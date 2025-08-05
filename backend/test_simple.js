const fetch = require('node-fetch');

async function testBackend() {
  console.log('Testing backend connectivity...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData.message);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
    }
    
    // Test 2: AI Billing test route (no auth)
    console.log('\n2. Testing AI Billing test route...');
    const testResponse = await fetch('http://localhost:5000/api/ai-billing/test');
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ AI Billing test route passed:', testData.message);
    } else {
      console.log('❌ AI Billing test route failed:', testResponse.status);
    }
    
    // Test 3: AI Billing analysis route (requires auth)
    console.log('\n3. Testing AI Billing analysis route (should fail without auth)...');
    const analysisResponse = await fetch('http://localhost:5000/api/ai-billing/analysis');
    if (analysisResponse.status === 401 || analysisResponse.status === 403) {
      console.log('✅ Analysis route properly protected (requires auth)');
    } else {
      console.log('⚠️ Analysis route response:', analysisResponse.status);
    }
    
  } catch (error) {
    console.log('❌ Connection error:', error.message);
    console.log('Make sure the backend server is running on port 5000');
  }
}

testBackend(); 