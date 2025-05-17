import axiosInstance from './axiosInstance';

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

class AuthService {
    private static instance: AuthService;
    private userInfo: UserInfo | null = null;

    private constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async login(email: string, password: string): Promise<UserInfo | null> {
        try {
            console.log('Attempting login for email:', email);
            const loginResponse = await axiosInstance.post<Token>('/api/auth/login', {
                email,
                password
            });

            console.log('Login response:', loginResponse.data);
            if (!loginResponse.data || !loginResponse.data.refreshToken) {
                console.error('Invalid login response:', loginResponse.data);
                throw new Error('Invalid login response');
            }

            // Lưu refreshToken và accessToken vào localStorage
            localStorage.setItem('refreshToken', loginResponse.data.refreshToken);
            localStorage.setItem('accessToken', loginResponse.data.accessToken);

            console.log('Tokens set in localStorage: accessToken, refreshToken');
            console.log('Access token in localStorage:', localStorage.getItem('accessToken'));

            const userInfo = await this.getUserInfo();
            if (userInfo) {
                localStorage.setItem('userRole', userInfo.role);
                console.log('User info fetched:', userInfo);
                return userInfo;
            } else {
                console.error('Failed to fetch user info');
                throw new Error('Không thể lấy thông tin người dùng');
            }
        } catch (error: any) {
            console.error('Login error:', error.message, error.response?.status, error.response?.data);
            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error('Yêu cầu đăng nhập bị từ chối. Vui lòng kiểm tra lại thông tin.');
                }
                throw new Error(error.response.data || 'Email hoặc mật khẩu không đúng');
            } else if (error.request) {
                throw new Error('Không thể kết nối đến máy chủ');
            } else {
                throw new Error('Có lỗi xảy ra khi đăng nhập');
            }
        }
    }

    public async logout(): Promise<void> {
        try {
            await axiosInstance.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.userInfo = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userRole');
            window.location.href = '/login';
        }
    }

    public isAuthenticated(): boolean {
        const token = localStorage.getItem('accessToken');
        console.log('Checking authentication, accessToken:', token ? 'exists' : 'not found');
        return !!token;
    }

    public async getUserInfo(): Promise<UserInfo | null> {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.log('No access token found in localStorage');
                return null;
            }

            console.log('Fetching user info...');
            const response = await axiosInstance.get<UserInfo>('/api/user/me');

            if (!response.data) {
                console.log('Invalid user info response');
                throw new Error('Invalid user info response');
            }

            this.userInfo = response.data;
            console.log('User info fetched:', this.userInfo);
            if (this.userInfo) {
                localStorage.setItem('userRole', this.userInfo.role);
            }
            return this.userInfo;
        } catch (error) {
            console.error('Error fetching user info:', error);
            this.userInfo = null;
            return null;
        }
    }

    public async getCurrentUser(): Promise<UserInfo | null> {
        if (this.userInfo) {
            return this.userInfo;
        }
        return this.getUserInfo();
    }
}

export default AuthService.getInstance();