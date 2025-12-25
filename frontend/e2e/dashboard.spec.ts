import { test, expect } from '@playwright/test'
import { login, clearAuthStorage, waitForPageLoad, isAuthenticated } from './utils/test-helpers'

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com'
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123'

test.describe('User Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthStorage(page)
    await page.goto('/')
    await waitForPageLoad(page)
    
    // Login before dashboard tests
    await login(page, TEST_EMAIL, TEST_PASSWORD)
    await page.waitForTimeout(2000)
  })

  test('Dashboard page loads after login', async ({ page }) => {
    await page.goto('/dashboard')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Dashboard shows user information', async ({ page }) => {
    await page.goto('/dashboard')
    await waitForPageLoad(page)
    
    // Check for dashboard content
    const dashboardContent = page.locator('text=/dashboard/i, text=/welcome/i, text=/profile/i').first()
    await expect(dashboardContent).toBeVisible({ timeout: 5000 })
  })

  test('Saved resources page loads', async ({ page }) => {
    await page.goto('/dashboard/saved')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/dashboard\/saved/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Dashboard courses page loads', async ({ page }) => {
    await page.goto('/dashboard/courses')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/dashboard\/courses/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Profile page loads', async ({ page }) => {
    await page.goto('/dashboard/profile')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/dashboard\/profile/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('User profile page loads', async ({ page }) => {
    await page.goto('/profile')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/profile/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Dashboard navigation works', async ({ page }) => {
    await page.goto('/dashboard')
    await waitForPageLoad(page)
    
    // Try to navigate to saved
    const savedLink = page.locator('a[href*="/saved"], button:has-text("Saved")').first()
    if (await savedLink.isVisible({ timeout: 3000 })) {
      await savedLink.click()
      await waitForPageLoad(page)
      await expect(page).toHaveURL(/\/saved/)
    }
  })

  test('Profile edit functionality', async ({ page }) => {
    await page.goto('/dashboard/profile')
    await waitForPageLoad(page)
    
    // Check for edit button or form
    const editButton = page.locator('button:has-text("Edit"), button:has-text("Update")').first()
    if (await editButton.isVisible({ timeout: 3000 })) {
      await editButton.click()
      await page.waitForTimeout(500)
      // Should show edit form
      const formVisible = await page.locator('input, textarea, form').first().isVisible()
      expect(formVisible).toBeTruthy()
    }
  })

  test('Dashboard is protected - requires login', async ({ page }) => {
    await clearAuthStorage(page)
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    
    // Should redirect to login or show login modal
    const loginForm = page.locator('input[name="email"]').first()
    await expect(loginForm).toBeVisible({ timeout: 5000 })
  })
})

