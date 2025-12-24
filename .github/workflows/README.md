# CI/CD Workflows

This directory contains GitHub Actions workflows for automated deployment.

## Frontend Deployment to Vercel

### Setup Instructions

1. **Get Vercel Credentials:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to Settings → Tokens
   - Create a new token and copy it

2. **Get Project IDs:**
   - Go to your project settings in Vercel
   - Copy the **Project ID** and **Organization ID**

3. **Add GitHub Secrets:**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VERCEL_TOKEN` - Your Vercel token
     - `VERCEL_ORG_ID` - Your Vercel organization ID
     - `VERCEL_PROJECT_ID` - Your Vercel project ID
     - `VITE_API_URL` (optional) - Your backend API URL

### Workflow Options

#### Option 1: Simple Deployment (Recommended)
Uses `deploy-frontend-simple.yml` - Uses Vercel GitHub Action for easier setup.

#### Option 2: Full Control
Uses `deploy-frontend.yml` - Uses Vercel CLI for more control over the deployment process.

### How It Works

- **Triggers:** Automatically runs on push to `main` branch when frontend files change
- **Build:** Installs dependencies and builds the frontend
- **Deploy:** Deploys the built frontend to Vercel production

### Manual Trigger

You can also manually trigger the workflow from the GitHub Actions tab.

