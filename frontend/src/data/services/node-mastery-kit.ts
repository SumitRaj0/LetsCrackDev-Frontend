import { ServiceDetailConfig } from './serviceDetailConfig'

export const nodeMasteryKitConfig: ServiceDetailConfig = {
  slug: 'node-mastery-kit',
  subtitle: 'Master Node.js Backend Development Interviews',
  whatIsThis: {
    title: 'What is this?',
    paragraphs: [
      'Node.js Mastery Kit is a complete interview preparation guide for backend and full-stack developers preparing for Node.js interviews.',
      'This comprehensive kit covers Node.js core concepts, async programming, event loop, production patterns, and everything you need to ace backend interviews.',
    ],
  },
  whoIsThisFor: {
    title: 'Who is this for?',
    items: [
      'Backend developers preparing for Node.js interviews',
      'Full-stack developers wanting to master backend',
      'Developers transitioning to Node.js',
      'Anyone preparing for backend engineering roles',
      'Developers targeting companies using Node.js stack',
    ],
  },
  whatYouGet: {
    title: 'What You Get (Core Offering)',
    items: [
      {
        emoji: '1️⃣',
        title: 'Node.js Core Concepts & Event Loop',
        description: 'Deep dive into Node.js fundamentals',
        subItems: [
          'Event loop architecture explained',
          'Single-threaded vs multi-threaded',
          'Non-blocking I/O operations',
          'Process vs threads in Node.js',
        ],
        additionalText: 'Master the concepts that interviewers always ask about.',
      },
      {
        emoji: '2️⃣',
        title: 'Async Programming Patterns',
        description: 'Complete guide to asynchronous programming in Node.js',
        subItems: [
          'Callbacks and callback hell',
          'Promises and promise chaining',
          'Async/await patterns',
          'Error handling in async code',
        ],
        additionalText: 'Learn all async patterns and when to use each.',
      },
      {
        emoji: '3️⃣',
        title: 'Express.js Framework Mastery',
        description: 'Master Express.js for backend interviews',
        subItems: [
          'Express middleware patterns',
          'Routing and route handlers',
          'Request/response handling',
          'Error handling middleware',
        ],
        additionalText: 'Build production-ready Express applications.',
      },
      {
        emoji: '4️⃣',
        title: 'Database Integration',
        description: 'Working with databases in Node.js',
        subItems: [
          'MongoDB with Mongoose',
          'PostgreSQL with Sequelize/Prisma',
          'Redis for caching',
          'Database connection pooling',
        ],
        additionalText: 'Master database operations for backend interviews.',
      },
      {
        emoji: '5️⃣',
        title: 'Authentication & Security',
        description: 'Security best practices for Node.js',
        subItems: [
          'JWT authentication',
          'Password hashing (bcrypt)',
          'Session management',
          'Security vulnerabilities and prevention',
        ],
        additionalText: 'Learn security patterns that interviewers expect.',
      },
      {
        emoji: '6️⃣',
        title: 'Performance Optimization',
        description: 'Optimize Node.js applications',
        subItems: [
          'Caching strategies',
          'Load balancing',
          'Clustering and worker threads',
          'Memory management',
        ],
        additionalText: 'Scale Node.js applications effectively.',
      },
      {
        emoji: '7️⃣',
        title: 'Production Deployment & DevOps',
        description: 'Deploy and maintain Node.js applications',
        subItems: [
          'Docker containerization',
          'CI/CD pipelines',
          'Monitoring and logging',
          'Error tracking and debugging',
        ],
        additionalText: 'Production-ready deployment strategies.',
      },
    ],
  },
  topicsCovered: {
    title: 'Topics Covered',
    items: [
      'Node.js fundamentals',
      'Event loop and concurrency',
      'Async programming patterns',
      'Express.js framework',
      'Database integration',
      'Authentication & security',
      'Performance optimization',
      'Production deployment',
      'Error handling',
      'Testing Node.js applications',
    ],
  },
}

