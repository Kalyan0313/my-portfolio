import type { Profile } from '../types';

export const profileData: Profile = {
  name: 'Kalyan Mahato',

  role: 'Full Stack Developer',

  headline: 'Building Full-Stack Products with Node.js, TypeScript & React',

  location: 'Bengaluru, India',

  availability: 'Open to Full Stack Developer Opportunities',

  bioParagraphs: [
    "I'm a Full-Stack Developer with around 2 years of experience building products with React, Next.js, Node.js, and TypeScript. Most of my work has been backend-focused, from designing REST APIs and database models to integrating third-party services and handling real-time features.",

    "I've worked with MongoDB, PostgreSQL, Redis, Socket.IO, and Docker across projects involving multi-tenancy, payments, caching, and real-time communication. I care about keeping the codebase understandable, handling edge cases properly, and choosing solutions that fit the actual problem rather than adding unnecessary complexity."
  ],

  focusAreas: [
    {
      title: 'Backend & API Development',
      description:
        'Building REST APIs with Node.js and Express, with authentication, validation, error handling, and clear separation of business logic.'
    },

    {
      title: 'Databases & Caching',
      description:
        'Working with MongoDB, PostgreSQL, and Redis for data modeling, indexing, caching, and efficient queries.'
    },

    {
      title: 'Real-Time Applications',
      description:
        'Building real-time features with Socket.IO and WebSockets, including messaging, live updates, and event-based communication.'
    },

    {
      title: 'Frontend Development',
      description:
        'Building responsive interfaces with React, Next.js, and TypeScript with a focus on reusable components and maintainable code.'
    }
  ],

  quickStack: [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Express',
    'MongoDB',
    'PostgreSQL',
    'Redis',
    'Socket.IO',
    'Docker'
  ],

  github: 'https://github.com/ZairoXcode',

  linkedin: 'https://linkedin.com/in/kalyan-mahato-366444244',

  email: 'mahatokalyan2@gmail.com',

  phone: '',

  resumeUrl: '/Kalyan-Mahato-Resume.pdf'
};