import { axiosClient } from './axiosClient'

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactResponse {
  success: boolean
  message?: string
  error?: string
  details?: any
}

/**
 * Submit contact form
 */
export const submitContactForm = async (data: ContactFormData): Promise<ContactResponse> => {
  const response = await axiosClient.post<ContactResponse>('/v1/contact/submit', data)
  return response.data
}

