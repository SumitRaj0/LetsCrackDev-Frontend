interface CoursePlayerProps {
  courseId: string
}

export function CoursePlayer({ courseId }: CoursePlayerProps) {
  return (
    <div className="border rounded-lg p-4">
      <p>Course player for course: {courseId}</p>
    </div>
  )
}
