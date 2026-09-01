import type { ExperienceItem } from '../types';

export const experienceData: ExperienceItem[] = [
  {
    id: 'exp-1',
    company: 'Excellis IT',
    role: 'Node.js Full-Stack Developer',
    period: 'July 2024 — March 2026',
    location: 'India',
    badge: 'Full Time',
    overview:
      'Engineered scalable full-stack web applications, high-performance RESTful APIs, real-time messaging services, and dynamic frontend user interfaces using React, Next.js, Node.js, and Express.',
    contributions: [
      'Developed end-to-end full-stack web applications and microservices, implementing clean layered architecture with Express.js and TypeScript.',
      'Constructed resilient RESTful API endpoints with input validation, error-handling middleware, and role-based authentication using JWT tokens.',
      'Implemented real-time bidirectional event pipelines using Socket.IO and WebSockets for live status feeds and instant notification streaming.',
      'Optimized backend query execution and caching strategies utilizing MongoDB compound indexing, PostgreSQL, and Redis cache-aside layers.',
      'Built reusable, accessible UI component libraries with React and Next.js, optimizing state transitions and eliminating cumulative layout shifts.',
      'Integrated third-party payment gateways, external data APIs, and webhook synchronization workflows with automated payload verification.'
    ],
    technologies: [
      'JavaScript (ES6+)',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'PostgreSQL',
      'Redis',
      'Socket.IO',
      'REST APIs',
      'Docker'
    ]
  }
];
