import api from './api';

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  unitNumber?: string;
  phoneNumber?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  phoneNumber?: string;
  department?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class UserService {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/users/profile');
    return response.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await api.put<UserProfile>('/users/profile', data);
    return response.data;
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.put('/users/change-password', data);
  }

  async getResidents(): Promise<UserProfile[]> {
    const response = await api.get<UserProfile[]>('/users/residents');
    return response.data;
  }

  async getAdmins(): Promise<UserProfile[]> {
    const response = await api.get<UserProfile[]>('/users/admins');
    return response.data;
  }
}

export default new UserService(); 