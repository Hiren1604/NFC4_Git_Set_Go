const express = require('express');
const { body, validationResult } = require('express-validator');
const Bill = require('../models/Bill');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    // Role-based filtering
    if (req.user.role === 'resident') {
      filter.resident = req.user._id;
    }

    const bills = await Bill.find(filter)
      .populate('resident', 'name email phone flatNumber building')
      .populate('disputes.raisedBy', 'name')
      .populate('disputes.resolvedBy', 'name')
      .sort({ dueDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Bill.countDocuments(filter);

    res.json({
      bills,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
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
    const bill = await Bill.findById(req.params.id)
      .populate('resident', 'name email phone flatNumber building')
      .populate('disputes.raisedBy', 'name')
      .populate('disputes.resolvedBy', 'name');

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Check access permissions
    if (req.user.role === 'resident' && bill.resident._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(bill);
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Create new bill (Admin only)
// @route   POST /api/bills
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), [
  body('resident').isMongoId().withMessage('Valid resident ID is required'),
  body('type').isIn(['maintenance', 'electricity', 'water', 'gas', 'parking', 'amenities', 'other']).withMessage('Invalid bill type'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('description').trim().notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { resident, type, amount, dueDate, description, period } = req.body;

    const bill = await Bill.create({
      resident,
      type,
      amount,
      dueDate,
      description,
      period
    });

    const populatedBill = await Bill.findById(bill._id)
      .populate('resident', 'name email phone flatNumber building');

    res.status(201).json(populatedBill);
  } catch (error) {
    console.error('Create bill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Mark bill as paid
// @route   PUT /api/bills/:id/pay
// @access  Private
router.put('/:id/pay', protect, [
  body('method').isIn(['online', 'cash', 'cheque', 'upi', 'bank_transfer']).withMessage('Invalid payment method'),
  body('transactionId').optional().trim(),
  body('paidAmount').isFloat({ min: 0 }).withMessage('Paid amount must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Check permissions
    if (req.user.role === 'resident' && bill.resident.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { method, transactionId, paidAmount } = req.body;
    await bill.markAsPaid({ method, transactionId, paidAmount });

    const updatedBill = await Bill.findById(bill._id)
      .populate('resident', 'name email phone flatNumber building');

    res.json(updatedBill);
  } catch (error) {
    console.error('Pay bill error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Upload payment proof
// @route   POST /api/bills/:id/proof
// @access  Private
router.post('/:id/proof', protect, [
  body('type').isIn(['receipt', 'screenshot', 'bank_statement', 'upi_confirmation']).withMessage('Invalid proof type'),
  body('url').isURL().withMessage('Valid URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Check permissions
    if (req.user.role === 'resident' && bill.resident.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { type, url } = req.body;
    bill.proofOfPayment.push({ type, url });
    await bill.save();

    res.json(bill.proofOfPayment);
  } catch (error) {
    console.error('Upload proof error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Raise dispute
// @route   POST /api/bills/:id/dispute
// @access  Private
router.post('/:id/dispute', protect, [
  body('reason').trim().notEmpty().withMessage('Reason is required'),
  body('description').trim().notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Only residents can raise disputes
    if (req.user.role !== 'resident' || bill.resident.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { reason, description } = req.body;
    await bill.addDispute(reason, description, req.user._id);

    const updatedBill = await Bill.findById(bill._id)
      .populate('resident', 'name email phone flatNumber building')
      .populate('disputes.raisedBy', 'name');

    res.json(updatedBill);
  } catch (error) {
    console.error('Raise dispute error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Resolve dispute (Admin only)
// @route   PUT /api/bills/:id/dispute/:disputeId/resolve
// @access  Private (Admin only)
router.put('/:id/dispute/:disputeId/resolve', protect, authorize('admin'), [
  body('resolution').trim().notEmpty().withMessage('Resolution is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    const { resolution } = req.body;
    await bill.resolveDispute(req.params.disputeId, resolution, req.user._id);

    const updatedBill = await Bill.findById(bill._id)
      .populate('resident', 'name email phone flatNumber building')
      .populate('disputes.raisedBy', 'name')
      .populate('disputes.resolvedBy', 'name');

    res.json(updatedBill);
  } catch (error) {
    console.error('Resolve dispute error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 