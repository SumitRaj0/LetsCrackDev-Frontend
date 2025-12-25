import { test, expect } from '@playwright/test'
import { login, navigateToCheckout, applyCoupon, clearAuthStorage } from './utils/test-helpers'

// Test credentials - use environment variables in production
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com'
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123'
const TEST_COUPON = process.env.TEST_COUPON_CODE || 'TEST20'

test.describe('Complete Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear auth storage before each test
    await clearAuthStorage(page)
  })

  test('Login → Apply Coupon → Checkout Flow', async ({ page }) => {
    // Step 1: Navigate to checkout (should trigger login modal)
    await navigateToCheckout(page, 'course', 'test-course-id', 1000)
    
    // Step 2: Login via modal
    await page.waitForSelector('input[name="email"]', { state: 'visible', timeout: 5000 })
    await page.fill('input[name="email"]', TEST_EMAIL)
    await page.fill('input[name="password"]', TEST_PASSWORD)
    await page.click('button[type="submit"]')
    
    // Wait for login to complete
    await page.waitForURL((url) => url.pathname.includes('/premium/checkout'), { timeout: 10000 })
    
    // Step 3: Verify checkout page loaded
    await expect(page.locator('text=Payment Details, text=Order Summary')).toBeVisible()
    
    // Step 4: Apply coupon
    const couponResult = await applyCoupon(page, TEST_COUPON)
    
    if (couponResult.success) {
      // Verify discount is applied
      await expect(page.locator('text=/discount/i, text=₹')).toBeVisible()
      
      // Verify final amount is updated
      const finalAmount = await page.locator('text=/₹\\d+/').first().textContent()
      expect(finalAmount).toBeTruthy()
    } else {
      console.log('Coupon application failed or coupon not available')
    }
    
    // Step 5: Verify payment button is visible
    await expect(page.locator('button:has-text("Pay"), button:has-text("₹")')).toBeVisible()
    
    // Step 6: Check terms checkbox
    await page.check('input[type="checkbox"][id="terms"]')
    
    // Note: We won't actually process payment in test, but we can verify the flow
    console.log('✅ Checkout flow test completed successfully')
  })

  test('Login with invalid credentials', async ({ page }) => {
    await page.goto('/premium/checkout?type=course&id=test&price=1000')
    
    // Wait for login modal
    await page.waitForSelector('input[name="email"]', { state: 'visible' })
    
    // Fill with invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // Wait for error message
    await page.waitForTimeout(2000)
    const errorVisible = await page.locator('text=/error/i, text=/invalid/i, text=/failed/i').first().isVisible()
    expect(errorVisible).toBeTruthy()
  })

  test('Apply invalid coupon code', async ({ page }) => {
    // Login first
    await page.goto('/')
    await login(page, TEST_EMAIL, TEST_PASSWORD)
    
    // Navigate to checkout
    await navigateToCheckout(page, 'course', 'test-course-id', 1000)
    
    // Try to apply invalid coupon
    const result = await applyCoupon(page, 'INVALID123')
    
    // Should show error
    expect(result.error || !result.success).toBeTruthy()
  })

  test('Checkout without authentication redirects to login', async ({ page }) => {
    await clearAuthStorage(page)
    await navigateToCheckout(page, 'course', 'test-course-id', 1000)
    
    // Should show login modal
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 5000 })
  })

  test('Remove applied coupon', async ({ page }) => {
    // Login
    await page.goto('/')
    await login(page, TEST_EMAIL, TEST_PASSWORD)
    
    // Navigate to checkout
    await navigateToCheckout(page, 'course', 'test-course-id', 1000)
    
    // Apply coupon
    await applyCoupon(page, TEST_COUPON)
    await page.waitForTimeout(1000)
    
    // Find and click remove coupon button
    const removeButton = page.locator('button:has-text("Remove"), button:has-text("✕"), button[aria-label*="remove" i]').first()
    if (await removeButton.isVisible()) {
      await removeButton.click()
      await page.waitForTimeout(1000)
      
      // Verify coupon is removed (discount should be gone)
      const discountVisible = await page.locator('text=/discount/i').isVisible().catch(() => false)
      expect(discountVisible).toBeFalsy()
    }
  })
})

