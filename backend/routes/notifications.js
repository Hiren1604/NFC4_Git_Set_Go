const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Issue = require('../models/Issue');
const User = require('../models/User');
const Bill = require('../models/Bill');

// GET /api/notifications - Get all notifications for the current user
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    
    console.log('🔍 Fetching notifications for user:', {
      userId: userId,
      role: userRole,
      name: req.user.name
    });

    const notifications = [];

    // 1. Get technician assignments for resident's issues
    if (userRole === 'resident') {
      const userIssues = await Issue.find({ reportedBy: userId })
        .populate('assignedTo', 'name email phone skills hourlyRate')
        .populate('reportedBy', 'name email flatNumber building')
        .sort({ createdAt: -1 });

      console.log(`📋 Found ${userIssues.length} issues for resident`);

      for (const issue of userIssues) {
        if (issue.assignedTo) {
          notifications.push({
            id: `assignment_${issue._id}`,
            type: 'technician_assignment',
            title: `AI Assignment: ${issue.assignedTo.name}`,
            message: `${issue.assignedTo.name} has been assigned to your ${issue.category} issue. They specialize in ${issue.assignedTo.skills.join(', ')} and charge ₹${issue.assignedTo.hourlyRate}/hour.`,
            timestamp: issue.updatedAt.toLocaleString(),
            priority: issue.priority,
            status: 'unread',
            issueId: issue._id.toString(),
            technician: {
              name: issue.assignedTo.name,
              skills: issue.assignedTo.skills,
              hourlyRate: issue.assignedTo.hourlyRate,
              phone: issue.assignedTo.phone,
              email: issue.assignedTo.email
            },
            issue: {
              title: issue.title,
              description: issue.description,
              category: issue.category,
              status: issue.status
            }
          });
        }

        // Add issue status updates
        if (issue.status === 'in_progress') {
          notifications.push({
            id: `progress_${issue._id}`,
            type: 'issue_update',
            title: 'Issue Update',
            message: `Your ${issue.category} issue is now in progress.`,
            timestamp: issue.updatedAt.toLocaleString(),
            priority: 'medium',
            status: 'unread',
            issueId: issue._id.toString()
          });
        }

        if (issue.status === 'resolved') {
          notifications.push({
            id: `resolved_${issue._id}`,
            type: 'issue_update',
            title: 'Issue Resolved',
            message: `Your ${issue.category} issue has been resolved successfully.`,
            timestamp: issue.updatedAt.toLocaleString(),
            priority: 'medium',
            status: 'unread',
            issueId: issue._id.toString()
          });
        }
      }
    }

    // 2. Get AI-generated bill reminders for residents
    if (userRole === 'resident') {
      const userBills = await Bill.find({ 
        resident: userId,
        status: { $in: ['pending', 'overdue'] }
      }).sort({ dueDate: 1 });

      console.log(`💰 Found ${userBills.length} pending bills for resident`);

      for (const bill of userBills) {
        const daysUntilDue = Math.ceil((new Date(bill.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue <= 7) {
          notifications.push({
            id: `bill_${bill._id}`,
            type: 'bill_reminder',
            title: 'Bill Reminder',
            message: `Your ${bill.type} bill of ₹${bill.amount} is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}. Please pay to avoid late fees.`,
            timestamp: new Date().toLocaleString(),
            priority: daysUntilDue <= 3 ? 'high' : 'medium',
            status: 'unread',
            issueId: bill._id.toString(),
            bill: {
              id: bill._id,
              billType: bill.type,
              amount: bill.amount,
              dueDate: bill.dueDate,
              status: bill.status
            }
          });
        }
      }
    }

    // 3. Get AI-generated duplicate bill alerts for residents
    if (userRole === 'resident') {
      const duplicateBills = await Bill.find({ 
        resident: userId,
        status: 'disputed',
        'disputes.reason': { $regex: /duplicate|double/i }
      }).sort({ createdAt: -1 });

      console.log(`⚠️ Found ${duplicateBills.length} duplicate bills for resident`);

      for (const bill of duplicateBills) {
        notifications.push({
          id: `duplicate_${bill._id}`,
          type: 'ai_analysis',
          title: 'AI Duplicate Bill Alert',
          message: `AI analysis detected a potential duplicate ${bill.type} bill of ₹${bill.amount}. This has been flagged for review.`,
          timestamp: bill.updatedAt.toLocaleString(),
          priority: 'high',
          status: 'unread',
          issueId: bill._id.toString(),
          aiAnalysis: {
            type: 'duplicate_detection',
            confidence: 'high',
            billType: bill.type,
            amount: bill.amount
          }
        });
      }
    }

    // 4. Get technician assignment notifications for technicians
    if (userRole === 'technician') {
      const assignedIssues = await Issue.find({ 
        assignedTo: userId,
        status: { $in: ['assigned', 'in_progress'] }
      }).populate('reportedBy', 'name email flatNumber building')
        .sort({ createdAt: -1 });

      console.log(`🔧 Found ${assignedIssues.length} assigned issues for technician`);

      for (const issue of assignedIssues) {
        notifications.push({
          id: `tech_assignment_${issue._id}`,
          type: 'technician_assignment',
          title: 'New Assignment',
          message: `You have been assigned to a ${issue.category} issue by ${issue.reportedBy.name} (${issue.reportedBy.flatNumber}).`,
          timestamp: issue.updatedAt.toLocaleString(),
          priority: issue.priority,
          status: 'unread',
          issueId: issue._id.toString(),
          issue: {
            title: issue.title,
            description: issue.description,
            category: issue.category,
            priority: issue.priority,
            status: issue.status,
            resident: {
              name: issue.reportedBy.name,
              flatNumber: issue.reportedBy.flatNumber,
              building: issue.reportedBy.building
            }
          }
        });
      }
    }

    // 5. Get security alerts for all users (mock for now, would come from security system)
    if (userRole === 'resident') {
      // Simulate security alerts based on user's building
      const securityAlerts = [
        {
          id: 'security_1',
          type: 'security_alert',
          title: 'Security Alert',
          message: 'Unusual activity detected in your building. Security team has been notified.',
          timestamp: new Date().toLocaleString(),
          priority: 'urgent',
          status: 'unread',
          issueId: 'security_alert_1'
        }
      ];
      
      notifications.push(...securityAlerts);
    }

    // Sort notifications by timestamp (newest first)
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    console.log(`✅ Returning ${notifications.length} notifications`);

    res.json({
      success: true,
      notifications: notifications,
      count: notifications.length,
      unreadCount: notifications.filter(n => n.status === 'unread').length
    });

  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch notifications',
      details: error.message 
    });
  }
});

// POST /api/notifications/mark-read - Mark notification as read
router.post('/mark-read', protect, async (req, res) => {
  try {
    const { notificationId } = req.body;
    
    // In a real implementation, you would update the notification status in the database
    // For now, we'll just return success
    console.log('📝 Marking notification as read:', notificationId);
    
    res.json({ 
      success: true, 
      message: 'Notification marked as read' 
    });
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to mark notification as read' 
    });
  }
});

// POST /api/notifications/mark-all-read - Mark all notifications as read
router.post('/mark-all-read', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // In a real implementation, you would update all notifications for this user
    console.log('📝 Marking all notifications as read for user:', userId);
    
    res.json({ 
      success: true, 
      message: 'All notifications marked as read' 
    });
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to mark all notifications as read' 
    });
  }
});

module.exports = router; 