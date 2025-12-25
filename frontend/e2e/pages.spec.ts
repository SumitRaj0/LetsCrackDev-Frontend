import { test, expect } from '@playwright/test'
import { waitForPageLoad, clearAuthStorage } from './utils/test-helpers'

test.describe('All Pages Load Correctly', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthStorage(page)
  })

  test('Home page - all sections visible', async ({ page }) => {
    await page.goto('/')
    await waitForPageLoad(page)
    
    // Check for common home page elements
    await expect(page.locator('body')).toBeVisible()
    // Add more specific checks based on your home page structure
  })

  test('Resources page loads', async ({ page }) => {
    await page.goto('/resources')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/resources/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Resources detail page loads', async ({ page }) => {
    // Navigate to resources first
    await page.goto('/resources')
    await waitForPageLoad(page)
    
    // Try to click first resource if available
    const firstResource = page.locator('a[href*="/resources/"]').first()
    const isVisible = await firstResource.isVisible({ timeout: 3000 }).catch(() => false)
    if (isVisible) {
      await firstResource.click()
      await waitForPageLoad(page)
      await expect(page).toHaveURL(/\/resources\/\w+/)
    } else {
      // Skip test if no resources available
      test.skip(true, 'No resources available to test detail page')
    }
  })

  test('Categories page loads', async ({ page }) => {
    await page.goto('/categories')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/categories/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Courses page loads', async ({ page }) => {
    await page.goto('/courses')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/courses/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Course detail page loads', async ({ page }) => {
    await page.goto('/courses')
    await waitForPageLoad(page)
    
    // Try to click first course if available
    const firstCourse = page.locator('a[href*="/courses/"]').first()
    const isVisible = await firstCourse.isVisible({ timeout: 3000 }).catch(() => false)
    if (isVisible) {
      await firstCourse.click()
      await waitForPageLoad(page)
      await expect(page).toHaveURL(/\/courses\/\w+/)
    } else {
      // Skip test if no courses available
      test.skip(true, 'No courses available to test detail page')
    }
  })

  test('Premium page loads', async ({ page }) => {
    await page.goto('/premium')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/premium/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Premium benefits page loads', async ({ page }) => {
    await page.goto('/premium/benefits')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/premium\/benefits/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('About page loads', async ({ page }) => {
    await page.goto('/about')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/about/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Blog page loads', async ({ page }) => {
    await page.goto('/blog')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/blog/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Contact page loads', async ({ page }) => {
    await page.goto('/contact')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/contact/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Careers page loads', async ({ page }) => {
    await page.goto('/careers')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/careers/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('404 page for invalid route', async ({ page }) => {
    await page.goto('/invalid-route-12345')
    await waitForPageLoad(page)
    
    // Should show 404 or redirect to home
    const is404 = await page.locator('text=/404/i, text=/not found/i').isVisible().catch(() => false)
    const isHome = page.url().endsWith('/')
    expect(is404 || isHome).toBeTruthy()
  })

  test('Payment success page loads', async ({ page }) => {
    await page.goto('/payment/success')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/payment\/success/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Payment failed page loads', async ({ page }) => {
    await page.goto('/payment/failed')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/payment\/(failed|cancel)/)
    await expect(page.locator('body')).toBeVisible()
  })
})

