# Railway.app Backend Deployment Guide

## Prerequisites
- GitHub repository with your code
- Railway.app account (sign up at https://railway.app)
- MongoDB Atlas account for database

## Step 1: Connect to Railway.app

1. Go to https://railway.app and sign in with GitHub
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `sports-inventory-mern` repository
5. Select the `backend` folder as the root directory

## Step 2: Configure Environment Variables

In Railway dashboard, go to your project → Variables tab and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sports_inventory
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
PORT=5000
```

### MongoDB Atlas Setup (if needed):
1. Go to https://cloud.mongodb.com
2. Create a cluster
3. Create a database user
4. Get connection string and replace in MONGODB_URI

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Step 3: Deploy

1. Railway will automatically detect your Node.js app
2. It will use the `railway.json` configuration
3. Deployment starts automatically
4. Get your deployment URL from Railway dashboard

## Step 4: Update Frontend Configuration

Update your frontend API URL to point to Railway deployment:

```javascript
// frontend/src/config/api.js
const API_BASE_URL = 'https://your-railway-app.railway.app/api';
```

## Step 5: Test Deployment

1. Visit your Railway app URL
2. Test API endpoints:
   - GET /api/categories
   - POST /api/auth/register
   - POST /api/auth/login

## Troubleshooting

- Check Railway logs for errors
- Ensure all environment variables are set
- Verify MongoDB connection string
- Check that PORT is set to Railway's provided port

## Railway Configuration Files

Your project includes:
- `railway.json` - Railway deployment configuration
- `package.json` - Node.js dependencies and scripts
- `.env.example` - Environment variables template