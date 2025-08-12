import axios from 'axios';
import { PersonalInfo, Project, Experience, Skill } from '../types';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Personal Info API
export const personalInfoApi = {
  get: () => api.get<PersonalInfo>('/personal-info'),
  update: (id: number, data: Partial<PersonalInfo>) => api.put<PersonalInfo>(`/personal-info/${id}`, data),
};

// Projects API
export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects'),
  create: (data: Omit<Project, 'id'>) => api.post<Project>('/projects', data),
  update: (id: number, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

// Experiences API
export const experiencesApi = {
  getAll: () => api.get<Experience[]>('/experiences'),
  create: (data: Omit<Experience, 'id'>) => api.post<Experience>('/experiences', data),
  update: (id: number, data: Partial<Experience>) => api.put<Experience>(`/experiences/${id}`, data),
  delete: (id: number) => api.delete(`/experiences/${id}`),
};

// Skills API
export const skillsApi = {
  getAll: () => api.get<Skill[]>('/skills'),
  create: (data: Omit<Skill, 'id'>) => api.post<Skill>('/skills', data),
  update: (id: number, data: Partial<Skill>) => api.put<Skill>(`/skills/${id}`, data),
  delete: (id: number) => api.delete(`/skills/${id}`),
};

// Portfolio summary (all info)
export const portfolioApi = {
  get: () => api.get('/portfolio'),
};

export default api;
