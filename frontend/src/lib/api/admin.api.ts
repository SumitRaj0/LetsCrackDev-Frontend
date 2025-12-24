/**
 * Admin API Functions
 * All endpoints require admin authentication
 */

import { axiosClient } from './axiosClient'

export interface AdminAnalytics {
  overview: {
    totalUsers: number
    totalResources: number
    totalCourses: number
    totalServices: number
    totalPremiumUsers: number
    totalPurchases: number
    completedPurchases: number
    totalRevenue: number
  }
  recentActivity: {
    newUsersLast30Days: number
    newResourcesLast30Days: number
    newCoursesLast30Days: number
    newPurchasesLast30Days: number
    revenueLast30Days: number
  }
}

export interface MonthlyStat {
  month: string
  year: number
  monthNumber: number
  users: number
  resources: number
  courses: number
  purchases: number
  revenue: number
}

export interface SalesData {
  summary: {
    totalRevenue: number
    totalPurchases: number
    servicePurchases: number
    coursePurchases: number
    averageOrderValue: number
  }
  topSelling: {
    services: Array<{
      serviceId: string
      serviceName: string
      purchases: number
    }>
    courses: Array<{
      courseId: string
      courseName: string
      purchases: number
    }>
  }
}

export interface UserStats {
  totalUsers: number
  premiumUsers: number
  regularUsers: number
  adminUsers: number
  activeUsers: number
  usersByMonth: Array<{
    month: number
    year: number
    count: number
  }>
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

/**
 * Get admin dashboard analytics
 */
export const getAdminAnalytics = async (): Promise<AdminAnalytics> => {
  const response = await axiosClient.get<ApiResponse<AdminAnalytics>>('/v1/admin/analytics')
  return response.data.data
}

/**
 * Get monthly statistics
 */
export const getMonthlyStats = async (): Promise<{ monthlyStats: MonthlyStat[] }> => {
  const response = await axiosClient.get<ApiResponse<{ monthlyStats: MonthlyStat[] }>>(
    '/v1/admin/analytics/monthly'
  )
  return response.data.data
}

/**
 * Get sales data
 */
export const getSalesData = async (): Promise<SalesData> => {
  const response = await axiosClient.get<ApiResponse<SalesData>>('/v1/admin/analytics/sales')
  return response.data.data
}

/**
 * Get user statistics
 */
export const getUserStats = async (): Promise<UserStats> => {
  const response = await axiosClient.get<ApiResponse<UserStats>>('/v1/admin/analytics/users')
  return response.data.data
}

