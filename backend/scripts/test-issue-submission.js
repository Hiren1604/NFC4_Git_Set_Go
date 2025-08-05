const mongoose = require('mongoose');
const Issue = require('../models/Issue');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resident_assist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testIssueSubmission() {
  try {
    console.log('🧪 Testing issue submission with AI agent...\n');

    // Wait for connection
    await mongoose.connection.asPromise();
    console.log('✅ Connected to MongoDB');

    // First, let's check if we have any users (residents)
    const users = await User.find({ role: 'resident' }).limit(1);
    if (users.length === 0) {
      console.log('❌ No residents found in database. Creating a test resident...');
      
      // Create a test resident
      const testResident = await User.create({
        name: 'Test Resident',
        email: 'test@example.com',
        password: 'password123',
        role: 'resident',
        flatNumber: 'A101',
        building: 'Building A',
        phone: '1234567890'
      });
      
      console.log('✅ Created test resident:', testResident.email);
    } else {
      console.log('✅ Found existing resident:', users[0].email);
    }

    // Check technicians
    const technicians = await User.find({ role: 'technician' });
    console.log(`👥 Found ${technicians.length} technicians in database`);

    if (technicians.length === 0) {
      console.log('❌ No technicians found. Please run populate-technicians.js first.');
      return;
    }

    // Create a test issue
    console.log('\n📝 Creating test cleaning issue...');
    
    const testIssue = await Issue.create({
      title: 'Test Cleaning Request',
      description: 'Need apartment cleaning service for 2BHK flat',
      category: 'cleaning',
      priority: 'medium',
      reportedBy: users[0]?._id || 'test-user-id',
      location: {
        flatNumber: 'A101',
        building: 'Building A',
        area: 'Living Room'
      },
      status: 'pending'
    });

    console.log('✅ Test issue created:', {
      id: testIssue._id,
      title: testIssue.title,
      category: testIssue.category,
      status: testIssue.status
    });

    // Now let's simulate the AI agent assignment process
    console.log('\n🤖 Simulating AI agent assignment...');
    
    // Get available technicians
    const availableTechnicians = await User.find({ 
      role: 'technician',
      availability: 'available'
    }).select('name email phone skills hourlyRate availability');

    console.log(`👥 Found ${availableTechnicians.length} available technicians`);

    if (availableTechnicians.length > 0) {
      // Find best technician for cleaning
      const cleaningTechnicians = availableTechnicians.filter(tech => 
        tech.skills.includes('cleaning')
      );

      if (cleaningTechnicians.length > 0) {
        const bestTechnician = cleaningTechnicians[0]; // Take the first one
        console.log('🎯 Best technician for cleaning:', {
          name: bestTechnician.name,
          skills: bestTechnician.skills,
          hourlyRate: bestTechnician.hourlyRate
        });

        // Update the issue
        testIssue.assignedTo = bestTechnician._id;
        testIssue.status = 'assigned';
        await testIssue.save();

        console.log('✅ Issue assigned to technician:', bestTechnician.name);
      } else {
        console.log('⚠️ No cleaning technicians available');
      }
    }

    // Show final result
    const finalIssue = await Issue.findById(testIssue._id)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name skills hourlyRate');

    console.log('\n📊 Final Issue Details:');
    console.log('   ID:', finalIssue._id);
    console.log('   Title:', finalIssue.title);
    console.log('   Category:', finalIssue.category);
    console.log('   Status:', finalIssue.status);
    console.log('   Reported by:', finalIssue.reportedBy?.name);
    console.log('   Assigned to:', finalIssue.assignedTo?.name || 'Not assigned');

  } catch (error) {
    console.error('❌ Error in test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testIssueSubmission(); 