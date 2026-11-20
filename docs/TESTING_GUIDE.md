# AI Billing Analysis Testing Guide

This guide will help you test and debug the AI Billing Analysis system step by step.

## 🚀 Quick Test Steps

### Step 1: Test Python Agent Independently

```bash
cd ai-agents
python simple_test.py samplemaintenance.csv
```

**Expected Output:**
```
🤖 Running simple billing analysis...
📊 Total records: 52
📁 File: /path/to/ai-agents/samplemaintenance.csv
🔍 Duplicate records: 2
📈 Duplicate percentage: 3.85%
  - Neha Patel: 2 duplicates (Bill IDs: ['BILL099', 'BILL089'])

📄 JSON Output:
{
  "analysis_type": "billing_duplicate_detection",
  "csv_file": "/path/to/ai-agents/samplemaintenance.csv",
  "total_records": 52,
  "duplicate_records": 2,
  "duplicate_percentage": 3.85,
  "duplicate_details": [...]
}

✅ Analysis completed successfully!
```

### Step 2: Start Backend Server

```bash
cd backend
npm start
```

**Expected Output:**
```
🚀 Server running on port 5000
📊 Health check: http://localhost:5000/api/health
✅ Connected to MongoDB - societyhub database
```

### Step 3: Test Backend Routes

```bash
# Install node-fetch if not already installed
npm install node-fetch

# Run the test script
node test_backend.js
```

**Expected Output:**
```
🧪 Testing Backend Routes...

1️⃣ Testing health check...
✅ Health check: { status: 'OK', message: 'Resident Assist AI Backend is running' }

2️⃣ Testing Python agent...
✅ Python agent test: Python agent test completed
📊 Analysis results: { totalRecords: 52, duplicateRecords: 2, duplicatePercentage: 3.85 }

3️⃣ Testing analysis endpoint (no auth)...
📊 Analysis endpoint response: Not authorized, no token

🎉 Backend testing completed!
```

### Step 4: Test Frontend Integration

1. Start the frontend:
```bash
npm run dev
```

2. Navigate to the AI Billing Analysis page
3. Click "Run Analysis" button
4. Check browser console for any errors

## 🔧 Debugging Steps

### If Python Agent Fails

**Problem:** `ModuleNotFoundError: No module named 'pandas'`

**Solution:**
```bash
cd ai-agents
pip install pandas
```

**Problem:** `FileNotFoundError: [Errno 2] No such file or directory`

**Solution:**
```bash
# Check if CSV file exists
ls -la ai-agents/samplemaintenance.csv

# If not, create a simple test CSV
echo "Bill ID,Resident Name,Amount,Status,Date,Comments
BILL001,Test User,1000,Paid,2025-01-01,Test" > ai-agents/samplemaintenance.csv
```

### If Backend Routes Fail

**Problem:** `Route not found`

**Solution:**
1. Check if server is running on port 5000
2. Verify route registration in `server.js`
3. Check for syntax errors in route files

**Problem:** `Authentication failed`

**Solution:**
1. Use the `/test-python` endpoint (no auth required)
2. Check if you're logged in as admin in frontend
3. Verify JWT token in localStorage

### If Frontend Integration Fails

**Problem:** `Failed to fetch analysis data`

**Solution:**
1. Check browser console for CORS errors
2. Verify backend is running on correct port
3. Check network tab for request/response details

## 🧪 Manual Testing

### Test 1: Direct Python Execution

```bash
cd ai-agents
python -c "
import pandas as pd
import json
df = pd.read_csv('samplemaintenance.csv')
print(f'Total records: {len(df)}')
duplicates = df[df.duplicated(subset=['Resident Name', 'Amount', 'Status', 'Date', 'Comments'], keep=False)]
print(f'Duplicates: {len(duplicates)}')
print(json.dumps({'total': len(df), 'duplicates': len(duplicates)}, indent=2))
"
```

### Test 2: Backend Health Check

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Resident Assist AI Backend is running",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Test 3: Python Agent via Backend

```bash
curl -X POST http://localhost:5000/api/ai-billing/test-python \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Python agent test completed",
  "data": {
    "pythonOutput": "...",
    "parsedResults": {
      "total_records": 52,
      "duplicate_records": 2,
      "duplicate_percentage": 3.85
    },
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

## 📊 Expected Results

### Python Agent Output
- **Total Records:** 52
- **Duplicate Records:** 2 (Neha Patel's bills)
- **Duplicate Percentage:** 3.85%
- **JSON Structure:** Properly formatted with all required fields

### Backend Integration
- **Health Check:** Returns server status
- **Python Test:** Executes successfully and returns parsed results
- **Analysis Endpoint:** Requires authentication, returns mock data

### Frontend Display
- **Loading State:** Shows spinner while analysis runs
- **Results Display:** Shows summary cards and detailed tabs
- **Error Handling:** Graceful error messages for failures

## 🐛 Common Issues & Solutions

### Issue 1: Python Not Found
```bash
# Check Python installation
python --version
python3 --version

# Use correct Python command
python3 simple_test.py samplemaintenance.csv
```

### Issue 2: CSV File Not Found
```bash
# Check file location
find . -name "samplemaintenance.csv"

# Create test file if missing
echo "Bill ID,Resident Name,Amount,Status,Date,Comments
BILL001,Test User,1000,Paid,2025-01-01,Test" > ai-agents/samplemaintenance.csv
```

### Issue 3: Backend Port Already in Use
```bash
# Check what's using port 5000
lsof -i :5000

# Kill the process or change port
kill -9 <PID>
# OR
PORT=5001 npm start
```

### Issue 4: CORS Errors
```bash
# Check backend CORS configuration
# Ensure frontend URL is in allowed origins
```

## ✅ Success Criteria

The system is working correctly if:

1. ✅ Python agent runs independently and finds duplicates
2. ✅ Backend health check returns OK status
3. ✅ Python agent test endpoint returns analysis results
4. ✅ Frontend can run analysis and display results
5. ✅ Console shows detailed logging of Python process
6. ✅ No authentication errors for test endpoints
7. ✅ JSON parsing works correctly
8. ✅ Error handling works gracefully

## 📞 Troubleshooting

If you encounter issues:

1. **Check Logs:** Look at backend console and browser console
2. **Test Independently:** Run each component separately
3. **Verify Dependencies:** Ensure all packages are installed
4. **Check File Paths:** Verify all files exist in correct locations
5. **Test Network:** Ensure ports are accessible

## 🎯 Next Steps

Once testing is successful:

1. Set up Gemini API key for real AI analysis
2. Integrate with actual billing data
3. Add more sophisticated duplicate detection
4. Implement real-time analysis scheduling
5. Add export functionality for results 