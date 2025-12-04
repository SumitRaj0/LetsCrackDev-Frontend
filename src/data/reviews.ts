export interface Review {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  rating: number
  comment: string
  date: string
}

export const reviews: Review[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Senior Frontend Developer',
    company: 'TechCorp',
    avatar: 'SC',
    rating: 5,
    comment:
      'LetsCrackDev has been a game-changer for my learning journey. The curated resources and premium courses helped me land my dream job at a top tech company. The community support is incredible!',
    date: '2024-01-15',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'Full-Stack Developer',
    company: 'StartupXYZ',
    avatar: 'MR',
    rating: 5,
    comment:
      'Best platform for developers! The premium courses are worth every penny. I completed the Full-Stack Bootcamp and built 3 real-world projects. Highly recommend to anyone serious about coding.',
    date: '2024-01-10',
  },
  {
    id: '3',
    name: 'Emily Johnson',
    role: 'Backend Engineer',
    company: 'CloudTech',
    avatar: 'EJ',
    rating: 5,
    comment:
      'The interview preparation kits are phenomenal. I aced my technical interviews thanks to the comprehensive question banks and mock interview simulator. Got offers from 3 companies!',
    date: '2024-01-08',
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'React Developer',
    company: 'DesignStudio',
    avatar: 'DK',
    rating: 5,
    comment:
      'As a self-taught developer, LetsCrackDev provided the structure I needed. The learning paths are well-organized, and the project-based courses gave me portfolio pieces that impressed employers.',
    date: '2024-01-05',
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    role: 'DevOps Engineer',
    company: 'ScaleUp Inc',
    avatar: 'JM',
    rating: 5,
    comment:
      'The System Design course is top-notch! Finally understood distributed systems and scalability. The ATS Resume Builder helped me get past screening systems. This platform is a complete career accelerator.',
    date: '2024-01-03',
  },
  {
    id: '6',
    name: 'Alex Thompson',
    role: 'Software Engineer',
    company: 'BigTech Co',
    avatar: 'AT',
    rating: 5,
    comment:
      "I've tried many learning platforms, but LetsCrackDev stands out. The quality of content, the community, and the premium services are unmatched. My career trajectory changed completely after joining.",
    date: '2023-12-28',
  },
]
