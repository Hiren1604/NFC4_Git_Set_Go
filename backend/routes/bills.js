const express = require('express');
const { body, validationResult } = require('express-validator');
const Bill = require('../models/Bill');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all bills for a resident
// @route   GET /api/bills
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const bills = await Bill.find({ resident: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(bills);
  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get single bill
// @route   GET /api/bills/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const bill = await Bill.findOne({ 
      _id: req.params.id, 
      resident: req.user._id 
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json(bill);
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Raise bill dispute
// @route   POST /api/bills/:id/dispute
// @access  Private
router.post('/:id/dispute', protect, [
  body('type').isIn(['already-paid', 'paid-twice', 'wrong-split']).withMessage('Invalid dispute type'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, description, transactionId, paymentDate, paymentMethod, doublePaymentDetails, wrongSplitDetails } = req.body;

    const bill = await Bill.findOne({ 
      _id: req.params.id, 
      resident: req.user._id 
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Determine dispute reason based on type
    let reason = '';
    switch (type) {
      case 'already-paid':
        reason = 'Already Paid';
        break;
      case 'paid-twice':
        reason = 'Paid Twice';
        break;
      case 'wrong-split':
        reason = 'Wrong Bill Split';
        break;
    }

    // Add dispute to bill
    await bill.addDispute(reason, description, req.user._id);

    // Update bill status to disputed
    bill.status = 'disputed';
    await bill.save();

    res.json({ 
      message: 'Dispute raised successfully',
      bill 
    });
  } catch (error) {
    console.error('Raise dispute error:', error);
    res.status(500).json({ error: 'Server error during dispute creation' });
  }
});

// @desc    Upload payment proof
// @route   POST /api/bills/:id/proof
// @access  Private
router.post('/:id/proof', protect, async (req, res) => {
  try {
    const { proofType, proofUrl } = req.body;

    const bill = await Bill.findOne({ 
      _id: req.params.id, 
      resident: req.user._id 
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Add proof to bill
    bill.proofOfPayment.push({
      type: proofType,
      url: proofUrl,
      uploadedAt: new Date()
    });

    await bill.save();

    res.json({ 
      message: 'Payment proof uploaded successfully',
      bill 
    });
  } catch (error) {
    console.error('Upload proof error:', error);
    res.status(500).json({ error: 'Server error during proof upload' });
  }
});

// @desc    Mark bill as paid
// @route   PUT /api/bills/:id/pay
// @access  Private
router.put('/:id/pay', protect, [
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  body('transactionId').notEmpty().withMessage('Transaction ID is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentMethod, transactionId, paidAmount } = req.body;

    const bill = await Bill.findOne({ 
      _id: req.params.id, 
      resident: req.user._id 
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Mark bill as paid
    await bill.markAsPaid({
      method: paymentMethod,
      transactionId,
      paidAmount: paidAmount || bill.amount
    });

    res.json({ 
      message: 'Bill marked as paid successfully',
      bill 
    });
  } catch (error) {
    console.error('Mark as paid error:', error);
    res.status(500).json({ error: 'Server error during payment' });
  }
});

module.exports = router; 