import axiosInstance from '../axiosInstance';
import { FeeDTO, NewFeeDTO, PaymentRequestDTO, RefundRequestDTO } from '../../types/fee';

export const managementFeeService = {
    getAllFees: async (): Promise<FeeDTO[]> => {
        try {
            const response = await axiosInstance.get('/api/fee');
            return response.data;
        } catch (error) {
            console.error('Error fetching fees:', error);
            throw error;
        }
    },

    getFeeById: async (id: number): Promise<FeeDTO> => {
        try {
            const response = await axiosInstance.get(`/api/fee/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching fee:', error);
            throw error;
        }
    },

    createFee: async (fee: NewFeeDTO): Promise<FeeDTO> => {
        try {
            const response = await axiosInstance.post('/api/fee', fee);
            return response.data;
        } catch (error) {
            console.error('Error creating fee:', error);
            throw error;
        }
    },

    updateFee: async (id: number, fee: NewFeeDTO): Promise<FeeDTO> => {
        try {
            const response = await axiosInstance.put(`/api/fee/${id}`, fee);
            return response.data;
        } catch (error) {
            console.error('Error updating fee:', error);
            throw error;
        }
    },

    deleteFee: async (id: number): Promise<void> => {
        try {
            await axiosInstance.delete(`/api/fee/${id}`);
        } catch (error) {
            console.error('Error deleting fee:', error);
            throw error;
        }
    },

    searchFees: async (searchTerm: string): Promise<FeeDTO[]> => {
        try {
            const response = await axiosInstance.get('/api/fee/search', {
                params: { searchTerm }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching fees:', error);
            throw error;
        }
    },

    getFeesByApartment: async (apartmentId: number): Promise<FeeDTO[]> => {
        try {
            const response = await axiosInstance.get(`/api/fee/apartment/${apartmentId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching apartment fees:', error);
            throw error;
        }
    },

    createPaymentIntent: async (paymentData: PaymentRequestDTO): Promise<{ clientSecret: string }> => {
        try {
            const response = await axiosInstance.post('/api/fee/payment-intent', paymentData);
            return response.data;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    },

    confirmPayment: async (feeId: number, stripePaymentId: string): Promise<FeeDTO> => {
        try {
            const response = await axiosInstance.post('/api/fee/confirm-payment', null, {
                params: { feeId, stripePaymentId }
            });
            return response.data;
        } catch (error) {
            console.error('Error confirming payment:', error);
            throw error;
        }
    },

    processRefund: async (request: RefundRequestDTO): Promise<FeeDTO> => {
        try {
            const response = await axiosInstance.post('/api/fee/refund', request);
            return response.data;
        } catch (error) {
            console.error('Error processing refund:', error);
            throw error;
        }
    }
};