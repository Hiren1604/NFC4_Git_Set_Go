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
  return new Promise((resolve) => {
    let resolved = false;
    const pythonScript = path.join(__dirname, '../../ai-agents/categoryagent.py');
    const pythonProcess = spawn('python', [pythonScript], {
      cwd: path.join(__dirname, '../../ai-agents'),
      shell: true
    });

    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        try { pythonProcess.kill(); } catch (e) {}
        console.log('⏱️ Python agent timed out (2.5s), switching to fast AI dispatcher');
        resolve({ error: 'Timeout' });
      }
    }, 2500);

    console.log('🐍 Starting Python agent process...');
    console.log('📁 Python script path:', pythonScript);
    console.log('📁 Working directory:', path.join(__dirname, '../../ai-agents'));

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      const dataStr = data.toString();
      output += dataStr;
    });

    pythonProcess.stderr.on('data', (data) => {
      const dataStr = data.toString();
      errorOutput += dataStr;
    });

    pythonProcess.on('close', (code) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeoutId);
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

// @desc    Live AI Triage & Chat for Grievance Reporting
// @route   POST /api/issues/triage
// @access  Private
router.post('/triage', protect, async (req, res) => {
  try {
    const { message, history = [], currentCategory, currentPriority } = req.body;
    const text = (message || '').trim();
    const lower = text.toLowerCase();

    // 1. Check for Greeting
    const isGreeting = /^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste|hola|yo|start|menu)\b/i.test(lower);
    if (isGreeting) {
      return res.json({
        reply: `Hello ${req.user.name ? req.user.name.split(' ')[0] : 'there'}! 👋 I am your Society AI Maintenance Concierge.\n\nWhat issue or grievance can I help you resolve in Flat ${req.user.flatNumber || '101'} today? Let me know what needs fixing, or tap a domain below to get started:`,
        category: null,
        priority: null,
        technician: null,
        suggestions: [
          { label: "💧 Water Leak / Plumbing", value: "Water leak or plumbing problem in my flat" },
          { label: "⚡ Electrical / Power Tripping", value: "Electrical switch, MCB, or light socket issue" },
          { label: "🛗 Lift / Elevator Malfunction", value: "Elevator not working or stopped between floors" },
          { label: "🚪 Door Lock / Carpentry", value: "Door hinge, lock, or window carpentry repair" },
          { label: "🧹 Garbage / Common Cleaning", value: "Corridor sanitation, spill, or garbage chute problem" },
          { label: "🛡️ Intercom / Gate Access", value: "Gate security, intercom, or barrier issue" }
        ],
        isReadyForDraft: false
      });
    }

    // 2. Check for Help query
    const isHelp = /^(who\s*are\s*you|what\s*can\s*you\s*do|what\s*is\s*this|help|how\s*does\s*this\s*work)\b/i.test(lower);
    if (isHelp) {
      return res.json({
        reply: `I am Emerald Heights' automated **AI Maintenance Concierge**! 🤖\n\nYou can chat with me about any maintenance issue in your flat. I will diagnose the problem, evaluate urgency, match a certified on-duty technician from our live society roster, and schedule assistance.\n\nWhat problem would you like to report?`,
        category: null,
        priority: null,
        technician: null,
        suggestions: [
          { label: "💧 Water Leak", value: "Water leak or plumbing problem in my flat" },
          { label: "⚡ Electrical Fault", value: "Electrical switch, MCB, or light socket issue" },
          { label: "🛗 Lift Malfunction", value: "Elevator not working or stopped between floors" },
          { label: "🚪 Carpentry / Lock", value: "Door hinge, lock, or window carpentry repair" }
        ],
        isReadyForDraft: false
      });
    }

    // 3. Category Detection
    let detectedCategory = null;
    if (/(leak|pipe|water|drip|tap|faucet|flush|drain|toilet|sink|geyser|bathroom|shower|seepage|sewage|commode|cistern)/.test(lower)) {
      detectedCategory = 'plumbing';
    } else if (/(power|light|bulb|switch|socket|mcb|breaker|spark|wire|blackout|fan|tripping|short|voltage|ac|air\s*conditioner|heater|electric)/.test(lower)) {
      detectedCategory = 'electrical';
    } else if (/(lift|elevator|hoist|lift\s*door|lift\s*sensor)/.test(lower)) {
      detectedCategory = 'elevator';
    } else if (/(door|window|lock|key|latch|hinge|handle|glass|cabinet|cupboard|drawer|wood|carpent)/.test(lower)) {
      detectedCategory = 'carpentry';
    } else if (/(gate|guard|intercom|barrier|cctv|theft|noise|disturbance|parking|car|slot|bay)/.test(lower)) {
      detectedCategory = 'security';
    } else if (/(garbage|trash|waste|chute|spill|stain|smell|corridor|dirty|sanitation|clean|pest|insect)/.test(lower)) {
      detectedCategory = 'cleaning';
    }

    const finalCategory = detectedCategory || currentCategory || null;

    // 4. Urgency Detection
    let detectedPriority = currentPriority || 'medium';
    const isUrgent = /(flood|spark|smoke|fire|trapped|burst|shock|overflow|emergency|urgent|gas|blackout)/.test(lower);
    const isHigh = /(leak|power|broken|jammed|tripping|severe)/.test(lower);

    if (isUrgent) detectedPriority = 'urgent';
    else if (isHigh && detectedPriority !== 'urgent') detectedPriority = 'high';

    // 5. Match Technician from live MongoDB User database
    let matchingTech = null;
    if (finalCategory) {
      const categorySkillMap = {
        plumbing: ['plumbing'],
        electrical: ['electrical'],
        elevator: ['elevator', 'electrical'],
        carpentry: ['carpentry'],
        cleaning: ['cleaning'],
        security: ['security'],
        parking: ['parking', 'security'],
        garden: ['garden', 'cleaning'],
      };
      const targetSkills = categorySkillMap[finalCategory] || [finalCategory];

      let techList = [];
      if (finalCategory === 'elevator') {
        techList = await User.find({
          role: 'technician',
          availability: 'available',
          $or: [{ skills: { $in: targetSkills } }, { email: /lift/i }, { name: /ramesh/i }]
        }).sort({ hourlyRate: -1 }).select('name email phone skills hourlyRate');
      } else {
        techList = await User.find({
          role: 'technician',
          availability: 'available',
          skills: { $in: targetSkills }
        }).select('name email phone skills hourlyRate');
      }

      if (techList.length > 0) {
        matchingTech = techList[0];
      } else {
        matchingTech = await User.findOne({ role: 'technician', availability: 'available' }).select('name email phone skills hourlyRate');
      }
    }

    // 6. Check if enough detail to present Draft
    const hasEnoughDetail = (text.length >= 20 && finalCategory) || isUrgent || history.length >= 2;

    if (hasEnoughDetail && finalCategory) {
      return res.json({
        reply: `I have diagnosed your grievance and prepared an autonomous technician dispatch for Flat ${req.user.flatNumber || '101'}.\n\nPlease review your summary draft below:`,
        category: finalCategory,
        priority: detectedPriority,
        confidence: isUrgent ? 98 : 91,
        reasoning: isUrgent
          ? "Critical safety or water damage indicators detected. Priority emergency routing applied."
          : `Standard ${finalCategory} maintenance protocol. Certified trade technician matched from live roster.`,
        technician: matchingTech ? {
          name: matchingTech.name,
          phone: matchingTech.phone,
          skills: matchingTech.skills,
          hourlyRate: matchingTech.hourlyRate
        } : null,
        isReadyForDraft: true,
        suggestions: [
          { label: "🚀 Confirm & Dispatch Technician", value: "Confirm & dispatch technician now" },
          { label: "🕒 Schedule for Afternoon", value: "Please schedule for afternoon 2:00 PM" },
          { label: "✏️ Modify Details", value: "Change details" }
        ]
      });
    }

    // 7. Dynamic follow-up questions by category
    if (finalCategory === 'plumbing') {
      return res.json({
        reply: `Got it, I've categorized this under **Plumbing Maintenance**.\n\nCould you specify the exact nature of the leak or water issue?`,
        category: finalCategory,
        priority: detectedPriority,
        technician: matchingTech ? {
          name: matchingTech.name,
          phone: matchingTech.phone,
          skills: matchingTech.skills,
          hourlyRate: matchingTech.hourlyRate
        } : null,
        isReadyForDraft: false,
        suggestions: [
          { label: "🌊 Severe Water Leak / Flooding", value: "Severe water leak flooding the floor tiles" },
          { label: "💧 Tap Dripping / Loose Valve", value: "Washbasin tap dripping continuously" },
          { label: "🚽 Flush Tank Overflowing", value: "Toilet flush tank valve stuck and overflowing" },
          { label: "🛁 Bathroom Drain Clogged", value: "Shower drainage clogged with standing water" }
        ]
      });
    }

    if (finalCategory === 'electrical') {
      return res.json({
        reply: `I've logged this under **Electrical Maintenance**.\n\nIs there an immediate safety hazard such as sparking, or is it an appliance circuit fault?`,
        category: finalCategory,
        priority: detectedPriority,
        technician: matchingTech ? {
          name: matchingTech.name,
          phone: matchingTech.phone,
          skills: matchingTech.skills,
          hourlyRate: matchingTech.hourlyRate
        } : null,
        isReadyForDraft: false,
        suggestions: [
          { label: "⚡ MCB Tripping Continuously", value: "Kitchen MCB trips whenever appliances turn on" },
          { label: "🔥 Sparks or Burning Smell", value: "Sparking switch socket with burning smell" },
          { label: "💡 Lights & Fans Inoperative", value: "Living room ceiling light fixtures not turning on" },
          { label: "🔌 Loose Socket Connection", value: "Plug socket loose on bedroom wall" }
        ]
      });
    }

    if (finalCategory === 'elevator') {
      return res.json({
        reply: `Elevator issue registered. **Is anyone currently trapped inside the lift car?**`,
        category: finalCategory,
        priority: 'urgent',
        technician: matchingTech ? {
          name: matchingTech.name,
          phone: matchingTech.phone,
          skills: matchingTech.skills,
          hourlyRate: matchingTech.hourlyRate
        } : null,
        isReadyForDraft: false,
        suggestions: [
          { label: "🚨 YES! Resident trapped inside", value: "Emergency: Resident trapped inside elevator" },
          { label: "🚪 Door sensor jammed open", value: "Lift door is not closing on 4th floor" },
          { label: "🔊 Loud screeching noise", value: "Elevator making loud mechanical grinding noise" },
          { label: "❌ Lift stopped and unresponsive", value: "Lift display off and not responding to buttons" }
        ]
      });
    }

    // Default general follow-up
    return res.json({
      reply: `I'm here to help! Could you specify what needs repair or select a category below?`,
      category: null,
      priority: null,
      technician: null,
      isReadyForDraft: false,
      suggestions: [
        { label: "💧 Water / Plumbing Issue", value: "Water leak or plumbing problem in my flat" },
        { label: "⚡ Electrical / Power Issue", value: "Electrical switch, MCB, or light socket issue" },
        { label: "🚪 Door / Lock / Carpentry", value: "Door hinge, lock, or window carpentry repair" },
        { label: "🧹 Cleaning / Common Area", value: "Corridor sanitation, spill, or garbage chute problem" }
      ]
    });

  } catch (error) {
    console.error('Triage error:', error);
    res.status(500).json({ error: 'Server error during AI triage' });
  }
});

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
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 5, max: 1000 }).withMessage('Description must be between 5 and 1000 characters'),
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
          console.log('⚠️ AI agent fallback: Matching available technician by category...');
          const matchingTech = technicians.find(t => t.skills && t.skills.includes(issue.category)) || technicians[0];
          if (matchingTech) {
            issue.assignedTo = matchingTech._id;
            issue.status = 'assigned';
            try {
              await issue.addTimelineEntry('assigned', `Assigned to ${matchingTech.name} via AI auto-dispatch (${issue.category})`, req.user._id);
            } catch (tlErr) {
              console.error('Error adding timeline entry:', tlErr);
            }
            await issue.save();
          }

          const populatedIssue = await Issue.findById(issue._id)
            .populate('reportedBy', 'name email phone flatNumber building')
            .populate('assignedTo', 'name email phone skills hourlyRate');

          res.status(201).json({
            issue: populatedIssue,
            message: 'Issue created and technician auto-dispatched successfully.'
          });
        }
      } else {
        const populatedIssue = await Issue.findById(issue._id)
          .populate('reportedBy', 'name email phone flatNumber building')
          .populate('assignedTo', 'name email phone skills hourlyRate');

        res.status(201).json({
          issue: populatedIssue,
          message: 'Issue created successfully.'
        });
      }
    } catch (aiError) {
      console.error('❌ Error in technician assignment:', aiError.message);
      const populatedIssue = await Issue.findById(issue._id)
        .populate('reportedBy', 'name email phone flatNumber building')
        .populate('assignedTo', 'name email phone skills hourlyRate');

      res.status(201).json({
        issue: populatedIssue,
        message: 'Issue created successfully.'
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

    // Auto-resolve if resident confirms work done by submitting rating
    if (issue.status !== 'resolved' && issue.status !== 'closed') {
      issue.status = 'resolved';
      issue.actualCompletion = new Date();
      try {
        await issue.addTimelineEntry('resolved', `Work confirmed completed and rated ${score}/5 by resident`, req.user._id);
      } catch (tlErr) {
        console.error('Timeline entry error:', tlErr);
      }
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