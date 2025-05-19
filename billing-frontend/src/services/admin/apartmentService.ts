import axiosInstance from '../axiosInstance';

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
  }
};
