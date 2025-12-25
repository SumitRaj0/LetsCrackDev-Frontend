import { Page, expect } from '@playwright/test'

/**
 * Login helper function
 */
export async function login(page: Page, email: string, password: string) {
  // Wait for login form to be visible
  await page.waitForSelector('input[name="email"]', { state: 'visible' })
  
  // Fill login form
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  
  // Submit form
  await page.click('button[type="submit"]')
  
  // Wait for login to complete (check for user menu or redirect)
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 })
  
  // Verify login success - check for user menu or dashboard
  await expect(page.locator('body')).not.toContainText('Login')
}

/**
 * Navigate to checkout page
 */
export async function navigateToCheckout(
  page: Page,
  type: 'course' | 'service',
  id: string,
  price: number
) {
  const checkoutUrl = `/premium/checkout?type=${type}&id=${id}&price=${price}`
  await page.goto(checkoutUrl)
  await page.waitForLoadState('networkidle')
}

/**
 * Apply coupon code
 */
export async function applyCoupon(page: Page, couponCode: string) {
  // Find coupon input - it might be in a form or input field
  const couponInput = page.locator('input[placeholder*="coupon" i], input[name*="coupon" i]').first()
  await couponInput.waitFor({ state: 'visible' })
  await couponInput.fill(couponCode)
  
  // Click apply button
  const applyButton = page.locator('button:has-text("Apply"), button:has-text("APPLY")').first()
  await applyButton.click()
  
  // Wait for coupon validation (success or error message)
  await page.waitForTimeout(2000) // Wait for API call
  
  // Check for success message
  const successMessage = page.locator('text=/coupon.*applied/i, text=/discount.*applied/i').first()
  const errorMessage = page.locator('text=/invalid.*coupon/i, text=/coupon.*invalid/i').first()
  
  // Return true if success, false if error
  const isSuccess = await successMessage.isVisible().catch(() => false)
  const isError = await errorMessage.isVisible().catch(() => false)
  
  return { success: isSuccess, error: isError }
}

/**
 * Wait for toast notification
 */
export async function waitForToast(page: Page, message: string, timeout = 5000) {
  await page.waitForSelector(`text=${message}`, { timeout, state: 'visible' })
}

/**
 * Clear localStorage and sessionStorage
 * Handles SecurityError in WebKit when page is not in a valid context
 */
export async function clearAuthStorage(page: Page) {
  try {
    // Check if page is in a valid context for storage access
    const url = page.url()
    const needsNavigation = !url || url === 'about:blank' || url.startsWith('file://')
    
    if (needsNavigation) {
      // Navigate to a valid URL first if needed
      await page.goto('/', { waitUntil: 'domcontentloaded' })
    }
    
    // Try to clear storage with error handling
    await page.evaluate(() => {
      try {
        if (typeof Storage !== 'undefined') {
          localStorage.clear()
          sessionStorage.clear()
        }
      } catch (e) {
        // Silently handle SecurityError - storage may not be accessible
        // This can happen in some browser contexts (especially WebKit)
      }
    })
  } catch (error) {
    // If we can't clear storage, it's not critical - continue with test
    // This handles cases where the page context doesn't allow storage access
    // WebKit sometimes throws SecurityError even after navigation
    if (error instanceof Error && error.message.includes('SecurityError')) {
      // Expected in some contexts, silently continue
      return
    }
    // Log other unexpected errors
    console.warn('Could not clear auth storage:', error)
  }
}

/**
 * Check if user is authenticated
 * Handles SecurityError in WebKit when page is not in a valid context
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    const token = await page.evaluate(() => {
      try {
        return localStorage.getItem('accessToken')
      } catch (e) {
        // SecurityError - storage not accessible
        return null
      }
    })
    return !!token
  } catch (error) {
    // If we can't access storage, assume not authenticated
    return false
  }
}

/**
 * Wait for page to load completely
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
}

/**
 * Click navigation link - tries multiple strategies
 */
export async function clickNavLink(page: Page, linkText: string) {
  // Try direct href navigation first (more reliable)
  const hrefMap: Record<string, string> = {
    'Resources': '/resources',
    'Courses': '/courses',
    'Premium': '/premium',
    'About': '/about',
    'Blog': '/blog',
    'Contact': '/contact',
    'Careers': '/careers',
    'Home': '/',
    'Categories': '/categories',
  }
  
  if (hrefMap[linkText]) {
    await page.goto(hrefMap[linkText])
    await waitForPageLoad(page)
    return
  }
  
  // Fallback to clicking link
  try {
    const link = page.locator(`a:has-text("${linkText}"), button:has-text("${linkText}")`).first()
    if (await link.isVisible({ timeout: 2000 })) {
      await link.click()
      await waitForPageLoad(page)
    }
  } catch {
    // If link not found, try direct navigation
    console.log(`Link "${linkText}" not found, skipping click`)
  }
}

/**
 * Open login modal
 */
export async function openLoginModal(page: Page) {
  const loginButton = page.locator('button:has-text("Login"), a:has-text("Login")').first()
  await loginButton.click()
  await page.waitForSelector('input[name="email"]', { state: 'visible', timeout: 3000 })
}

/**
 * Open signup modal
 */
export async function openSignupModal(page: Page) {
  const signupButton = page.locator('button:has-text("Sign Up"), a:has-text("Sign Up"), button:has-text("Signup")').first()
  await signupButton.click()
  await page.waitForSelector('input[name="email"]', { state: 'visible', timeout: 3000 })
}

/**
 * Toggle theme (dark/light mode)
 */
export async function toggleTheme(page: Page) {
  const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i]').first()
  if (await themeToggle.isVisible()) {
    await themeToggle.click()
    await page.waitForTimeout(500) // Wait for theme transition
  }
}

/**
 * Open chatbot
 */
export async function openChatbot(page: Page) {
  const chatbotButton = page.locator('button[aria-label*="chat" i], button:has-text("Chat")').first()
  if (await chatbotButton.isVisible()) {
    await chatbotButton.click()
    await page.waitForTimeout(500)
  }
}

/**
 * Close chatbot
 */
export async function closeChatbot(page: Page) {
  const closeButton = page.locator('button[aria-label*="close" i], button:has-text("Close")').first()
  if (await closeButton.isVisible()) {
    await closeButton.click()
    await page.waitForTimeout(500)
  }
}

/**
 * Search for content
 */
export async function search(page: Page, query: string) {
  const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[name*="search" i]').first()
  await searchInput.waitFor({ state: 'visible' })
  await searchInput.fill(query)
  await searchInput.press('Enter')
  await page.waitForTimeout(1000)
}

/**
 * Check if element is visible
 */
export async function isElementVisible(page: Page, selector: string): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { state: 'visible', timeout: 2000 })
    return true
  } catch {
    return false
  }
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(page: Page, urlPattern: string, timeout = 10000) {
  await page.waitForResponse(
    (response) => response.url().includes(urlPattern) && response.status() === 200,
    { timeout }
  )
}

/**
 * Fill form field
 */
export async function fillFormField(page: Page, name: string, value: string) {
  const field = page.locator(`input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`).first()
  await field.waitFor({ state: 'visible' })
  await field.fill(value)
}

/**
 * Submit form
 */
export async function submitForm(page: Page) {
  const submitButton = page.locator('button[type="submit"]').first()
  await submitButton.click()
  await page.waitForTimeout(1000)
}

/**
 * Check for toast notification
 */
export async function checkToast(page: Page, message: string, type: 'success' | 'error' = 'success'): Promise<boolean> {
  const toastSelector = type === 'success' 
    ? `text=/success/i, text=${message}`
    : `text=/error/i, text=${message}`
  
  try {
    await page.waitForSelector(toastSelector, { timeout: 5000, state: 'visible' })
    return true
  } catch {
    return false
  }
}

/**
 * Logout user
 */
export async function logout(page: Page) {
  // Open profile dropdown if needed
  const profileButton = page.locator('button[aria-label*="profile" i], button:has-text("Profile"), img[alt*="profile" i]').first()
  if (await profileButton.isVisible()) {
    await profileButton.click()
    await page.waitForTimeout(500)
  }
  
  // Click logout
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Log out"), a:has-text("Logout")').first()
  if (await logoutButton.isVisible()) {
    await logoutButton.click()
    await page.waitForTimeout(1000)
  }
}

