const express = require('express');
const { body, validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

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

    // Populate the created issue
    const populatedIssue = await Issue.findById(issue._id)
      .populate('reportedBy', 'name email phone flatNumber building')
      .populate('assignedTo', 'name email phone skills hourlyRate');

    res.status(201).json(populatedIssue);
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