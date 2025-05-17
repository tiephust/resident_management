import axiosInstance from '../axiosInstance';
import { Fee, NewFee, FeeFilter } from '../../types/admin/FeeManagementType';

export const managementFeeService = {
    async getAllFees(): Promise<Fee[]> {
        const response = await axiosInstance.get('/api/fee');
        return response.data;
    },

    async getFeeById(id: number): Promise<Fee> {
        const response = await axiosInstance.get(`/api/fee/${id}`);
        return response.data;
    },

    async createFee(fee: NewFee): Promise<Fee> {
        const response = await axiosInstance.post('/api/fee', fee);
        return response.data;
    },

    async updateFee(id: number, fee: NewFee): Promise<Fee> {
        const response = await axiosInstance.put(`/api/fee/${id}`, fee);
        return response.data;
    },

    async deleteFee(id: number): Promise<void> {
        await axiosInstance.delete(`/api/fee/${id}`);
    },

    async searchFees(searchTerm: string): Promise<Fee[]> {
        const response = await axiosInstance.get(`/api/fee/search?searchTerm=${encodeURIComponent(searchTerm)}`);
        return response.data;
    },

    async getFeesByFilter(filter: FeeFilter): Promise<Fee[]> {
        const params = new URLSearchParams();
        if (filter.residentId) params.append('residentId', filter.residentId.toString());
        if (filter.feeTypeId) params.append('feeTypeId', filter.feeTypeId.toString());
        if (filter.status) params.append('status', filter.status);
        if (filter.startDate) params.append('startDate', filter.startDate);
        if (filter.endDate) params.append('endDate', filter.endDate);

        const response = await axiosInstance.get(`/api/fee/filter?${params.toString()}`);
        return response.data;
    },

    async getFeesByResident(residentId: number): Promise<Fee[]> {
        const response = await axiosInstance.get(`/api/fee/resident/${residentId}`);
        return response.data;
    },

    async getFeesByStatus(status: string): Promise<Fee[]> {
        const response = await axiosInstance.get(`/api/fee/status/${status}`);
        return response.data;
    }
};