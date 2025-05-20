import axiosInstance from './axiosInstance';
import { Profile } from '../types/Profile';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const userService = {
    getCurrentUser: async (): Promise<Profile> => {
        const response = await axiosInstance.get(`${API_URL}/api/user/me`);
        const userData = response.data;
        return {
            id: userData.id,
            name: userData.name,
            role: userData.role === 'RESIDENT' ? 'Cư dân' : 'Ban quản lý',
            email: userData.email,
            phone: userData.phone || '',
            address: userData.address || '',
            apartment: userData.apartment || null,
            avatar: userData.avatar || null
        };
    },

    updateProfile: async (profile: Profile): Promise<Profile> => {
        const response = await axiosInstance.put(`${API_URL}/api/user/me`, {
            name: profile.name,
            phone: profile.phone,
            address: profile.address
        });
        const userData = response.data;
        return {
            id: userData.id,
            name: userData.name,
            role: userData.role === 'RESIDENT' ? 'Cư dân' : 'Ban quản lý',
            email: userData.email,
            phone: userData.phone || '',
            address: userData.address || '',
            apartment: userData.apartment || null,
            avatar: userData.avatar || null
        };
    },

    changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> => {
        await axiosInstance.put(`${API_URL}/api/user/me/password`, {
            currentPassword,
            newPassword,
            confirmPassword
        });
    }
};
