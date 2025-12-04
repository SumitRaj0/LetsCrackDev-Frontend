export interface PremiumService {
  id: string
  title: string
  description: string
  category: 'Career' | 'Interview' | 'AI Tools' | 'Templates'
  features: string[]
  isPremium: boolean
  optedCount: number
  price: number
}

export const premiumServices: PremiumService[] = [
  {
    id: 'ats-resume-builder',
    title: 'ATS Resume Builder',
    description:
      'Create ATS-friendly resumes that pass through applicant tracking systems and get you noticed by recruiters.',
    category: 'Career',
    features: ['ATS optimization', 'Multiple templates', 'Real-time feedback', 'Export to PDF'],
    isPremium: true,
    optedCount: 5420,
    price: 129,
  },
  {
    id: 'portfolio-website-builder',
    title: 'Portfolio Website Builder',
    description:
      'Build a stunning portfolio website with our drag-and-drop builder. No coding required.',
    category: 'Career',
    features: [
      'Drag-and-drop editor',
      'Responsive templates',
      'Custom domain support',
      'SEO optimization',
    ],
    isPremium: true,
    optedCount: 3890,
    price: 199,
  },
  {
    id: 'frontend-interview-kit',
    title: 'Frontend Interview Kit',
    description:
      'Comprehensive preparation kit with questions, answers, and practice problems for frontend interviews.',
    category: 'Interview',
    features: ['500+ questions', 'Code challenges', 'Mock interviews', 'Performance tips'],
    isPremium: true,
    optedCount: 6250,
    price: 179,
  },
  {
    id: 'backend-interview-kit',
    title: 'Backend Interview Kit',
    description:
      'Master backend interview questions covering databases, APIs, system design, and architecture.',
    category: 'Interview',
    features: [
      'Database questions',
      'API design patterns',
      'System design scenarios',
      'Security best practices',
    ],
    isPremium: true,
    optedCount: 4780,
    price: 179,
  },
  {
    id: 'fullstack-interview-kit',
    title: 'Full-Stack Interview Kit',
    description:
      'Complete interview preparation for full-stack positions covering both frontend and backend topics.',
    category: 'Interview',
    features: [
      'Full-stack questions',
      'Project walkthroughs',
      'Technical deep-dives',
      'Behavioral questions',
    ],
    isPremium: true,
    optedCount: 5120,
    price: 249,
  },
  {
    id: 'javascript-interview-kit',
    title: 'JavaScript Interview Kit',
    description:
      'Deep dive into JavaScript fundamentals, advanced concepts, and common interview patterns.',
    category: 'Interview',
    features: ['Core JS concepts', 'ES6+ features', 'Async programming', 'Algorithm patterns'],
    isPremium: true,
    optedCount: 6890,
    price: 149,
  },
  {
    id: 'ai-mock-interview',
    title: 'AI Mock Interview Simulator',
    description:
      'Practice interviews with AI-powered simulator that asks real questions and provides feedback.',
    category: 'AI Tools',
    features: [
      'AI-powered questions',
      'Real-time feedback',
      'Performance analytics',
      'Multiple difficulty levels',
    ],
    isPremium: true,
    optedCount: 4250,
    price: 299,
  },
  {
    id: 'project-review-feedback',
    title: 'Project Review + Feedback',
    description:
      'Get expert code reviews and feedback on your projects to improve code quality and architecture.',
    category: 'Career',
    features: [
      'Expert code reviews',
      'Architecture feedback',
      'Best practices',
      'Improvement suggestions',
    ],
    isPremium: true,
    optedCount: 3120,
    price: 349,
  },
  {
    id: 'career-path-generator',
    title: 'Career Path Generator',
    description:
      'AI-powered career path generator that creates personalized learning roadmaps based on your goals.',
    category: 'Career',
    features: ['Personalized roadmaps', 'Skill assessments', 'Progress tracking', 'Goal setting'],
    isPremium: true,
    optedCount: 3560,
    price: 229,
  },
  {
    id: 'premium-templates',
    title: 'Premium Templates Library',
    description:
      'Access to premium code templates, starter kits, and boilerplates for faster development.',
    category: 'Templates',
    features: [
      '100+ templates',
      'React/Next.js starters',
      'Backend boilerplates',
      'Full-stack projects',
    ],
    isPremium: true,
    optedCount: 7890,
    price: 399,
  },
  {
    id: 'job-board-filtering',
    title: 'Job Board Filtering',
    description:
      'Advanced job search with filters for remote work, entry-level positions, and specific tech stacks like React.',
    category: 'Career',
    features: ['Remote job filter', 'Entry-level filter', 'Tech stack filter', 'Salary insights'],
    isPremium: true,
    optedCount: 5230,
    price: 149,
  },
]
