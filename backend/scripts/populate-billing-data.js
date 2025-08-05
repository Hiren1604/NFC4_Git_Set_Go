const mongoose = require('mongoose');
const Bill = require('../models/Bill');
require('dotenv').config();

// Sample billing data based on the CSV
const sampleBills = [
  {
    billId: "BILL001",
    residentName: "Sneha Rao",
    amount: 1200,
    status: "Disputed",
    date: "2025-07-16",
    comments: "Dispute over water charges",
    type: "Maintenance",
    dueDate: "2025-07-31",
    category: "Water"
  },
  {
    billId: "BILL002",
    residentName: "Raj Verma",
    amount: 1800,
    status: "Disputed",
    date: "2025-07-31",
    comments: "Dispute over water charges",
    type: "Maintenance",
    dueDate: "2025-08-15",
    category: "Water"
  },
  {
    billId: "BILL003",
    residentName: "Rohan Mehta",
    amount: 1800,
    status: "Paid",
    date: "2025-07-19",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-03",
    category: "General"
  },
  {
    billId: "BILL004",
    residentName: "Raj Verma",
    amount: 2000,
    status: "Paid",
    date: "2025-07-29",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-13",
    category: "General"
  },
  {
    billId: "BILL005",
    residentName: "Neha Shah",
    amount: 1200,
    status: "Disputed",
    date: "2025-07-07",
    comments: "Dispute over water charges",
    type: "Maintenance",
    dueDate: "2025-07-22",
    category: "Water"
  },
  {
    billId: "BILL006",
    residentName: "Pooja Nair",
    amount: 1200,
    status: "Paid",
    date: "2025-07-23",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-07",
    category: "General"
  },
  {
    billId: "BILL007",
    residentName: "Sneha Rao",
    amount: 2000,
    status: "Unpaid",
    date: "2025-07-04",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-19",
    category: "General"
  },
  {
    billId: "BILL008",
    residentName: "Raj Verma",
    amount: 1800,
    status: "Paid",
    date: "2025-07-12",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-27",
    category: "General"
  },
  {
    billId: "BILL009",
    residentName: "Vikram Iyer",
    amount: 1800,
    status: "Paid",
    date: "2025-07-21",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-05",
    category: "General"
  },
  {
    billId: "BILL010",
    residentName: "Vikram Iyer",
    amount: 1500,
    status: "Paid",
    date: "2025-07-04",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-19",
    category: "General"
  },
  {
    billId: "BILL011",
    residentName: "Neha Shah",
    amount: 1200,
    status: "Paid",
    date: "2025-07-28",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-12",
    category: "General"
  },
  {
    billId: "BILL012",
    residentName: "Pooja Nair",
    amount: 1200,
    status: "Unpaid",
    date: "2025-07-27",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-11",
    category: "General"
  },
  {
    billId: "BILL013",
    residentName: "Rohan Mehta",
    amount: 1500,
    status: "Paid",
    date: "2025-07-11",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-26",
    category: "General"
  },
  {
    billId: "BILL014",
    residentName: "Raj Verma",
    amount: 1200,
    status: "Disputed",
    date: "2025-07-09",
    comments: "Dispute over water charges",
    type: "Maintenance",
    dueDate: "2025-07-24",
    category: "Water"
  },
  {
    billId: "BILL015",
    residentName: "Amit Patel",
    amount: 1500,
    status: "Unpaid",
    date: "2025-07-30",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-14",
    category: "General"
  },
  {
    billId: "BILL016",
    residentName: "Raj Verma",
    amount: 2000,
    status: "Paid",
    date: "2025-07-11",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-26",
    category: "General"
  },
  {
    billId: "BILL017",
    residentName: "Pooja Nair",
    amount: 1500,
    status: "Paid",
    date: "2025-07-20",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-04",
    category: "General"
  },
  {
    billId: "BILL018",
    residentName: "Pooja Nair",
    amount: 1200,
    status: "Paid",
    date: "2025-07-25",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-09",
    category: "General"
  },
  {
    billId: "BILL019",
    residentName: "Vikram Iyer",
    amount: 2000,
    status: "Paid",
    date: "2025-07-04",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-19",
    category: "General"
  },
  {
    billId: "BILL020",
    residentName: "Pooja Nair",
    amount: 1200,
    status: "Paid",
    date: "2025-07-09",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-24",
    category: "General"
  },
  {
    billId: "BILL021",
    residentName: "Neha Shah",
    amount: 2000,
    status: "Unpaid",
    date: "2025-07-11",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-26",
    category: "General"
  },
  {
    billId: "BILL022",
    residentName: "Raj Verma",
    amount: 1200,
    status: "Disputed",
    date: "2025-07-16",
    comments: "Dispute over water charges",
    type: "Maintenance",
    dueDate: "2025-07-31",
    category: "Water"
  },
  {
    billId: "BILL023",
    residentName: "Pooja Nair",
    amount: 1200,
    status: "Paid",
    date: "2025-07-31",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-15",
    category: "General"
  },
  {
    billId: "BILL024",
    residentName: "Vikram Iyer",
    amount: 1200,
    status: "Paid",
    date: "2025-07-09",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-24",
    category: "General"
  },
  {
    billId: "BILL025",
    residentName: "Raj Verma",
    amount: 2000,
    status: "Paid",
    date: "2025-07-11",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-26",
    category: "General"
  },
  {
    billId: "BILL026",
    residentName: "Rohan Mehta",
    amount: 1800,
    status: "Paid",
    date: "2025-07-14",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-29",
    category: "General"
  },
  {
    billId: "BILL027",
    residentName: "Amit Patel",
    amount: 1500,
    status: "Unpaid",
    date: "2025-07-19",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-03",
    category: "General"
  },
  {
    billId: "BILL028",
    residentName: "Raj Verma",
    amount: 2000,
    status: "Disputed",
    date: "2025-07-28",
    comments: "Dispute over water charges",
    type: "Maintenance",
    dueDate: "2025-08-12",
    category: "Water"
  },
  {
    billId: "BILL029",
    residentName: "Sneha Rao",
    amount: 1200,
    status: "Paid",
    date: "2025-07-16",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-31",
    category: "General"
  },
  {
    billId: "BILL030",
    residentName: "Rohan Mehta",
    amount: 1800,
    status: "Paid",
    date: "2025-07-07",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-22",
    category: "General"
  },
  {
    billId: "BILL031",
    residentName: "Raj Verma",
    amount: 2000,
    status: "Unpaid",
    date: "2025-07-25",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-09",
    category: "General"
  },
  {
    billId: "BILL032",
    residentName: "Neha Shah",
    amount: 1500,
    status: "Paid",
    date: "2025-07-11",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-26",
    category: "General"
  },
  {
    billId: "BILL033",
    residentName: "Neha Shah",
    amount: 1200,
    status: "Paid",
    date: "2025-07-13",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-28",
    category: "General"
  },
  {
    billId: "BILL034",
    residentName: "Pooja Nair",
    amount: 2000,
    status: "Paid",
    date: "2025-07-31",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-15",
    category: "General"
  },
  {
    billId: "BILL035",
    residentName: "Amit Patel",
    amount: 1500,
    status: "Paid",
    date: "2025-07-09",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-24",
    category: "General"
  },
  {
    billId: "BILL036",
    residentName: "Amit Patel",
    amount: 1800,
    status: "Paid",
    date: "2025-07-20",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-04",
    category: "General"
  },
  {
    billId: "BILL037",
    residentName: "Raj Verma",
    amount: 2000,
    status: "Paid",
    date: "2025-07-30",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-14",
    category: "General"
  },
  {
    billId: "BILL038",
    residentName: "Sneha Rao",
    amount: 2000,
    status: "Paid",
    date: "2025-07-23",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-07",
    category: "General"
  },
  {
    billId: "BILL039",
    residentName: "Pooja Nair",
    amount: 1500,
    status: "Paid",
    date: "2025-07-03",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-18",
    category: "General"
  },
  {
    billId: "BILL040",
    residentName: "Sneha Rao",
    amount: 2000,
    status: "Paid",
    date: "2025-07-20",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-04",
    category: "General"
  },
  {
    billId: "BILL041",
    residentName: "Sneha Rao",
    amount: 1500,
    status: "Paid",
    date: "2025-07-30",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-14",
    category: "General"
  },
  {
    billId: "BILL042",
    residentName: "Sneha Rao",
    amount: 1500,
    status: "Paid",
    date: "2025-07-21",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-05",
    category: "General"
  },
  {
    billId: "BILL043",
    residentName: "Raj Verma",
    amount: 2000,
    status: "Paid",
    date: "2025-07-16",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-31",
    category: "General"
  },
  {
    billId: "BILL044",
    residentName: "Sneha Rao",
    amount: 1800,
    status: "Paid",
    date: "2025-07-05",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-20",
    category: "General"
  },
  {
    billId: "BILL045",
    residentName: "Amit Patel",
    amount: 1500,
    status: "Paid",
    date: "2025-07-31",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-15",
    category: "General"
  },
  {
    billId: "BILL046",
    residentName: "Sneha Rao",
    amount: 1500,
    status: "Unpaid",
    date: "2025-07-05",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-20",
    category: "General"
  },
  {
    billId: "BILL047",
    residentName: "Neha Shah",
    amount: 2000,
    status: "Paid",
    date: "2025-07-12",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-27",
    category: "General"
  },
  {
    billId: "BILL048",
    residentName: "Rohan Mehta",
    amount: 2000,
    status: "Paid",
    date: "2025-07-22",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-06",
    category: "General"
  },
  {
    billId: "BILL049",
    residentName: "Raj Verma",
    amount: 1200,
    status: "Unpaid",
    date: "2025-07-28",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-08-12",
    category: "General"
  },
  {
    billId: "BILL050",
    residentName: "Vikram Iyer",
    amount: 2000,
    status: "Unpaid",
    date: "2025-07-07",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-22",
    category: "General"
  },
  // Duplicate bills for AI analysis
  {
    billId: "BILL099",
    residentName: "Neha Patel",
    amount: 2000,
    status: "Paid",
    date: "2025-07-11",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-26",
    category: "General"
  },
  {
    billId: "BILL089",
    residentName: "Neha Patel",
    amount: 2000,
    status: "Paid",
    date: "2025-07-11",
    comments: "",
    type: "Maintenance",
    dueDate: "2025-07-26",
    category: "General"
  }
];

async function populateBillingData() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://waghelahiren16:2k5TVOdYVCy4EFJm@cluster0.fkkhdpx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing bills
    await Bill.deleteMany({});
    console.log('🗑️  Cleared existing bills');

    // Insert sample bills
    const bills = await Bill.insertMany(sampleBills);
    console.log(`✅ Inserted ${bills.length} bills`);

    // Log some statistics
    const totalBills = await Bill.countDocuments();
    const disputedBills = await Bill.countDocuments({ status: 'Disputed' });
    const paidBills = await Bill.countDocuments({ status: 'Paid' });
    const unpaidBills = await Bill.countDocuments({ status: 'Unpaid' });

    console.log('\n📊 Billing Statistics:');
    console.log(`Total Bills: ${totalBills}`);
    console.log(`Paid Bills: ${paidBills}`);
    console.log(`Unpaid Bills: ${unpaidBills}`);
    console.log(`Disputed Bills: ${disputedBills}`);

    // Find duplicates for verification
    const duplicates = await Bill.aggregate([
      {
        $group: {
          _id: {
            residentName: '$residentName',
            amount: '$amount',
            date: '$date',
            comments: '$comments'
          },
          count: { $sum: 1 },
          bills: { $push: '$billId' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    console.log('\n🔍 Duplicate Detection Results:');
    duplicates.forEach(dup => {
      console.log(`Resident: ${dup._id.residentName}, Amount: ₹${dup._id.amount}, Bills: ${dup.bills.join(', ')}`);
    });

    console.log('\n✅ Database population completed successfully!');
  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  populateBillingData();
}

module.exports = { populateBillingData }; 