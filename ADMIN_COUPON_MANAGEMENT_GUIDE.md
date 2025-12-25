# Admin Coupon Management Guide

## 📍 How to Access Coupon Management

1. **Log in as Admin** - You must have admin role
2. **Go to Admin Dashboard** - Navigate to `/admin` or click "Admin" in the navigation
3. **Click "Manage Coupons"** - You'll see a card with 🎫 icon
4. **Or directly go to** - `/admin/coupons`

## ➕ How to Create a New Coupon

### Step 1: Open Create Coupon Modal
- On the Coupon Management page, click the **"+ Create Coupon"** button (top right)

### Step 2: Fill in Coupon Details

#### Required Fields:
- **Coupon Code** (e.g., `SUMMER20`, `WELCOME10`)
  - Must be unique
  - Will be automatically converted to UPPERCASE
  - Cannot be changed after creation

- **Discount Type**
  - **Percentage (%)** - e.g., 20% off
  - **Fixed Amount (₹)** - e.g., ₹100 off

- **Discount Value**
  - For percentage: 0-100 (e.g., 20 for 20%)
  - For fixed: Any positive number (e.g., 100 for ₹100)

- **Valid From** - Start date (when coupon becomes active)
- **Valid Until** - End date (when coupon expires)

#### Optional Fields:
- **Min Purchase Amount (₹)** - Minimum order value required
  - Example: If set to ₹500, coupon only works for orders ≥ ₹500

- **Max Discount Amount (₹)** - Maximum discount cap (for percentage coupons)
  - Example: 50% off with max ₹200 means:
    - Order ₹1000 → ₹500 discount (but capped at ₹200) = ₹800 final
    - Order ₹200 → ₹100 discount (within cap) = ₹100 final

- **Usage Limit** - Total times coupon can be used
  - Example: 100 means only 100 people can use it
  - Leave empty for unlimited

- **User Limit** - Max times a single user can use this coupon
  - Example: 2 means each user can use it maximum 2 times
  - Leave empty for unlimited per user

- **Applicable To**
  - **All Items** - Works for both courses and services
  - **Courses Only** - Only valid for course purchases
  - **Services Only** - Only valid for service purchases

- **Description** - Optional note about the coupon

- **Active Status** - Checkbox to enable/disable coupon
  - Unchecked = Coupon exists but cannot be used

### Step 3: Save
- Click **"Create Coupon"** button
- You'll see a success message
- The coupon will appear in the list

## 🗑️ How to Delete/Remove a Coupon

### Method 1: Delete from List
1. Go to Coupon Management page (`/admin/coupons`)
2. Find the coupon you want to delete
3. Click the **"Delete"** button (red button in Actions column)
4. Confirm the deletion in the popup
5. Coupon will be permanently removed

### Method 2: Deactivate Instead of Delete
If you want to keep the coupon for records but prevent usage:
1. Click **"Edit"** on the coupon
2. Uncheck **"Active"** checkbox
3. Click **"Update Coupon"**
4. Coupon will remain but won't be usable

## ✏️ How to Edit a Coupon

1. Go to Coupon Management page
2. Find the coupon you want to edit
3. Click **"Edit"** button
4. Modify the fields (Note: Code cannot be changed)
5. Click **"Update Coupon"**

## 📊 Understanding the Coupon List

The coupon table shows:
- **Code** - The coupon code users enter
- **Discount** - Discount amount/percentage
- **Validity** - Date range with status badges:
  - 🟢 **Active** - Currently valid
  - 🔴 **Expired** - Past end date
  - 🔵 **Upcoming** - Not yet started
- **Usage** - Current usage / Limit (with progress bar)
- **Applicable To** - What items it works for
- **Status** - Active/Inactive toggle
- **Actions** - Edit/Delete buttons

## 🎯 Best Practices & Standards

### Coupon Code Naming
- Use descriptive codes: `SUMMER2024`, `BLACKFRIDAY`, `WELCOME10`
- Keep it short (3-10 characters recommended)
- Use uppercase letters and numbers
- Avoid special characters

### Discount Strategy
- **Percentage discounts** work best for:
  - Seasonal sales (20-50% off)
  - Clearance events
  - New user welcome (10-20% off)

- **Fixed discounts** work best for:
  - Small incentives (₹50-₹200 off)
  - Minimum purchase rewards
  - Specific price points

### Validity Periods
- **Short-term** (1-7 days): Flash sales, limited offers
- **Medium-term** (1-4 weeks): Seasonal promotions
- **Long-term** (1-6 months): Welcome coupons, loyalty programs

### Usage Limits
- **Limited usage** (10-100): Creates urgency, prevents abuse
- **Unlimited**: Good for general promotions, welcome offers
- **User limit**: Prevents single-user abuse (recommended: 1-3 uses)

### Minimum Purchase Amount
- Set minimums to:
  - Encourage larger orders
  - Cover discount costs
  - Example: ₹500 min for 20% off ensures at least ₹100 order value

### Maximum Discount Cap
- Always set for high percentage discounts
- Example: 50% off with ₹500 max prevents giving away too much on large orders

## 📋 Common Coupon Examples

### Welcome Coupon
```
Code: WELCOME10
Type: Percentage
Value: 10%
Min Purchase: ₹0
Usage Limit: Unlimited
User Limit: 1
Valid: 30 days
Applicable: All Items
```

### Flash Sale Coupon
```
Code: FLASH50
Type: Percentage
Value: 50%
Max Discount: ₹500
Min Purchase: ₹1000
Usage Limit: 100
User Limit: 1
Valid: 24 hours
Applicable: All Items
```

### Course-Specific Coupon
```
Code: COURSE20
Type: Percentage
Value: 20%
Min Purchase: ₹500
Usage Limit: Unlimited
User Limit: 2
Valid: 1 month
Applicable: Courses Only
```

## ⚠️ Important Notes

1. **Coupon codes are case-insensitive** - Users can enter `summer20` or `SUMMER20`
2. **Codes cannot be changed** after creation (to prevent confusion)
3. **Deleting is permanent** - Consider deactivating instead
4. **Expired coupons** are automatically invalid (no need to delete)
5. **Usage tracking** - System tracks how many times each coupon is used
6. **User tracking** - System tracks per-user usage for user limits

## 🔍 Filtering & Search

- **Search** - Type in search box to find by code or description
- **Status Filter**:
  - **All** - Shows all coupons
  - **Active** - Only active coupons
  - **Inactive** - Only deactivated coupons

## 🚨 Troubleshooting

### Coupon not working for users?
1. Check if coupon is **Active** (green badge)
2. Check **Valid From/Until** dates
3. Check **Usage Limit** - might be reached
4. Check **Applicable To** - matches purchase type?
5. Check **Min Purchase Amount** - order meets minimum?

### Can't delete coupon?
- Make sure you're logged in as admin
- Check browser console for errors
- Try refreshing the page

### Coupon code already exists?
- Each code must be unique
- Try a variation: `SUMMER20` → `SUMMER2024`

## 📱 Quick Access

- **Admin Dashboard**: `/admin`
- **Coupon Management**: `/admin/coupons`
- **Create Coupon**: Click "+ Create Coupon" button

---

**Need Help?** Check the browser console (F12) for detailed error messages if something doesn't work.

