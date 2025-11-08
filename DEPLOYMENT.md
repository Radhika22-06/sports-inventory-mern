# Deployment Guide - Sports Inventory Management System

## Free Hosting Options

### Option 1: Railway + Netlify (Recommended)

#### Backend Deployment (Railway)
1. Create account at [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy backend folder
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Random secure string
   - `PORT`: 8080 (Railway default)

#### Frontend Deployment (Netlify)
1. Create account at [Netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Base directory: `frontend`
4. Add environment variable:
   - `REACT_APP_API_URL`: Your Railway backend URL

### Option 2: Render + Vercel

#### Backend (Render)
1. Create account at [Render.com](https://render.com)
2. Connect repository and select backend folder
3. Use `render.yaml` configuration
4. Add environment variables

#### Frontend (Vercel)
1. Create account at [Vercel.com](https://vercel.com)
2. Import project, select frontend folder
3. Add environment variable: `REACT_APP_API_URL`

### Database Setup (MongoDB Atlas)
1. Create free account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free cluster (M0)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string for `MONGODB_URI`

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sports_inventory
JWT_SECRET=your_super_secret_jwt_key_here
PORT=8080
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

## Deployment Steps

1. **Setup MongoDB Atlas**
   - Create cluster and get connection string

2. **Deploy Backend**
   - Push code to GitHub
   - Connect to Railway/Render
   - Add environment variables
   - Deploy

3. **Deploy Frontend**
   - Update `REACT_APP_API_URL` with backend URL
   - Connect to Netlify/Vercel
   - Deploy

4. **Test Application**
   - Register new user
   - Test all features

## Cost: $0/month
- Railway: 500 hours/month free
- Netlify: 100GB bandwidth free
- MongoDB Atlas: 512MB storage free
- Vercel: 100GB bandwidth free
- Render: 750 hours/month free