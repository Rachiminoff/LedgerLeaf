export interface AboutData {
  applicationName: string;
  description: string;
  mission: string;
  keyFeatures: {
    title: string;
    description: string;
  }[];
  philosophy: string;
}

export interface GettingStartedStep {
  step: number;
  title: string;
  icon: string;
  description: string;
  details: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface FinancialConcept {
  title: string;
  icon: string;
  explanation: string;
  example: string;
}

export interface AppInfo {
  applicationName: string;
  version: string;
  developer: string;
  description: string;

  project: {
    type: string;
    category: string;
    purpose: string;
  };

  technologies: {
    frontend: string[];
    backend: string[];
    database: string[];
  };

  features: string[];
  platforms: string[];

  lastUpdated: string;
  repository: string;
  license: string;
}