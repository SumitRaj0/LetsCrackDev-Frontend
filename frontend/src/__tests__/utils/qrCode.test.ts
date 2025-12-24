/**
 * QR Code Utility Tests
 * Tests for QR code generation functions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  generateCourseQRCode,
  generateServiceQRCode,
  generateResourceQRCode,
  generateProfileQRCode,
  generatePurchaseQRCode,
} from '@/utils/qrCode'

describe('qrCode utilities', () => {
  const originalLocation = window.location

  beforeEach(() => {
    // Mock window.location
    delete (window as any).location
    window.location = {
      ...originalLocation,
      origin: 'https://example.com',
    } as Location
  })

  afterEach(() => {
    window.location = originalLocation
  })

  describe('generateCourseQRCode', () => {
    it('should generate correct course QR code URL', () => {
      const courseId = 'course-123'
      const result = generateCourseQRCode(courseId)

      expect(result).toBe('https://example.com/courses/course-123')
    })

    it('should handle different course IDs', () => {
      expect(generateCourseQRCode('abc')).toBe('https://example.com/courses/abc')
      expect(generateCourseQRCode('course-456')).toBe('https://example.com/courses/course-456')
    })
  })

  describe('generateServiceQRCode', () => {
    it('should generate correct service QR code URL', () => {
      const serviceId = 'service-123'
      const result = generateServiceQRCode(serviceId)

      expect(result).toBe('https://example.com/premium/service/service-123')
    })

    it('should handle different service IDs', () => {
      expect(generateServiceQRCode('xyz')).toBe('https://example.com/premium/service/xyz')
    })
  })

  describe('generateResourceQRCode', () => {
    it('should generate correct resource QR code URL', () => {
      const resourceId = 'resource-123'
      const result = generateResourceQRCode(resourceId)

      expect(result).toBe('https://example.com/resources/resource-123')
    })

    it('should handle different resource IDs', () => {
      expect(generateResourceQRCode('res-456')).toBe('https://example.com/resources/res-456')
    })
  })

  describe('generateProfileQRCode', () => {
    it('should generate correct profile QR code URL', () => {
      const userId = 'user-123'
      const result = generateProfileQRCode(userId)

      expect(result).toBe('https://example.com/profile/user-123')
    })

    it('should handle different user IDs', () => {
      expect(generateProfileQRCode('user-789')).toBe('https://example.com/profile/user-789')
    })
  })

  describe('generatePurchaseQRCode', () => {
    it('should generate correct purchase QR code URL', () => {
      const purchaseId = 'purchase-123'
      const result = generatePurchaseQRCode(purchaseId)

      expect(result).toBe('https://example.com/purchases/purchase-123')
    })

    it('should handle different purchase IDs', () => {
      expect(generatePurchaseQRCode('pur-456')).toBe('https://example.com/purchases/pur-456')
    })
  })

  describe('origin handling', () => {
    it('should use current window.location.origin', () => {
      window.location.origin = 'http://localhost:5173'

      const result = generateCourseQRCode('test')
      expect(result).toBe('http://localhost:5173/courses/test')
    })
  })
})


