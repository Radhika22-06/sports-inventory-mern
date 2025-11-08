#!/bin/bash

echo "🚀 Sports Inventory Deployment Script"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
fi

echo ""
echo "📋 Deployment Checklist:"
echo "1. ✅ MongoDB Atlas cluster created"
echo "2. ✅ Environment variables configured"
echo "3. ✅ Repository pushed to GitHub"
echo ""

echo "🔗 Quick Deploy Links:"
echo "Backend (Railway): https://railway.app/new"
echo "Frontend (Netlify): https://app.netlify.com/start"
echo "Database (MongoDB): https://cloud.mongodb.com"
echo ""

echo "📝 Don't forget to:"
echo "- Update REACT_APP_API_URL with your backend URL"
echo "- Add CORS origin with your frontend URL"
echo "- Test all endpoints after deployment"