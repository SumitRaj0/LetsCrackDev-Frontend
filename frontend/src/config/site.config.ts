export const siteConfig = {
  name: 'Learning Platform',
  description: 'A comprehensive learning platform',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com',
    github: 'https://github.com',
  },
} as const
