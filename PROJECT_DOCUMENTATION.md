# 🏢 Resident Assist AI (SocietyHub) - Detailed Project Documentation

---

## 📌 1. Project Overview & Core Purpose

**Resident Assist AI** (also known as **SocietyHub**) is a full-stack, AI-powered platform designed for residential society issue tracking and automated community management.

Traditional housing society management relies heavily on manual complaints tracking, delayed technician dispatches, and manual billing reconciliation. **Resident Assist AI** solves these challenges by combining a responsive web interface with **autonomous AI Agents** that handle issue classification, smart technician dispatching, issue lifecycle tracking, and maintenance bill fraud/anomaly detection.

---

## 🛠️ 2. Comprehensive Tech Stack

### **Frontend (User Interface)**
- **Core Framework**: React 18 with TypeScript (`.tsx`)
- **Build Tooling**: Vite 5
- **Styling & UI Components**:
  - Tailwind CSS & custom design tokens
  - Radix UI Primitives (Dialogs, Dropdowns, Tabs, Tooltips, Accordions, Toasts)
  - Lucide React Icons
- **Data Management & State**:
  - TanStack React Query v5 for API caching and state synchronization
  - React Router DOM v6 for dynamic portal navigation
  - React Hook Form + Zod for schema validation
- **Analytics**: Recharts for administrative dashboards

### **Backend (REST API Engine)**
- **Runtime**: Node.js v20+
- **Framework**: Express.js 4
- **Security Middleware**:
  - `jsonwebtoken` (JWT) for secure authentication
  - `bcryptjs` for password hashing
  - `helmet` for HTTP security headers
  - `express-rate-limit` for request throttling
  - `cors` for cross-origin domain management
- **Utilities**: `compression` for Gzip optimization, `morgan` for server logging, `multer` for file uploads

### **Database Layer**
- **Engine**: MongoDB / MongoDB Atlas (Cloud NoSQL Database)
- **ODM**: Mongoose v8
- **Core Models**:
  - **User**: Manages Residents, Technicians, and Admins (stores flat info, skills, hourly rates, availability).
  - **Issue**: Tracks ticket titles, descriptions, categories, priorities, emergency status, timeline audits, assigned technicians, and user ratings.
  - **Bill**: Handles maintenance bill generation, payment logs, and dispute tracking.

### **AI Multi-Agent Subsystem**
- **Runtime**: Python 3.12
- **Agent Framework**: CrewAI (`crewai>=0.28.0`)
- **LLM Engine**: Google Gemini 3.8 Flash (`gemini/gemini-3.8-flash`)
- **Data Processing**: Pandas v2 (for CSV maintenance record auditing)
- **Integration**: Node.js `child_process.spawn` IPC pipeline passing JSON streams between Express routes and Python agents.

---

## 👥 3. Portals & User Roles

1. **Resident Portal**:
   - Report maintenance issues (Plumbing, Electrical, Elevator, Carpentry, Security, etc.) with title, description, and photos.
   - View automated AI technician assignments, including estimated repair cost (in ₹) and time.
   - Monitor real-time status updates and submit performance ratings upon issue resolution.

2. **Technician Portal**:
   - View job tickets assigned by the AI Dispatcher based on matching skills.
   - Manage availability status (`available`, `busy`, `offline`).
   - Update work status (`in_progress`, `resolved`) and submit cost totals.

3. **Admin Portal**:
   - High-level analytics dashboard tracking open, in-progress, and resolved issues.
   - Comprehensive resident and technician directories.
   - Monitoring suite for AI Agents and automated system health.
   - Access to the AI Billing Analysis suite to audit maintenance files for duplicates and fraud.

---

## 🤖 4. AI Agent Capabilities

* **Technician Dispatcher Agent (`ai-agents/categoryagent.py`)**:
  - Receives issue reports from the backend via stdin.
  - Evaluates issue urgency, required skills, technician hourly rates, and availability.
  - Dynamically selects the best matching technician and calculates projected completion times and costs.

* **Billing & Anomaly Detection Agent (`ai-agents/billingagent.py`)**:
  - Reads maintenance CSV datasets.
  - Runs duplicate detection tools across resident names, dates, comments, and payment amounts to prevent double billing or fraudulent charges.

---

## ⚙️ 5. How System Components Connect

1. **User Action**: A resident submits a ticket on the React frontend.
2. **API Endpoint**: The request hits Express `/api/issues`.
3. **AI Execution**: Express spawns the Python `categoryagent.py` process, passing the ticket and available technicians via JSON.
4. **LLM Evaluation**: CrewAI invokes Google Gemini 3.8 Flash to evaluate the best technician match.
5. **Database Storage**: The selection is saved to MongoDB via Mongoose.
6. **Real-Time Response**: The updated ticket and notification are returned to the React UI.

---

## 🚀 6. Setup & Execution Guide

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- MongoDB instance (Local or MongoDB Atlas)

### Backend Setup
```bash
cd backend
npm install
# Configure your MONGODB_URI in backend/.env
npm start
```

### AI Agents Setup
```bash
cd ai-agents
pip install -r requirements.txt
# Set GOOGLE_API_KEY in ai-agents/.env
```

### Frontend Setup
```bash
# In the project root directory
npm install
npm run dev
```
