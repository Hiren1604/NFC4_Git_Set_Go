const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Bill = require('../models/Bill');

// Resident metadata mapping to generate realistic profiles
const RESIDENT_PROFILES = {
  'Sneha Rao': { flatNumber: 'A-101', building: 'Building A', phone: '+91 98765 00001' },
  'Raj Verma': { flatNumber: 'A-202', building: 'Building A', phone: '+91 98765 00002' },
  'Rohan Mehta': { flatNumber: 'B-101', building: 'Building B', phone: '+91 98765 00003' },
  'Neha Shah': { flatNumber: 'B-202', building: 'Building B', phone: '+91 98765 00004' },
  'Pooja Nair': { flatNumber: 'C-101', building: 'Building C', phone: '+91 98765 00005' },
  'Vikram Iyer': { flatNumber: 'C-202', building: 'Building C', phone: '+91 98765 00006' },
  'Amit Patel': { flatNumber: 'D-101', building: 'Building D', phone: '+91 98765 00007' },
  'Neha Patel': { flatNumber: 'D-202', building: 'Building D', phone: '+91 98765 00008' },
};

function parseCSVLine(line) {
  // Simple CSV parser supporting standard comma separation
  return line.split(',').map(item => item.trim());
}

async function loadCSVToMongoDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resident_assist';
  console.log('📡 Connecting to MongoDB at:', mongoURI.replace(/:[^:]*@/, ':****@'));

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.log('\n💡 Tip: Please make sure your MongoDB instance is running, or verify MONGODB_URI in backend/.env');
    process.exit(1);
  }

  try {
    // 1. Ensure an Admin user exists
    let admin = await User.findOne({ email: 'admin@societyhub.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Society Admin',
        email: 'admin@societyhub.com',
        password: 'adminpassword123',
        role: 'admin',
        phone: '+91 99999 88888',
        building: 'Clubhouse',
        flatNumber: 'Office-1'
      });
      console.log('👑 Created default admin user: admin@societyhub.com (password: adminpassword123)');
    } else {
      console.log('👑 Admin user already exists:', admin.email);
    }

    // 2. Read the CSV file
    const csvPath = path.join(__dirname, '../../ai-agents/samplemaintenance.csv');
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at: ${csvPath}`);
    }

    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = fileContent.split('\n').filter(l => l.trim().length > 0);
    const header = parseCSVLine(lines[0]);
    console.log(`📄 Found ${lines.length - 1} records in samplemaintenance.csv`);

    // 3. Collect unique residents from CSV and create user records if missing
    const userMap = {}; // residentName -> User Document

    for (let i = 1; i < lines.length; i++) {
      const parts = parseCSVLine(lines[i]);
      if (parts.length < 5) continue;
      const residentName = parts[1];

      if (!userMap[residentName]) {
        let user = await User.findOne({ name: residentName });
        if (!user) {
          const profile = RESIDENT_PROFILES[residentName] || {
            flatNumber: `F-${100 + i}`,
            building: 'Tower A',
            phone: `+91 98000 ${String(i).padStart(5, '0')}`
          };
          const email = `${residentName.toLowerCase().replace(/\s+/g, '.')}@societyhub.com`;

          user = await User.create({
            name: residentName,
            email: email,
            password: 'password123',
            role: 'resident',
            phone: profile.phone,
            flatNumber: profile.flatNumber,
            building: profile.building
          });
          console.log(`👤 Created resident account: ${residentName} (${email})`);
        }
        userMap[residentName] = user;
      }
    }

    // 4. Wipe old bills and import rows from CSV
    await Bill.deleteMany({});
    console.log('🗑️  Cleared existing bills collection in MongoDB');

    const billsToInsert = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = parseCSVLine(lines[i]);
      if (parts.length < 5) continue;

      const [billId, residentName, amountStr, statusStr, dateStr, ...commentParts] = parts;
      const comments = commentParts.join(',').trim();
      const amount = parseFloat(amountStr) || 1500;
      const resident = userMap[residentName];

      if (!resident) continue;

      // Normalize status to lowercase enum expected by Mongoose:
      // 'pending', 'paid', 'overdue', 'disputed', 'cancelled'
      let normalizedStatus = 'pending';
      const rawStatus = (statusStr || '').toLowerCase();
      if (rawStatus === 'paid') normalizedStatus = 'paid';
      else if (rawStatus === 'disputed') normalizedStatus = 'disputed';
      else if (rawStatus === 'overdue') normalizedStatus = 'overdue';
      else if (rawStatus === 'unpaid') normalizedStatus = 'pending';

      const billDate = dateStr ? new Date(dateStr) : new Date();
      const dueDate = new Date(billDate.getTime() + 15 * 24 * 60 * 60 * 1000);

      const billDoc = {
        resident: resident._id,
        type: 'maintenance',
        amount: amount,
        currency: 'INR',
        dueDate: dueDate,
        status: normalizedStatus,
        description: comments || `Monthly maintenance charges (${billId})`,
        tags: [billId, residentName],
        createdAt: billDate,
        updatedAt: billDate,
        disputes: []
      };

      // If status is disputed or comments mention duplicate/dispute, create dispute record
      if (normalizedStatus === 'disputed' || comments.toLowerCase().includes('dispute') || comments.toLowerCase().includes('duplicate')) {
        billDoc.disputes.push({
          reason: comments || 'Duplicate or disputed maintenance charge',
          description: `Dispute reported for ${billId}: ${comments || 'Duplicate maintenance payment issue'}`,
          raisedBy: resident._id,
          raisedAt: billDate,
          status: 'pending'
        });
      }

      billsToInsert.push(billDoc);
    }

    const inserted = await Bill.insertMany(billsToInsert);
    console.log(`\n🎉 Successfully imported ${inserted.length} real bills into MongoDB!`);

    const summary = {
      total: await Bill.countDocuments(),
      paid: await Bill.countDocuments({ status: 'paid' }),
      pending: await Bill.countDocuments({ status: 'pending' }),
      disputed: await Bill.countDocuments({ status: 'disputed' })
    };
    console.log('📊 Real Database Summary:', summary);

  } catch (err) {
    console.error('❌ Error during data loading:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

if (require.main === module) {
  loadCSVToMongoDB();
}

module.exports = { loadCSVToMongoDB };
