import axiosInstance from '../axiosInstance';
import { Resident, NewResident } from '../../types/admin/ResidentManagementType';

const API_URL = 'http://localhost:8080/api/resident';

export const managementResidentService = {
  getAllResidents: async () => {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  },

  getResidentById: async (id: number) => {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  },

  createResident: async (resident: NewResident) => {
    const response = await axiosInstance.post(API_URL, resident);
    return response.data;
  },

  updateResident: async (id: number, resident: Partial<Resident>) => {
    const response = await axiosInstance.put(`${API_URL}/${id}`, resident);
    return response.data;
  },

  deleteResident: async (id: number) => {
    await axiosInstance.delete(`${API_URL}/${id}`);
  },

  searchResidents: async (searchTerm: string) => {
    const response = await axiosInstance.get(`${API_URL}/search`, {
      params: { searchTerm }
    });
    return response.data;
  },

  getResidentsByRole: async (role: string) => {
    const response = await axiosInstance.get(`${API_URL}/role/${role}`);
    return response.data;
  }
};