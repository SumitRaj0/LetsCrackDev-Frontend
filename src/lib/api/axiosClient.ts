import axios from 'axios'
import { getStoredAccessToken } from '@/utils/authStorage'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use(
  config => {
    const token = getStoredAccessToken()

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error)
)

export default axiosClient


