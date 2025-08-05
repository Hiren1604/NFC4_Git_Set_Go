const mongoose = require('mongoose');
const Issue = require('../models/Issue');
const User = require('../models/User');
require('dotenv').config();

async function populateSampleIssues() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://waghelahiren16:2k5TVOdYVCy4EFJm@cluster0.fkkhdpx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get some resident users
    const residents = await User.find({ role: 'resident' }).limit(10);
    if (residents.length === 0) {
      console.log('❌ No resident users found. Please create some users first.');
      return;
    }

    console.log(`Found ${residents.length} residents`);

    // Get some technician users
    const technicians = await User.find({ role: 'technician' }).limit(5);
    console.log(`Found ${technicians.length} technicians`);

    // Clear existing issues
    await Issue.deleteMany({});
    console.log('🗑️ Cleared existing issues');

    // Sample issues data
    const sampleIssues = [
      {
        title: 'Water Leak in Kitchen',
        description: 'There is a persistent water leak under the kitchen sink. Water is dripping and has started to damage the cabinet. This needs immediate attention as it could cause more damage.',
        category: 'plumbing',
        priority: 'high',
        reportedBy: residents[0]._id,
        assignedTo: technicians[0]?._id,
        status: 'in-progress',
        location: {
          flatNumber: 'A-501',
          building: 'Building A',
          area: 'Kitchen'
        },
        aiSuggestions: {
          category: 'plumbing',
          priority: 'high',
          estimatedTime: '2-4 hours',
          confidence: 0.9
        },
        timeline: [
          {
            status: 'reported',
            message: 'Issue reported by resident',
            updatedBy: residents[0]._id,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          },
          {
            status: 'assigned',
            message: 'Assigned to plumbing technician',
            updatedBy: technicians[0]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
          },
          {
            status: 'in-progress',
            message: 'Technician arrived and started work',
            updatedBy: technicians[0]?._id || residents[0]._id,
            timestamp: new Date()
          }
        ],
        estimatedCompletion: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        cost: {
          estimated: 1500,
          actual: 0,
          currency: 'INR'
        },
        isEmergency: false
      },
      {
        title: 'Electrical Outlet Not Working',
        description: 'The electrical outlet in the living room has stopped working. No power is coming through. This affects the TV and other appliances.',
        category: 'electrical',
        priority: 'medium',
        reportedBy: residents[1]?._id || residents[0]._id,
        assignedTo: technicians[1]?._id,
        status: 'assigned',
        location: {
          flatNumber: 'B-302',
          building: 'Building B',
          area: 'Living Room'
        },
        aiSuggestions: {
          category: 'electrical',
          priority: 'medium',
          estimatedTime: '1-2 hours',
          confidence: 0.85
        },
        timeline: [
          {
            status: 'reported',
            message: 'Issue reported by resident',
            updatedBy: residents[1]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
          },
          {
            status: 'assigned',
            message: 'Assigned to electrical technician',
            updatedBy: technicians[1]?._id || residents[0]._id,
            timestamp: new Date()
          }
        ],
        estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        cost: {
          estimated: 800,
          actual: 0,
          currency: 'INR'
        },
        isEmergency: false
      },
      {
        title: 'Broken Window Lock',
        description: 'The window lock in the bedroom is broken and cannot be secured. This is a security concern as the window cannot be properly locked.',
        category: 'carpentry',
        priority: 'medium',
        reportedBy: residents[2]?._id || residents[0]._id,
        status: 'pending',
        location: {
          flatNumber: 'C-405',
          building: 'Building C',
          area: 'Bedroom'
        },
        aiSuggestions: {
          category: 'carpentry',
          priority: 'medium',
          estimatedTime: '1-2 days',
          confidence: 0.8
        },
        timeline: [
          {
            status: 'reported',
            message: 'Issue reported by resident',
            updatedBy: residents[2]?._id || residents[0]._id,
            timestamp: new Date()
          }
        ],
        estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        cost: {
          estimated: 1200,
          actual: 0,
          currency: 'INR'
        },
        isEmergency: false
      },
      {
        title: 'Elevator Not Responding',
        description: 'The elevator in Building A is not responding to button presses. It seems to be stuck on the ground floor. This is affecting all residents.',
        category: 'elevator',
        priority: 'urgent',
        reportedBy: residents[3]?._id || residents[0]._id,
        status: 'assigned',
        location: {
          flatNumber: 'A-101',
          building: 'Building A',
          area: 'Main Lobby'
        },
        aiSuggestions: {
          category: 'elevator',
          priority: 'urgent',
          estimatedTime: '4-6 hours',
          confidence: 0.95
        },
        timeline: [
          {
            status: 'reported',
            message: 'Emergency issue reported',
            updatedBy: residents[3]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
          },
          {
            status: 'assigned',
            message: 'Assigned to elevator technician',
            updatedBy: technicians[2]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
          }
        ],
        estimatedCompletion: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        cost: {
          estimated: 5000,
          actual: 0,
          currency: 'INR'
        },
        isEmergency: true,
        emergencyType: 'structural'
      },
      {
        title: 'Garbage Chute Blocked',
        description: 'The garbage chute on the 3rd floor is blocked and waste is accumulating. This is causing a hygiene issue and unpleasant odor.',
        category: 'cleaning',
        priority: 'high',
        reportedBy: residents[4]?._id || residents[0]._id,
        status: 'in-progress',
        location: {
          flatNumber: 'B-301',
          building: 'Building B',
          area: '3rd Floor'
        },
        aiSuggestions: {
          category: 'cleaning',
          priority: 'high',
          estimatedTime: '3-4 hours',
          confidence: 0.85
        },
        timeline: [
          {
            status: 'reported',
            message: 'Issue reported by resident',
            updatedBy: residents[4]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
          },
          {
            status: 'assigned',
            message: 'Assigned to cleaning staff',
            updatedBy: technicians[3]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
          },
          {
            status: 'in-progress',
            message: 'Cleaning staff working on unblocking',
            updatedBy: technicians[3]?._id || residents[0]._id,
            timestamp: new Date()
          }
        ],
        estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        cost: {
          estimated: 2000,
          actual: 0,
          currency: 'INR'
        },
        isEmergency: false
      },
      {
        title: 'Parking Gate Malfunction',
        description: 'The automatic parking gate is not opening properly. It opens partially and then gets stuck, making it difficult for vehicles to enter and exit.',
        category: 'parking',
        priority: 'medium',
        reportedBy: residents[5]?._id || residents[0]._id,
        status: 'pending',
        location: {
          flatNumber: 'C-201',
          building: 'Building C',
          area: 'Parking Area'
        },
        aiSuggestions: {
          category: 'parking',
          priority: 'medium',
          estimatedTime: '1-2 days',
          confidence: 0.8
        },
        timeline: [
          {
            status: 'reported',
            message: 'Issue reported by resident',
            updatedBy: residents[5]?._id || residents[0]._id,
            timestamp: new Date()
          }
        ],
        estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        cost: {
          estimated: 3000,
          actual: 0,
          currency: 'INR'
        },
        isEmergency: false
      },
      {
        title: 'Garden Sprinkler System Broken',
        description: 'The automatic sprinkler system in the garden is not working. The plants are drying up due to lack of water. This affects the overall appearance of the society.',
        category: 'garden',
        priority: 'low',
        reportedBy: residents[6]?._id || residents[0]._id,
        status: 'resolved',
        location: {
          flatNumber: 'A-601',
          building: 'Building A',
          area: 'Garden Area'
        },
        aiSuggestions: {
          category: 'garden',
          priority: 'low',
          estimatedTime: '1-2 days',
          confidence: 0.75
        },
        timeline: [
          {
            status: 'reported',
            message: 'Issue reported by resident',
            updatedBy: residents[6]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
          },
          {
            status: 'assigned',
            message: 'Assigned to garden maintenance',
            updatedBy: technicians[4]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
          },
          {
            status: 'in-progress',
            message: 'Technician working on sprinkler system',
            updatedBy: technicians[4]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
          },
          {
            status: 'resolved',
            message: 'Sprinkler system repaired and working',
            updatedBy: technicians[4]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
          }
        ],
        actualCompletion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        cost: {
          estimated: 1500,
          actual: 1800,
          currency: 'INR'
        },
        rating: {
          score: 4,
          feedback: 'Good work, but took longer than expected',
          submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
        },
        isEmergency: false
      },
      {
        title: 'Security Camera Offline',
        description: 'The security camera at the main entrance is showing "offline" status. This is a security concern as it affects surveillance of the main entry point.',
        category: 'security',
        priority: 'high',
        reportedBy: residents[7]?._id || residents[0]._id,
        status: 'assigned',
        location: {
          flatNumber: 'B-401',
          building: 'Building B',
          area: 'Main Entrance'
        },
        aiSuggestions: {
          category: 'security',
          priority: 'high',
          estimatedTime: '2-3 hours',
          confidence: 0.9
        },
        timeline: [
          {
            status: 'reported',
            message: 'Security issue reported',
            updatedBy: residents[7]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
          },
          {
            status: 'assigned',
            message: 'Assigned to security technician',
            updatedBy: technicians[0]?._id || residents[0]._id,
            timestamp: new Date()
          }
        ],
        estimatedCompletion: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
        cost: {
          estimated: 2500,
          actual: 0,
          currency: 'INR'
        },
        isEmergency: false
      },
      {
        title: 'Intercom System Not Working',
        description: 'The intercom system in my flat is not working. I cannot receive calls from the main gate or other residents. This affects communication and security.',
        category: 'other',
        priority: 'medium',
        reportedBy: residents[8]?._id || residents[0]._id,
        status: 'pending',
        location: {
          flatNumber: 'C-505',
          building: 'Building C',
          area: 'Living Room'
        },
        aiSuggestions: {
          category: 'other',
          priority: 'medium',
          estimatedTime: '1-2 days',
          confidence: 0.7
        },
        timeline: [
          {
            status: 'reported',
            message: 'Issue reported by resident',
            updatedBy: residents[8]?._id || residents[0]._id,
            timestamp: new Date()
          }
        ],
        estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        cost: {
          estimated: 1000,
          actual: 0,
          currency: 'INR'
        },
        isEmergency: false
      },
      {
        title: 'Fire Alarm Test Required',
        description: 'The fire alarm system needs to be tested as per safety regulations. It has been more than 6 months since the last test. This is important for safety compliance.',
        category: 'security',
        priority: 'medium',
        reportedBy: residents[9]?._id || residents[0]._id,
        status: 'closed',
        location: {
          flatNumber: 'A-301',
          building: 'Building A',
          area: 'Entire Building'
        },
        aiSuggestions: {
          category: 'security',
          priority: 'medium',
          estimatedTime: '4-6 hours',
          confidence: 0.8
        },
        timeline: [
          {
            status: 'reported',
            message: 'Safety compliance issue reported',
            updatedBy: residents[9]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
          },
          {
            status: 'assigned',
            message: 'Assigned to safety inspector',
            updatedBy: technicians[1]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
          },
          {
            status: 'in-progress',
            message: 'Fire alarm testing in progress',
            updatedBy: technicians[1]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
          },
          {
            status: 'resolved',
            message: 'Fire alarm test completed successfully',
            updatedBy: technicians[1]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
          },
          {
            status: 'closed',
            message: 'Issue closed - all systems working properly',
            updatedBy: technicians[1]?._id || residents[0]._id,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
          }
        ],
        actualCompletion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        cost: {
          estimated: 3000,
          actual: 2800,
          currency: 'INR'
        },
        rating: {
          score: 5,
          feedback: 'Excellent work, very thorough testing',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        isEmergency: false
      }
    ];

    // Insert the issues
    const insertedIssues = await Issue.insertMany(sampleIssues);
    console.log(`✅ Created ${insertedIssues.length} sample issues`);

    // Log statistics
    const statusStats = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const categoryStats = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const priorityStats = await Issue.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    console.log('\n📊 Sample Issues Summary:');
    console.log(`- Total issues created: ${insertedIssues.length}`);
    console.log('\n📈 Status Distribution:');
    statusStats.forEach(stat => {
      console.log(`  - ${stat._id}: ${stat.count}`);
    });

    console.log('\n🏷️ Category Distribution:');
    categoryStats.forEach(stat => {
      console.log(`  - ${stat._id}: ${stat.count}`);
    });

    console.log('\n⚡ Priority Distribution:');
    priorityStats.forEach(stat => {
      console.log(`  - ${stat._id}: ${stat.count}`);
    });

    console.log('\n🎯 The Report Issue form will now save data to the database!');
    console.log('📝 Residents can submit issues and they will be stored with proper tracking.');

  } catch (error) {
    console.error('❌ Error populating sample issues:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

populateSampleIssues(); 