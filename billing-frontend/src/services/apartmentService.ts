import axiosInstance from "./axiosInstance";
import { ApartmentDTO, NewApartmentDTO } from '../types/admin/ApartmentServiceType';

const API_URL = 'http://localhost:8080/api/apartment';

export const apartmentService = {
    getAllApartments: async (): Promise<ApartmentDTO[]> => {
        const response = await axiosInstance.get(API_URL);
        return response.data.map((d: any) => ({
            ...d,
            createdAt: d.createdAt ? d.createdAt.split('T')[0] : null,
            updatedAt: d.updatedAt ? d.updatedAt.split('T')[0] : null,
        }));
    },

    getApartmentById: async (id: number): Promise<ApartmentDTO> => {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        const data = response.data;
        return {
            ...data,
            createdAt: data.createdAt ? data.createdAt.split('T')[0] : null,
            updatedAt: data.updatedAt ? data.updatedAt.split('T')[0] : null,
        };
    },

    createApartment: async (apartment: NewApartmentDTO): Promise<ApartmentDTO> => {
        const response = await axiosInstance.post(API_URL, apartment);
        return response.data;
    },

    updateApartment: async (id: number, apartment: NewApartmentDTO): Promise<ApartmentDTO> => {
        const response = await axiosInstance.put(`${API_URL}/${id}`, apartment);
        return response.data;
    },

    deleteApartment: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${API_URL}/${id}`);
    },

    searchApartments: async (searchTerm: string): Promise<ApartmentDTO[]> => {
        const response = await axiosInstance.get(`${API_URL}/search?searchTerm=${searchTerm}`);
        return response.data.map((d: any) => ({
            ...d,
            createdAt: d.createdAt ? d.createdAt.split('T')[0] : null,
            updatedAt: d.updatedAt ? d.updatedAt.split('T')[0] : null,
        }));
    },
};