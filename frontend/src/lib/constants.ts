export const COMPANY_INFO = {
  name: 'LetsCrackDev',
  managedBy: 'Sumit Raj',
  contact: '7004413019',
  email: 'sumitraj.itdev@gmail.com',
  location: 'India',
} as const

export const SOCIAL_LINKS = {
  github: 'https://github.com/SumitRaj0',
  linkedin: 'https://linkedin.com/in/5umitraj',
  twitter: 'https://twitter.com',
} as const

export const FOUNDER_INFO = {
  name: 'Sumit Raj',
  title: 'Software Developer – Remote (MERN Stack | TypeScript | Node.js)',
  email: 'sumitraj.itdev@gmail.com',
  phone: '7004413019',
  location: 'India',
  github: 'https://github.com/SumitRaj0',
  linkedin: 'https://linkedin.com/in/5umitraj',
  summary:
    'Full-Stack Software Developer with 2.5+ years of experience building scalable, high-performance web applications using the MERN stack (MongoDB, Express.js, React.js, Node.js). Skilled in TypeScript, Next.js, REST APIs, and microservices architecture. Experienced in Dockerized deployments, AWS S3 integration, CI/CD pipelines (GitHub Actions), and responsive design. Proven ability to work in Agile remote teams, translate business needs into robust technical solutions, and deliver features with measurable business impact.',
  experience: [
    {
      company: 'Octopus Technologies',
      position: 'Software Developer',
      period: '07/2024 – Present',
      location: 'Remote',
      description:
        'Building scalable SaaS applications with MERN stack, focusing on Docker deployments, AWS integrations, and component-based architecture.',
    },
    {
      company: 'Tezo (Formerly Technovert)',
      position: 'Junior Software Developer',
      period: '01/2023 – 07/2024',
      location: 'Hyderabad',
      description:
        'Developed and maintained full-stack applications using React.js, Node.js, and TypeScript, with focus on performance optimization and CI/CD pipelines.',
    },
  ],
  skills: {
    frontend:
      'React.js, Next.js, TypeScript, JavaScript (ES6+), Redux Toolkit, Tailwind CSS, Material UI, Bootstrap',
    backend: 'Node.js, Express.js, MongoDB, Mongoose, PostgreSQL, MySQL, REST APIs, JWT',
    devops: 'Docker, GitHub Actions (CI/CD), AWS S3, Netlify',
    tools: 'Git, GitHub, Bitbucket, Postman, Jest, VS Code, Jira',
  },
  education: {
    institution: 'Punjab Technical University',
    degree: 'B.Tech in Information Technology',
    period: '07/2019 – 07/2023',
    location: 'Chandigarh',
  },
} as const
