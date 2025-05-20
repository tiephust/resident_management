import axiosInstance from '../axiosInstance';
import {
    FeeDTO,
    NewFeeDTO,
    PaymentRequestDTO,
    RefundRequestDTO
} from '../../types/fee';

export const FeeService = {
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

    createPaymentIntent: async (paymentData: PaymentRequestDTO): Promise<{ clientSecret: string }> => {
        try {
            const response = await axiosInstance.post('/api/fee/payment-intent', paymentData);
            return response.data;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    },

    confirmPayment: async (feeId: number, stripePaymentId: string, residentId: number): Promise<FeeDTO> => {
        try {
            const response = await axiosInstance.post('/api/fee/confirm-payment', null, {
                params: { feeId, stripePaymentId, residentId }
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

export interface FeeDTO {
    id: number;
    apartmentId: number;
    feeTypeId: number;
    residentId: number;
    amount: number;
    dueDate: string;
    paymentDate: string | null;
    status: 'PAID' | 'UNPAID' | 'OVERDUE';
    description: string | null;
    stripePaymentIntentId: string | null;
    stripePaymentStatus: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface NewFeeDTO {
    apartmentId: number;
    feeTypeId: number;
    amount: number;
    dueDate: string;
    description: string | null;
    status: 'PAID' | 'UNPAID' | 'OVERDUE';
    residentId: number;
}

export interface PaymentRequestDTO {
    feeId: string;
    residentId: string;
    amount: number;
    paymentMethodId: string;
}

export interface RefundRequestDTO {
    feeId: string;
    paymentIntentId: string;
}