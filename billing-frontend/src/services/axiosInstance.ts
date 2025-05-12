import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = Cookies.get('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Call refresh token endpoint
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/auth/refresh-token`,
                    { refreshToken }
                );

                const { accessToken } = response.data;

                // Update the access token in cookies
                Cookies.set('accessToken', accessToken, {
                    expires: 1,
                    secure: true,
                    sameSite: 'strict'
                });

                // Update the authorization header
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh token fails, logout the user
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance; 