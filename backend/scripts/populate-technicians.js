const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function populateTechnicians() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://waghelahiren16:2k5TVOdYVCy4EFJm@cluster0.fkkhdpx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing technicians
    await User.deleteMany({ role: 'technician' });
    console.log('🗑️ Cleared existing technicians');

    // Sample technicians data
    const technicians = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.plumber@societyhub.com',
        password: 'password123',
        role: 'technician',
        phone: '+91 98765 43210',
        skills: ['plumbing'],
        hourlyRate: 800,
        availability: 'available',
        avatar: '/avatars/technician1.jpg'
      },
      {
        name: 'Amit Singh',
        email: 'amit.electrician@societyhub.com',
        password: 'password123',
        role: 'technician',
        phone: '+91 98765 43211',
        skills: ['electrical'],
        hourlyRate: 900,
        availability: 'available',
        avatar: '/avatars/technician2.jpg'
      },
      {
        name: 'Suresh Patel',
        email: 'suresh.carpenter@societyhub.com',
        password: 'password123',
        role: 'technician',
        phone: '+91 98765 43212',
        skills: ['carpentry'],
        hourlyRate: 700,
        availability: 'available',
        avatar: '/avatars/technician3.jpg'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.cleaner@societyhub.com',
        password: 'password123',
        role: 'technician',
        phone: '+91 98765 43213',
        skills: ['cleaning'],
        hourlyRate: 500,
        availability: 'available',
        avatar: '/avatars/technician4.jpg'
      },
      {
        name: 'Vikram Malhotra',
        email: 'vikram.security@societyhub.com',
        password: 'password123',
        role: 'technician',
        phone: '+91 98765 43214',
        skills: ['security'],
        hourlyRate: 600,
        availability: 'available',
        avatar: '/avatars/technician5.jpg'
      },
      {
        name: 'Ramesh Iyer',
        email: 'ramesh.lift@societyhub.com',
        password: 'password123',
        role: 'technician',
        phone: '+91 98765 43215',
        skills: ['electrical'], // Lift technicians need electrical skills
        hourlyRate: 1000,
        availability: 'available',
        avatar: '/avatars/technician6.jpg'
      },
      {
        name: 'Lakshmi Devi',
        email: 'lakshmi.gardener@societyhub.com',
        password: 'password123',
        role: 'technician',
        phone: '+91 98765 43216',
        skills: ['cleaning'], // Garden maintenance
        hourlyRate: 400,
        availability: 'available',
        avatar: '/avatars/technician7.jpg'
      },
      {
        name: 'Arjun Reddy',
        email: 'arjun.parking@societyhub.com',
        password: 'password123',
        role: 'technician',
        phone: '+91 98765 43217',
        skills: ['security'], // Parking attendants
        hourlyRate: 450,
        availability: 'available',
        avatar: '/avatars/technician8.jpg'
      },
      {
        name: 'Meera Kapoor',
        email: 'meera.painter@societyhub.com',
        password: 'password123',
        role: 'technician',
        phone: '+91 98765 43218',
        skills: ['carpentry'], // Painters often do carpentry work too
        hourlyRate: 650,
        availability: 'available',
        avatar: '/avatars/technician9.jpg'
      },
      {
        name: 'Sanjay Gupta',
        email: 'sanjay.general@societyhub.com',
        password: 'password123',
        role: 'technician',
        phone: '+91 98765 43219',
        skills: ['plumbing', 'electrical', 'carpentry'], // General technician
        hourlyRate: 750,
        availability: 'available',
        avatar: '/avatars/technician10.jpg'
      }
    ];

    // Insert technicians
    const insertedTechnicians = await User.insertMany(technicians);
    console.log(`✅ Created ${insertedTechnicians.length} technicians`);

    // Log technician details
    console.log('\n👥 Technician Details:');
    insertedTechnicians.forEach((tech, index) => {
      console.log(`${index + 1}. ${tech.name} - ${tech.skills.join(', ')} - ₹${tech.hourlyRate}/hr`);
    });

    // Log statistics
    const skillStats = {};
    insertedTechnicians.forEach(tech => {
      tech.skills.forEach(skill => {
        skillStats[skill] = (skillStats[skill] || 0) + 1;
      });
    });

    console.log('\n📊 Skill Distribution:');
    Object.entries(skillStats).forEach(([skill, count]) => {
      console.log(`  - ${skill}: ${count} technicians`);
    });

    console.log('\n🎯 Technicians are now available for assignment!');
    console.log('🔧 The category agent can now assign real technicians to issues.');

  } catch (error) {
    console.error('❌ Error populating technicians:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

populateTechnicians(); 