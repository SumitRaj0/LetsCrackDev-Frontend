import { ServiceDetailConfig } from './serviceDetailConfig'

export const atsResumeServiceConfig: ServiceDetailConfig = {
  slug: 'ats-resume-service',
  subtitle: 'Get Past ATS Filters and Land More Interviews',
  whatIsThis: {
    title: 'What is this?',
    paragraphs: [
      'ATS Resume Service provides professional resume optimization specifically designed to pass Applicant Tracking Systems (ATS) used by 95% of companies today.',
      'Our service ensures your resume gets past automated filters and reaches human recruiters, significantly increasing your interview chances.',
    ],
  },
  whoIsThisFor: {
    title: 'Who is this for?',
    items: [
      'Developers applying for tech roles',
      'Job seekers not getting interview calls',
      'Career changers entering tech industry',
      'Experienced developers updating their resume',
      'Anyone struggling with ATS rejections',
    ],
  },
  whatYouGet: {
    title: 'What You Get',
    items: [
      {
        title: 'ATS-Optimized Resume Review',
        description: 'Complete analysis of your resume for ATS compatibility',
        subItems: [
          'Keyword optimization for tech roles',
          'Formatting that ATS systems can read',
          'Section structure optimization',
        ],
      },
      {
        title: 'Keyword Enhancement',
        description: 'Strategic keyword placement based on job descriptions',
        subItems: [
          'Technology stack keywords',
          'Industry-specific terms',
          'Action verbs and quantifiable achievements',
        ],
      },
      {
        title: 'Formatting Improvements',
        description: 'Resume structure optimized for both ATS and human readers',
        subItems: [
          'ATS-friendly file formats',
          'Proper section ordering',
          'Clean, professional layout',
        ],
      },
      {
        title: 'Industry-Specific Optimizations',
        description: 'Tailored for tech industry standards',
        subItems: [
          'Project descriptions that stand out',
          'Technical skills presentation',
          'Experience formatting for developers',
        ],
      },
      {
        title: 'Cover Letter Template',
        description: 'Professional cover letter template included',
        subItems: [
          'ATS-optimized cover letter',
          'Customizable templates',
          'Best practices guide',
        ],
      },
    ],
  },
  customSections: [
    {
      title: 'Why ATS Optimization Matters',
      content: [
        '95% of companies use ATS to filter resumes',
        'Only 2-3% of resumes pass ATS filters',
        'Your resume must be ATS-compatible to reach recruiters',
        'Proper formatting and keywords are critical',
      ],
      type: 'list',
    },
  ],
}

