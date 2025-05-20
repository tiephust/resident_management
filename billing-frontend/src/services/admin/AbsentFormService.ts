import axiosInstance from '../axiosInstance';
import { AbsentForm, FormState } from '../../types/AbsentFormType';

const API_URL = 'http://localhost:8080/api/absent-forms';

export const absentFormService = {
    getAllAbsentForms: async (): Promise<AbsentForm[]> => {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    },

    createAbsentForm: async (form: Omit<AbsentForm, 'id' | 'residentName' | 'createdAt' | 'updatedAt'>): Promise<AbsentForm> => {
        const response = await axiosInstance.post(API_URL, form);
        return response.data;
    },

    getAbsentFormById: async (id: number): Promise<AbsentForm> => {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    },

    updateAbsentFormState: async (id: number, state: FormState): Promise<AbsentForm> => {
        const response = await axiosInstance.put(`${API_URL}/${id}/state`, null, { params: { state } });
        return response.data;
    },

    getAbsentFormsByResidentId: async (residentId: number): Promise<AbsentForm[]> => {
        const response = await axiosInstance.get(`${API_URL}/resident/${residentId}`);
        return response.data;
    },

    getAbsentFormsByState: async (state: FormState): Promise<AbsentForm[]> => {
        const response = await axiosInstance.get(`${API_URL}/state/${state}`);
        return response.data;
    },

    deleteAbsentForm: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${API_URL}/${id}`);
    },
};