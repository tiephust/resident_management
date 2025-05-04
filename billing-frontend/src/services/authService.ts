import axiosInstance from './axiosInstance';
import Cookies from 'js-cookie';

interface UserInfo {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Token {
    accessToken: string;
    refreshToken: string;
}

interface LoginResponse {
    token: Token;
    userRole: string;
}

class AuthService {
    private static instance: AuthService;
    private userInfo: UserInfo | null = null;

    private constructor() {
        // Private constructor to enforce singleton pattern
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async login(email: string, password: string): Promise<LoginResponse> {
        try {
            const loginResponse = await axiosInstance.post<LoginResponse>('/auth/login', {
                email,
                password
            });
            
            console.log('Login response:', loginResponse.data);
            
            if (!loginResponse.data || !loginResponse.data.token) {
                throw new Error('Invalid login response');
            }

            // Lưu token vào cookie
            Cookies.set('accessToken', loginResponse.data.token.accessToken, { 
                expires: 1, // 1 ngày
                secure: true,
                sameSite: 'strict'
            });
            
            Cookies.set('refreshToken', loginResponse.data.token.refreshToken, {
                expires: 7, // 7 ngày
                secure: true,
                sameSite: 'strict'
            });
            
            return loginResponse.data;
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                throw new Error(error.response.data.message || 'Email hoặc mật khẩu không đúng');
            } else if (error.request) {
                console.error('No response received:', error.request);
                throw new Error('Không thể kết nối đến máy chủ');
            } else {
                console.error('Error setting up request:', error.message);
                throw new Error('Có lỗi xảy ra khi đăng nhập');
            }
        }
    }

    public async logout(): Promise<void> {
        try {
            const accessToken = Cookies.get('accessToken');
            if (accessToken) {
                await axiosInstance.post('/auth/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.userInfo = null;
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            window.location.href = '/login';
        }
    }

    public isAuthenticated(): boolean {
        return !!Cookies.get('accessToken');
    }

    public async getUserInfo(): Promise<UserInfo | null> {
        try {
            const response = await axiosInstance.get<UserInfo>('/user/me');
            
            if (!response.data) {
                throw new Error('Invalid user info response');
            }
            
            this.userInfo = response.data;
            return this.userInfo;
        } catch (error) {
            console.error('Get user info error:', error);
            this.userInfo = null;
            return null;
        }
    }

    public async getCurrentUser(): Promise<UserInfo | null> {
        const user = await this.getUserInfo();
        console.log(user);
        return user;
    }

    public isAdmin(): boolean {
        return this.userInfo?.role === 'ADMIN';
    }

    public isResident(): boolean {
        return this.userInfo?.role === 'RESIDENT';
    }
}

export default AuthService.getInstance(); 