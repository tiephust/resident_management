import axiosInstance from './axiosInstance';
import { FeeDTO, PaymentRequestDTO, RefundRequestDTO } from '../types/fee';

export const feeService = {
    getPayments: async (status: string = 'ALL', residentName: string = ''): Promise<FeeDTO[]> => {
        try {
            const response = await axiosInstance.get('/api/payments/admin', {
                params: { status, resident: residentName }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching payments:', error);
            throw error;
        }
    },

    createPaymentIntent: async (paymentData: PaymentRequestDTO): Promise<{ clientSecret: string }> => {
        try {
            const response = await axiosInstance.post('/api/payments/create-payment-intent', paymentData);
            return response.data;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    },

    confirmPayment: async (feeId: string, stripePaymentId: string): Promise<void> => {
        try {
            await axiosInstance.post('/api/payments/confirm', {
                feeId,
                stripePaymentId
            });
        } catch (error) {
            console.error('Error confirming payment:', error);
            throw error;
        }
    },

    processRefund: async (feeId: number, paymentIntentId: string): Promise<void> => {
        try {
            await axiosInstance.post(`/api/payments/refund/${feeId}`, {
                feeId,
                paymentIntentId
            });
        } catch (error) {
            console.error('Error processing refund:', error);
            throw error;
        }
    },

    createFee: async (fee: FeeDTO): Promise<FeeDTO> => {
        try {
            const response = await axiosInstance.post('/api/payments', fee);
            return response.data;
        } catch (error) {
            console.error('Error creating fee:', error);
            throw error;
        }
    },

    updateFee: async (id: number, fee: FeeDTO): Promise<FeeDTO> => {
        try {
            const response = await axiosInstance.put(`/api/payments/${id}`, fee);
            return response.data;
        } catch (error) {
            console.error('Error updating fee:', error);
            throw error;
        }
    },

    deleteFee: async (id: number): Promise<void> => {
        try {
            await axiosInstance.delete(`/api/payments/${id}`);
        } catch (error) {
            console.error('Error deleting fee:', error);
            throw error;
        }
    },

    searchFees: async (searchTerm: string): Promise<FeeDTO[]> => {
        try {
            const response = await axiosInstance.get('/api/payments/search', {
                params: { searchTerm }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching fees:', error);
            throw error;
        }
    }
};