const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: [true, 'Bill type is required'],
    enum: ['maintenance', 'electricity', 'water', 'gas', 'parking', 'amenities', 'other']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'disputed', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  period: {
    startDate: Date,
    endDate: Date
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['online', 'cash', 'cheque', 'upi', 'bank_transfer']
    },
    transactionId: String,
    paidAt: Date,
    paidAmount: Number
  },
  proofOfPayment: [{
    type: {
      type: String,
      enum: ['receipt', 'screenshot', 'bank_statement', 'upi_confirmation']
    },
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  disputes: [{
    reason: String,
    description: String,
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    raisedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'rejected'],
      default: 'pending'
    },
    resolution: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  lateFees: {
    amount: { type: Number, default: 0 },
    appliedAt: Date
  },
  reminders: [{
    sentAt: Date,
    type: { type: String, enum: ['email', 'sms', 'push'] },
    status: { type: String, enum: ['sent', 'delivered', 'failed'] }
  }],
  tags: [String],
  notes: String
}, {
  timestamps: true
});

// Indexes for better query performance
billSchema.index({ resident: 1, status: 1 });
billSchema.index({ dueDate: 1 });
billSchema.index({ type: 1 });
billSchema.index({ status: 1, dueDate: 1 });

// Virtual for isOverdue
billSchema.virtual('isOverdue').get(function() {
  return this.status === 'pending' && new Date() > this.dueDate;
});

// Virtual for daysUntilDue
billSchema.virtual('daysUntilDue').get(function() {
  const today = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to mark as paid
billSchema.methods.markAsPaid = function(paymentDetails) {
  this.status = 'paid';
  this.paymentDetails = {
    ...this.paymentDetails,
    ...paymentDetails,
    paidAt: new Date()
  };
  return this.save();
};

// Method to add dispute
billSchema.methods.addDispute = function(reason, description, raisedBy) {
  this.disputes.push({
    reason,
    description,
    raisedBy,
    raisedAt: new Date()
  });
  this.status = 'disputed';
  return this.save();
};

// Method to resolve dispute
billSchema.methods.resolveDispute = function(disputeId, resolution, resolvedBy) {
  const dispute = this.disputes.id(disputeId);
  if (dispute) {
    dispute.status = 'resolved';
    dispute.resolution = resolution;
    dispute.resolvedAt = new Date();
    dispute.resolvedBy = resolvedBy;
    
    // If all disputes are resolved, revert status to pending
    const hasUnresolvedDisputes = this.disputes.some(d => d.status === 'pending');
    if (!hasUnresolvedDisputes) {
      this.status = 'pending';
    }
  }
  return this.save();
};

// Pre-save middleware to apply late fees
billSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'overdue' && !this.lateFees.appliedAt) {
    // Apply 5% late fee
    this.lateFees.amount = this.amount * 0.05;
    this.lateFees.appliedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Bill', billSchema); 