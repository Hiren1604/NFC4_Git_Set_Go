const mongoose = require('mongoose');
const Issue = require('../models/Issue');
const User = require('../models/User');
const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

async function assignExistingIssues() {
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

      // Prepare data for the Python agent
      const agentData = {
        title: issue.title,
        description: issue.description,
        category: issue.category,
        technicians: technicians.map(tech => ({
          _id: tech._id.toString(),
          name: tech.name,
          phone: tech.phone,
          email: tech.email,
          skills: tech.skills,
          hourlyRate: tech.hourlyRate,
          availability: tech.availability
        }))
      };

      try {
        // Call the Python agent
        const assignmentResult = await runTechnicianAssignment(agentData);

        if (assignmentResult.error) {
          console.log(`❌ Error assigning technician to issue ${issue._id}: ${assignmentResult.error}`);
          continue;
        }

        // Update the issue with the assigned technician
        if (assignmentResult.technician && assignmentResult.technician.id) {
          issue.assignedTo = assignmentResult.technician.id;
          issue.status = 'assigned';
          
          // Add timeline entry
          try {
            await issue.addTimelineEntry('assigned', `AI assigned ${assignmentResult.technician.name}`, issue.reportedBy._id);
          } catch (timelineError) {
            console.error('Error adding timeline entry:', timelineError);
          }
          
          await issue.save();
          console.log(`✅ Assigned ${assignmentResult.technician.name} to issue: ${issue.title}`);
        } else {
          console.log(`❌ No suitable technician found for issue: ${issue.title}`);
        }

      } catch (error) {
        console.error(`❌ Error processing issue ${issue._id}:`, error);
      }

      // Add a small delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000));
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

// Helper function to run Python agent
async function runTechnicianAssignment(agentData) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../../ai-agents/categoryagent.py');
    const pythonProcess = spawn('python', [pythonScript], {
      cwd: path.join(__dirname, '../../ai-agents')
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python agent error:', errorOutput);
        resolve({ error: 'Failed to run technician assignment agent' });
        return;
      }

      try {
        // Try to parse the output as JSON
        const result = JSON.parse(output.trim());
        resolve(result);
      } catch (error) {
        console.error('Failed to parse agent output:', output);
        resolve({ error: 'Failed to parse agent output', raw_output: output });
      }
    });

    // Send data to Python process
    pythonProcess.stdin.write(JSON.stringify(agentData));
    pythonProcess.stdin.end();
  });
}

assignExistingIssues();
