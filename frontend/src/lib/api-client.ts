import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error.response?.data || error.message);
      },
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', token);
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }

  async register(data: { email: string; username: string; password: string; displayName?: string }) {
    return this.client.post('/auth/register', data);
  }

  async refreshToken(refreshToken: string) {
    return this.client.post('/auth/refresh', { refreshToken });
  }

  async getMe() {
    return this.client.get('/auth/me');
  }

  // Program endpoints
  async getPrograms(params?: any) {
    return this.client.get('/programs', { params });
  }

  async getProgram(id: string) {
    return this.client.get(`/programs/${id}`);
  }

  async createProgram(data: any) {
    return this.client.post('/programs', data);
  }

  async updateProgram(id: string, data: any) {
    return this.client.patch(`/programs/${id}`, data);
  }

  // Submission endpoints
  async getSubmissions(params?: any) {
    return this.client.get('/submissions', { params });
  }

  async getSubmission(id: string) {
    return this.client.get(`/submissions/${id}`);
  }

  async createSubmission(data: any) {
    return this.client.post('/submissions', data);
  }

  // Report endpoints
  async getReports(params?: any) {
    return this.client.get('/reports', { params });
  }

  async getReport(id: string) {
    return this.client.get(`/reports/${id}`);
  }

  async updateReport(id: string, data: any) {
    return this.client.patch(`/reports/${id}`, data);
  }

  // User endpoints
  async getUsers(params?: any) {
    return this.client.get('/users', { params });
  }

  async getUser(id: string) {
    return this.client.get(`/users/${id}`);
  }

  // File endpoints
  async uploadFile(submissionId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.client.post(`/files/upload/${submissionId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getFileUrl(fileId: string) {
    return this.client.get(`/files/${fileId}/url`);
  }
}

export const apiClient = new ApiClient();
export default apiClient;

