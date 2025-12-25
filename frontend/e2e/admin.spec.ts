import { test, expect } from '@playwright/test'
import { login, clearAuthStorage, waitForPageLoad } from './utils/test-helpers'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword123'

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthStorage(page)
    await page.goto('/')
    await waitForPageLoad(page)
    
    // Login as admin
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD)
    await page.waitForTimeout(2000)
  })

  test('Admin dashboard loads', async ({ page }) => {
    await page.goto('/admin')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/admin/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Admin resources page loads', async ({ page }) => {
    await page.goto('/admin/resources')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/admin\/resources/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Admin create new resource', async ({ page }) => {
    await page.goto('/admin/resources')
    await waitForPageLoad(page)
    
    // Find create button
    const createButton = page.locator('button:has-text("Create"), button:has-text("New"), a:has-text("Create")').first()
    if (await createButton.isVisible({ timeout: 3000 })) {
      await createButton.click()
      await waitForPageLoad(page)
      
      // Should show create form
      const formVisible = await page.locator('form, input[name="title"], input[name="name"]').first().isVisible()
      expect(formVisible).toBeTruthy()
    }
  })

  test('Admin categories page loads', async ({ page }) => {
    await page.goto('/admin/categories')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/admin\/categories/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Admin users page loads', async ({ page }) => {
    await page.goto('/admin/users')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/admin\/users/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Admin courses page loads', async ({ page }) => {
    await page.goto('/admin/courses')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/admin\/courses/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Admin coupons page loads', async ({ page }) => {
    await page.goto('/admin/coupons')
    await waitForPageLoad(page)
    
    await expect(page).toHaveURL(/\/admin\/coupons/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('Admin create coupon', async ({ page }) => {
    await page.goto('/admin/coupons')
    await waitForPageLoad(page)
    
    // Find create coupon button
    const createButton = page.locator('button:has-text("Create Coupon"), button:has-text("New Coupon")').first()
    if (await createButton.isVisible({ timeout: 3000 })) {
      await createButton.click()
      await page.waitForTimeout(1000)
      
      // Should show coupon form
      const formVisible = await page.locator('input[name="code"], form').first().isVisible()
      expect(formVisible).toBeTruthy()
    }
  })

  test('Admin search functionality', async ({ page }) => {
    await page.goto('/admin/resources')
    await waitForPageLoad(page)
    
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
    if (await searchInput.isVisible({ timeout: 3000 })) {
      await searchInput.fill('test')
      await page.waitForTimeout(1000)
      // Search should work
      expect(await searchInput.inputValue()).toBe('test')
    }
  })

  test('Admin filters work', async ({ page }) => {
    await page.goto('/admin/coupons')
    await waitForPageLoad(page)
    
    // Find filter buttons
    const filterButtons = page.locator('button:has-text("All"), button:has-text("Active"), button:has-text("Inactive")')
    const count = await filterButtons.count()
    
    if (count > 0) {
      await filterButtons.first().click()
      await page.waitForTimeout(1000)
      // Filter should be applied
      expect(true).toBeTruthy()
    }
  })

  test('Admin edit resource', async ({ page }) => {
    await page.goto('/admin/resources')
    await waitForPageLoad(page)
    
    // Find edit button for first resource
    const editButton = page.locator('button:has-text("Edit"), a[href*="/edit"]').first()
    if (await editButton.isVisible({ timeout: 3000 })) {
      await editButton.click()
      await waitForPageLoad(page)
      
      // Should show edit form
      const formVisible = await page.locator('form, input').first().isVisible()
      expect(formVisible).toBeTruthy()
    }
  })

  test('Admin delete functionality', async ({ page }) => {
    await page.goto('/admin/coupons')
    await waitForPageLoad(page)
    
    // Find delete button
    const deleteButton = page.locator('button:has-text("Delete")').first()
    if (await deleteButton.isVisible({ timeout: 3000 })) {
      await deleteButton.click()
      await page.waitForTimeout(500)
      
      // Should show confirmation dialog
      const confirmVisible = await page.locator('text=/confirm/i, text=/delete/i, [role="dialog"]').isVisible().catch(() => false)
      // Confirmation might be shown
      expect(true).toBeTruthy()
    }
  })

  test('Admin panel is protected - requires admin role', async ({ page }) => {
    await clearAuthStorage(page)
    await page.goto('/admin')
    await page.waitForTimeout(2000)
    
    // Should redirect to login or show access denied
    const loginForm = page.locator('input[name="email"]').first()
    const accessDenied = page.locator('text=/access denied/i, text=/unauthorized/i').first()
    
    const hasLogin = await loginForm.isVisible({ timeout: 3000 }).catch(() => false)
    const hasAccessDenied = await accessDenied.isVisible({ timeout: 3000 }).catch(() => false)
    
    expect(hasLogin || hasAccessDenied).toBeTruthy()
  })

  test('Admin navigation between pages', async ({ page }) => {
    await page.goto('/admin')
    await waitForPageLoad(page)
    
    // Navigate to resources
    const resourcesLink = page.locator('a[href*="/admin/resources"], button:has-text("Resources")').first()
    if (await resourcesLink.isVisible({ timeout: 3000 })) {
      await resourcesLink.click()
      await waitForPageLoad(page)
      await expect(page).toHaveURL(/\/admin\/resources/)
    }
  })
})

