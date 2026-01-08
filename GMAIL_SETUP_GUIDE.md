# Gmail Setup Guide for Password Reset Emails

Since Gmail offers **unlimited emails**, it's perfect if you don't want to worry about monthly limits!

## ✅ What You Need

- ✅ Gmail account (any Gmail address)
- ✅ 2-Step Verification enabled
- ✅ App Password (we'll create this)

## 🚀 Setup Steps (10 minutes)

### Step 1: Enable 2-Step Verification

**This is required** to generate an App Password.

1. **Go to Google Account Security**
   - Visit: [https://myaccount.google.com/security](https://myaccount.google.com/security)
   - Or: Google Account → Security

2. **Enable 2-Step Verification**
   - Find **"2-Step Verification"** section
   - Click **"Get Started"** or **"Turn On"**
   - Follow the prompts:
     - Enter your password
     - Choose verification method (Phone number recommended)
     - Enter verification code sent to your phone
     - Click **"Turn On"**

### Step 2: Generate App Password

1. **Go Back to Security Settings**
   - Visit: [https://myaccount.google.com/security](https://myaccount.google.com/security)
   - Find **"2-Step Verification"** section again

2. **Open App Passwords**
   - Scroll down in the 2-Step Verification page
   - Click **"App passwords"** (or visit directly: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords))
   
   **Note:** If you don't see "App passwords":
   - Make sure 2-Step Verification is enabled
   - You may need to sign in again
   - Try refreshing the page

3. **Create App Password**
   - Select app: **"Mail"**
   - Select device: **"Other (Custom name)"**
   - Enter name: `LetsCrackDev Backend`
   - Click **"Generate"**

4. **Copy the App Password**
   - A 16-character password will appear
   - **Copy it immediately!** (You won't see it again)
   - Format: `xxxx xxxx xxxx xxxx` (spaces will be removed automatically)

### Step 3: Add to Backend Environment Variables

Add these to your `backend/.env` file:

```env
# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

**Important:**
- Use your actual Gmail address for `GMAIL_USER`
- Paste the 16-character App Password (spaces are okay, they'll be ignored)
- Example: `GMAIL_APP_PASSWORD=abcd efgh ijkl mnop` or `GMAIL_APP_PASSWORD=abcdefghijklmnop`

### Step 4: Restart Backend Server

```bash
cd backend
npm run dev
```

## ✅ That's It!

Your password reset emails will now be sent via Gmail with unlimited sending capacity!

## 🧪 Test It

1. **Start your backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Request password reset:**
   - Go to forgot password page
   - Enter a test email
   - Submit

3. **Check the email:**
   - Check inbox (and spam folder)
   - Email will be from: `"LetsCrackDev" <your-email@gmail.com>`

## 📋 How It Works

1. User requests password reset
2. Backend generates reset token
3. Backend sends email via Gmail SMTP
4. Gmail delivers email to user
5. User clicks reset link in email
6. Password reset complete!

## 🔍 Troubleshooting

### "Invalid login" or "Authentication failed" Error

**Causes:**
- Wrong App Password (make sure you copied it correctly)
- Using regular Gmail password instead of App Password
- App Password has spaces that weren't handled correctly

**Solution:**
1. Generate a new App Password
2. Copy it carefully (all 16 characters)
3. Paste into `.env` file (spaces are okay)
4. Restart backend server

### "Less secure app access" Error

**You don't need to enable this!**
- App Passwords work differently
- Just use the App Password, not your regular password
- Make sure 2-Step Verification is enabled

### "App passwords" Option Not Showing

**Causes:**
- 2-Step Verification not enabled
- Using a Google Workspace account (may have restrictions)
- Account not fully verified

**Solution:**
1. Make sure 2-Step Verification is **fully enabled** and working
2. Try refreshing the security page
3. Sign out and sign back in
4. Use a regular Gmail account (not Workspace) if possible

### Emails Going to Spam

**Solution:**
1. Ask users to check spam folder
2. Ask users to mark as "Not Spam"
3. After a few emails, spam filters learn it's legitimate
4. Consider using a custom domain email in the future

### "Connection timeout" Error

**Causes:**
- Network/firewall blocking SMTP
- Incorrect SMTP settings

**Solution:**
- Make sure port 587 is not blocked
- Check firewall settings
- Verify internet connection

## 💡 Pro Tips

1. **Use a Dedicated Gmail Account** (Optional)
   - Create a separate Gmail just for your app
   - Example: `noreply@letscrackdev.gmail.com` (use your own)
   - Better for organization and security

2. **Monitor Email Activity**
   - Check Gmail account for sent emails
   - Verify emails are being delivered
   - Check spam reports

3. **Rate Limits**
   - Gmail has rate limits: ~500 emails per day for new accounts
   - Established accounts: up to 2,000 emails per day
   - For higher volume, consider using a transactional email service

4. **Security**
   - Never commit `.env` file to git
   - Keep App Password secret
   - If compromised, revoke and create a new one

## 🔐 Security Best Practices

1. **App Password vs Regular Password**
   - ✅ Use App Password (secure, can be revoked)
   - ❌ Never use your regular Gmail password

2. **If App Password is Compromised**
   - Go to App Passwords
   - Find the compromised password
   - Click "Revoke"
   - Generate a new one

3. **Environment Variables**
   - Never share `.env` file
   - Never commit to version control
   - Use different passwords for development/production

## 📊 Gmail Limits

| Feature | Limit |
|---------|-------|
| **New Accounts** | ~500 emails/day |
| **Established Accounts** | ~2,000 emails/day |
| **Monthly** | Unlimited (within daily limits) |
| **Recipients per email** | 500 (for password reset, you send to 1) |

For password resets, these limits are more than enough!

## ✅ Verification Checklist

- [ ] 2-Step Verification enabled
- [ ] App Password generated
- [ ] App Password copied (16 characters)
- [ ] `GMAIL_USER` set in `.env`
- [ ] `GMAIL_APP_PASSWORD` set in `.env`
- [ ] Backend server restarted
- [ ] Test email sent successfully

## 🆚 Gmail vs Other Services

| Feature | Gmail | Resend | Brevo |
|---------|-------|--------|-------|
| **Setup Time** | 10 min | 5 min | 10 min |
| **Monthly Limit** | Unlimited* | 3,000 | 9,000 |
| **Daily Limit** | 500-2000 | Unlimited | 300 |
| **Deliverability** | Good | Excellent | Good |
| **Best For** | Unlimited needs | Easy setup | High volume |

*Within daily sending limits (500-2000/day)

---

## 🎯 Quick Command to Test Configuration

Run this to verify your Gmail setup:

```bash
cd backend
node -e "require('dotenv').config(); console.log('GMAIL_USER:', process.env.GMAIL_USER || 'NOT SET'); console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'SET (' + process.env.GMAIL_APP_PASSWORD.length + ' chars)' : 'NOT SET');"
```

You should see:
```
GMAIL_USER: your-email@gmail.com
GMAIL_APP_PASSWORD: SET (16 chars)
```

---

**That's it! You're all set! 🎉**

Your password reset emails will now be sent via Gmail with unlimited capacity (within daily limits). No monthly quotas to worry about!
