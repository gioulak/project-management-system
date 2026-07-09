import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost';
const USER_PORT = import.meta.env.VITE_USER_SERVICE_PORT || '8080';
const TEAM_PORT = import.meta.env.VITE_TEAM_SERVICE_PORT || '8081';
const TASK_PORT = import.meta.env.VITE_TASK_SERVICE_PORT || '8082';

// Create axios instances for each service
const userAPI = axios.create({
  baseURL: `${API_BASE}:${USER_PORT}/api`,
});

const teamAPI = axios.create({
  baseURL: `${API_BASE}:${TEAM_PORT}/api`,
});

const taskAPI = axios.create({
  baseURL: `${API_BASE}:${TASK_PORT}/api`,
});

// Add token to requests
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

userAPI.interceptors.request.use(addAuthToken);
teamAPI.interceptors.request.use(addAuthToken);
taskAPI.interceptors.request.use(addAuthToken);

// Handle 401 errors (redirect to login)
const handle401 = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

userAPI.interceptors.response.use(response => response, handle401);
teamAPI.interceptors.response.use(response => response, handle401);
taskAPI.interceptors.response.use(response => response, handle401);

// ===== USER SERVICE =====
export const authService = {
  login: (credentials) => userAPI.post('/auth/login', credentials),
  signup: (userData) => userAPI.post('/auth/signup', userData),
  getProfile: () => userAPI.get('/auth/profile'),
};

export const adminService = {
  getAllUsers: () => userAPI.get('/admin/users'),
  getUserById: (id) => userAPI.get(`/admin/users/${id}`),
  activateUser: (id) => userAPI.put(`/admin/users/${id}/activate`),
  deactivateUser: (id) => userAPI.put(`/admin/users/${id}/deactivate`),
  updateUserRole: (id, role) => userAPI.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => userAPI.delete(`/admin/users/${id}`),
};

// ===== TEAM SERVICE =====
export const teamService = {
  createTeam: (teamData) => teamAPI.post('/teams', teamData),
  getAllTeams: () => teamAPI.get('/teams'),
  getTeamById: (id) => teamAPI.get(`/teams/${id}`),
  updateTeam: (id, teamData) => teamAPI.put(`/teams/${id}`, teamData),
  addMember: (teamId, userId) => teamAPI.post(`/teams/${teamId}/members`, { userId }),
  removeMember: (teamId, userId) => teamAPI.delete(`/teams/${teamId}/members/${userId}`),
  deleteTeam: (id) => teamAPI.delete(`/teams/${id}`),
};

// ===== TASK SERVICE =====
export const taskService = {
  createTask: (taskData) => taskAPI.post('/tasks', taskData),
  getAllTasks: (params) => taskAPI.get('/tasks', { params }),
  getMyTasks: (params) => taskAPI.get('/tasks/my-tasks', { params }),
  getTasksByTeam: (teamId, params) => taskAPI.get(`/tasks/team/${teamId}`, { params }),
  getTaskById: (id) => taskAPI.get(`/tasks/${id}`),
  updateTask: (id, taskData) => taskAPI.put(`/tasks/${id}`, taskData),
  updateTaskStatus: (id, status) => taskAPI.patch(`/tasks/${id}/status`, { status }),
  deleteTask: (id) => taskAPI.delete(`/tasks/${id}`),
  addComment: (id, text) => taskAPI.post(`/tasks/${id}/comments`, { text }),
};

export default { authService, adminService, teamService, taskService };
