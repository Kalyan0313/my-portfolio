import type { SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    category: 'Languages',
    description: 'Core programming and scripting languages used for both systems and interface development.',
    skills: ['JavaScript (ES6+)', 'TypeScript', 'C++', 'SQL', 'HTML5', 'CSS3']
  },
  {
    category: 'Frontend Development',
    description: 'Component architecture, state management, and modern responsive web interfaces.',
    skills: [
      'React.js',
      'Next.js (App & Pages Router)',
      'Redux',
      'Redux Toolkit',
      'Tailwind CSS',
      'Bootstrap',
      'DOM APIs'
    ]
  },
  {
    category: 'Backend & APIs',
    description: 'Server-side application logic, layered architecture, API design, and asynchronous execution.',
    skills: [
      'Node.js',
      'Express.js',
      'REST API Design',
      'Socket.IO',
      'JWT Authentication',
      'Middleware Architecture'
    ]
  },
  {
    category: 'Databases & Storage',
    description: 'Relational and document storage systems, schema design, indexing, and data consistency.',
    skills: [
      'MongoDB',
      'Mongoose ODM',
      'PostgreSQL',
      'MySQL',
      'Relational Schema Design',
      'Query Optimization'
    ]
  },
  {
    category: 'Caching & Real-Time',
    description: 'In-memory data stores for high-throughput caching and bi-directional event distribution.',
    skills: [
      'Redis (In-memory Caching, TTL Management)',
      'Socket.IO (Room Management, Event Handlers)',
      'WebSockets'
    ]
  },
  {
    category: 'DevOps & Tooling',
    description: 'Version control, containerization, API testing, documentation, and Linux environment.',
    skills: [
      'Git',
      'GitHub',
      'Docker (Containerization)',
      'Postman (API Testing & Collections)',
      'Swagger / OpenAPI',
      'Linux CLI & Bash'
    ]
  },
  {
    category: 'Third-Party Integrations',
    description: 'Production service integrations for billing, external data providers, and cloud services.',
    skills: [
      'Razorpay (Payments, Subscriptions & Webhooks)',
      'Amadeus API (Flight Data & Booking)',
      'Firebase (Auth, Cloud Storage)',
      'Map Providers (Google Maps, Mapbox, OSM)'
    ]
  }
];
