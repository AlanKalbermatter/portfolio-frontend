import axios, { AxiosResponse } from 'axios';
import {
  Project,
  PersonalInfo,
  Experience,
  Skill,
  SkillCategory,
  PortfolioData,
  CreateProject,
  UpdateProject,
  CreatePersonalInfo,
  UpdatePersonalInfo,
  CreateExperience,
  UpdateExperience,
  CreateSkill,
  UpdateSkill
} from '../types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects API
export const projectsApi = {
  getAll: (): Promise<AxiosResponse<Project[]>> =>
    api.get('/api/projects'),

  getFeatured: (): Promise<AxiosResponse<Project[]>> =>
    api.get('/api/projects/featured'),

  getById: (id: number): Promise<AxiosResponse<Project>> =>
    api.get(`/api/projects/${id}`),

  search: (query: string): Promise<AxiosResponse<Project[]>> =>
    api.get(`/api/projects/search?query=${encodeURIComponent(query)}`),

  getByTechnology: (tech: string): Promise<AxiosResponse<Project[]>> =>
    api.get(`/api/projects/technology/${encodeURIComponent(tech)}`),

  create: (data: CreateProject): Promise<AxiosResponse<Project>> =>
    api.post('/api/projects', data),

  update: (id: number, data: UpdateProject): Promise<AxiosResponse<Project>> =>
    api.put(`/api/projects/${id}`, data),

  delete: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/api/projects/${id}`)
};

// Personal Info API
export const personalInfoApi = {
  get: (): Promise<AxiosResponse<PersonalInfo>> =>
    api.get('/api/personal-info'),

  create: (data: CreatePersonalInfo): Promise<AxiosResponse<PersonalInfo>> =>
    api.post('/api/personal-info', data),

  update: (data: UpdatePersonalInfo): Promise<AxiosResponse<PersonalInfo>> =>
    api.put('/api/personal-info', data)
};

// Experience API
export const experienceApi = {
  getAll: (): Promise<AxiosResponse<Experience[]>> =>
    api.get('/api/experiences'),

  getCurrent: (): Promise<AxiosResponse<Experience[]>> =>
    api.get('/api/experiences/current'),

  getById: (id: number): Promise<AxiosResponse<Experience>> =>
    api.get(`/api/experiences/${id}`),

  searchByCompany: (company: string): Promise<AxiosResponse<Experience[]>> =>
    api.get(`/api/experiences/search/company?company=${encodeURIComponent(company)}`),

  searchByPosition: (position: string): Promise<AxiosResponse<Experience[]>> =>
    api.get(`/api/experiences/search/position?position=${encodeURIComponent(position)}`),

  create: (data: CreateExperience): Promise<AxiosResponse<Experience>> =>
    api.post('/api/experiences', data),

  update: (id: number, data: UpdateExperience): Promise<AxiosResponse<Experience>> =>
    api.put(`/api/experiences/${id}`, data),

  delete: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/api/experiences/${id}`)
};

// Skills API
export const skillsApi = {
  getAll: (): Promise<AxiosResponse<Skill[]>> =>
    api.get('/api/skills'),

  getByCategory: (category: SkillCategory): Promise<AxiosResponse<Skill[]>> =>
    api.get(`/api/skills/category/${category}`),

  getById: (id: number): Promise<AxiosResponse<Skill>> =>
    api.get(`/api/skills/${id}`),

  create: (data: CreateSkill): Promise<AxiosResponse<Skill>> =>
    api.post('/api/skills', data),

  update: (id: number, data: UpdateSkill): Promise<AxiosResponse<Skill>> =>
    api.put(`/api/skills/${id}`, data),

  delete: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/api/skills/${id}`)
};

// Portfolio Summary API
export const portfolioApi = {
  getComplete: (): Promise<AxiosResponse<PortfolioData>> =>
    api.get('/api/portfolio')
};

// Error handling utility
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    console.error('API Error:', error.response.data);
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response received
    console.error('Network Error:', error.request);
    return 'Network error - please check your connection';
  } else {
    // Something else happened
    console.error('Error:', error.message);
    return error.message;
  }
};

export default api;
