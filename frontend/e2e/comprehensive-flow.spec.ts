import { test, expect } from '@playwright/test'
import { 
  login, 
  clearAuthStorage, 
  waitForPageLoad, 
  navigateToCheckout, 
  applyCoupon,
  openLoginModal,
  search,
  toggleTheme,
  openChatbot
} from './utils/test-helpers'

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com'
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123'
const TEST_COUPON = process.env.TEST_COUPON_CODE || 'TEST20'

test.describe('Comprehensive User Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthStorage(page)
  })

  test('Complete user journey - Browse → Login → Checkout', async ({ page }) => {
    // 1. Start at home
    await page.goto('/')
    await waitForPageLoad(page)
    await expect(page).toHaveURL('/')

    // 2. Browse resources
    await page.click('a:has-text("Resources"), nav a[href*="/resources"]')
    await waitForPageLoad(page)
    await expect(page).toHaveURL(/\/resources/)

    // 3. Browse courses
    await page.click('a:has-text("Courses"), nav a[href*="/courses"]')
    await waitForPageLoad(page)
    await expect(page).toHaveURL(/\/courses/)

    // 4. Go to premium
    await page.click('a:has-text("Premium"), nav a[href*="/premium"]')
    await waitForPageLoad(page)
    await expect(page).toHaveURL(/\/premium/)

    // 5. Try to checkout (should trigger login)
    await navigateToCheckout(page, 'course', 'test-id', 1000)
    await page.waitForTimeout(2000)

    // 6. Login
    await openLoginModal(page)
    await login(page, TEST_EMAIL, TEST_PASSWORD)
    await page.waitForTimeout(2000)

    // 7. Should be on checkout page
    await expect(page).toHaveURL(/\/premium\/checkout/)

    // 8. Apply coupon
    const couponResult = await applyCoupon(page, TEST_COUPON)
    await page.waitForTimeout(1000)

    // 9. Verify checkout elements
    await expect(page.locator('text=/payment/i, text=/checkout/i').first()).toBeVisible()
  })

  test('Search and filter flow', async ({ page }) => {
    await page.goto('/resources')
    await waitForPageLoad(page)

    // Try search if available
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
    if (await searchInput.isVisible({ timeout: 3000 })) {
      await search(page, 'test')
      await page.waitForTimeout(1000)
    }

    // Try filters if available
    const filterButton = page.locator('button:has-text("Filter"), select').first()
    if (await filterButton.isVisible({ timeout: 3000 })) {
      await filterButton.click()
      await page.waitForTimeout(500)
    }
  })

  test('Theme and UI preferences', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    // Toggle theme
    await toggleTheme(page)
    await page.waitForTimeout(500)

    // Open chatbot
    await openChatbot(page)
    await page.waitForTimeout(500)

    // Close chatbot
    const closeButton = page.locator('button[aria-label*="close" i]').first()
    if (await closeButton.isVisible()) {
      await closeButton.click()
      await page.waitForTimeout(500)
    }
  })

  test('Navigation flow - all main pages', async ({ page }) => {
    const pages = [
      { name: 'Home', path: '/' },
      { name: 'Resources', path: '/resources' },
      { name: 'Courses', path: '/courses' },
      { name: 'Premium', path: '/premium' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ]

    for (const pageInfo of pages) {
      await page.goto(pageInfo.path)
      await waitForPageLoad(page)
      await expect(page).toHaveURL(new RegExp(pageInfo.path.replace('/', '\\/') + '(\\?.*)?$'))
    }
  })

  test('Authentication flow - signup to login', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)

    // Open signup modal
    const signupButton = page.locator('button:has-text("Sign Up"), a:has-text("Sign Up")').first()
    if (await signupButton.isVisible()) {
      await signupButton.click()
      await page.waitForTimeout(500)

      // Switch to login
      const switchToLogin = page.locator('a:has-text("Login"), button:has-text("Login")').first()
      if (await switchToLogin.isVisible()) {
        await switchToLogin.click()
        await page.waitForTimeout(500)
        await expect(page.locator('input[name="email"]')).toBeVisible()
      }
    }
  })

  test('Error handling - invalid routes', async ({ page }) => {
    // Test 404 handling
    await page.goto('/invalid-page-12345')
    await waitForPageLoad(page)

    // Should either show 404 or redirect
    const is404 = await page.locator('text=/404/i, text=/not found/i').isVisible().catch(() => false)
    const isRedirected = !page.url().includes('invalid-page')
    expect(is404 || isRedirected).toBeTruthy()
  })

  test('Form validation flow', async ({ page }) => {
    await page.goto('/login')
    await waitForPageLoad(page)

    // Try to submit empty form
    await page.click('button[type="submit"]')
    await page.waitForTimeout(1000)

    // Should show validation errors
    const emailInput = page.locator('input[name="email"]').first()
    const isRequired = await emailInput.evaluate((el: HTMLInputElement) => el.required || el.validity.valueMissing)
    expect(isRequired).toBeTruthy()
  })

  test('Mobile responsive flow', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await waitForPageLoad(page)

    // Check mobile menu
    const mobileMenuButton = page.locator('button[aria-label*="menu" i]').first()
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click()
      await page.waitForTimeout(500)
      // Menu should be open
      expect(await mobileMenuButton.isVisible()).toBeTruthy()
    }

    // Navigate
    await page.click('a:has-text("Resources")')
    await waitForPageLoad(page)
    await expect(page).toHaveURL(/\/resources/)
  })
})

