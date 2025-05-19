import axiosInstance from "../axiosInstance";
import { ApartmentDetail, NewApartment } from '../../types/admin/ApartmentManagementType';

const API_URL = 'http://localhost:8080/api/apartment';

export const apartmentService = {
    getAllApartments: async (): Promise<ApartmentDetail[]> => {
        const response = await axiosInstance.get(API_URL);
        return response.data.map((d: any) => ({
            ...d,
            createdAt: d.createdAt ? d.createdAt.split('T')[0] : null,
            updatedAt: d.updatedAt ? d.updatedAt.split('T')[0] : null,
        }));
    },

    getApartmentById: async (id: number): Promise<ApartmentDetail> => {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        const data = response.data;
        return {
            ...data,
            createdAt: data.createdAt ? data.createdAt.split('T')[0] : null,
            updatedAt: data.updatedAt ? data.updatedAt.split('T')[0] : null,
        };
    },

    createApartment: async (apartment: NewApartment): Promise<ApartmentDetail> => {
        const response = await axiosInstance.post(API_URL, {
            name: apartment.name,
            apartmentOwnerId: apartment.apartmentOwnerId,
            description: apartment.description,
        });
        return response.data;
    },

    updateApartment: async (id: number, apartment: NewApartment): Promise<ApartmentDetail> => {
        const response = await axiosInstance.put(`${API_URL}/${id}`, {
            name: apartment.name,
            apartmentOwnerId: apartment.apartmentOwnerId,
            description: apartment.description,
        });
        return response.data;
    },

    deleteApartment: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${API_URL}/${id}`);
    },

    searchApartments: async (searchTerm: string): Promise<ApartmentDetail[]> => {
        const response = await axiosInstance.get(`${API_URL}/search?searchTerm=${searchTerm}`);
        return response.data.map((d: any) => ({
            ...d,
            createdAt: d.createdAt ? d.createdAt.split('T')[0] : null,
            updatedAt: d.updatedAt ? d.updatedAt.split('T')[0] : null,
        }));
    },
};