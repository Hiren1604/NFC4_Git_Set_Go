# AI Billing Analysis Debug Guide

## 🚨 Current Issue: "Route not found"

The frontend is getting a "Route not found" error when trying to access the AI billing analysis endpoints.

## 🔍 Debugging Steps

### Step 1: Check if Backend is Running

```bash
# Start the backend server
cd backend
npm start
```

**Expected Output:**
```
🚀 Server running on port 5000
📊 Health check: http://localhost:5000/api/health
✅ Connected to MongoDB - societyhub database
```

### Step 2: Test Basic Connectivity

```bash
# Test health endpoint
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

### Step 3: Test AI Billing Routes

```bash
# Test simple route (no auth)
curl http://localhost:5000/api/ai-billing/test

# Test Python agent (no auth)
curl -X POST http://localhost:5000/api/ai-billing/test-python \
  -H "Content-Type: application/json"

# Test run-analysis (no auth)
curl -X POST http://localhost:5000/api/ai-billing/test-run-analysis \
  -H "Content-Type: application/json"
```

### Step 4: Run Automated Tests

```bash
# Install node-fetch if needed
npm install node-fetch

# Run the test script
node test_routes.js
```

**Expected Output:**
```
🧪 Testing AI Billing Routes...

1️⃣ Testing health check...
✅ Health check: Resident Assist AI Backend is running

2️⃣ Testing simple test route...
✅ Test route: AI Billing route is working!

3️⃣ Testing Python agent...
✅ Python agent test: Python agent test completed
📊 Analysis results: { totalRecords: 52, duplicateRecords: 2, duplicatePercentage: 3.85 }

4️⃣ Testing run-analysis (no auth)...
✅ Run analysis test: AI analysis completed successfully (test mode)
📊 Results summary: { duplicateBills: 1, totalBills: 50 }

🎉 Route testing completed!
```

## 🐛 Common Issues & Solutions

### Issue 1: Backend Not Running
**Symptoms:** All requests fail with connection errors
**Solution:** Start the backend server with `npm start`

### Issue 2: Port Already in Use
**Symptoms:** "EADDRINUSE" error
**Solution:** 
```bash
# Find what's using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
# Or use a different port
PORT=5001 npm start
```

### Issue 3: Route Not Registered
**Symptoms:** 404 "Route not found" errors
**Solution:** Check `backend/server.js` line 67:
```javascript
app.use('/api/ai-billing', aiBillingRoutes);
```

### Issue 4: Authentication Issues
**Symptoms:** 401 "Not authorized" errors
**Solution:** Use the test endpoints (no auth required):
- `/api/ai-billing/test`
- `/api/ai-billing/test-python`
- `/api/ai-billing/test-run-analysis`

### Issue 5: Python Agent Issues
**Symptoms:** Python process errors
**Solution:**
```bash
cd ai-agents
python simple_test.py samplemaintenance.csv
```

## 🔧 Frontend Debugging

### Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

### Test Frontend Integration
1. Start frontend: `npm run dev`
2. Navigate to AI Billing Analysis page
3. Click "Run Analysis"
4. Check console for detailed logs

## 📊 Expected Results

### Backend Tests
- ✅ Health check returns OK
- ✅ Test route returns success message
- ✅ Python agent executes and returns results
- ✅ Run analysis returns enhanced data

### Frontend Tests
- ✅ Page loads without errors
- ✅ "Run Analysis" button works
- ✅ Results display correctly
- ✅ Console shows detailed logs

## 🚀 Quick Fix

If you're still getting "Route not found":

1. **Restart Backend:**
```bash
cd backend
npm start
```

2. **Test Routes:**
```bash
node test_routes.js
```

3. **Update Frontend:**
The frontend now uses test endpoints that don't require authentication.

4. **Check Console:**
Look for detailed error messages in both backend and frontend consoles.

## 🎯 Next Steps

Once the routes are working:

1. Test the Python agent independently
2. Verify the CSV file exists
3. Check if pandas is installed
4. Test the full integration

## 📞 Troubleshooting

If issues persist:

1. **Check Backend Logs:** Look at the terminal where backend is running
2. **Check Frontend Console:** Open browser dev tools
3. **Test Each Component:** Run each test separately
4. **Verify Dependencies:** Ensure all packages are installed
5. **Check File Paths:** Verify all files exist in correct locations 