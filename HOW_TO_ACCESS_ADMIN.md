# How to Access Admin Dashboard

## ✅ Your Account Status

Your account (`sumitoffical@gmail.com`) is **already set as admin** in the database.

## 🔄 How to See Admin Options

### Step 1: Refresh Your Browser
1. **Log out** (if currently logged in)
2. **Log back in** with `sumitoffical@gmail.com`
3. This will fetch your admin role from the server

### Step 2: Access Admin Dashboard

**Option A: Via Profile Dropdown (Recommended)**
1. Click on your **profile picture/avatar** in the top right
2. Look for **"Admin Dashboard"** link in the dropdown menu
3. Click it to go to `/admin`

**Option B: Direct URL**
- Simply navigate to: `/admin` or `https://your-domain.com/admin`
- You'll see the Admin Dashboard with all management options

**Option C: From Admin Dashboard**
- Once on `/admin`, you'll see cards for:
  - 🎫 **Manage Coupons** - Click this to go to `/admin/coupons`

## 🎫 Accessing Coupon Management

Once you're on the Admin Dashboard (`/admin`):

1. Look for the **"Manage Coupons"** card (with 🎫 icon)
2. Click on it
3. You'll be taken to `/admin/coupons`
4. Click **"+ Create Coupon"** to create new coupons
5. Click **"Delete"** on any coupon to remove it

## 🔍 Troubleshooting

### If you don't see "Admin Dashboard" in profile dropdown:

1. **Clear browser cache and cookies**
2. **Log out completely**
3. **Log back in**
4. The admin link should appear

### If you get "Access Denied" when going to `/admin`:

1. Make sure you're logged in with `sumitoffical@gmail.com`
2. Try refreshing the page (F5)
3. Check browser console (F12) for any errors

### If role is not updating:

The system fetches your role when you:
- Log in
- Refresh the page
- Navigate to a protected route

If it's still not working, you may need to:
1. Clear localStorage: Open browser console (F12) → Application tab → Local Storage → Clear
2. Log out and log back in

## 📝 Quick Commands (For Developers)

If you need to make someone admin via command line:

```bash
cd backend
npm run make-admin user@example.com
```

## 🎯 Direct Links

- **Admin Dashboard**: `/admin`
- **Coupon Management**: `/admin/coupons`
- **User Management**: `/admin/users`
- **Course Management**: `/admin/courses`
- **Resource Management**: `/admin/resources`

---

**Note**: The admin link in the profile dropdown only appears for users with `role: 'admin'`. Since your account is already admin, just refresh your session to see it!

