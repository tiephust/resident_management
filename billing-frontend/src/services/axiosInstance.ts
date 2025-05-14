import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Sending request to:', config.url, 'with data:', config.data);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Received response from:', response.config.url, 'status:', response.status);
        console.log('Response headers:', response.headers);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/api/auth/login')
        ) {
            originalRequest._retry = true;
            try {
                const refreshToken = Cookies.get('refreshToken');
                if (!refreshToken) {
                    console.error('No refresh token available');
                    throw new Error('No refresh token available');
                }

                console.log('Attempting to refresh token');
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/auth/refresh`,
                    { refreshToken },
                    { withCredentials: true }
                );

                const { accessToken } = response.data;
                console.log('New access token received');
                Cookies.set('accessToken', accessToken, {
                    expires: 1,
                    secure: false,
                    sameSite: 'none'
                });

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                Cookies.remove('userRole');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        console.error('Response error:', error.response?.status, error.response?.data, error.config.url);
        return Promise.reject(error);
    }
);

export default axiosInstance;