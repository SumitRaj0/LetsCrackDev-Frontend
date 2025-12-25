# Environment Variables Setup

This document describes all required and optional environment variables for the frontend application.

## Required Environment Variables

### API Configuration
```env
VITE_API_URL=https://your-backend-url.com/api
```
- **Description**: Backend API base URL
- **Required**: Yes (in production)
- **Development Default**: `http://localhost:3001/api` (if not set)
- **Example**: `https://letscrackdev-backend.onrender.com/api`

### EmailJS Configuration (for contact form)
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```
- **Description**: EmailJS credentials for sending contact form emails
- **Required**: Yes (if using contact form)
- **Get from**: https://www.emailjs.com/
- **Note**: These are public keys, safe to expose in frontend

### Google Gemini API (for chatbot)
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```
- **Description**: Google Gemini API key for chatbot functionality
- **Required**: Yes (if using chatbot)
- **Get from**: https://makersuite.google.com/app/apikey
- **Note**: This is a public key, but should be restricted to your domain

### Application URL
```env
VITE_APP_URL=https://your-frontend-url.com
```
- **Description**: Frontend application URL (for OAuth callbacks, etc.)
- **Required**: Yes (in production)
- **Development Default**: `http://localhost:5173` (if not set)
- **Example**: `https://letscrackdev.com`

## Development Setup

For local development, create a `.env` file in the `frontend` directory:

```env
# Local development
VITE_API_URL=http://localhost:3001/api
VITE_APP_URL=http://localhost:5173

# EmailJS (get from https://www.emailjs.com/)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Gemini API (get from https://makersuite.google.com/app/apikey)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Production Setup

In production (Vercel, Netlify, etc.), set these as environment variables in your deployment platform:

1. **Vercel**: Go to Project Settings → Environment Variables
2. **Netlify**: Go to Site Settings → Environment Variables
3. **Other platforms**: Check their documentation for setting environment variables

## Important Notes

- All Vite environment variables must be prefixed with `VITE_`
- Environment variables are embedded at build time, not runtime
- After changing environment variables, you must rebuild the application
- Never commit `.env` files with real credentials to version control
- Use `.env.example` as a template (without real values)

## Verification

To verify your environment variables are loaded correctly:

1. Check the browser console in development mode
2. Look for API calls to the correct base URL
3. Test contact form and chatbot functionality

## Troubleshooting

### API calls failing
- Check `VITE_API_URL` is set correctly
- Verify the backend is accessible from your frontend domain
- Check CORS settings on backend

### Contact form not working
- Verify all three EmailJS variables are set
- Check EmailJS dashboard for service status
- Verify template ID matches your EmailJS template

### Chatbot not working
- Verify `VITE_GEMINI_API_KEY` is set
- Check API key is valid and not expired
- Verify API key has proper permissions

