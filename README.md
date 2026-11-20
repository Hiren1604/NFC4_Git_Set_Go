# 🏢 Resident Assist AI (SocietyHub)

An enterprise-grade, **AI-powered Multi-Agent Residential Society Issue Tracker & Management Platform**.

> For full architectural details, tech stack breakdown, and component guides, see [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) and the [docs/](docs/) directory.

## 🛠️ Quick Tech Stack Overview
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI, TanStack Query, Recharts
- **Backend**: Node.js, Express.js, JWT, Mongoose, Helmet, Compression
- **Database**: MongoDB / MongoDB Atlas
- **AI Agents**: Python 3.12, CrewAI, Google Gemini 3.8 Flash, Pandas

## 🚀 Quick Start

### 1. Backend Server
```bash
cd backend
npm install
npm start
```
*(Make sure to set `MONGODB_URI` in `backend/.env`)*

### 2. AI Agents Dependencies
```bash
cd ai-agents
pip install -r requirements.txt
```

### 3. Frontend Web App
```bash
# In the root folder
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
