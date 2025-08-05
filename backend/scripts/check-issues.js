const mongoose = require('mongoose');
const Issue = require('../models/Issue');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resident_assist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkIssues() {
  try {
    console.log('🔍 Checking existing issues in database...\n');

    // Get all issues with populated data
    const issues = await Issue.find({})
      .populate('reportedBy', 'name email phone')
      .populate('assignedTo', 'name email phone skills hourlyRate')
      .sort({ createdAt: -1 });

    console.log(`📊 Found ${issues.length} issues in database:\n`);

    if (issues.length === 0) {
      console.log('❌ No issues found in database');
      return;
    }

    issues.forEach((issue, index) => {
      console.log(`\n🔸 Issue #${index + 1}:`);
      console.log(`   ID: ${issue._id}`);
      console.log(`   Title: ${issue.title}`);
      console.log(`   Description: ${issue.description}`);
      console.log(`   Category: ${issue.category}`);
      console.log(`   Priority: ${issue.priority}`);
      console.log(`   Status: ${issue.status}`);
      console.log(`   Created: ${issue.createdAt.toLocaleString()}`);
      
      if (issue.reportedBy) {
        console.log(`   Reported by: ${issue.reportedBy.name} (${issue.reportedBy.email})`);
      }
      
      if (issue.assignedTo) {
        console.log(`   Assigned to: ${issue.assignedTo.name} (${issue.assignedTo.skills.join(', ')})`);
        console.log(`   Hourly Rate: ₹${issue.assignedTo.hourlyRate}/hr`);
      } else {
        console.log(`   Assigned to: Not assigned`);
      }

      if (issue.timeline && issue.timeline.length > 0) {
        console.log(`   Timeline:`);
        issue.timeline.forEach((entry, i) => {
          console.log(`     ${i + 1}. ${entry.status} - ${entry.message} (${entry.timestamp.toLocaleString()})`);
        });
      }

      if (issue.aiSuggestions) {
        console.log(`   AI Suggestions:`, issue.aiSuggestions);
      }
    });

    // Check technicians
    console.log('\n👥 Checking available technicians...');
    const technicians = await User.find({ role: 'technician' }).select('name email skills hourlyRate availability');
    
    console.log(`📊 Found ${technicians.length} technicians:\n`);
    
    technicians.forEach((tech, index) => {
      console.log(`${index + 1}. ${tech.name} - ${tech.skills.join(', ')} - ₹${tech.hourlyRate}/hr - ${tech.availability}`);
    });

  } catch (error) {
    console.error('❌ Error checking issues:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkIssues(); 