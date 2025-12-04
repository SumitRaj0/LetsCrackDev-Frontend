export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Remote'

export interface JobListing {
  id: string
  title: string
  department: string
  location: string
  type: JobType
  description: string
  requirements: string[]
  postedDate: string
}
