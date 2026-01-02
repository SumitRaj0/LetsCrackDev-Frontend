# Deployment Guide

This guide will help you deploy:
- **Backend** to Render
- **Frontend** to Vercel

---

## 🚀 Backend Deployment to Render

### Prerequisites
- Render account: https://render.com
- MongoDB Atlas account (or your MongoDB connection string)
- GitHub repository connected to Render

### Step 1: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository and branch (usually `main`)
5. Configure the service:
   - **Name**: `LetsCrackDev-Backend` (or your preferred name)
   - **Root Directory**: `backend` (important!)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose your plan (Free tier available)

### Step 2: Set Environment Variables in Render

Go to your service → **Environment** tab and add:

#### Required Variables:
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-connection-string
ACCESS_TOKEN_SECRET=your-jwt-secret-min-32-chars
REFRESH_TOKEN_SECRET=your-refresh-token-secret-min-32-chars
FRONTEND_URL=https://your-frontend.vercel.app
```

#### Razorpay (for payments):
```env
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

#### Email (Gmail App Password):
```env
GMAIL_USER=letscrackdev@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

#### Rate Limiting (Optional):
```env
RATE_LIMIT_MAX_REQUESTS=500
PUBLIC_READ_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=200
CHATBOT_RATE_LIMIT_MAX=10
```

#### Google Drive (if using):
```env
GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY=your-private-key
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
```

#### Google Gemini (for chatbot):
```env
GEMINI_API_KEY=your-gemini-api-key
```

### Step 3: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build the project
   - Start the server
3. Wait for deployment to complete (check **Logs** tab)
4. Your backend will be available at: `https://your-service-name.onrender.com`

### Step 4: Verify Deployment

1. Check health endpoint: `https://your-service-name.onrender.com/health`
2. Check API endpoint: `https://your-service-name.onrender.com/api/v1`
3. Check logs in Render dashboard for any errors

---

## 🎨 Frontend Deployment to Vercel

### Prerequisites
- Vercel account: https://vercel.com
- GitHub repository connected to Vercel

### Step 1: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (important!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

### Step 2: Set Environment Variables in Vercel

Go to your project → **Settings** → **Environment Variables** and add:

#### Required:
```env
VITE_API_URL=https://your-backend-service.onrender.com/api
```

**Important**: Replace `your-backend-service.onrender.com` with your actual Render backend URL.

### Step 3: Deploy

1. Click **"Deploy"**
2. Vercel will automatically:
   - Install dependencies
   - Build the project
   - Deploy to production
3. Your frontend will be available at: `https://your-project.vercel.app`

### Step 4: Update Backend CORS

After deploying frontend, update the `FRONTEND_URL` in Render:
```env
FRONTEND_URL=https://your-project.vercel.app
```

Then restart the Render service.

---

## 🔄 Auto-Deployment Setup

### Backend (Render)

Render automatically deploys when you push to the connected branch (usually `main`).

**Manual Deploy**: Go to Render Dashboard → Your Service → **Manual Deploy**

### Frontend (Vercel)

Vercel automatically deploys when you push to the connected branch.

**Manual Deploy**: Go to Vercel Dashboard → Your Project → **Deployments** → **Redeploy**

---

## ✅ Post-Deployment Checklist

### Backend:
- [ ] Health endpoint working: `/health`
- [ ] API endpoint accessible: `/api/v1`
- [ ] MongoDB connection successful (check logs)
- [ ] Environment variables set correctly
- [ ] CORS configured for frontend URL
- [ ] Email service working (test password reset)

### Frontend:
- [ ] Site loads correctly
- [ ] API calls working (check browser console)
- [ ] Environment variables set
- [ ] No CORS errors
- [ ] Authentication working
- [ ] Payment flow working (if applicable)

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Service won't start
- **Check**: Build command is correct (`npm run build`)
- **Check**: Start command is correct (`npm start`)
- **Check**: Root directory is set to `backend`
- **Check**: Logs for specific errors

**Problem**: MongoDB connection fails
- **Check**: `MONGODB_URI` is set correctly
- **Check**: MongoDB Atlas allows connections from Render IPs (0.0.0.0/0)
- **Check**: Connection string format is correct

**Problem**: CORS errors
- **Check**: `FRONTEND_URL` is set to your Vercel URL
- **Check**: CORS middleware is configured correctly

### Frontend Issues

**Problem**: API calls fail
- **Check**: `VITE_API_URL` is set correctly in Vercel
- **Check**: Backend URL is accessible
- **Check**: CORS is configured on backend
- **Check**: Browser console for specific errors

**Problem**: Build fails
- **Check**: All dependencies are in `package.json`
- **Check**: TypeScript errors are fixed
- **Check**: Build logs in Vercel dashboard

---

## 📝 Important Notes

1. **Environment Variables**: Never commit `.env` files. Always set them in the platform dashboard.

2. **Build Commands**:
   - Backend: `npm install && npm run build`
   - Frontend: `npm run build`

3. **Root Directories**:
   - Backend: `backend`
   - Frontend: `frontend`

4. **Port**: Render automatically sets `PORT` environment variable. Your code should use `process.env.PORT || 3001`.

5. **CORS**: Make sure `FRONTEND_URL` in backend matches your Vercel URL exactly.

6. **Database**: Use MongoDB Atlas for production. Free tier available.

---

## 🔗 Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas

---

## 📞 Need Help?

- Check Render logs: Service → **Logs** tab
- Check Vercel logs: Project → **Deployments** → Click deployment → **Logs**
- Check browser console for frontend errors
- Review environment variables in both platforms

