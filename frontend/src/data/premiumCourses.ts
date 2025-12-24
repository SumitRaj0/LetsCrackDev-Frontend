export interface PremiumCourse {
  id: string
  title: string
  description: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  isPremium: boolean
  tags: string[]
  enrolledCount: number
  price: number
}

export const premiumCourses: PremiumCourse[] = [
  {
    id: 'frontend-mastery',
    title: 'Frontend Mastery Course',
    description:
      'Master modern frontend development with React, Next.js, TypeScript, and advanced UI patterns. Build production-ready applications.',
    level: 'Intermediate',
    duration: '8 weeks',
    isPremium: true,
    tags: ['React', 'Next.js', 'TypeScript', 'UI/UX'],
    enrolledCount: 3240,
    price: 299,
  },
  {
    id: 'backend-mastery',
    title: 'Backend Mastery Course',
    description:
      'Learn server-side development with Node.js, databases, APIs, authentication, and deployment strategies.',
    level: 'Intermediate',
    duration: '10 weeks',
    isPremium: true,
    tags: ['Node.js', 'Database', 'API', 'Security'],
    enrolledCount: 2890,
    price: 349,
  },
  {
    id: 'fullstack-bootcamp',
    title: 'Full-Stack Developer Bootcamp',
    description:
      'Complete bootcamp covering frontend, backend, DevOps, and real-world project development from scratch.',
    level: 'Advanced',
    duration: '16 weeks',
    isPremium: true,
    tags: ['Full-Stack', 'DevOps', 'Projects', 'Career'],
    enrolledCount: 5120,
    price: 499,
  },
  {
    id: 'javascript-interview',
    title: 'JavaScript Interview Mastery',
    description:
      'Ace your JavaScript interviews with comprehensive coverage of closures, promises, async/await, and algorithm patterns.',
    level: 'Intermediate',
    duration: '4 weeks',
    isPremium: true,
    tags: ['JavaScript', 'Interview', 'Algorithms', 'ES6+'],
    enrolledCount: 4560,
    price: 199,
  },
  {
    id: 'system-design-beginners',
    title: 'System Design for Beginners',
    description:
      'Learn to design scalable systems, understand distributed systems, databases, caching, and load balancing.',
    level: 'Beginner',
    duration: '6 weeks',
    isPremium: true,
    tags: ['System Design', 'Architecture', 'Scalability', 'Distributed Systems'],
    enrolledCount: 2180,
    price: 249,
  },
  {
    id: 'jobs-preparation',
    title: 'Jobs Preparation Accelerator',
    description:
      'Complete preparation guide: resume building, portfolio creation, interview prep, and job search strategies.',
    level: 'Beginner',
    duration: '5 weeks',
    isPremium: true,
    tags: ['Career', 'Interview', 'Resume', 'Portfolio'],
    enrolledCount: 3890,
    price: 179,
  },
  {
    id: 'ai-tools-developers',
    title: 'AI Tools for Developers',
    description:
      'Master AI-powered development tools, GitHub Copilot, ChatGPT for coding, and automation workflows.',
    level: 'Intermediate',
    duration: '3 weeks',
    isPremium: true,
    tags: ['AI', 'Tools', 'Automation', 'Productivity'],
    enrolledCount: 2750,
    price: 149,
  },
  {
    id: 'project-based-courses',
    title: 'Project-Based Courses',
    description:
      'Build real-world projects: SaaS applications, CRM systems, LMS platforms, and social media apps.',
    level: 'Advanced',
    duration: '12 weeks',
    isPremium: true,
    tags: ['Projects', 'SaaS', 'CRM', 'LMS', 'Social App'],
    enrolledCount: 4210,
    price: 399,
  },
]
