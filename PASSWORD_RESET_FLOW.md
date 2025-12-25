# Password Reset Flow Documentation

## Complete Flow: Backend to Frontend

### Overview
This document describes the complete password reset flow from when a user requests a password reset to when they successfully reset their password.

---

## Flow Diagram

```
User → Frontend (/forgot) 
  → API Call (POST /v1/auth/forgot-password)
  → Backend (forgotPassword controller)
  → Generate Token & Save to DB
  → Send Email (or log in dev)
  → User receives link
  → Frontend (/reset-password?token=...)
  → API Call (POST /v1/auth/reset-password)
  → Backend (resetPassword controller)
  → Validate Token & Update Password
  → Success
```

---

## Step-by-Step Flow

### Step 1: User Requests Password Reset

**Frontend:** `frontend/src/pages/Forgot.tsx`
- User enters email address
- Form validation (email format)
- Calls `forgotPassword(email)` API

**API Call:**
```typescript
POST /api/v1/auth/forgot-password
Body: { email: "user@example.com" }
```

**Backend:** `backend/src/modules/auth/auth.controller.ts` → `forgotPassword()`
1. Validates email format using Zod schema
2. Finds user by email (or returns success if not found - security)
3. Generates 32-byte random token
4. Hashes token with SHA-256
5. Sets expiration (1 hour from now)
6. Saves token hash and expiration to user document
7. Builds reset URL: `${FRONTEND_URL}/reset-password?token=${resetToken}`
8. Attempts to send email with reset link
9. Returns success response (includes resetUrl in dev mode)

**Response:**
```json
{
  "success": true,
  "data": {
    "resetUrl": "http://localhost:5173/reset-password?token=abc123..." // dev only
  },
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

**Database Changes:**
```javascript
User {
  passwordResetToken: "hashed_token_here",
  passwordResetExpires: Date (1 hour from now)
}
```

---

### Step 2: User Receives Reset Link

**Development Mode:**
- Reset link is logged to backend console
- Reset link is returned in API response
- Reset link is logged to browser console
- User can copy link from console

**Production Mode:**
- Reset link is sent via email (requires GMAIL_APP_PASSWORD)
- User clicks link in email

---

### Step 3: User Clicks Reset Link

**Frontend:** `frontend/src/pages/ResetPassword.tsx`
- URL: `/reset-password?token=abc123...`
- Extracts token from URL query parameter
- Validates token exists
- Shows reset password form

**Form Fields:**
- New Password (min 8 chars, must meet complexity requirements)
- Confirm Password (must match)

---

### Step 4: User Submits New Password

**Frontend Validation:**
- Password length >= 8 characters
- Passwords match
- Password complexity (handled by backend)

**API Call:**
```typescript
POST /api/v1/auth/reset-password
Body: {
  token: "abc123...",
  password: "NewPassword123!"
}
```

**Backend:** `backend/src/modules/auth/auth.controller.ts` → `resetPassword()`
1. Validates request body (token, password) using Zod schema
2. Validates password complexity:
   - Min 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character
3. Hashes the provided token with SHA-256
4. Finds user with matching token hash and valid expiration
5. If not found or expired → throws UnauthorizedError
6. Hashes new password with bcrypt (10 rounds)
7. Updates user passwordHash
8. Clears passwordResetToken and passwordResetExpires
9. Saves user
10. Returns success response

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Database Changes:**
```javascript
User {
  passwordHash: "new_bcrypt_hash",
  passwordResetToken: undefined,
  passwordResetExpires: undefined
}
```

---

### Step 5: User Can Now Login

- User can login with new password
- Old password no longer works
- Reset token is cleared (cannot be reused)

---

## Security Features

### 1. Token Security
- **Random Generation:** 32-byte cryptographically secure random token
- **Hashing:** Token is hashed (SHA-256) before storing in database
- **Expiration:** Token expires after 1 hour
- **One-time Use:** Token is cleared after successful reset

### 2. Email Privacy
- **No User Enumeration:** Returns same success message whether email exists or not
- **Secure Token:** Token is long and random, making brute force impractical

### 3. Password Requirements
- Minimum 8 characters
- Must contain uppercase, lowercase, number, and special character
- Passwords are hashed with bcrypt (10 rounds)

### 4. Rate Limiting
- Forgot password endpoint has rate limiting (configured in routes)
- Prevents abuse and email spam

---

## Error Scenarios

### Invalid Email Format
- **Frontend:** Shows validation error
- **Backend:** Returns ValidationError (400)

### Email Not Found
- **Backend:** Returns success (security - doesn't reveal if email exists)
- **Frontend:** Shows success message

### Invalid/Expired Token
- **Backend:** Returns UnauthorizedError (401)
- **Frontend:** Shows error, redirects to forgot password page

### Weak Password
- **Frontend:** Shows validation error
- **Backend:** Returns ValidationError with specific requirements

### Token Already Used
- **Backend:** Token is cleared after use, so reuse returns UnauthorizedError
- **Frontend:** Shows error, user must request new reset link

---

## Development vs Production

### Development Mode
- Email sending is optional (logs instead)
- Reset URL is returned in API response
- Reset URL is logged to console
- Useful for testing without email setup

### Production Mode
- Email sending is required
- Reset URL is NOT returned in API response
- User must check email for reset link
- Requires GMAIL_APP_PASSWORD environment variable

---

## Test Cases

### Backend Tests
Location: `backend/src/__tests__/modules/auth/password-reset.test.ts`

**Forgot Password Tests:**
- ✅ Generate reset token for valid email
- ✅ Return success for non-existent email (security)
- ✅ Throw ValidationError for invalid email
- ✅ Generate unique tokens for each request
- ✅ Set token expiration to 1 hour
- ✅ Attempt to send email

**Reset Password Tests:**
- ✅ Successfully reset password with valid token
- ✅ Throw UnauthorizedError for invalid token
- ✅ Throw UnauthorizedError for expired token
- ✅ Throw ValidationError for weak password
- ✅ Clear reset token after successful reset
- ✅ Prevent token reuse
- ✅ Hash new password before saving

**Integration Tests:**
- ✅ Complete flow from forgot to reset

### Frontend Tests
Location: `frontend/src/__tests__/pages/Forgot.test.tsx` and `ResetPassword.test.tsx`

**Forgot Password Page Tests:**
- ✅ Render form correctly
- ✅ Show error for empty email
- ✅ Call API on submit
- ✅ Show success message
- ✅ Show reset URL in dev mode
- ✅ Handle API errors
- ✅ Disable form during submission

**Reset Password Page Tests:**
- ✅ Render form with valid token
- ✅ Redirect if token missing
- ✅ Validate password length
- ✅ Validate password match
- ✅ Call API on submit
- ✅ Show success screen
- ✅ Handle API errors
- ✅ Disable form during submission

---

## Running Tests

### Backend Tests
```bash
cd backend
npm test password-reset.test.ts
```

### Frontend Tests
```bash
cd frontend
npm test Forgot.test.tsx
npm test ResetPassword.test.tsx
```

---

## API Endpoints

### POST /api/v1/auth/forgot-password
**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resetUrl": "http://localhost:5173/reset-password?token=..." // dev only
  },
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

### POST /api/v1/auth/reset-password
**Request:**
```json
{
  "token": "abc123...",
  "password": "NewPassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## Environment Variables

### Required for Production
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
FRONTEND_URL=https://your-frontend-domain.com
```

### Development
```env
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## Troubleshooting

### Email Not Sending
- Check GMAIL_APP_PASSWORD is set
- Check GMAIL_USER is set
- In development, check console for reset link

### Token Invalid/Expired
- Token expires after 1 hour
- Token can only be used once
- Request a new reset link

### Password Validation Failing
- Must be at least 8 characters
- Must contain: uppercase, lowercase, number, special character
- Check error message for specific requirements

---

## Files Involved

### Backend
- `backend/src/modules/auth/auth.controller.ts` - Controller logic
- `backend/src/modules/auth/auth.schema.ts` - Validation schemas
- `backend/src/modules/auth/auth.routes.ts` - Route definitions
- `backend/src/modules/auth/user.model.ts` - User model with reset fields
- `backend/src/utils/email.ts` - Email sending utility

### Frontend
- `frontend/src/pages/Forgot.tsx` - Forgot password page
- `frontend/src/pages/ResetPassword.tsx` - Reset password page
- `frontend/src/lib/api/auth.api.ts` - API service functions

### Tests
- `backend/src/__tests__/modules/auth/password-reset.test.ts` - Backend tests
- `frontend/src/__tests__/pages/Forgot.test.tsx` - Frontend forgot tests
- `frontend/src/__tests__/pages/ResetPassword.test.tsx` - Frontend reset tests

