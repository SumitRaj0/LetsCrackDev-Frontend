import { PageHero } from '@/components/shared/PageHero'
import { CTASection } from '@/components/shared/CTASection'
import { formatDate } from '@/utils/dateFormat'
import type { JobListing } from '@/types/careers'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const jobListings: JobListing[] = [
  {
    id: '1',
    title: 'Senior Full-Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description:
      'We are looking for an experienced Full-Stack Developer to join our engineering team. You will be responsible for building and maintaining our platform using modern web technologies.',
    requirements: [
      '5+ years of experience with React.js and Node.js',
      'Strong knowledge of TypeScript and MongoDB',
      'Experience with AWS and Docker',
      'Excellent problem-solving skills',
    ],
    postedDate: '2024-01-10',
  },
  {
    id: '2',
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Join our frontend team to create beautiful and intuitive user interfaces. You will work closely with designers and backend developers to deliver exceptional user experiences.',
    requirements: [
      '3+ years of experience with React.js',
      'Proficiency in TypeScript and Tailwind CSS',
      'Experience with state management (Redux, Zustand)',
      'Strong understanding of responsive design',
    ],
    postedDate: '2024-01-08',
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description:
      'We need a DevOps Engineer to help us scale our infrastructure and improve our deployment processes. You will work on CI/CD pipelines, containerization, and cloud infrastructure.',
    requirements: [
      '4+ years of DevOps experience',
      'Strong knowledge of Docker and Kubernetes',
      'Experience with AWS or similar cloud platforms',
      'Proficiency in GitHub Actions or similar CI/CD tools',
    ],
    postedDate: '2024-01-05',
  },
  {
    id: '4',
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Help us create beautiful and user-friendly designs for our platform. You will work on user research, wireframing, prototyping, and collaborating with developers.',
    requirements: [
      '3+ years of UI/UX design experience',
      'Proficiency in Figma or similar design tools',
      'Strong portfolio showcasing web application designs',
      'Understanding of frontend development principles',
    ],
    postedDate: '2024-01-03',
  },
  {
    id: '5',
    title: 'Content Writer',
    department: 'Marketing',
    location: 'Remote',
    type: 'Part-time',
    description:
      'We are looking for a technical content writer to create blog posts, tutorials, and documentation. You should have a strong understanding of web development technologies.',
    requirements: [
      '2+ years of technical writing experience',
      'Strong knowledge of web development technologies',
      'Excellent writing and communication skills',
      'Ability to explain complex concepts clearly',
    ],
    postedDate: '2023-12-28',
  },
  {
    id: '6',
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Lead product development initiatives and work with cross-functional teams to deliver features that users love. You will be responsible for product strategy, roadmap planning, and execution.',
    requirements: [
      '5+ years of product management experience',
      'Experience with developer tools or SaaS products',
      'Strong analytical and problem-solving skills',
      'Excellent communication and leadership abilities',
    ],
    postedDate: '2023-12-25',
  },
]

export default function Careers() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Join Our Team"
        description="Help us build the best platform for developers worldwide"
      />

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center tracking-tight">
            Why Work at LetsCrackDev?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Remote First</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Work from anywhere in the world
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Growth Opportunities
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Continuous learning and development
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Great Team</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Collaborate with talented developers
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
            Open Positions
          </h2>
          <div className="space-y-6">
            {jobListings.map(job => (
              <Card key={job.id} className="p-6 md:p-8 hover-lift">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {job.location}
                      </span>
                      <Badge variant="default" size="sm">
                        {job.type}
                      </Badge>
                    </div>
                  </div>
                  <time className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
                    Posted {formatDate(job.postedDate)}
                  </time>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{job.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Requirements:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <Button variant="primary" size="md">
                  Apply Now
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Don't See a Role That Fits?"
        description="We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities."
        primaryButton={{ text: 'Get in Touch', to: '/contact' }}
      />
    </div>
  )
}
