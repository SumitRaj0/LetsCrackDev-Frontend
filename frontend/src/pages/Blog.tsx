import { Link } from 'react-router-dom'
import { PageHero } from '@/components/shared/PageHero'
import { CTASection } from '@/components/shared/CTASection'
import { formatDate } from '@/utils/dateFormat'
import type { BlogPost } from '@/types/blog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: '10 Essential React Hooks Every Developer Should Know',
    excerpt:
      'Discover the most powerful React hooks that can simplify your code and improve your development workflow. From useState to custom hooks, learn how to leverage these tools effectively.',
    author: 'LetsCrackDev Team',
    date: '2024-01-15',
    category: 'React',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Building Scalable Node.js Applications: Best Practices',
    excerpt:
      'Learn the key principles and patterns for building Node.js applications that can handle growth. We cover architecture, performance optimization, and deployment strategies.',
    author: 'LetsCrackDev Team',
    date: '2024-01-10',
    category: 'Backend',
    readTime: '8 min read',
  },
  {
    id: '3',
    title: 'TypeScript Tips: Advanced Patterns for Better Code',
    excerpt:
      'Take your TypeScript skills to the next level with advanced patterns, generics, and type manipulation techniques that will make your code more robust and maintainable.',
    author: 'LetsCrackDev Team',
    date: '2024-01-05',
    category: 'TypeScript',
    readTime: '6 min read',
  },
  {
    id: '4',
    title: 'The Complete Guide to RESTful API Design',
    excerpt:
      'Master the art of designing RESTful APIs that are intuitive, scalable, and developer-friendly. We cover naming conventions, status codes, versioning, and more.',
    author: 'LetsCrackDev Team',
    date: '2023-12-28',
    category: 'API Design',
    readTime: '10 min read',
  },
  {
    id: '5',
    title: 'Docker for Developers: From Basics to Production',
    excerpt:
      'Everything you need to know about Docker for modern development. Learn containerization, Docker Compose, and best practices for deploying containerized applications.',
    author: 'LetsCrackDev Team',
    date: '2023-12-20',
    category: 'DevOps',
    readTime: '12 min read',
  },
  {
    id: '6',
    title: 'Modern CSS Techniques: Grid, Flexbox, and Beyond',
    excerpt:
      'Explore advanced CSS techniques that will help you build beautiful, responsive layouts. Learn about CSS Grid, Flexbox, custom properties, and modern layout patterns.',
    author: 'LetsCrackDev Team',
    date: '2023-12-15',
    category: 'Frontend',
    readTime: '7 min read',
  },
]

export default function Blog() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="LetsCrackDev Blog"
        description="Insights, tutorials, and best practices for developers"
      />

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <Card key={post.id} className="overflow-hidden hover-lift">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="default" size="md">
                      {post.category}
                    </Badge>
                    <span className="text-gray-400 dark:text-gray-500 text-sm">
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{post.author}</span>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Stay Updated"
        description="Subscribe to our newsletter and get the latest articles, tutorials, and resources delivered to your inbox."
      >
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Button
            variant="secondary"
            size="lg"
            className="whitespace-nowrap !bg-white !text-indigo-600 hover:!bg-indigo-50 dark:!bg-white dark:!text-indigo-600 dark:hover:!bg-indigo-50"
          >
            Subscribe
          </Button>
        </div>
      </CTASection>
    </div>
  )
}
