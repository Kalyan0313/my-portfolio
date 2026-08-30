export interface SocialLink {
  name: string;
  url: string;
  label: string;
  icon: string;
}

export interface Profile {
  name: string;
  role: string;
  headline: string;
  location: string;
  availability: string;
  bioParagraphs: string[];
  focusAreas: {
    title: string;
    description: string;
  }[];
  quickStack: string[];
  github: string;
  linkedin: string;
  email: string;
  phone?: string;
  resumeUrl: string;
}

export interface TechDecision {
  topic: string;
  choice: string;
  reason: string;
  alternativesConsidered?: string;
}

export interface CaseStudy {
  overview: string;
  problem: string;
  goals: string[];
  systemArchitecture: {
    title: string;
    description: string;
    diagramDescription?: string;
  };
  technicalDecisions: TechDecision[];
  databaseDesign: {
    overview: string;
    modelsOrEntities: {
      name: string;
      description: string;
    }[];
  };
  apiAndRealtime: {
    overview: string;
    endpointsOrEvents: {
      type: 'REST' | 'Socket.IO' | 'Webhook' | 'Cache';
      name: string;
      description: string;
    }[];
  };
  challengesAndSolutions: {
    challenge: string;
    solution: string;
    result: string;
  }[];
  tradeOffsAndLearnings: string[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  badge?: string;
  image?: string;
  shortDescription: string;
  technologies: string[];
  highlights: string[];
  githubUrl?: string;
  liveUrl?: string;
  caseStudy?: CaseStudy;
  featured: boolean;
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  badge?: string;
  overview: string;
  contributions: string[];
  technologies: string[];
}

export interface EngineeringNote {
  id: string;
  title: string;
  date: string;
  readTime: string;
  topic: string;
  summary: string;
  tags?: string[];
  featured?: boolean;
  keyTakeaways: string[];
  htmlContent?: string;
  contentMarkdown?: string;
  contentSections?: {
    heading: string;
    text: string;
    codeSnippet?: {
      language: string;
      code: string;
      caption?: string;
    };
  }[];
}
