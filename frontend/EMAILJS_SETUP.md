# EmailJS Setup Guide

This guide will help you set up EmailJS to send contact form emails directly from the frontend.

## Step 1: Create EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month free)
3. Verify your email address

## Step 2: Create Email Service

1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose **Gmail** (or your preferred email provider)
4. Connect your Gmail account (`letscrackdev@gmail.com`)
5. Click **Create Service**
6. **Copy the Service ID** (you'll need this)

## Step 3: Create Email Template

1. Go to **Email Templates** in your EmailJS dashboard
2. Click **Create New Template**
3. Use this template:

**Template Name:** Contact Form

**Subject:** Contact Form: {{subject}}

**Content:**
```
New Contact Form Submission

From: {{from_name}} ({{from_email}})
Subject: {{subject}}

Message:
{{message}}

---
This email was sent from the LetsCrackDev contact form.
```

4. Set **To Email** to: `letscrackdev@gmail.com`
5. Set **From Name** to: `LetsCrackDev Contact Form`
6. Click **Save**
7. **Copy the Template ID** (you'll need this)

## Step 4: Get Public Key

1. Go to **Account** → **General** in your EmailJS dashboard
2. Find **Public Key** section
3. **Copy the Public Key** (you'll need this)

## Step 5: Add Environment Variables

Create or update `.env` file in the `frontend` directory:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

Replace:
- `your_service_id_here` with your Service ID from Step 2
- `your_template_id_here` with your Template ID from Step 3
- `your_public_key_here` with your Public Key from Step 4

## Step 6: Install Dependencies

Run this command in the frontend directory:

```bash
npm install @emailjs/browser
```

## Step 7: Restart Development Server

After adding environment variables, restart your dev server:

```bash
npm run dev
```

## Testing

1. Fill out the contact form on your website
2. Submit the form
3. Check your Gmail inbox (`letscrackdev@gmail.com`)
4. You should receive the email!

## Troubleshooting

- **"Email service is not configured"**: Make sure all three environment variables are set in `.env`
- **"Failed to send message"**: Check that your EmailJS service is connected and template is saved
- **Emails not received**: Check spam folder, verify Gmail connection in EmailJS dashboard

## Free Tier Limits

- EmailJS free tier: 200 emails/month
- If you need more, consider upgrading to a paid plan

## Security Note

The Public Key is safe to expose in frontend code - it's designed to be public. However, make sure to set up rate limiting in EmailJS dashboard to prevent abuse.

