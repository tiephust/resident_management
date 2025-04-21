import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}

export const authService = {
    login: async (loginRequest: LoginCredentials): Promise<LoginResponse> => {
        const response = await axios.post<LoginResponse>(`${API_URL}/login`, loginRequest, {
            withCredentials: true
        });
        return response.data;
    },

    logout: async (): Promise<void> => {
        await axios.post(`${API_URL}/logout`, {}, {
            withCredentials: true
        });
        // Clear local storage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

    getCurrentUser: (): LoginResponse['user'] | null => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('user');
    },

    isAdmin: (): boolean => {
        const user = authService.getCurrentUser();
        return user?.role === 'ADMIN';
    },

    isResident: (): boolean => {
        const user = authService.getCurrentUser();
        return user?.role === 'RESIDENT';
    },

    getAuthHeader: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const data = JSON.parse(userStr);
            return { Authorization: `Bearer ${data.token}` };
        }
        return {};
    }
}; 