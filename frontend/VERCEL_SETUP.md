# Vercel Deployment Setup

## Important: Root Directory Configuration

For Vercel to build correctly, you **MUST** set the root directory in Vercel Dashboard:

### Steps:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **LetsCrackDev-Frontend** (or your project name)
3. Go to **Settings** → **General**
4. Scroll to **Root Directory**
5. Click **Edit**
6. Set Root Directory to: `frontend`
7. Click **Save**

### Why This Is Needed

The error `vite: command not found` occurs because:
- Vercel is trying to run `vite build` from the repository root
- But `package.json` and `node_modules` are in the `frontend/` directory
- Setting the root directory tells Vercel to run all commands from `frontend/`

### Current Configuration

The `vercel.json` file is already configured correctly:
- `buildCommand`: `npm run build`
- `installCommand`: `npm ci`
- `framework`: `vite`
- `outputDirectory`: `dist`

### After Setting Root Directory

Once you set the root directory in Vercel Dashboard:
1. Vercel will automatically detect the change
2. It will trigger a new deployment
3. The build should succeed because:
   - Dependencies will be installed from `frontend/package.json`
   - Build command will run from `frontend/` directory
   - `vite` will be available in `node_modules/.bin`

### Alternative: Manual Deployment

If you want to test immediately:
1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click **Redeploy** on the latest deployment
4. Or trigger a new deployment by pushing to `main` branch

### Environment Variables

Make sure these are set in Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://letscrackdev-backend.onrender.com/api
```

### Troubleshooting

**If build still fails:**
1. Check Vercel build logs for specific errors
2. Verify root directory is set to `frontend` (not `/frontend` or `./frontend`)
3. Check that `package.json` exists in `frontend/` directory
4. Verify `npm ci` runs successfully (check logs)

