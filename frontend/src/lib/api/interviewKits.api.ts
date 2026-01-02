/**
 * Interview Kits API Service
 * Fetches interview kit questions (requires authentication + purchase access)
 */

import { api } from './client'
import { InterviewQuestion } from '@/types/interviewKit'

export interface InterviewKitQuestionsResponse {
  success: boolean
  data: {
    kit: {
      serviceId: string
      serviceName: string
      questions: InterviewQuestion[]
    }
  }
  message: string
}

export async function getInterviewKitQuestions(
  serviceId: string,
): Promise<InterviewKitQuestionsResponse> {
  return api.get<InterviewKitQuestionsResponse>(`/v1/interview-kits/${serviceId}/questions`)
}


