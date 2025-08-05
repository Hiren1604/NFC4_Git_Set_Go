const express = require('express');
const { body, validationResult } = require('express-validator');
const { spawn } = require('child_process');
const path = require('path');
const Issue = require('../models/Issue');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Helper function to run Python agent for automatic technician assignment
async function runTechnicianAssignment(agentData) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../../ai-agents/categoryagent.py');
    const pythonProcess = spawn('python', [pythonScript], {
      cwd: path.join(__dirname, '../../ai-agents'),
      shell: true
    });

    console.log('🐍 Starting Python agent process...');
    console.log('📁 Python script path:', pythonScript);
    console.log('📁 Working directory:', path.join(__dirname, '../../ai-agents'));

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      const dataStr = data.toString();
      output += dataStr;
      console.log('🐍 Python stdout:', dataStr.trim());
    });

    pythonProcess.stderr.on('data', (data) => {
      const dataStr = data.toString();
      errorOutput += dataStr;
      console.error('🐍 Python stderr:', dataStr.trim());
    });

    pythonProcess.on('close', (code) => {
      console.log(`🐍 Python process exited with code: ${code}`);
      console.log('🐍 Final output length:', output.length);
      console.log('🐍 Final error length:', errorOutput.length);
      
      if (code !== 0) {
        console.error('❌ Python agent error:', errorOutput);
        resolve({ error: 'Failed to run technician assignment agent', exitCode: code });
        return;
      }

      try {
        // Try to parse the output as JSON
        const result = JSON.parse(output.trim());
        console.log('✅ Successfully parsed Python agent output as JSON');
        resolve(result);
      } catch (error) {
        console.error('❌ Failed to parse agent output:', output);
        console.error('❌ Parse error:', error.message);
        resolve({ error: 'Failed to parse agent output', raw_output: output });
      }
    });

    pythonProcess.on('error', (err) => {
      console.error('❌ Failed to start Python process:', err.message);
      resolve({ error: 'Failed to start Python process', details: err.message });
    });

    // Send data to Python process
    console.log('📤 Sending data to Python agent:', JSON.stringify(agentData, null, 2));
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

// @desc    Get all issues (with filters)
// @route   GET /api/issues
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, category, priority, assignedTo, reportedBy, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (reportedBy) filter.reportedBy = reportedBy;

    // Role-based filtering
    if (req.user.role === 'resident') {
      filter.reportedBy = req.user._id;
    } else if (req.user.role === 'technician') {
      filter.assignedTo = req.user._id;
    }

    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name email phone flatNumber building')
      .populate('assignedTo', 'name email phone skills hourlyRate')
      .populate('timeline.updatedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Issue.countDocuments(filter);

    res.json({
      issues,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email phone flatNumber building')
      .populate('assignedTo', 'name email phone skills hourlyRate')
      .populate('timeline.updatedBy', 'name');

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Check access permissions
    if (req.user.role === 'resident' && issue.reportedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(issue);
  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private
router.post('/', protect, [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').isIn(['plumbing', 'electrical', 'carpentry', 'painting', 'cleaning', 'security', 'elevator', 'parking', 'garden', 'other']).withMessage('Invalid category'),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, priority, location, photos, isEmergency, emergencyType, aiSuggestions } = req.body;

    // Create issue
    const issue = await Issue.create({
      title,
      description,
      category,
      priority,
      reportedBy: req.user._id,
      location: {
        flatNumber: req.user.flatNumber,
        building: req.user.building,
        area: location?.area
      },
      photos: photos || [],
      isEmergency: isEmergency || false,
      emergencyType: isEmergency ? emergencyType : undefined,
      aiSuggestions: aiSuggestions || undefined
    });

    // Add initial timeline entry
    try {
      await issue.addTimelineEntry('reported', 'Issue reported', req.user._id);
    } catch (timelineError) {
      console.error('Error adding timeline entry:', timelineError);
      // Continue without timeline entry if it fails
    }

    // AUTOMATIC TECHNICIAN ASSIGNMENT - Trigger AI Agent
    try {
      console.log('🔄 Automatically triggering AI agent for technician assignment...');
      console.log('📝 Issue Details:', {
        title: issue.title,
        description: issue.description,
        category: issue.category,
        priority: issue.priority,
        reportedBy: req.user.name || req.user.email,
        timestamp: new Date().toISOString()
      });

      // Get all available technicians
      const technicians = await User.find({
        role: 'technician',
        availability: 'available'
      }).select('name email phone skills hourlyRate availability');

      console.log(`👥 Found ${technicians.length} available technicians`);

      if (technicians.length > 0) {
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

        console.log('🤖 Calling Python AI agent with data:', {
          issueTitle: agentData.title,
          issueCategory: agentData.category,
          technicianCount: agentData.technicians.length,
          technicianSkills: agentData.technicians.map(t => ({ name: t.name, skills: t.skills }))
        });

        // Call the Python agent
        const assignmentResult = await runTechnicianAssignment(agentData);

        console.log('🤖 AI Agent Response:', assignmentResult);

        if (!assignmentResult.error && assignmentResult.technician && assignmentResult.technician.id) {
          // Update the issue with the assigned technician
          issue.assignedTo = assignmentResult.technician.id;
          issue.status = 'assigned';

          try {
            await issue.addTimelineEntry('assigned', `Automatically assigned to ${assignmentResult.technician.name} via AI`, req.user._id);
          } catch (timelineError) {
            console.error('Error adding timeline entry:', timelineError);
          }

          await issue.save();

          console.log('✅ AI agent successfully assigned technician:', {
            technicianName: assignmentResult.technician.name,
            technicianSkills: assignmentResult.technician.skills,
            hourlyRate: assignmentResult.technician.hourlyRate,
            issueCategory: issue.category,
            timestamp: new Date().toISOString()
          });

          // Create notification data for immediate response
          const notification = {
            type: 'technician_assignment',
            title: `Technician Assigned: ${assignmentResult.technician.name}`,
            message: `${assignmentResult.technician.name} has been automatically assigned to your issue. They specialize in ${assignmentResult.technician.skills.join(', ')} and charge ₹${assignmentResult.technician.hourlyRate}/hour.`,
            technician: {
              id: assignmentResult.technician.id,
              name: assignmentResult.technician.name,
              phone: assignmentResult.technician.phone,
              email: assignmentResult.technician.email,
              skills: assignmentResult.technician.skills,
              hourlyRate: assignmentResult.technician.hourlyRate,
              availability: assignmentResult.technician.availability
            },
            issue: {
              title: issue.title,
              description: issue.description,
              category: issue.category
            },
            estimatedTime: getEstimatedTime(issue.category, issue.title, issue.description),
            estimatedCost: getEstimatedCost(issue.category, assignmentResult.technician.hourlyRate),
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

          // Populate the created issue with assignment details
          const populatedIssue = await Issue.findById(issue._id)
            .populate('reportedBy', 'name email phone flatNumber building')
            .populate('assignedTo', 'name email phone skills hourlyRate');

          console.log('📤 Sending response with AI assignment notification');

          res.status(201).json({
            issue: populatedIssue,
            notification: notification,
            message: 'Issue created and technician automatically assigned via AI'
          });
        } else {
          console.log('⚠️ AI agent could not assign technician:', {
            error: assignmentResult.error,
            rawOutput: assignmentResult.raw_output,
            timestamp: new Date().toISOString()
          });

          // Populate the created issue without assignment
          const populatedIssue = await Issue.findById(issue._id)
            .populate('reportedBy', 'name email phone flatNumber building')
            .populate('assignedTo', 'name email phone skills hourlyRate');

          res.status(201).json({
            issue: populatedIssue,
            message: 'Issue created successfully. No technician automatically assigned.'
          });
        }
      } else {
        console.log('⚠️ No available technicians found for automatic assignment:', {
          timestamp: new Date().toISOString(),
          issueCategory: issue.category,
          issueTitle: issue.title
        });

        // Populate the created issue without assignment
        const populatedIssue = await Issue.findById(issue._id)
          .populate('reportedBy', 'name email phone flatNumber building')
          .populate('assignedTo', 'name email phone skills hourlyRate');

        res.status(201).json({
          issue: populatedIssue,
          message: 'Issue created successfully. No available technicians for automatic assignment.'
        });
      }
    } catch (aiError) {
      console.error('❌ Error in automatic technician assignment:', {
        error: aiError.message,
        stack: aiError.stack,
        timestamp: new Date().toISOString(),
        issueTitle: issue.title,
        issueCategory: issue.category
      });

      // Populate the created issue without assignment
      const populatedIssue = await Issue.findById(issue._id)
        .populate('reportedBy', 'name email phone flatNumber building')
        .populate('assignedTo', 'name email phone skills hourlyRate');

      res.status(201).json({
        issue: populatedIssue,
        message: 'Issue created successfully. Automatic technician assignment failed.'
      });
    }

  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Update issue
// @route   PUT /api/issues/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Check permissions
    if (req.user.role === 'resident' && issue.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { title, description, category, priority, status, assignedTo, estimatedCompletion, cost } = req.body;

    // Update fields
    if (title) issue.title = title;
    if (description) issue.description = description;
    if (category) issue.category = category;
    if (priority) issue.priority = priority;
    if (estimatedCompletion) issue.estimatedCompletion = estimatedCompletion;
    if (cost) issue.cost = { ...issue.cost, ...cost };

    // Handle status change
    if (status && status !== issue.status) {
      try {
        await issue.updateStatus(status, `Status updated to ${status}`, req.user._id);
      } catch (timelineError) {
        console.error('Error updating status:', timelineError);
        // Continue without timeline entry if it fails
      }
    }

    // Handle assignment
    if (assignedTo && assignedTo !== issue.assignedTo?.toString()) {
      issue.assignedTo = assignedTo;
      try {
        await issue.addTimelineEntry('assigned', `Assigned to technician`, req.user._id);
      } catch (timelineError) {
        console.error('Error adding timeline entry:', timelineError);
        // Continue without timeline entry if it fails
      }
    }

    const updatedIssue = await issue.save();
    const populatedIssue = await Issue.findById(updatedIssue._id)
      .populate('reportedBy', 'name email phone flatNumber building')
      .populate('assignedTo', 'name email phone skills hourlyRate')
      .populate('timeline.updatedBy', 'name');

    res.json(populatedIssue);
  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Add photo to issue
// @route   POST /api/issues/:id/photos
// @access  Private
router.post('/:id/photos', protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Check permissions
    if (req.user.role === 'resident' && issue.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { url, caption } = req.body;
    issue.photos.push({ url, caption });
    await issue.save();

    res.json(issue.photos);
  } catch (error) {
    console.error('Add photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Rate issue
// @route   POST /api/issues/:id/rate
// @access  Private
router.post('/:id/rate', protect, [
  body('score').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().trim().isLength({ max: 500 }).withMessage('Feedback cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Only the person who reported can rate
    if (issue.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the person who reported can rate this issue' });
    }

    if (issue.status !== 'resolved' && issue.status !== 'closed') {
      return res.status(400).json({ error: 'Can only rate resolved or closed issues' });
    }

    const { score, feedback } = req.body;
    issue.rating = {
      score,
      feedback,
      submittedAt: new Date()
    };

    await issue.save();
    res.json(issue.rating);
  } catch (error) {
    console.error('Rate issue error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get issue statistics
// @route   GET /api/issues/stats/overview
// @access  Private (Admin only)
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const stats = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Issue.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      statusStats: stats,
      categoryStats,
      priorityStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 