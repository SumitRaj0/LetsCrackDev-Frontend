/**
 * QR Code Utility Functions
 * Helper functions for generating QR codes for various purposes
 */

/**
 * Generate QR code for sharing a course
 */
export function generateCourseQRCode(courseId: string): string {
  const baseUrl = window.location.origin
  return `${baseUrl}/courses/${courseId}`
}

/**
 * Generate QR code for sharing a service
 */
export function generateServiceQRCode(serviceId: string): string {
  const baseUrl = window.location.origin
  return `${baseUrl}/premium/service/${serviceId}`
}

/**
 * Generate QR code for sharing a resource
 */
export function generateResourceQRCode(resourceId: string): string {
  const baseUrl = window.location.origin
  return `${baseUrl}/resources/${resourceId}`
}

/**
 * Generate QR code for user profile
 */
export function generateProfileQRCode(userId: string): string {
  const baseUrl = window.location.origin
  return `${baseUrl}/profile/${userId}`
}

/**
 * Generate QR code for sharing purchase
 */
export function generatePurchaseQRCode(purchaseId: string): string {
  const baseUrl = window.location.origin
  return `${baseUrl}/purchases/${purchaseId}`
}

