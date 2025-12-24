export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  videoUrl: string
  duration: number
}
