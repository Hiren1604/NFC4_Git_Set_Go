# AI Billing Analysis Setup Guide

This guide explains how to set up and use the AI Billing Analysis feature that integrates Python AI agents with the Node.js backend.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
cp backend/env.example backend/.env
```

Edit `backend/.env` and add your Gemini API key:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/?retryWrites=true&w=majority

# JWT Secret for Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Google Gemini API Key for AI Billing Analysis
GOOGLE_API_KEY=your-actual-gemini-api-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 2. Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

### 3. Install Python Dependencies

```bash
cd ai-agents
pip install crewai pandas python-dotenv google-generativeai
```

### 4. Test the Python Agent

```bash
cd ai-agents
python test_billing_agent.py
```

Expected output:
```
📁 Testing with CSV file: /path/to/ai-agents/samplemaintenance.csv
✅ Analysis completed successfully!
📊 Total records: 52
🔍 Duplicate records: 2
📈 Duplicate percentage: 3.85%
🔍 Duplicate details:
  - Neha Patel: 2 duplicates (Bill IDs: ['BILL099', 'BILL089'])
```

### 5. Start the Backend

```bash
cd backend
npm install
npm start
```

### 6. Start the Frontend

```bash
npm install
npm run dev
```

## 🔧 How It Works

### Architecture

```
Frontend (React) → Backend (Node.js) → Python Agent → Gemini API
```

1. **Frontend**: Admin dashboard with AI Billing Analysis page
2. **Backend**: Express.js server with AI billing routes
3. **Python Agent**: CrewAI-based duplicate detection using Gemini
4. **Gemini API**: Google's AI model for analysis

### Data Flow

1. Admin clicks "Run Analysis" in the frontend
2. Frontend sends POST request to `/api/ai-billing/run-analysis`
3. Backend spawns Python process with `billingagent.py`
4. Python agent reads CSV file and analyzes with Gemini
5. Results are returned as JSON to the backend
6. Backend integrates results with mock data
7. Frontend displays enhanced analysis results

### Key Files

- `src/pages/AIBillingAnalysisPage.tsx` - Frontend interface
- `backend/routes/ai-billing.js` - Backend API routes
- `ai-agents/billingagent.py` - Python AI agent
- `ai-agents/samplemaintenance.csv` - Sample billing data

## 🐛 Troubleshooting

### Common Issues

#### 1. "Failed to fetch analysis data" Error

**Cause**: Authentication or server issues
**Solution**:
- Ensure you're logged in as admin
- Check if backend is running on port 5000
- Verify JWT token in localStorage

#### 2. "GOOGLE_API_KEY not set" Warning

**Cause**: Missing environment variable
**Solution**:
- Add your Gemini API key to `backend/.env`
- Restart the backend server

#### 3. Python Process Errors

**Cause**: Missing Python dependencies or wrong Python version
**Solution**:
```bash
cd ai-agents
pip install -r requirements.txt
python test_billing_agent.py
```

#### 4. CSV File Not Found

**Cause**: Wrong file path
**Solution**:
- Ensure `samplemaintenance.csv` exists in `ai-agents/`
- Check file permissions

### Debug Mode

Enable detailed logging:

```bash
# Backend
NODE_ENV=development DEBUG=* npm start

# Python Agent
cd ai-agents
python -u billingagent.py samplemaintenance.csv
```

## 📊 Sample Data

The system uses `samplemaintenance.csv` with intentional duplicates:

```csv
Bill ID,Resident Name,Amount,Status,Date,Comments
BILL099,Neha Patel,2000,Paid,2025-07-11,
BILL089,Neha Patel,2000,Paid,2025-07-11,
```

## 🔄 API Endpoints

### GET `/api/ai-billing/analysis`
- **Purpose**: Get current analysis results
- **Auth**: Admin only
- **Response**: Analysis data with duplicates, anomalies, recommendations

### POST `/api/ai-billing/run-analysis`
- **Purpose**: Run new AI analysis
- **Auth**: Admin only
- **Response**: Updated analysis results with Python agent output

### POST `/api/ai-billing/resolve-duplicate/:id`
- **Purpose**: Mark duplicate as resolved
- **Auth**: Admin only
- **Body**: `{ "action": "remove|keep" }`

## 🎯 Features

### AI Analysis
- **Duplicate Detection**: Identifies identical billing records
- **Pattern Analysis**: Finds unusual billing patterns
- **Recommendations**: AI-suggested improvements

### Frontend Features
- **Real-time Analysis**: Run AI analysis on demand
- **Visual Dashboard**: Charts and metrics
- **Duplicate Management**: Mark duplicates as resolved
- **Export Results**: Download analysis reports

### Backend Integration
- **Python Process**: Spawns Python agent from Node.js
- **Environment Variables**: Secure API key management
- **Error Handling**: Graceful fallback to mock data
- **Authentication**: Admin-only access

## 🔐 Security

- **API Key**: Stored in environment variables
- **Authentication**: JWT-based admin access
- **Input Validation**: CSV file validation
- **Error Handling**: No sensitive data in error messages

## 📈 Performance

- **Mock Data**: Works without API key (for testing)
- **Caching**: Analysis results cached in memory
- **Async Processing**: Non-blocking Python execution
- **Timeout Handling**: 30-second process timeout

## 🚀 Production Deployment

1. **Environment Variables**: Set all required env vars
2. **Python Path**: Ensure Python 3.8+ is available
3. **Dependencies**: Install all Python packages
4. **File Permissions**: Ensure CSV files are readable
5. **Monitoring**: Add logging for Python process errors

## 📝 Development

### Adding New Analysis Types

1. Extend `billingagent.py` with new tools
2. Update backend route to handle new output
3. Modify frontend to display new results

### Customizing CSV Format

1. Update column names in `DuplicateCheckerTool`
2. Modify `run_analysis()` function
3. Test with your CSV format

### Adding More AI Models

1. Update `llm` configuration in `billingagent.py`
2. Add new API keys to environment
3. Test with different models

## 🤝 Contributing

1. Test with `python test_billing_agent.py`
2. Verify backend integration
3. Check frontend displays correctly
4. Update documentation

## 📞 Support

For issues:
1. Check console logs in browser
2. Verify backend server logs
3. Test Python agent independently
4. Check environment variables 