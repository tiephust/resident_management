import axiosInstance from "../axiosInstance";
import { ApartmentDTO, NewApartmentDTO } from '../../types/admin/ApartmentServiceType';

const API_URL = 'http://localhost:8080/api/apartment';

export const managementApartmentService = {
    getAllApartments: async (): Promise<ApartmentDTO[]> => {
        try {
            const response = await axiosInstance.get(API_URL);
            return response.data.map((d: any) => ({
                ...d,
                createdAt: d.createdAt ? d.createdAt.split('T')[0] : null,
                updatedAt: d.updatedAt ? d.updatedAt.split('T')[0] : null,
            }));
        } catch (error) {
            console.error('Lỗi khi lấy danh sách căn hộ:', error);
            throw error;
        }
    },

    getApartmentById: async (id: number): Promise<ApartmentDTO> => {
        try {
            const response = await axiosInstance.get(`${API_URL}/${id}`);
            const data = response.data;
            return {
                ...data,
                createdAt: data.createdAt ? data.createdAt.split('T')[0] : null,
                updatedAt: data.updatedAt ? data.updatedAt.split('T')[0] : null,
            };
        } catch (error) {
            console.error(`Lỗi khi lấy căn hộ với ID ${id}:`, error);
            throw error;
        }
    },

    createApartment: async (apartment: NewApartmentDTO): Promise<ApartmentDTO> => {
        try {
            const response = await axiosInstance.post(API_URL, apartment);
            const data = response.data;
            return {
                ...data,
                createdAt: data.createdAt ? data.createdAt.split('T')[0] : null,
                updatedAt: data.updatedAt ? data.updatedAt.split('T')[0] : null,
            };
        } catch (error) {
            console.error('Lỗi khi tạo căn hộ:', error);
            throw error;
        }
    },

    updateApartment: async (id: number, apartment: NewApartmentDTO): Promise<ApartmentDTO> => {
        try {
            const response = await axiosInstance.put(`${API_URL}/${id}`, apartment);
            const data = response.data;
            return {
                ...data,
                createdAt: data.createdAt ? data.createdAt.split('T')[0] : null,
                updatedAt: data.updatedAt ? data.updatedAt.split('T')[0] : null,
            };
        } catch (error) {
            console.error(`Lỗi khi cập nhật căn hộ với ID ${id}:`, error);
            throw error;
        }
    },

    deleteApartment: async (id: number): Promise<void> => {
        try {
            await axiosInstance.delete(`${API_URL}/${id}`);
        } catch (error) {
            console.error(`Lỗi khi xóa căn hộ với ID ${id}:`, error);
            throw error;
        }
    },

    searchApartments: async (searchTerm: string): Promise<ApartmentDTO[]> => {
        try {
            const response = await axiosInstance.get(`${API_URL}/search?searchTerm=${searchTerm}`);
            return response.data.map((d: any) => ({
                ...d,
                createdAt: d.createdAt ? d.createdAt.split('T')[0] : null,
                updatedAt: d.updatedAt ? d.updatedAt.split('T')[0] : null,
            }));
        } catch (error) {
            console.error('Lỗi khi tìm kiếm căn hộ:', error);
            throw error;
        }
    },
};