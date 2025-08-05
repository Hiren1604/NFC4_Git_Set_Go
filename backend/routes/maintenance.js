const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get maintenance services
// @route   GET /api/maintenance/services
// @access  Private
router.get('/services', protect, async (req, res) => {
  try {
    // Mock data for now - in real app, this would come from a MaintenanceService model
    const services = [
      { name: "Plumber", icon: "Wrench", available: 3, nextSlot: "2PM Today", rate: "₹500/hour" },
      { name: "Electrician", icon: "AlertTriangle", available: 2, nextSlot: "4PM Today", rate: "₹600/hour" },
      { name: "Carpenter", icon: "Wrench", available: 1, nextSlot: "10AM Tomorrow", rate: "₹400/hour" },
      { name: "Painter", icon: "Wrench", available: 0, nextSlot: "9AM Monday", rate: "₹300/hour" }
    ];

    res.json(services);
  } catch (error) {
    console.error('Get maintenance services error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Book maintenance service
// @route   POST /api/maintenance/book
// @access  Private
router.post('/book', protect, async (req, res) => {
  try {
    // Mock implementation
    res.json({ message: 'Maintenance service booked successfully' });
  } catch (error) {
    console.error('Book maintenance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 