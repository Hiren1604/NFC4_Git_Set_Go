const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resident_assist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkResidents() {
  try {
    console.log('🔍 Checking existing residents in database...\n');

    // Wait for connection
    await mongoose.connection.asPromise();
    console.log('✅ Connected to MongoDB');

    // Get all residents
    const residents = await User.find({ role: 'resident' });
    console.log(`📊 Found ${residents.length} residents in database:\n`);

    if (residents.length === 0) {
      console.log('❌ No residents found in database');
      return;
    }

    residents.forEach((resident, index) => {
      console.log(`\n👤 Resident #${index + 1}:`);
      console.log(`   ID: ${resident._id}`);
      console.log(`   Name: ${resident.name}`);
      console.log(`   Email: ${resident.email}`);
      console.log(`   Phone: ${resident.phone}`);
      console.log(`   Flat: ${resident.flatNumber}`);
      console.log(`   Building: ${resident.building}`);
      console.log(`   Role: ${resident.role}`);
      console.log(`   Created: ${resident.createdAt.toLocaleString()}`);
    });

    // Also check technicians
    console.log('\n👥 Checking technicians...');
    const technicians = await User.find({ role: 'technician' });
    console.log(`📊 Found ${technicians.length} technicians in database:\n`);

    if (technicians.length > 0) {
      technicians.forEach((tech, index) => {
        console.log(`${index + 1}. ${tech.name} - ${tech.skills.join(', ')} - ₹${tech.hourlyRate}/hr - ${tech.availability}`);
      });
    } else {
      console.log('❌ No technicians found in database');
    }

  } catch (error) {
    console.error('❌ Error checking residents:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkResidents(); 