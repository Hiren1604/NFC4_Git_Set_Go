const mongoose = require('mongoose');
const Issue = require('../models/Issue');
const User = require('../models/User');
require('dotenv').config();

async function simpleAssignIssues() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resident_assist';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get all unassigned issues
    const unassignedIssues = await Issue.find({ 
      assignedTo: null,
      status: 'pending'
    }).populate('reportedBy', 'name email phone flatNumber building');

    console.log(`📋 Found ${unassignedIssues.length} unassigned issues`);

    if (unassignedIssues.length === 0) {
      console.log('✅ No unassigned issues found');
      return;
    }

    // Get all available technicians
    const technicians = await User.find({ 
      role: 'technician',
      availability: 'available'
    }).select('name email phone skills hourlyRate availability');

    console.log(`👥 Found ${technicians.length} available technicians`);

    if (technicians.length === 0) {
      console.log('❌ No available technicians found');
      return;
    }

    // Process each unassigned issue
    for (let i = 0; i < unassignedIssues.length; i++) {
      const issue = unassignedIssues[i];
      console.log(`\n🔄 Processing issue ${i + 1}/${unassignedIssues.length}: ${issue.title}`);

      // Simple assignment logic without AI
      const bestTechnician = findBestTechnician(issue, technicians);

      if (bestTechnician) {
        // Update the issue with the assigned technician
        issue.assignedTo = bestTechnician._id;
        issue.status = 'assigned';
        
        // Add timeline entry
        try {
          await issue.addTimelineEntry('assigned', `AI assigned ${bestTechnician.name}`, issue.reportedBy._id);
        } catch (timelineError) {
          console.error('Error adding timeline entry:', timelineError);
        }
        
        await issue.save();
        console.log(`✅ Assigned ${bestTechnician.name} to issue: ${issue.title}`);
      } else {
        console.log(`❌ No suitable technician found for issue: ${issue.title}`);
      }
    }

    console.log('\n🎯 Assignment process completed!');
    console.log('📱 Residents should now see technician assignment notifications');

  } catch (error) {
    console.error('❌ Error assigning existing issues:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Simple technician assignment logic
function findBestTechnician(issue, technicians) {
  const category = issue.category.toLowerCase();
  
  let bestTechnician = null;
  let bestScore = 0;
  
  for (const tech of technicians) {
    let score = 0;
    const skills = tech.skills.map(skill => skill.toLowerCase());
    
    // Primary skill match
    if (skills.includes(category)) {
      score += 3;
    }
    // Partial skill match
    else if (skills.some(skill => category.includes(skill) || skill.includes(category))) {
      score += 2;
    }
    
    // Prefer available technicians
    if (tech.availability === 'available') {
      score += 1;
    }
    
    // Prefer lower cost technicians
    if (tech.hourlyRate < 600) {
      score += 1;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestTechnician = tech;
    }
  }
  
  // Fallback to any available technician if no perfect match
  if (!bestTechnician) {
    bestTechnician = technicians.find(tech => tech.availability === 'available') || technicians[0];
  }
  
  return bestTechnician;
}

simpleAssignIssues();
