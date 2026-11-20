# Report Issue Implementation Guide

## 🎯 **What Was Implemented:**

The "Report Issue" form in the resident dashboard now saves data to the database and the database has been populated with sample issues using the existing schema.

## 🔧 **Changes Made:**

### 1. **Updated ReportIssuePage.tsx**
- **Database Integration**: Modified `handleSubmit` function to call the backend API
- **Form Validation**: Added required fields and proper error handling
- **Authentication**: Integrated JWT token authentication
- **Data Structure**: Updated form fields to match the Issue model schema
- **Success State**: Enhanced success page to show actual issue details from database
- **Error Handling**: Added error alerts for failed submissions

### 2. **Created Sample Data Script**
- **File**: `backend/scripts/populate-sample-issues.js`
- **Purpose**: Populates database with realistic sample issues
- **Features**: 
  - 10 diverse sample issues across different categories
  - Various statuses (pending, assigned, in-progress, resolved, closed)
  - Different priorities (low, medium, high, urgent)
  - Complete timeline tracking
  - AI suggestions and cost estimates
  - Ratings for completed issues

### 3. **Database Schema Compliance**
- **Category**: Updated to match Issue model (plumbing, electrical, carpentry, cleaning, security, elevator, parking, garden, other)
- **Priority**: Changed from "urgency" to "priority" to match schema
- **Location**: Structured to match the nested location object
- **AI Suggestions**: Integrated with the aiSuggestions field in the schema

## 📊 **Sample Data Created:**

### **Issue Categories:**
- Plumbing: Water leak in kitchen
- Electrical: Outlet not working
- Carpentry: Broken window lock
- Cleaning: Garbage chute blocked
- Security: Camera offline, fire alarm test
- Elevator: Not responding (urgent)
- Parking: Gate malfunction
- Garden: Sprinkler system broken
- Other: Intercom system

### **Status Distribution:**
- Pending: 3 issues
- Assigned: 3 issues
- In-progress: 2 issues
- Resolved: 1 issue
- Closed: 1 issue

### **Priority Distribution:**
- Low: 1 issue
- Medium: 5 issues
- High: 3 issues
- Urgent: 1 issue

## 🚀 **How to Test:**

### 1. **Start the Backend Server**
```bash
cd backend
node server.js
```

### 2. **Login as a Resident**
- Go to the login page
- Use resident credentials
- Navigate to "Report Issue" from the sidebar

### 3. **Submit a New Issue**
- Fill out the form with realistic data
- Test AI suggestions by typing detailed descriptions
- Submit the form
- Verify the success page shows the saved issue details

### 4. **View Submitted Issues**
- Navigate to "My Issues" to see all submitted issues
- Check that new issues appear in the list
- Verify the data matches what was submitted

## 🔍 **API Endpoints Used:**

### **POST /api/issues**
- **Purpose**: Create new issue
- **Authentication**: Required (Bearer token)
- **Request Body**:
  ```json
  {
    "title": "Issue title",
    "description": "Detailed description",
    "category": "plumbing|electrical|carpentry|cleaning|security|elevator|parking|garden|other",
    "priority": "low|medium|high|urgent",
    "location": {
      "area": "Location description"
    },
    "aiSuggestions": {
      "category": "suggested_category",
      "priority": "suggested_priority",
      "estimatedTime": "time_estimate",
      "confidence": 0.85
    }
  }
  ```

## 🎨 **Form Features:**

### **AI-Powered Suggestions**
- Analyzes description text to suggest category and priority
- Provides estimated completion time
- Can be applied with a single click

### **Validation**
- Required fields: title, description, category, priority
- Proper error messages for validation failures
- Authentication checks

### **User Experience**
- Loading states during submission
- Success confirmation with issue details
- Error handling with clear messages
- Form reset after successful submission

## 📈 **Database Integration:**

### **Issue Model Fields Used:**
- `title`: Issue title (required)
- `description`: Detailed description (required)
- `category`: Issue category (required)
- `priority`: Priority level (required)
- `reportedBy`: Automatically set to current user
- `location`: Structured location object
- `aiSuggestions`: AI analysis results
- `timeline`: Automatic timeline entry on creation
- `status`: Defaults to 'pending'
- `estimatedCompletion`: Calculated based on priority

### **Automatic Features:**
- **Timeline Tracking**: Every issue gets an initial "reported" entry
- **User Association**: Issues are automatically linked to the reporting user
- **Status Management**: Proper status progression tracking
- **Cost Tracking**: Estimated and actual cost fields
- **Rating System**: Completed issues can be rated

## ✅ **Benefits:**

1. **Data Persistence**: Issues are now saved to the database
2. **Real-time Tracking**: Issues can be tracked through their lifecycle
3. **User Management**: Issues are properly associated with users
4. **AI Integration**: AI suggestions are stored and can be referenced
5. **Complete Workflow**: From submission to resolution tracking
6. **Sample Data**: Realistic data for testing and demonstration

## 🎯 **Next Steps:**

1. **Test the Form**: Submit various types of issues
2. **Check My Issues**: Verify issues appear in the resident's issue list
3. **Admin View**: Check that admins can see all submitted issues
4. **Technician Assignment**: Test the assignment workflow
5. **Status Updates**: Test status progression and timeline updates

## 🔧 **Troubleshooting:**

### **Common Issues:**
- **Authentication Error**: Ensure user is logged in with valid token
- **Validation Error**: Check that all required fields are filled
- **Database Error**: Verify MongoDB connection and Issue model
- **Network Error**: Check backend server is running

### **Debug Steps:**
1. Check browser console for errors
2. Verify backend server is running on port 5000
3. Check MongoDB connection
4. Verify user authentication token
5. Check network tab for API call details

## 📝 **Sample Issue Submission:**

```json
{
  "title": "Water Leak in Kitchen",
  "description": "There is a persistent water leak under the kitchen sink. Water is dripping and has started to damage the cabinet.",
  "category": "plumbing",
  "priority": "high",
  "location": {
    "area": "Kitchen, Flat A-501"
  },
  "aiSuggestions": {
    "category": "plumbing",
    "priority": "high",
    "estimatedTime": "2-4 hours",
    "confidence": 0.9
  }
}
```

This implementation provides a complete issue reporting system with database persistence, AI assistance, and proper user management. 