# E2E Testing with Playwright

This directory contains end-to-end (E2E) tests for the LetsCrackDev application, covering the complete user flow from login to checkout.

## Setup

1. **Install dependencies** (already done):
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```

2. **Configure test credentials**:
   - Copy `.env.test.example` to `.env.test` (if needed)
   - Update with your test user credentials and coupon codes

## Running Tests

### Basic Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests step-by-step
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### Test Files

- `checkout-flow.spec.ts` - Main test file covering:
  - Login flow
  - Coupon application
  - Checkout process
  - Error handling

## Test Scenarios

### 1. Complete Checkout Flow
Tests the full user journey:
- Navigate to checkout (triggers login modal)
- Login with valid credentials
- Apply coupon code
- Verify discount calculation
- Check payment button availability

### 2. Invalid Login
Tests error handling for:
- Invalid email/password
- Error message display

### 3. Invalid Coupon
Tests coupon validation:
- Invalid coupon code rejection
- Error message display

### 4. Authentication Check
Tests protected routes:
- Redirect to login when not authenticated
- Login modal appearance

### 5. Coupon Removal
Tests coupon management:
- Apply coupon
- Remove coupon
- Verify discount removal

## Test Utilities

Located in `utils/test-helpers.ts`:

- `login()` - Helper to login with credentials
- `navigateToCheckout()` - Navigate to checkout page
- `applyCoupon()` - Apply coupon code
- `clearAuthStorage()` - Clear authentication storage
- `isAuthenticated()` - Check authentication status

## Configuration

Test configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:5173` (default)
- **Browsers**: Chromium, Firefox, WebKit
- **Retries**: 2 retries on CI
- **Screenshots**: On failure
- **Videos**: Retained on failure
- **Traces**: On first retry

## Environment Variables

Set these in your environment or `.env.test`:

```env
PLAYWRIGHT_TEST_BASE_URL=http://localhost:5173
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123
TEST_COUPON_CODE=TEST20
```

## CI/CD Integration

Tests can be integrated into CI/CD pipelines. The configuration includes:
- Automatic retries on CI
- HTML report generation
- Screenshot and video capture on failures

## Troubleshooting

### Tests fail to start
- Ensure dev server is running: `npm run dev`
- Check base URL in `playwright.config.ts`
- Verify test credentials are correct

### Login fails
- Check test user exists in database
- Verify credentials in environment variables
- Check network requests in browser console

### Coupon tests fail
- Ensure test coupon exists in database
- Verify coupon is active and not expired
- Check coupon validation API endpoint

## Best Practices

1. **Isolation**: Each test clears auth storage before running
2. **Wait for elements**: Tests use proper wait strategies
3. **Error handling**: Tests verify error messages
4. **Realistic data**: Use actual test data from your database

## Next Steps

- Add more test scenarios
- Test mobile viewports
- Add visual regression tests
- Integrate with CI/CD pipeline

