const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Bill = require('../models/Bill');
const { spawn } = require('child_process');
const path = require('path');

// AI Billing Analysis Results
const aiBillingResults = {
  duplicateBills: [
    {
      id: 1,
      residentName: "Neha Patel",
      billIds: ["BILL099", "BILL089"],
      amount: 2000,
      status: "Paid",
      date: "2025-07-11",
      comments: "",
      duplicateType: "exact_match",
      aiAnalysis: "Identical bills found for same resident, amount, and date",
      recommendedAction: "Remove duplicate BILL089",
      severity: "high"
    },
    {
      id: 2,
      residentName: "Raj Verma",
      billIds: ["BILL002", "BILL014", "BILL022", "BILL028"],
      amount: 1200,
      status: "Disputed",
      date: "2025-07-16",
      comments: "Dispute over water charges",
      duplicateType: "similar_pattern",
      aiAnalysis: "Multiple disputed bills with same amount and comments pattern",
      recommendedAction: "Investigate billing accuracy for water charges",
      severity: "medium"
    },
    {
      id: 3,
      residentName: "Sneha Rao",
      billIds: ["BILL007", "BILL029"],
      amount: 1200,
      status: "Paid",
      date: "2025-07-16",
      comments: "",
      duplicateType: "exact_match",
      aiAnalysis: "Identical bills found for same resident and date",
      recommendedAction: "Verify if both payments were actually made",
      severity: "medium"
    }
  ],
  billingAnomalies: [
    {
      id: 1,
      type: "unusual_amount",
      residentName: "Vikram Iyer",
      billId: "BILL010",
      amount: 1500,
      expectedRange: "1800-2000",
      aiAnalysis: "Amount significantly lower than typical maintenance charges",
      recommendedAction: "Review billing calculation"
    },
    {
      id: 2,
      type: "frequent_disputes",
      residentName: "Raj Verma",
      disputeCount: 4,
      totalBills: 8,
      disputeRate: "50%",
      aiAnalysis: "Unusually high dispute rate indicates potential billing issues",
      recommendedAction: "Audit billing process for this resident"
    },
    {
      id: 3,
      type: "payment_pattern",
      residentName: "Pooja Nair",
      pattern: "Consistent late payments",
      aiAnalysis: "Resident shows pattern of delayed payments",
      recommendedAction: "Implement payment reminders"
    }
  ],
  aiRecommendations: [
    {
      id: 1,
      category: "billing_optimization",
      title: "Implement Automated Duplicate Detection",
      description: "Set up real-time duplicate detection to prevent future billing errors",
      priority: "high",
      estimatedImpact: "Reduce billing errors by 85%"
    },
    {
      id: 2,
      category: "process_improvement",
      title: "Standardize Billing Comments",
      description: "Create standardized comment templates to reduce ambiguity",
      priority: "medium",
      estimatedImpact: "Improve billing accuracy by 60%"
    },
    {
      id: 3,
      category: "customer_service",
      title: "Proactive Dispute Resolution",
      description: "Implement early warning system for potential disputes",
      priority: "medium",
      estimatedImpact: "Reduce dispute rate by 40%"
    }
  ],
  summary: {
    totalBills: 50,
    duplicateBills: 3,
    duplicateAmount: 5200,
    potentialSavings: 2600,
    disputeRate: "12%",
    averageResolutionTime: "3.2 days"
  }
};

// Function to run Python billing agent
const runBillingAgent = async () => {
  return new Promise((resolve, reject) => {
    // Use the original billing agent script
    const pythonScript = path.join(__dirname, '../../ai-agents/billingagent.py');
    const csvFile = path.join(__dirname, '../../ai-agents/samplemaintenance.csv');
    
    console.log('Starting Python process...');
    console.log('Python script:', pythonScript);
    console.log('CSV file:', csvFile);
    
    const pythonProcess = spawn('python', [pythonScript, csvFile], {
      env: {
        ...process.env,
        PYTHONPATH: path.join(__dirname, '../../ai-agents')
      }
    });

    let output = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      const dataStr = data.toString();
      output += dataStr;
      console.log('Python output:', dataStr.trim());
    });

    pythonProcess.stderr.on('data', (data) => {
      const dataStr = data.toString();
      error += dataStr;
      console.error('Python error:', dataStr.trim());
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code: ${code}`);
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Python process exited with code ${code}: ${error}`));
      }
    });

    pythonProcess.on('error', (err) => {
      console.error('Failed to start Python process:', err.message);
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });
  });
};

// Get AI Billing Analysis Results
router.get('/analysis', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    // Get bills with disputes (complaints about double payments)
    const billsWithDisputes = await Bill.find({
      'disputes.0': { $exists: true },
      'disputes.status': 'pending'
    }).populate('resident', 'name email');

    // Filter for maintenance bills with disputes
    const maintenanceDisputes = billsWithDisputes.filter(bill => 
      bill.type === 'maintenance' && 
      bill.disputes.some(dispute => 
        dispute.status === 'pending' && 
        (dispute.reason.toLowerCase().includes('duplicate') || 
         dispute.reason.toLowerCase().includes('double') ||
         dispute.description.toLowerCase().includes('duplicate') ||
         dispute.description.toLowerCase().includes('double'))
      )
    );

    // Create filtered duplicate bills data
    const filteredDuplicateBills = maintenanceDisputes.map((bill, index) => {
      const dispute = bill.disputes.find(d => 
        d.status === 'pending' && 
        (d.reason.toLowerCase().includes('duplicate') || 
         d.reason.toLowerCase().includes('double') ||
         d.description.toLowerCase().includes('duplicate') ||
         d.description.toLowerCase().includes('double'))
      );

      return {
        id: index + 1,
        residentName: bill.resident.name,
        billIds: [bill._id.toString()],
        amount: bill.amount,
        status: bill.status,
        date: bill.createdAt.toISOString().split('T')[0],
        comments: dispute ? dispute.description : '',
        duplicateType: "resident_complaint",
        aiAnalysis: `Resident ${bill.resident.name} reported duplicate/double maintenance payment`,
        recommendedAction: `Investigate and resolve the duplicate payment complaint`,
        severity: "high",
        disputeId: dispute._id,
        residentEmail: bill.resident.email
      };
    });

    // Update the results to only show disputed duplicates
    const filteredResults = {
      ...aiBillingResults,
      duplicateBills: filteredDuplicateBills,
      summary: {
        totalBills: aiBillingResults.summary.totalBills,
        duplicateBills: filteredDuplicateBills.length,
        duplicateAmount: filteredDuplicateBills.reduce((sum, bill) => sum + bill.amount, 0),
        potentialSavings: filteredDuplicateBills.reduce((sum, bill) => sum + bill.amount, 0),
        disputeRate: `${((filteredDuplicateBills.length / aiBillingResults.summary.totalBills) * 100).toFixed(1)}%`,
        averageResolutionTime: "3.2 days"
      }
    };

    res.json({
      success: true,
      data: filteredResults
    });
  } catch (error) {
    console.error('Error fetching AI billing analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Duplicate Bills
router.get('/duplicates', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    res.json({
      success: true,
      data: aiBillingResults.duplicateBills
    });
  } catch (error) {
    console.error('Error fetching duplicate bills:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Billing Anomalies
router.get('/anomalies', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    res.json({
      success: true,
      data: aiBillingResults.billingAnomalies
    });
  } catch (error) {
    console.error('Error fetching billing anomalies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get AI Recommendations
router.get('/recommendations', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    res.json({
      success: true,
      data: aiBillingResults.aiRecommendations
    });
  } catch (error) {
    console.error('Error fetching AI recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resolve Duplicate Bill
router.post('/resolve-duplicate/:duplicateId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { duplicateId } = req.params;
    const { action, billIdToRemove } = req.body;

    // Simulate resolving duplicate
    const duplicate = aiBillingResults.duplicateBills.find(d => d.id === parseInt(duplicateId));
    
    if (!duplicate) {
      return res.status(404).json({ error: 'Duplicate not found' });
    }

    // In a real implementation, you would update the database
    res.json({
      success: true,
      message: `Duplicate resolved: ${action}`,
      data: {
        duplicateId,
        action,
        resolvedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error resolving duplicate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test route for Python agent (no auth required for debugging)
router.post('/test-python', async (req, res) => {
  try {
    console.log('🧪 Testing Python agent...');
    const pythonOutput = await runBillingAgent();
    
    console.log('✅ Python agent test completed');
    
    // Try to parse JSON from the output
    let pythonResults = {};
    try {
      // Find JSON in the output (it should be at the end)
      const lines = pythonOutput.split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.startsWith('{') && line.endsWith('}')) {
          pythonResults = JSON.parse(line);
          break;
        }
      }
      if (Object.keys(pythonResults).length === 0) {
        pythonResults = { rawOutput: pythonOutput };
      }
    } catch (parseError) {
      console.warn('⚠️ Failed to parse Python output as JSON:', parseError.message);
      pythonResults = { rawOutput: pythonOutput };
    }

    res.json({
      success: true,
      message: 'Python agent test completed',
      data: {
        pythonOutput: pythonOutput,
        parsedResults: pythonResults,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error testing Python agent:', error);
    res.status(500).json({ 
      error: 'Python agent test failed',
      details: error.message 
    });
  }
});

// Simple test route without authentication
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'AI Billing route is working!',
    timestamp: new Date().toISOString()
  });
});

// Test run-analysis without authentication (for debugging)
router.post('/test-run-analysis', async (req, res) => {
  try {
    console.log('🧪 Testing run-analysis without auth...');
    
    // Run the Python billing agent
    console.log('🤖 Running Python billing agent...');
    const pythonOutput = await runBillingAgent();
    
    console.log('✅ Python agent output:', pythonOutput);

    // Parse the JSON output from Python
    let pythonResults = {};
    try {
      // Find JSON in the output (it should be at the end)
      const lines = pythonOutput.split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.startsWith('{') && line.endsWith('}')) {
          pythonResults = JSON.parse(line);
          break;
        }
      }
      if (Object.keys(pythonResults).length === 0) {
        pythonResults = { rawOutput: pythonOutput };
      }
    } catch (parseError) {
      console.warn('⚠️ Failed to parse Python output as JSON:', parseError.message);
      pythonResults = { rawOutput: pythonOutput };
    }

    // Integrate Python results with existing mock data
    const enhancedResults = {
      ...aiBillingResults,
      pythonAnalysis: pythonResults,
      lastUpdated: new Date().toISOString()
    };

    // If Python found duplicates, enhance the duplicate bills data
    if (pythonResults.duplicate_details && pythonResults.duplicate_details.length > 0) {
      enhancedResults.duplicateBills = pythonResults.duplicate_details.map((dup, index) => ({
        id: index + 1,
        residentName: dup.resident_name,
        billIds: dup.bill_ids,
        amount: dup.amount,
        status: dup.status,
        date: dup.date,
        comments: dup.comments,
        duplicateType: "exact_match",
        aiAnalysis: `Found ${dup.count} duplicate entries for ${dup.resident_name}`,
        recommendedAction: `Review and remove duplicate bill(s)`,
        severity: dup.count > 2 ? "high" : "medium"
      }));
      
      // Update summary based on Python results
      enhancedResults.summary = {
        totalBills: pythonResults.total_records || 50,
        duplicateBills: pythonResults.duplicate_records || 0,
        duplicateAmount: pythonResults.duplicate_details ? 
          pythonResults.duplicate_details.reduce((sum, dup) => sum + (dup.amount * dup.count), 0) : 0,
        potentialSavings: pythonResults.duplicate_details ? 
          pythonResults.duplicate_details.reduce((sum, dup) => sum + (dup.amount * (dup.count - 1)), 0) : 0,
        disputeRate: "12%",
        averageResolutionTime: "3.2 days"
      };
    }

    res.json({
      success: true,
      message: 'AI analysis completed successfully (test mode)',
      data: enhancedResults
    });
  } catch (error) {
    console.error('Error running AI analysis:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Run AI Analysis (integrate with Python billing agent)
router.post('/run-analysis', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    // Run the Python billing agent
    console.log('🤖 Running Python billing agent...');
    const pythonOutput = await runBillingAgent();
    
    console.log('✅ Python agent output:', pythonOutput);

    // Parse the JSON output from Python
    let pythonResults = {};
    try {
      // Find JSON in the output (it should be at the end)
      const lines = pythonOutput.split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.startsWith('{') && line.endsWith('}')) {
          pythonResults = JSON.parse(line);
          break;
        }
      }
      if (Object.keys(pythonResults).length === 0) {
        pythonResults = { rawOutput: pythonOutput };
      }
    } catch (parseError) {
      console.warn('⚠️ Failed to parse Python output as JSON:', parseError.message);
      pythonResults = { rawOutput: pythonOutput };
    }

    // Get bills with disputes (complaints about double payments)
    const billsWithDisputes = await Bill.find({
      'disputes.0': { $exists: true },
      'disputes.status': 'pending'
    }).populate('resident', 'name email');

    // Filter for maintenance bills with disputes
    const maintenanceDisputes = billsWithDisputes.filter(bill => 
      bill.type === 'maintenance' && 
      bill.disputes.some(dispute => 
        dispute.status === 'pending' && 
        (dispute.reason.toLowerCase().includes('duplicate') || 
         dispute.reason.toLowerCase().includes('double') ||
         dispute.description.toLowerCase().includes('duplicate') ||
         dispute.description.toLowerCase().includes('double'))
      )
    );

    // Create filtered duplicate bills data
    const filteredDuplicateBills = maintenanceDisputes.map((bill, index) => {
      const dispute = bill.disputes.find(d => 
        d.status === 'pending' && 
        (d.reason.toLowerCase().includes('duplicate') || 
         d.reason.toLowerCase().includes('double') ||
         d.description.toLowerCase().includes('duplicate') ||
         d.description.toLowerCase().includes('double'))
      );

      return {
        id: index + 1,
        residentName: bill.resident.name,
        billIds: [bill._id.toString()],
        amount: bill.amount,
        status: bill.status,
        date: bill.createdAt.toISOString().split('T')[0],
        comments: dispute ? dispute.description : '',
        duplicateType: "resident_complaint",
        aiAnalysis: `Resident ${bill.resident.name} reported duplicate/double maintenance payment`,
        recommendedAction: `Investigate and resolve the duplicate payment complaint`,
        severity: "high",
        disputeId: dispute._id,
        residentEmail: bill.resident.email
      };
    });

    // Integrate Python results with filtered data
    const enhancedResults = {
      ...aiBillingResults,
      duplicateBills: filteredDuplicateBills,
      pythonAnalysis: pythonResults,
      lastUpdated: new Date().toISOString(),
      summary: {
        totalBills: aiBillingResults.summary.totalBills,
        duplicateBills: filteredDuplicateBills.length,
        duplicateAmount: filteredDuplicateBills.reduce((sum, bill) => sum + bill.amount, 0),
        potentialSavings: filteredDuplicateBills.reduce((sum, bill) => sum + bill.amount, 0),
        disputeRate: `${((filteredDuplicateBills.length / aiBillingResults.summary.totalBills) * 100).toFixed(1)}%`,
        averageResolutionTime: "3.2 days"
      }
    };

    res.json({
      success: true,
      message: 'AI analysis completed successfully',
      data: enhancedResults
    });
    
    console.log("Sending response to frontend:", {
      success: true,
      message: 'AI analysis completed successfully',
      dataKeys: Object.keys(enhancedResults),
      filteredDuplicates: filteredDuplicateBills.length
    });
  } catch (error) {
    console.error('Error running AI analysis:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

module.exports = router; 