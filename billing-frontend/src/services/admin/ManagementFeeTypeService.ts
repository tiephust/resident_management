import axiosInstance from '../axiosInstance';
import { FeeType, NewFeeType } from '../../types/admin/FeeTypeManagementType';

const API_URL = 'http://localhost:8080/api/fee-type';

export const managementFeeTypeService = {
    getAllFeeTypes: async () => {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    },

    getFeeTypeById: async (id: number) => {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    },

    createFeeType: async (feeType: NewFeeType) => {
        const response = await axiosInstance.post(API_URL, feeType);
        return response.data;
    },

    updateFeeType: async (id: number, feeType: Partial<FeeType>) => {
        const response = await axiosInstance.put(`${API_URL}/${id}`, feeType);
        return response.data;
    },

    deleteFeeType: async (id: number) => {
        await axiosInstance.delete(`${API_URL}/${id}`);
    },

    searchFeeTypes: async (searchTerm: string) => {
        const response = await axiosInstance.get(`${API_URL}/search`, {
            params: { searchTerm }
        });
        return response.data;
    },

    getFeeTypesByCategory: async (category: string) => {
        const response = await axiosInstance.get(`${API_URL}/category/${category}`);
        return response.data;
    }
}; 