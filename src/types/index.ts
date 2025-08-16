// Types based on Spring Boot backend API models

export interface Project {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  isFeatured: boolean;
  displayOrder: number;
}

export interface PersonalInfo {
  id: number;
  fullName: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  summary: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  twitterUrl?: string;
  // Adding frontend-specific properties for backward compatibility
  name?: string; // Will map to fullName
  jobTitle?: string; // Will map to title
  bio?: string; // Will map to summary
  profileImageUrl?: string; // For profile image
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  location?: string;
  technologies: string[];
  // Adding frontend-specific properties
  companyUrl?: string;
  responsibilities?: string[];
}

export interface Skill {
  id: number;
  name: string;
  category: SkillCategory;
  proficiencyLevel: number;
  yearsOfExperience: number;
  // Adding frontend-specific properties for backward compatibility
  level?: number; // Will map to proficiencyLevel
  isFeatured?: boolean;
}

export enum SkillCategory {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  DATABASE = 'DATABASE',
  TOOLS = 'TOOLS',
  OTHER = 'OTHER'
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Create/Update types (without id)
export type CreateProject = Omit<Project, 'id'>;
export type UpdateProject = Partial<Omit<Project, 'id'>>;

export type CreatePersonalInfo = Omit<PersonalInfo, 'id'>;
export type UpdatePersonalInfo = Partial<Omit<PersonalInfo, 'id'>>;

export type CreateExperience = Omit<Experience, 'id'>;
export type UpdateExperience = Partial<Omit<Experience, 'id'>>;

export type CreateSkill = Omit<Skill, 'id'>;
export type UpdateSkill = Partial<Omit<Skill, 'id'>>;
