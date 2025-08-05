const fetch = require('node-fetch');

async function testRoutes() {
  const baseUrl = 'http://localhost:5000/api';
  
  console.log('🧪 Testing AI Billing Routes...\n');
  
  // Test 1: Health check
  try {
    console.log('1️⃣ Testing health check...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check:', healthData.message);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // Test 2: Test simple route
  try {
    console.log('\n2️⃣ Testing simple test route...');
    const testResponse = await fetch(`${baseUrl}/ai-billing/test`);
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ Test route:', testData.message);
    } else {
      console.log('❌ Test route failed:', testResponse.status);
    }
  } catch (error) {
    console.log('❌ Test route failed:', error.message);
  }
  
  // Test 3: Test Python agent
  try {
    console.log('\n3️⃣ Testing Python agent...');
    const pythonResponse = await fetch(`${baseUrl}/ai-billing/test-python`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (pythonResponse.ok) {
      const pythonData = await pythonResponse.json();
      console.log('✅ Python agent test:', pythonData.message);
      if (pythonData.data && pythonData.data.parsedResults) {
        console.log('📊 Analysis results:', {
          totalRecords: pythonData.data.parsedResults.total_records,
          duplicateRecords: pythonData.data.parsedResults.duplicate_records,
          duplicatePercentage: pythonData.data.parsedResults.duplicate_percentage
        });
      }
    } else {
      console.log('❌ Python agent test failed:', pythonResponse.status);
    }
  } catch (error) {
    console.log('❌ Python agent test failed:', error.message);
  }
  
  // Test 4: Test run-analysis without auth
  try {
    console.log('\n4️⃣ Testing run-analysis (no auth)...');
    const analysisResponse = await fetch(`${baseUrl}/ai-billing/test-run-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (analysisResponse.ok) {
      const analysisData = await analysisResponse.json();
      console.log('✅ Run analysis test:', analysisData.message);
      if (analysisData.data && analysisData.data.results) {
        console.log('📊 Results summary:', {
          duplicateBills: analysisData.data.results.duplicateBills?.length || 0,
          totalBills: analysisData.data.results.summary?.totalBills || 0
        });
      }
    } else {
      console.log('❌ Run analysis test failed:', analysisResponse.status);
    }
  } catch (error) {
    console.log('❌ Run analysis test failed:', error.message);
  }
  
  console.log('\n🎉 Route testing completed!');
}

// Run the test
testRoutes().catch(console.error); 