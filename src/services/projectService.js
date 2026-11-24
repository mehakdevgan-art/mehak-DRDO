import { request } from './apiClient';
export const getProjects = (params = {}) => request(`/projects?${new URLSearchParams({ page: 1, page_size: 100, ...params })}`);
export const getProject = (id) => request(`/projects/${id}`);
