# Backend Setup Guide

## 1. Configure MongoDB Connection

### Option A: Using MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster or use existing one
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

### Option B: Using Local MongoDB
1. Install MongoDB locally
2. Create a `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/resident-assist-ai
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

## 2. Install Dependencies
```bash
cd backend
npm install
```

## 3. Start the Server
```bash
npm start
```

## 4. Test the Connection
Visit: http://localhost:5000/api/health

You should see:
```json
{
  "status": "OK",
  "message": "Resident Assist AI Backend is running",
  "timestamp": "2024-01-XX..."
}
```

## 5. Common Issues

### Authentication Failed
- Check your username and password in the MongoDB URI
- Make sure you're using the correct database name
- Verify your IP is whitelisted in MongoDB Atlas

### Connection Refused
- Make sure MongoDB is running (if using local)
- Check if the port is correct
- Verify the cluster URL is correct

## 6. Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/resident-assist-ai |
| PORT | Server port | 5000 |
| JWT_SECRET | Secret key for JWT tokens | (required) |
| JWT_EXPIRE | JWT token expiration | 7d |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 | 