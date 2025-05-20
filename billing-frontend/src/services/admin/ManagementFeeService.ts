import axiosInstance from '../axiosInstance';
import { Fee, NewFee, FeeFilter } from '../../types/admin/FeeManagementType';
import { FeeDTO } from '../../types/fee';

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

    async getFeesByApartment(apartmentId: number): Promise<Fee[]> {
        const response = await axiosInstance.get(`/api/fee/apartment/${apartmentId}`);
        return response.data;
    },

    async getFeesByStatus(status: string): Promise<Fee[]> {
        const response = await axiosInstance.get(`/api/fee/status/${status}`);
        return response.data;
    },

    async getFeesByFilter(filter: FeeFilter): Promise<Fee[]> {
        const response = await axiosInstance.get('/api/fee/filter', { params: filter });
        return response.data;
    },

    async searchFees(searchTerm: string): Promise<Fee[]> {
        const response = await axiosInstance.get(`/api/fee/search?searchTerm=${encodeURIComponent(searchTerm)}`);
        return response.data;
    },

    getFees: async (status?: string, residentId?: number): Promise<FeeDTO[]> => {
        try {
            const response = await axiosInstance.get('/api/fee/filter', {
                params: { status, residentId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching filtered fees:', error);
            throw error;
        }
    },


    async getFeesByResident(residentId: number): Promise<Fee[]> {
        const response = await axiosInstance.get(`/api/fee/resident/${residentId}`);
        return response.data;
    },

    // Payment related methods
    async createPaymentIntent(request: { feeId: number }): Promise<Fee> {
        const response = await axiosInstance.post('/api/fee/payment-intent', request);
        return response.data;
    },

    async confirmPayment(feeId: number, stripePaymentId: string): Promise<Fee> {
        const response = await axiosInstance.post('/api/fee/confirm-payment', null, {
            params: {
                feeId,
                stripePaymentId
            }
        });
        return response.data;
    },

    async processRefund(request: { feeId: number, reason: string }): Promise<Fee> {
        const response = await axiosInstance.post('/api/fee/refund', request);
        return response.data;
    }
};