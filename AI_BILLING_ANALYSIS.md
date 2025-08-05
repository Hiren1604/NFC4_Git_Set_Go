# AI Billing Analysis System

## Overview

The AI Billing Analysis system integrates your existing AI agents (`billingagent.py`) with the admin dashboard to provide intelligent duplicate detection and billing optimization insights.

## Features

### 🔍 **Duplicate Detection**
- Identifies exact and similar duplicate bills
- Analyzes patterns in billing data
- Provides AI-powered recommendations for resolution

### 📊 **Billing Anomalies**
- Detects unusual billing amounts
- Identifies frequent dispute patterns
- Analyzes payment behavior trends

### 🤖 **AI Recommendations**
- Automated process improvements
- Billing optimization suggestions
- Customer service enhancements

## Setup Instructions

### 1. Populate Database with Sample Data

Run the database population script to load sample billing data:

```bash
cd backend
node scripts/populate-billing-data.js
```

This will:
- Connect to MongoDB
- Clear existing bills
- Insert 52 sample bills from your CSV data
- Include intentional duplicates for testing
- Display statistics and duplicate detection results

### 2. Start the Backend Server

```bash
cd backend
npm start
```

### 3. Start the Frontend

```bash
npm run dev
```

## How to Use

### For Admins

1. **Access AI Billing Analysis**
   - Login as admin
   - Navigate to "AI Billing Analysis" in the sidebar
   - The page shows a comprehensive overview of billing issues

2. **Run AI Analysis**
   - Click "Run Analysis" button
   - The system simulates your AI agent processing
   - Results are displayed in real-time

3. **Review Duplicates**
   - View detected duplicate bills
   - See AI analysis and recommendations
   - Take action to resolve duplicates

4. **Investigate Anomalies**
   - Review unusual billing patterns
   - Analyze dispute trends
   - Implement recommended actions

### Key Features

#### 📈 **Summary Dashboard**
- Total bills analyzed
- Number of duplicate bills detected
- Potential savings from resolving duplicates
- Dispute rate and resolution metrics

#### 🔍 **Duplicate Detection**
- **Exact Matches**: Identical bills for same resident, amount, and date
- **Similar Patterns**: Bills with similar characteristics that may be duplicates
- **AI Analysis**: Detailed reasoning for each duplicate detection
- **Recommended Actions**: Specific steps to resolve each duplicate

#### ⚠️ **Billing Anomalies**
- **Unusual Amounts**: Bills that deviate from expected ranges
- **Frequent Disputes**: Residents with high dispute rates
- **Payment Patterns**: Analysis of payment behavior trends

#### 💡 **AI Recommendations**
- **Process Improvements**: Suggestions for billing optimization
- **Automation Opportunities**: Areas where AI can help
- **Customer Service**: Recommendations for better resident experience

## API Endpoints

### Get AI Analysis Results
```
GET /api/ai-billing/analysis
```

### Get Duplicate Bills
```
GET /api/ai-billing/duplicates
```

### Get Billing Anomalies
```
GET /api/ai-billing/anomalies
```

### Get AI Recommendations
```
GET /api/ai-billing/recommendations
```

### Run AI Analysis
```
POST /api/ai-billing/run-analysis
```

### Resolve Duplicate
```
POST /api/ai-billing/resolve-duplicate/:duplicateId
```

## Sample Data Structure

The system includes sample data based on your CSV file with:

- **52 bills** from various residents
- **Intentional duplicates** for testing (Neha Patel's bills)
- **Disputed bills** with water charge issues
- **Various payment statuses** (Paid, Unpaid, Disputed)

## Integration with Your AI Agent

The current implementation provides a simulation of your AI agent's results. To integrate with your actual `billingagent.py`:

1. **Modify the AI Billing Route** (`backend/routes/ai-billing.js`)
2. **Call your Python script** from the Node.js backend
3. **Process the results** and return them to the frontend

### Example Integration

```javascript
// In backend/routes/ai-billing.js
const { spawn } = require('child_process');

router.post('/run-analysis', auth, async (req, res) => {
  try {
    // Run your Python AI agent
    const pythonProcess = spawn('python', ['ai-agents/billingagent.py']);
    
    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      // Process the AI agent output
      const results = parseAIOutput(output);
      res.json({
        success: true,
        data: results
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'AI analysis failed' });
  }
});
```

## Benefits

### For Society Management
- **Reduce Billing Errors**: Automated duplicate detection
- **Improve Efficiency**: AI-powered billing optimization
- **Better Resident Experience**: Proactive issue resolution
- **Cost Savings**: Identify and resolve duplicate charges

### For Admins
- **Comprehensive Overview**: All billing issues in one place
- **Actionable Insights**: Clear recommendations for each issue
- **Easy Resolution**: One-click actions to resolve duplicates
- **Performance Tracking**: Monitor dispute rates and resolution times

## Future Enhancements

1. **Real-time Integration**: Connect directly with your Python AI agent
2. **Machine Learning**: Improve detection accuracy over time
3. **Automated Resolution**: Auto-resolve simple duplicates
4. **Advanced Analytics**: Predictive billing insights
5. **Resident Notifications**: Alert residents about billing issues

## Troubleshooting

### Database Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env` file
- Verify network connectivity

### AI Analysis Not Working
- Check if backend server is running
- Verify API endpoints are accessible
- Check browser console for errors

### Sample Data Not Loading
- Run the population script again
- Check MongoDB connection
- Verify Bill model schema

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify all services are running
3. Check the backend logs for API errors
4. Ensure database is properly populated

---

**Note**: This system provides a comprehensive interface for your AI billing analysis. The sample data includes intentional duplicates to demonstrate the system's capabilities. In production, you would integrate with your actual AI agent for real-time analysis. 