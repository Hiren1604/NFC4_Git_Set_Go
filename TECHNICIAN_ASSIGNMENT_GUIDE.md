# Technician Assignment System Guide

## 🎯 **What Was Implemented:**

A complete technician assignment system that uses AI agents to intelligently assign technicians to maintenance issues based on skills, availability, and cost. The system includes database integration, real-time notifications, and user interaction capabilities.

## 🔧 **Components Implemented:**

### 1. **Database Population**
- **File**: `backend/scripts/populate-technicians.js`
- **Purpose**: Populates the database with realistic technicians
- **Features**:
  - 10 technicians with different specializations
  - Skills mapping to issue categories
  - Hourly rates and availability status
  - Contact information and professional details

### 2. **AI Agent Integration**
- **File**: `ai-agents/categoryagent.py`
- **Purpose**: Intelligent technician assignment using CrewAI
- **Features**:
  - Skills-based matching algorithm
  - Availability and cost optimization
  - Estimated time and cost calculations
  - JSON output for backend integration

### 3. **Backend API Routes**
- **File**: `backend/routes/technician-assignment.js`
- **Purpose**: RESTful API for technician assignment operations
- **Endpoints**:
  - `POST /api/technician-assignment/assign` - Assign technician to issue
  - `GET /api/technician-assignment/:issueId` - Get assignment details
  - `POST /api/technician-assignment/:issueId/accept` - Accept assignment
  - `POST /api/technician-assignment/:issueId/reject` - Reject assignment

### 4. **Frontend Components**
- **File**: `src/components/dashboard/TechnicianAssignmentNotification.tsx`
- **Purpose**: Rich notification component for technician assignments
- **Features**:
  - Detailed technician information display
  - Cost and time estimates
  - Accept/Reject/Reschedule actions
  - Real-time status updates

### 5. **Updated Notifications Page**
- **File**: `src/pages/NotificationsPage.tsx`
- **Purpose**: Enhanced notifications with technician assignment integration
- **Features**:
  - Integration with technician assignment API
  - Real-time notification updates
  - Filtering and search capabilities
  - Action handling for assignments

## 📊 **Technician Database:**

### **Technicians Created:**
1. **Rajesh Kumar** - Plumbing specialist (₹800/hr)
2. **Amit Singh** - Electrical specialist (₹900/hr)
3. **Suresh Patel** - Carpentry specialist (₹700/hr)
4. **Priya Sharma** - Cleaning specialist (₹500/hr)
5. **Vikram Malhotra** - Security specialist (₹600/hr)
6. **Ramesh Iyer** - Elevator technician (₹1000/hr)
7. **Lakshmi Devi** - Garden maintenance (₹400/hr)
8. **Arjun Reddy** - Parking attendant (₹450/hr)
9. **Meera Kapoor** - Painting specialist (₹650/hr)
10. **Sanjay Gupta** - General technician (₹750/hr)

### **Skill Distribution:**
- Plumbing: 2 technicians
- Electrical: 3 technicians
- Carpentry: 3 technicians
- Cleaning: 2 technicians
- Security: 2 technicians

## 🤖 **AI Agent Features:**

### **Assignment Algorithm:**
1. **Primary Skill Match**: +3 points for exact category match
2. **Partial Skill Match**: +2 points for related skills
3. **Availability Bonus**: +1 point for available technicians
4. **Cost Optimization**: +1 point for lower hourly rates

### **Time Estimation:**
- Plumbing: 2-4 hours
- Electrical: 1-3 hours
- Carpentry: 2-6 hours
- Cleaning: 1-2 hours
- Security: 1-2 hours
- Elevator: 4-8 hours
- Parking: 1-3 hours
- Garden: 2-4 hours

### **Cost Calculation:**
- Base multiplier per category
- Hourly rate × estimated hours
- Currency: INR

## 🚀 **How to Test:**

### 1. **Start the Backend Server**
```bash
cd backend
node server.js
```

### 2. **Populate Database with Technicians**
```bash
cd backend
node scripts/populate-technicians.js
```

### 3. **Test Technician Assignment**
- Login as a resident
- Navigate to "Report Issue"
- Submit a new issue
- Go to "Notifications"
- Click on technician assignment notification
- Review assignment details
- Accept or reject the assignment

### 4. **API Testing**
```bash
# Assign technician to an issue
curl -X POST http://localhost:5000/api/technician-assignment/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"issueId": "ISSUE_ID"}'

# Get assignment details
curl -X GET http://localhost:5000/api/technician-assignment/ISSUE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Accept assignment
curl -X POST http://localhost:5000/api/technician-assignment/ISSUE_ID/accept \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔍 **API Endpoints:**

### **POST /api/technician-assignment/assign**
- **Purpose**: Assign technician to an issue
- **Authentication**: Required
- **Request Body**: `{ "issueId": "string" }`
- **Response**: Assignment notification with technician details

### **GET /api/technician-assignment/:issueId**
- **Purpose**: Get assignment details for an issue
- **Authentication**: Required
- **Response**: Assignment notification with actions

### **POST /api/technician-assignment/:issueId/accept**
- **Purpose**: Accept technician assignment
- **Authentication**: Required
- **Response**: Success message with updated status

### **POST /api/technician-assignment/:issueId/reject**
- **Purpose**: Reject technician assignment
- **Authentication**: Required
- **Request Body**: `{ "reason": "string" }` (optional)
- **Response**: Success message with updated status

## 🎨 **Frontend Features:**

### **Technician Assignment Notification:**
- **Technician Details**: Name, phone, email, skills, hourly rate
- **Issue Information**: Title, description, category
- **Estimates**: Time and cost estimates
- **Actions**: Accept, Reject, Request Reschedule
- **Real-time Updates**: Status changes and feedback

### **Notifications Page:**
- **Filtering**: By type and priority
- **Search**: Across notification content
- **Real-time**: Refresh capability
- **Integration**: Direct access to assignment details

## 📈 **Database Integration:**

### **User Model Updates:**
- **Skills Array**: Multiple skills per technician
- **Hourly Rate**: Cost per hour
- **Availability**: Available, busy, offline
- **Role-based**: Technician role with specific fields

### **Issue Model Integration:**
- **Assigned To**: Reference to technician
- **Status Updates**: Automatic status progression
- **Timeline Tracking**: Assignment history
- **Cost Tracking**: Estimated and actual costs

## ✅ **Benefits:**

1. **Intelligent Assignment**: AI-powered technician selection
2. **Cost Optimization**: Automatic cost estimation and optimization
3. **Real-time Updates**: Live notification system
4. **User Control**: Accept/reject/reschedule capabilities
5. **Professional Details**: Complete technician information
6. **Database Integration**: Persistent data storage
7. **Scalable System**: Easy to add more technicians

## 🎯 **Workflow:**

1. **Issue Submission**: Resident submits maintenance issue
2. **AI Analysis**: Category agent analyzes issue details
3. **Technician Selection**: AI selects best available technician
4. **Notification**: Resident receives assignment notification
5. **User Action**: Resident accepts/rejects/reschedules
6. **Status Update**: Issue status updated based on action
7. **Timeline Tracking**: All actions logged in issue timeline

## 🔧 **Troubleshooting:**

### **Common Issues:**
- **No Technicians Available**: Check technician population script
- **AI Agent Errors**: Verify Python dependencies and environment
- **Authentication Errors**: Check JWT token validity
- **Database Connection**: Verify MongoDB connection

### **Debug Steps:**
1. Check backend server logs
2. Verify technician data in database
3. Test Python agent independently
4. Check frontend console for errors
5. Verify API endpoint accessibility

## 📝 **Sample Assignment Response:**

```json
{
  "type": "technician_assignment",
  "title": "Technician Assigned: Rajesh Kumar",
  "message": "Rajesh Kumar has been assigned to your issue. They specialize in plumbing and charge ₹800/hour.",
  "technician": {
    "id": "tech_id",
    "name": "Rajesh Kumar",
    "phone": "+91 98765 43210",
    "email": "rajesh.plumber@societyhub.com",
    "skills": ["plumbing"],
    "hourlyRate": 800,
    "availability": "available"
  },
  "issue": {
    "title": "Water leak in kitchen",
    "description": "Persistent water leak under sink",
    "category": "plumbing"
  },
  "estimatedTime": "2-4 hours",
  "estimatedCost": {
    "estimated_hours": 2.5,
    "hourly_rate": 800,
    "total_cost": 2000,
    "currency": "INR"
  },
  "actions": [
    {
      "type": "accept",
      "label": "Accept Assignment",
      "description": "Accept this technician for your issue"
    },
    {
      "type": "reschedule",
      "label": "Request Reschedule",
      "description": "Request a different time slot"
    },
    {
      "type": "reject",
      "label": "Reject & Request Another",
      "description": "Request a different technician"
    }
  ]
}
```

This implementation provides a complete, intelligent technician assignment system with database persistence, AI-powered selection, and rich user interaction capabilities. 