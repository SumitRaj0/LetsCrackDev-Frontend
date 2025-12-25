# Fix: Auto-Reply Recipient Address Empty

## The Problem
The auto-reply email shows "recipients address is empty" because EmailJS needs the "To Email" field configured in the template settings.

## Solution: Configure EmailJS Template Settings

### Step 1: Go to EmailJS Dashboard
1. Visit [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Go to **Email Templates**
3. Find your **Auto-Reply template** (the one with `VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID`)

### Step 2: Configure "To Email" Field
1. Click on your auto-reply template to edit it
2. Find the **"To Email"** field in the template settings (usually at the top)
3. Set it to one of these options:

**Option 1 (Recommended):**
```
{{to_email}}
```

**Option 2 (Alternative):**
```
{{reply_to}}
```

**Option 3 (Alternative):**
```
{{user_email}}
```

4. **Save** the template

### Step 3: Verify Template Variables
Make sure your template HTML uses these variables:
- `{{to_name}}` - User's name
- `{{to_email}}` or `{{reply_to}}` or `{{user_email}}` - User's email (must match what you set in "To Email")
- `{{subject}}` - Original subject

### Step 4: Test
1. Submit a test contact form
2. Check that the auto-reply is sent to the user's email address

## Important Notes

- The **"To Email"** field in EmailJS template settings is **required** - it cannot be empty
- The variable name in "To Email" must match what you pass in the code
- The code now passes multiple parameter names (`to_email`, `reply_to`, `user_email`) to ensure compatibility
- If "To Email" is empty or not set, EmailJS will show "recipients address is empty" error

## Current Code Implementation

The code now passes these parameters:
```javascript
{
  to_name: data.name,
  reply_to: data.email,
  user_email: data.email,
  to_email: data.email,
  subject: data.subject,
  from_name: data.name,
  from_email: data.email,
}
```

So you can use **any** of these in your EmailJS "To Email" field:
- `{{to_email}}` ✅
- `{{reply_to}}` ✅
- `{{user_email}}` ✅

## Quick Fix Checklist

- [ ] Go to EmailJS Dashboard → Email Templates
- [ ] Open your auto-reply template
- [ ] Set "To Email" field to `{{to_email}}` (or `{{reply_to}}` or `{{user_email}}`)
- [ ] Save the template
- [ ] Test by submitting the contact form
- [ ] Verify auto-reply is received at the user's email

That's it! The recipient address should now work correctly.

