const mongoose = require('mongoose');
const Bill = require('../models/Bill');
const User = require('../models/User');
require('dotenv').config();

async function populateBillingDisputes() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://waghelahiren16:2k5TVOdYVCy4EFJm@cluster0.fkkhdpx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get some resident users
    const residents = await User.find({ role: 'resident' }).limit(5);
    if (residents.length === 0) {
      console.log('❌ No resident users found. Please create some users first.');
      return;
    }

    console.log(`Found ${residents.length} residents`);

    // Clear existing bills
    await Bill.deleteMany({});
    console.log('🗑️ Cleared existing bills');

    // Create sample bills with disputes about duplicate payments
    const sampleBills = [
      {
        resident: residents[0]._id,
        type: 'maintenance',
        amount: 2000,
        currency: 'INR',
        dueDate: new Date('2025-02-15'),
        status: 'disputed',
        description: 'Monthly maintenance charges for February 2025',
        period: {
          startDate: new Date('2025-02-01'),
          endDate: new Date('2025-02-28')
        },
        disputes: [{
          reason: 'Duplicate Payment',
          description: 'I have already paid the maintenance charges for February 2025. This is a duplicate bill. Please check your records and remove this duplicate charge.',
          raisedBy: residents[0]._id,
          raisedAt: new Date('2025-02-10'),
          status: 'pending'
        }]
      },
      {
        resident: residents[1]?._id || residents[0]._id,
        type: 'maintenance',
        amount: 1800,
        currency: 'INR',
        dueDate: new Date('2025-02-15'),
        status: 'disputed',
        description: 'Monthly maintenance charges for February 2025',
        period: {
          startDate: new Date('2025-02-01'),
          endDate: new Date('2025-02-28')
        },
        disputes: [{
          reason: 'Double Billing',
          description: 'I received two maintenance bills for the same month. This appears to be a system error causing double billing. Please investigate and resolve.',
          raisedBy: residents[1]?._id || residents[0]._id,
          raisedAt: new Date('2025-02-12'),
          status: 'pending'
        }]
      },
      {
        resident: residents[2]?._id || residents[0]._id,
        type: 'maintenance',
        amount: 2200,
        currency: 'INR',
        dueDate: new Date('2025-02-15'),
        status: 'disputed',
        description: 'Monthly maintenance charges for February 2025',
        period: {
          startDate: new Date('2025-02-01'),
          endDate: new Date('2025-02-28')
        },
        disputes: [{
          reason: 'Duplicate Maintenance Charge',
          description: 'I have already paid the maintenance fee for this month. This duplicate bill is causing confusion. Please remove the duplicate entry.',
          raisedBy: residents[2]?._id || residents[0]._id,
          raisedAt: new Date('2025-02-08'),
          status: 'pending'
        }]
      },
      {
        resident: residents[3]?._id || residents[0]._id,
        type: 'maintenance',
        amount: 1600,
        currency: 'INR',
        dueDate: new Date('2025-02-15'),
        status: 'disputed',
        description: 'Monthly maintenance charges for February 2025',
        period: {
          startDate: new Date('2025-02-01'),
          endDate: new Date('2025-02-28')
        },
        disputes: [{
          reason: 'Double Payment Issue',
          description: 'I am being charged twice for the same maintenance period. This is clearly a duplicate billing issue that needs immediate attention.',
          raisedBy: residents[3]?._id || residents[0]._id,
          raisedAt: new Date('2025-02-14'),
          status: 'pending'
        }]
      },
      {
        resident: residents[4]?._id || residents[0]._id,
        type: 'maintenance',
        amount: 1900,
        currency: 'INR',
        dueDate: new Date('2025-02-15'),
        status: 'disputed',
        description: 'Monthly maintenance charges for February 2025',
        period: {
          startDate: new Date('2025-02-01'),
          endDate: new Date('2025-02-28')
        },
        disputes: [{
          reason: 'Duplicate Billing',
          description: 'I have received two identical maintenance bills for February. This is a system error that needs to be corrected immediately.',
          raisedBy: residents[4]?._id || residents[0]._id,
          raisedAt: new Date('2025-02-11'),
          status: 'pending'
        }]
      }
    ];

    // Insert the bills
    const insertedBills = await Bill.insertMany(sampleBills);
    console.log(`✅ Created ${insertedBills.length} bills with disputes`);

    // Also create some regular bills without disputes for comparison
    const regularBills = [
      {
        resident: residents[0]._id,
        type: 'maintenance',
        amount: 2000,
        currency: 'INR',
        dueDate: new Date('2025-03-15'),
        status: 'pending',
        description: 'Monthly maintenance charges for March 2025',
        period: {
          startDate: new Date('2025-03-01'),
          endDate: new Date('2025-03-31')
        }
      },
      {
        resident: residents[1]?._id || residents[0]._id,
        type: 'maintenance',
        amount: 1800,
        currency: 'INR',
        dueDate: new Date('2025-03-15'),
        status: 'paid',
        description: 'Monthly maintenance charges for March 2025',
        period: {
          startDate: new Date('2025-03-01'),
          endDate: new Date('2025-03-31')
        },
        paymentDetails: {
          method: 'online',
          transactionId: 'TXN123456',
          paidAt: new Date('2025-03-10'),
          paidAmount: 1800
        }
      }
    ];

    const insertedRegularBills = await Bill.insertMany(regularBills);
    console.log(`✅ Created ${insertedRegularBills.length} regular bills`);

    console.log('\n📊 Summary:');
    console.log(`- Total bills created: ${insertedBills.length + insertedRegularBills.length}`);
    console.log(`- Bills with disputes: ${insertedBills.length}`);
    console.log(`- Regular bills: ${insertedRegularBills.length}`);

    console.log('\n🎯 The AI Billing Analysis will now only show bills where residents have complained about duplicate payments!');

  } catch (error) {
    console.error('❌ Error populating billing disputes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

populateBillingDisputes(); 