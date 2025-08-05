@echo off
echo Starting Resident Assist AI Backend Server...
echo.
echo Using MongoDB Atlas from .env file
echo.
set PORT=5000
set NODE_ENV=development
set JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

node server.js
pause 