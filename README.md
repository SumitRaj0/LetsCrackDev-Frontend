# LetsCrackDev

A full-stack application with separate frontend and backend.

## Project Structure

```
LetsCrackDev/
├── frontend/     # React frontend application
└── backend/      # Node.js backend API
```

## Getting Started

### Frontend

Navigate to the frontend directory and follow the instructions in `frontend/README.md`:

```bash
cd frontend
npm install
npm run dev
```

### Backend

Navigate to the backend directory and follow the instructions in `backend/README.md`:

```bash
cd backend
npm install
npm run dev
```

## Development

Both frontend and backend need to be running for the full application to work:

1. Start the backend server (usually on port 3001)
2. Start the frontend development server (usually on port 5173)

## Deployment

### Frontend Auto-Deployment to Vercel

The frontend automatically deploys to Vercel when you push to the `main` branch.

#### Setup (One-time)

1. **Get Vercel Credentials:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to Settings → Tokens → Create Token
   - Copy the token

2. **Get Project IDs:**
   - In Vercel, go to your project settings
   - Copy the **Project ID** and **Organization ID**

3. **Add GitHub Secrets:**
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VERCEL_TOKEN` - Your Vercel token
     - `VERCEL_ORG_ID` - Your Vercel organization ID
     - `VERCEL_PROJECT_ID` - Your Vercel project ID
     - `VITE_API_URL` (optional) - Backend API URL

#### How It Works

- Push to `main` branch → GitHub Actions triggers
- Builds the frontend → Deploys to Vercel production
- See `.github/workflows/` for workflow details

## License

[Your License Here]
