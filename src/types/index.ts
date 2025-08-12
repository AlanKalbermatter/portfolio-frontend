// Types para las entidades del backend
export interface PersonalInfo {
  id: number;
  name: string;
  jobTitle: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  profileImageUrl?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  isFeatured: boolean;
  displayOrder: number;
}

export interface Experience {
  id: number;
  position: string;
  company: string;
  companyUrl?: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  displayOrder: number;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  iconUrl?: string;
  displayOrder: number;
  isFeatured: boolean;
}

export interface PortfolioSummary {
  personalInfo?: PersonalInfo;
  featuredProjects: Project[];
  currentExperience: Experience[];
  featuredSkills: Skill[];
  stats: {
    totalProjects: number;
    totalExperiences: number;
    totalSkills: number;
  };
}
