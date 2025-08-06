const { spawn } = require('child_process');
const path = require('path');

async function testCategoryAgent() {
  console.log('🧪 Testing updated category agent...\n');

  // Test data
  const testData = {
    title: "Electrical outlet not working",
    description: "The electrical outlet in the living room stopped working suddenly. Need urgent repair.",
    category: "electrical",
    technicians: [
      {
        _id: "tech1",
        name: "Amit Singh",
        phone: "+91 98765 43211",
        email: "amit.electrician@societyhub.com",
        skills: ["electrical"],
        hourlyRate: 900,
        availability: "available"
      },
      {
        _id: "tech2",
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        email: "rajesh.plumber@societyhub.com",
        skills: ["plumbing"],
        hourlyRate: 800,
        availability: "available"
      },
      {
        _id: "tech3",
        name: "Sanjay Gupta",
        phone: "+91 98765 43219",
        email: "sanjay.general@societyhub.com",
        skills: ["plumbing", "electrical", "carpentry"],
        hourlyRate: 750,
        availability: "available"
      }
    ]
  };

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
      console.log(`Python process exited with code: ${code}`);
      
      if (errorOutput) {
        console.log('🔍 Error output:', errorOutput);
      }
      
      if (code !== 0) {
        console.error('❌ Python agent failed');
        resolve({ error: 'Failed to run technician assignment agent' });
        return;
      }

      try {
        console.log('📤 Raw output:', output);
        const result = JSON.parse(output.trim());
        console.log('✅ Parsed result successfully:');
        console.log(JSON.stringify(result, null, 2));
        resolve(result);
      } catch (error) {
        console.error('❌ Failed to parse agent output:', error);
        console.log('📤 Raw output was:', output);
        resolve({ error: 'Failed to parse agent output', raw_output: output });
      }
    });

    // Send data to Python process
    pythonProcess.stdin.write(JSON.stringify(testData));
    pythonProcess.stdin.end();
  });
}

// Run the test
testCategoryAgent()
  .then(result => {
    console.log('\n🎯 Test completed!');
    if (result.error) {
      console.log('❌ Test failed:', result.error);
    } else {
      console.log('✅ Test passed! Agent is working correctly.');
    }
  })
  .catch(error => {
    console.error('❌ Test error:', error);
  });
