import { Course } from '../types'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-bold">{course.title}</h3>
      <p className="text-sm text-gray-600">{course.description}</p>
    </div>
  )
}
