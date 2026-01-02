import { ServiceDetailConfig } from './serviceDetailConfig'

export const javascriptInterviewMasteryKitConfig: ServiceDetailConfig = {
  slug: 'javascript-interview-mastery-kit',
  subtitle: 'Crack Any JavaScript Interview with Confidence',
  whatIsThis: {
    title: 'What This Kit Is (Positioning)',
    paragraphs: [
      'This is **NOT** a tutorial.',
      'This is a **thinking + answering framework** for JavaScript interviews.',
      'It teaches you:',
      '* What interviewers *actually* test',
      '* How to structure answers clearly',
      '* How to avoid rejection-level mistakes',
    ],
  },
  whoIsThisFor: {
    title: 'Who This Is For',
    items: [
      'Freshers preparing for JS interviews',
      'Frontend developers (React / Angular / Vue)',
      'Full-stack developers (MERN / MEAN)',
      '1–4 years experience stuck in interview loops',
      'Anyone who knows JS but struggles to explain it',
    ],
  },
  whatYouGet: {
    title: 'What You Get (Premium Deliverables)',
    items: [
      {
        title: '50 Curated JavaScript Interview Questions',
        description: 'Not random. Not copied.',
        subItems: [
          'Product-based companies',
          'Startup technical rounds',
          'Mid & senior JS interviews',
        ],
        additionalText: 'Each question is included because it **actually eliminates candidates**.',
      },
      {
        title: 'Interview-Ready Answer Structure (Per Question)',
        description: 'Every question follows the same **clean structure**:',
        subItems: [
          '**What the interviewer is testing**',
          '**Precise, confident answer** (what to say)',
          '**Supporting explanation** (why it works)',
          '**Real-world example**',
          '**Common mistakes**',
          '**Follow-up questions** interviewers ask',
        ],
        additionalText: 'No long essays. No one-liners.',
      },
      {
        title: 'Real-World Scenarios (Not Theory)',
        description: 'Examples are taken from real development problems:',
        subItems: [
          'Closures causing memory leaks',
          'Event loop UI freezes',
          'Async bugs in APIs',
          '`this` breaking production code',
          'Performance issues from bad patterns',
        ],
        additionalText: 'This helps you **sound experienced**, even in fresher interviews.',
      },
      {
        title: 'Interview Traps & Red Flags',
        description: "For every major topic, you'll learn:",
        subItems: [
          'Wrong answers interviewers reject',
          'Confusions candidates fall into',
          'Why people fail *despite knowing JS*',
        ],
        additionalText: 'This is where most free content stops.',
      },
    ],
  },
  topicsCovered: {
    title: 'Topics Covered',
    items: [
      'JavaScript fundamentals',
      'Scope, hoisting, closures',
      '`this`, call/apply/bind',
      'Promises & async/await',
      'Event loop & concurrency',
      'Objects, prototypes, inheritance',
      'Performance & memory',
      'Debugging & interview scenarios',
    ],
  },
  howIsDifferent: {
    title: 'Why This Kit Works',
    notThese: ['Not a crash course', 'Not MCQs', 'Not recycled blog content'],
    these: [
      'Interview-focused',
      'Answer-driven',
      'Built for confidence under pressure',
    ],
  },
  customSections: [
    {
      title: 'The Problem (Pain Points)',
      type: 'text',
      content:
        'Most developers fail JavaScript interviews not because they don\'t know JavaScript — but because:\n\n* They give **bookish or scattered answers**\n* They fail on **follow-up questions**\n* They miss **edge cases interviewers expect**\n* They panic when asked "why" instead of "how"\n\nThis kit fixes that.',
    },
    {
      title: 'Who This Is NOT For',
      type: 'list',
      content: [
        'Absolute beginners',
        'People looking for step-by-step tutorials',
        'People who want shortcuts without understanding',
      ],
    },
    {
      title: 'Bonus (Optional – Increases Conversion)',
      type: 'list',
      content: [
        '📄 *Interview Answer Framework PDF*',
        '📋 *Top JS Mistakes Checklist*',
        '⚡ *How to Structure Answers in 60 Seconds*',
      ],
    },
    {
      title: 'Trust Builder (Closing)',
      type: 'text',
      content:
        'This kit is built for **LetsCrackDev** learners who want results, not noise.\n\nIf JavaScript interviews decide your career growth — this kit pays for itself in one offer.',
    },
  ],
}