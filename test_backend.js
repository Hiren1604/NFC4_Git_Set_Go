const fetch = require('node-fetch');

async function testBackend() {
  const baseUrl = 'http://localhost:5000/api';
  
  console.log('🧪 Testing Backend Routes...\n');
  
  // Test 1: Health check
  try {
    console.log('1️⃣ Testing health check...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // Test 2: Test Python agent (no auth required)
  try {
    console.log('\n2️⃣ Testing Python agent...');
    const pythonResponse = await fetch(`${baseUrl}/ai-billing/test-python`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const pythonData = await pythonResponse.json();
    console.log('✅ Python agent test:', pythonData.message);
    if (pythonData.data && pythonData.data.parsedResults) {
      console.log('📊 Analysis results:', {
        totalRecords: pythonData.data.parsedResults.total_records,
        duplicateRecords: pythonData.data.parsedResults.duplicate_records,
        duplicatePercentage: pythonData.data.parsedResults.duplicate_percentage
      });
    }
  } catch (error) {
    console.log('❌ Python agent test failed:', error.message);
  }
  
  // Test 3: Test analysis endpoint (requires auth)
  try {
    console.log('\n3️⃣ Testing analysis endpoint (no auth)...');
    const analysisResponse = await fetch(`${baseUrl}/ai-billing/analysis`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const analysisData = await analysisResponse.json();
    console.log('📊 Analysis endpoint response:', analysisData.error || 'Success');
  } catch (error) {
    console.log('❌ Analysis endpoint test failed:', error.message);
  }
  
  console.log('\n🎉 Backend testing completed!');
}

// Run the test
testBackend().catch(console.error); 