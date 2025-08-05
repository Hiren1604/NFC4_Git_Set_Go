const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get security alerts
// @route   GET /api/security/alerts
// @access  Private
router.get('/alerts', protect, async (req, res) => {
  try {
    // Mock data for now - in real app, this would come from a SecurityAlert model
    const alerts = [
      {
        id: 1,
        type: "delivery",
        visitor: "Amazon Delivery",
        photo: "/placeholder.svg",
        time: "2024-01-10 14:30",
        status: "pending",
        items: "Package for Flat A-501"
      },
      {
        id: 2,
        type: "guest",
        visitor: "John Smith",
        photo: "/placeholder.svg",
        time: "2024-01-09 18:45",
        status: "approved",
        items: "Visiting Flat A-501"
      }
    ];

    res.json(alerts);
  } catch (error) {
    console.error('Get security alerts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Approve visitor
// @route   POST /api/security/approve/:id
// @access  Private
router.post('/approve/:id', protect, async (req, res) => {
  try {
    // Mock implementation
    res.json({ message: 'Visitor approved successfully' });
  } catch (error) {
    console.error('Approve visitor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 