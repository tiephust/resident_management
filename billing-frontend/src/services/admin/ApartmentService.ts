import axiosInstance from '../axiosInstance';
import { ApartmentDTO, NewApartmentDTO } from '../../types/admin/ApartmentServiceType';

const API_URL = 'http://localhost:8080/api/apartment';

export const apartmentService = {
  getAllApartments: async () => {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  },

  getApartmentById: async (id: number) => {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  },

  searchApartments: async (searchTerm: string) => {
    const response = await axiosInstance.get(`${API_URL}/search`, {
      params: { searchTerm }
    });
    return response.data;
  },

  createApartment: async (apartment: NewApartmentDTO): Promise<ApartmentDTO> => {
    const response = await axiosInstance.post(API_URL, apartment);
    return response.data;
  },

  updateApartment: async (id: number, apartment: ApartmentDTO): Promise<ApartmentDTO> => {
    const response = await axiosInstance.put(`${API_URL}/${id}`, apartment);
    return response.data;
  },

  deleteApartment: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_URL}/${id}`);
  }
};
