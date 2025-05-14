import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'RESIDENT' | 'ADMIN';
  unitNumber?: string;
  phoneNumber?: string;
  department?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    name: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post('/api/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/api/auth/reset-password', { token, newPassword });
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  getCurrentUser(): AuthResponse['user'] | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // In a real app, you might want to decode the JWT token here
    // For now, we'll just return a mock user
    return {
      id: 1,
      email: 'user@example.com',
      role: 'RESIDENT',
      name: 'John Doe'
    };
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService(); 