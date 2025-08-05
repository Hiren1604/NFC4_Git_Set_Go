const mongoose = require('mongoose');
const Bill = require('../models/Bill');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resident_assist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function populateSampleBills() {
  try {
    console.log('💰 Populating sample bills with disputes...\n');

    // Wait for connection
    await mongoose.connection.asPromise();
    console.log('✅ Connected to MongoDB');

    // Get existing residents
    const residents = await User.find({ role: 'resident' });
    if (residents.length === 0) {
      console.log('❌ No residents found. Please create residents first.');
      return;
    }

    console.log(`👥 Found ${residents.length} residents`);

    // Clear existing bills
    await Bill.deleteMany({});
    console.log('🗑️ Cleared existing bills');

    const sampleBills = [];

    // Create bills for each resident
    for (const resident of residents) {
      // Regular bills
      sampleBills.push({
        resident: resident._id,
        type: 'maintenance',
        amount: 2500,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'pending',
        description: 'Monthly maintenance charges',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      sampleBills.push({
        resident: resident._id,
        type: 'electricity',
        amount: 1800,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'pending',
        description: 'Electricity bill for current month',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Duplicate bills (for AI detection)
      sampleBills.push({
        resident: resident._id,
        type: 'maintenance',
        amount: 2500,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        status: 'disputed',
        disputes: [{
          reason: 'Duplicate maintenance bill - already paid this month',
          description: 'This bill appears to be a duplicate of the previous month\'s bill',
          raisedBy: resident._id,
          status: 'pending'
        }],
        description: 'Duplicate maintenance charges',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      sampleBills.push({
        resident: resident._id,
        type: 'water',
        amount: 1200,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'disputed',
        disputes: [{
          reason: 'Double water bill - billing error',
          description: 'Water bill amount seems incorrect and appears to be double charged',
          raisedBy: resident._id,
          status: 'pending'
        }],
        description: 'Water bill for current month',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Overdue bills
      sampleBills.push({
        resident: resident._id,
        type: 'parking',
        amount: 800,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: 'overdue',
        description: 'Parking charges for last month',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Insert all bills
    const createdBills = await Bill.insertMany(sampleBills);
    console.log(`✅ Created ${createdBills.length} sample bills`);

    // Show summary
    const billSummary = await Bill.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    console.log('\n📊 Bill Summary:');
    billSummary.forEach(summary => {
      console.log(`   ${summary._id}: ${summary.count} bills (₹${summary.totalAmount})`);
    });

    // Show duplicate bills
    const duplicateBills = await Bill.find({
      status: 'disputed',
      disputeReason: { $regex: /duplicate|double/i }
    });

    console.log(`\n⚠️ Duplicate bills detected: ${duplicateBills.length}`);
    duplicateBills.forEach(bill => {
      console.log(`   - ${bill.billType}: ₹${bill.amount} (${bill.disputeReason})`);
    });

  } catch (error) {
    console.error('❌ Error populating sample bills:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

populateSampleBills(); 