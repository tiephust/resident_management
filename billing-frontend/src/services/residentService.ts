import axios from 'axios';

const API_URL = 'http://localhost:8080/api/resident';

export interface Resident {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  unitNumber: string;
  department: string;
  leaseStartDate: string;
  leaseEndDate: string;
  status: string;
}

export const residentService = {
  getAllResidents: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getResidentById: async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createResident: async (resident: Omit<Resident, 'id'>) => {
    const response = await axios.post(API_URL, resident);
    return response.data;
  },

  updateResident: async (id: number, resident: Partial<Resident>) => {
    const response = await axios.put(`${API_URL}/${id}`, resident);
    return response.data;
  },

  deleteResident: async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
  },

  searchResidents: async (searchTerm: string) => {
    const response = await axios.get(`${API_URL}/search`, {
      params: { searchTerm }
    });
    return response.data;
  },

  getResidentsByStatus: async (status: string) => {
    const response = await axios.get(`${API_URL}/status/${status}`);
    return response.data;
  }
}; 