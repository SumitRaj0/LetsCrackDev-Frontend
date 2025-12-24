/**
 * API Services Index
 * Central export for all API services
 */

export * from './auth.api'
export * from './user.api'
export * from './resources.api'
export * from './services.api'
export * from './courses.api'
export * from './purchases.api'
export * from './coupons.api'
export * from './chatbot.api'
export * from './contact.api'
export { api, apiClient, setAuthTokenGetter } from './client'
export { axiosClient } from './axiosClient'

