const mongoose = require('mongoose');
const Issue = require('../models/Issue');
const User = require('../models/User');
const { spawn } = require('child_process');
const path = require('path');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resident_assist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Helper function to run Python agent (same as in routes/issues.js)
async function runTechnicianAssignment(agentData) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../ai-agents/categoryagent.py');
    const pythonProcess = spawn('python', [pythonScript], {
      cwd: path.join(__dirname, '../ai-agents'),
      shell: true
    });

    console.log('🐍 Starting Python agent process...');
    console.log('📁 Python script path:', pythonScript);
    console.log('📁 Working directory:', path.join(__dirname, '../ai-agents'));

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      const dataStr = data.toString();
      output += dataStr;
      console.log('🐍 Python stdout:', dataStr.trim());
    });

    pythonProcess.stderr.on('data', (data) => {
      const dataStr = data.toString();
      errorOutput += dataStr;
      console.error('🐍 Python stderr:', dataStr.trim());
    });

    pythonProcess.on('close', (code) => {
      console.log(`🐍 Python process exited with code: ${code}`);
      console.log('🐍 Final output length:', output.length);
      console.log('🐍 Final error length:', errorOutput.length);
      
      if (code !== 0) {
        console.error('❌ Python agent error:', errorOutput);
        resolve({ error: 'Failed to run technician assignment agent', exitCode: code });
        return;
      }

      try {
        // Try to parse the output as JSON
        const result = JSON.parse(output.trim());
        console.log('✅ Successfully parsed Python agent output as JSON');
        resolve(result);
      } catch (error) {
        console.error('❌ Failed to parse agent output:', output);
        console.error('❌ Parse error:', error.message);
        resolve({ error: 'Failed to parse agent output', raw_output: output });
      }
    });

    pythonProcess.on('error', (err) => {
      console.error('❌ Failed to start Python process:', err.message);
      resolve({ error: 'Failed to start Python process', details: err.message });
    });

    // Send data to Python process
    console.log('📤 Sending data to Python agent:', JSON.stringify(agentData, null, 2));
    pythonProcess.stdin.write(JSON.stringify(agentData));
    pythonProcess.stdin.end();
  });
}

async function testAIAgent() {
  try {
    console.log('🧪 Testing AI Agent with existing resident...\n');

    // Wait for connection
    await mongoose.connection.asPromise();
    console.log('✅ Connected to MongoDB');

    // Get existing resident
    const residents = await User.find({ role: 'resident' });
    if (residents.length === 0) {
      console.log('❌ No residents found. Please create a resident first.');
      return;
    }

    const resident = residents[0];
    console.log('👤 Using resident:', {
      name: resident.name,
      email: resident.email,
      flat: resident.flatNumber,
      building: resident.building
    });

    // Check technicians
    const technicians = await User.find({ role: 'technician' });
    console.log(`👥 Found ${technicians.length} technicians in database`);

    if (technicians.length === 0) {
      console.log('❌ No technicians found. Please run populate-technicians.js first.');
      return;
    }

    // Create a test cleaning issue
    console.log('\n📝 Creating test cleaning issue...');
    
    const testIssue = await Issue.create({
      title: 'Apartment Cleaning Request',
      description: 'Need thorough cleaning service for 2BHK apartment. Kitchen and bathroom need deep cleaning.',
      category: 'cleaning',
      priority: 'medium',
      reportedBy: resident._id,
      location: {
        flatNumber: resident.flatNumber,
        building: resident.building,
        area: 'Entire Apartment'
      },
      status: 'pending'
    });

    console.log('✅ Test issue created:', {
      id: testIssue._id,
      title: testIssue.title,
      description: testIssue.description,
      category: testIssue.category,
      priority: testIssue.priority,
      status: testIssue.status
    });

    // AUTOMATIC TECHNICIAN ASSIGNMENT - Trigger AI Agent
    console.log('\n🔄 Automatically triggering AI agent for technician assignment...');
    console.log('📝 Issue Details:', {
      title: testIssue.title,
      description: testIssue.description,
      category: testIssue.category,
      priority: testIssue.priority,
      reportedBy: resident.name,
      timestamp: new Date().toISOString()
    });

    // Get all available technicians
    const availableTechnicians = await User.find({
      role: 'technician',
      availability: 'available'
    }).select('name email phone skills hourlyRate availability');

    console.log(`👥 Found ${availableTechnicians.length} available technicians`);

    if (availableTechnicians.length > 0) {
      // Prepare data for the Python agent
      const agentData = {
        title: testIssue.title,
        description: testIssue.description,
        category: testIssue.category,
        technicians: availableTechnicians.map(tech => ({
          _id: tech._id.toString(),
          name: tech.name,
          phone: tech.phone,
          email: tech.email,
          skills: tech.skills,
          hourlyRate: tech.hourlyRate,
          availability: tech.availability
        }))
      };

      console.log('🤖 Calling Python AI agent with data:', {
        issueTitle: agentData.title,
        issueCategory: agentData.category,
        technicianCount: agentData.technicians.length,
        technicianSkills: agentData.technicians.map(t => ({ name: t.name, skills: t.skills }))
      });

      // Call the Python agent
      const assignmentResult = await runTechnicianAssignment(agentData);

      console.log('🤖 AI Agent Response:', assignmentResult);

      if (!assignmentResult.error && assignmentResult.technician && assignmentResult.technician.id) {
        // Update the issue with the assigned technician
        testIssue.assignedTo = assignmentResult.technician.id;
        testIssue.status = 'assigned';

        await testIssue.save();

        console.log('✅ AI agent successfully assigned technician:', {
          technicianName: assignmentResult.technician.name,
          technicianSkills: assignmentResult.technician.skills,
          hourlyRate: assignmentResult.technician.hourlyRate,
          issueCategory: testIssue.category,
          timestamp: new Date().toISOString()
        });

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
        console.log('   Technician Skills:', finalIssue.assignedTo?.skills?.join(', '));
        console.log('   Hourly Rate: ₹' + (finalIssue.assignedTo?.hourlyRate || 'N/A') + '/hr');

      } else {
        console.log('⚠️ AI agent could not assign technician:', {
          error: assignmentResult.error,
          rawOutput: assignmentResult.raw_output,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      console.log('⚠️ No available technicians found for automatic assignment');
    }

  } catch (error) {
    console.error('❌ Error in AI agent test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testAIAgent(); 