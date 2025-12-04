export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export type Status = 'idle' | 'loading' | 'success' | 'error'
