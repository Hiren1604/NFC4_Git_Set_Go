const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const Issue = require('../models/Issue');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Assign technician to an issue
// @route   POST /api/technician-assignment/assign
// @access  Private
router.post('/assign', protect, async (req, res) => {
  try {
    const { issueId } = req.body;

    if (!issueId) {
      return res.status(400).json({ error: 'Issue ID is required' });
    }

    // Get the issue details
    const issue = await Issue.findById(issueId)
      .populate('reportedBy', 'name email phone flatNumber building');

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Check if user has permission to view this issue
    if (req.user.role === 'resident' && issue.reportedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get all available technicians
    const technicians = await User.find({ 
      role: 'technician',
      availability: 'available'
    }).select('name email phone skills hourlyRate availability');

    if (technicians.length === 0) {
      return res.status(404).json({ error: 'No available technicians found' });
    }

    // Prepare data for the Python agent
    const agentData = {
      title: issue.title,
      description: issue.description,
      category: issue.category,
      technicians: technicians.map(tech => ({
        _id: tech._id.toString(),
        name: tech.name,
        phone: tech.phone,
        email: tech.email,
        skills: tech.skills,
        hourlyRate: tech.hourlyRate,
        availability: tech.availability
      }))
    };

    // Call the Python agent
    const assignmentResult = await runTechnicianAssignment(agentData);

    if (assignmentResult.error) {
      return res.status(500).json({ error: assignmentResult.error });
    }

    // Update the issue with the assigned technician
    if (assignmentResult.technician && assignmentResult.technician.id) {
      issue.assignedTo = assignmentResult.technician.id;
      issue.status = 'assigned';
      try {
        await issue.addTimelineEntry('assigned', `Assigned to ${assignmentResult.technician.name}`, req.user._id);
      } catch (timelineError) {
        console.error('Error adding timeline entry:', timelineError);
        // Continue without timeline entry if it fails
      }
      await issue.save();
    }

    res.json(assignmentResult);

  } catch (error) {
    console.error('Technician assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get technician assignment for an issue
// @route   GET /api/technician-assignment/:issueId
// @access  Private
router.get('/:issueId', protect, async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId)
      .populate('reportedBy', 'name email phone flatNumber building')
      .populate('assignedTo', 'name email phone skills hourlyRate availability');

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Check if user has permission to view this issue
    if (req.user.role === 'resident' && issue.reportedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!issue.assignedTo) {
      return res.status(404).json({ error: 'No technician assigned to this issue' });
    }

    // Create notification data
    const notification = {
      type: 'technician_assignment',
      title: `Technician Assigned: ${issue.assignedTo.name}`,
      message: `${issue.assignedTo.name} has been assigned to your issue. They specialize in ${issue.assignedTo.skills.join(', ')} and charge ₹${issue.assignedTo.hourlyRate}/hour.`,
      technician: {
        id: issue.assignedTo._id,
        name: issue.assignedTo.name,
        phone: issue.assignedTo.phone,
        email: issue.assignedTo.email,
        skills: issue.assignedTo.skills,
        hourlyRate: issue.assignedTo.hourlyRate,
        availability: issue.assignedTo.availability
      },
      issue: {
        title: issue.title,
        description: issue.description,
        category: issue.category
      },
      estimatedTime: getEstimatedTime(issue.category, issue.title, issue.description),
      estimatedCost: getEstimatedCost(issue.category, issue.assignedTo.hourlyRate),
      actions: [
        {
          type: 'accept',
          label: 'Accept Assignment',
          description: 'Accept this technician for your issue'
        },
        {
          type: 'reschedule',
          label: 'Request Reschedule',
          description: 'Request a different time slot'
        },
        {
          type: 'reject',
          label: 'Reject & Request Another',
          description: 'Request a different technician'
        }
      ]
    };

    res.json(notification);

  } catch (error) {
    console.error('Get technician assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Accept technician assignment
// @route   POST /api/technician-assignment/:issueId/accept
// @access  Private
router.post('/:issueId/accept', protect, async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Check if user has permission
    if (req.user.role === 'resident' && issue.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!issue.assignedTo) {
      return res.status(400).json({ error: 'No technician assigned to this issue' });
    }

    // Update issue status
    issue.status = 'in-progress';
    try {
      await issue.addTimelineEntry('accepted', 'Resident accepted technician assignment', req.user._id);
    } catch (timelineError) {
      console.error('Error adding timeline entry:', timelineError);
      // Continue without timeline entry if it fails
    }
    await issue.save();

    res.json({ 
      message: 'Technician assignment accepted',
      status: 'in-progress'
    });

  } catch (error) {
    console.error('Accept assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Reject technician assignment
// @route   POST /api/technician-assignment/:issueId/reject
// @access  Private
router.post('/:issueId/reject', protect, async (req, res) => {
  try {
    const { issueId } = req.params;
    const { reason } = req.body;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Check if user has permission
    if (req.user.role === 'resident' && issue.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!issue.assignedTo) {
      return res.status(400).json({ error: 'No technician assigned to this issue' });
    }

    // Remove assignment and reset status
    issue.assignedTo = null;
    issue.status = 'pending';
    try {
      await issue.addTimelineEntry('rejected', `Technician assignment rejected. Reason: ${reason || 'Not specified'}`, req.user._id);
    } catch (timelineError) {
      console.error('Error adding timeline entry:', timelineError);
      // Continue without timeline entry if it fails
    }
    await issue.save();

    res.json({ 
      message: 'Technician assignment rejected',
      status: 'pending'
    });

  } catch (error) {
    console.error('Reject assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to run Python agent
async function runTechnicianAssignment(agentData) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../../ai-agents/categoryagent.py');
    const pythonProcess = spawn('python', [pythonScript], {
      cwd: path.join(__dirname, '../../ai-agents')
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python agent error:', errorOutput);
        resolve({ error: 'Failed to run technician assignment agent' });
        return;
      }

      try {
        // Try to parse the output as JSON
        const result = JSON.parse(output.trim());
        resolve(result);
      } catch (error) {
        console.error('Failed to parse agent output:', output);
        resolve({ error: 'Failed to parse agent output', raw_output: output });
      }
    });

    // Send data to Python process
    pythonProcess.stdin.write(JSON.stringify(agentData));
    pythonProcess.stdin.end();
  });
}

// Helper function to get estimated time
function getEstimatedTime(category, title, description) {
  const timeEstimates = {
    "plumbing": "2-4 hours",
    "electrical": "1-3 hours", 
    "carpentry": "2-6 hours",
    "cleaning": "1-2 hours",
    "security": "1-2 hours",
    "elevator": "4-8 hours",
    "parking": "1-3 hours",
    "garden": "2-4 hours",
    "other": "2-4 hours"
  };
  
  const urgentKeywords = ["emergency", "urgent", "broken", "not working", "leak", "spark"];
  if (urgentKeywords.some(keyword => 
    title.toLowerCase().includes(keyword) || description.toLowerCase().includes(keyword)
  )) {
    const baseTime = timeEstimates[category] || "2-4 hours";
    if (baseTime.includes("hours")) {
      const hours = baseTime.split()[0];
      return `${hours} (Urgent)`;
    }
  }
  
  return timeEstimates[category] || "2-4 hours";
}

// Helper function to get estimated cost
function getEstimatedCost(category, hourlyRate) {
  const timeMultipliers = {
    "plumbing": 2.5,
    "electrical": 2.0,
    "carpentry": 3.0,
    "cleaning": 1.5,
    "security": 1.5,
    "elevator": 6.0,
    "parking": 2.0,
    "garden": 2.5,
    "other": 2.5
  };
  
  const multiplier = timeMultipliers[category] || 2.5;
  const estimatedHours = multiplier;
  const estimatedCost = hourlyRate * estimatedHours;
  
  return {
    estimated_hours: estimatedHours,
    hourly_rate: hourlyRate,
    total_cost: estimatedCost,
    currency: "INR"
  };
}

module.exports = router; 