const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Issue title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Issue description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['plumbing', 'electrical', 'carpentry', 'painting', 'cleaning', 'security', 'elevator', 'parking', 'garden', 'other']
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'resolved', 'closed', 'cancelled'],
    default: 'pending'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    flatNumber: String,
    building: String,
    area: String
  },
  photos: [{
    url: String,
    caption: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  aiSuggestions: {
    category: String,
    priority: String,
    estimatedTime: String,
    confidence: Number
  },
  timeline: [{
    status: {
      type: String,
      enum: ['reported', 'assigned', 'in-progress', 'resolved', 'closed']
    },
    message: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: { type: Date, default: Date.now }
  }],
  estimatedCompletion: Date,
  actualCompletion: Date,
  cost: {
    estimated: Number,
    actual: Number,
    currency: { type: String, default: 'INR' }
  },
  rating: {
    score: { type: Number, min: 1, max: 5 },
    feedback: String,
    submittedAt: Date
  },
  tags: [String],
  isEmergency: {
    type: Boolean,
    default: false
  },
  emergencyType: {
    type: String,
    enum: ['medical', 'fire', 'theft', 'security', 'structural']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
issueSchema.index({ status: 1, priority: 1 });
issueSchema.index({ reportedBy: 1 });
issueSchema.index({ assignedTo: 1 });
issueSchema.index({ category: 1 });
issueSchema.index({ createdAt: -1 });

// Virtual for issue age
issueSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for isOverdue
issueSchema.virtual('isOverdue').get(function() {
  if (this.estimatedCompletion && this.status !== 'resolved' && this.status !== 'closed') {
    return new Date() > this.estimatedCompletion;
  }
  return false;
});

// Method to add timeline entry
issueSchema.methods.addTimelineEntry = function(status, message, updatedBy) {
  this.timeline.push({
    status,
    message,
    updatedBy,
    timestamp: new Date()
  });
  return this.save();
};

// Method to update status
issueSchema.methods.updateStatus = function(newStatus, message, updatedBy) {
  this.status = newStatus;
  this.addTimelineEntry(newStatus, message, updatedBy);
  
  if (newStatus === 'resolved') {
    this.actualCompletion = new Date();
  }
  
  return this.save();
};

module.exports = mongoose.model('Issue', issueSchema); 