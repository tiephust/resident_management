// services/deviceService.ts
import axiosInstance from "../axiosInstance";
import { Device, NewDevice } from '../../types/admin/DeviceManagementType';

const API_URL = 'http://localhost:8080/api/device';

export const deviceService = {
    getAllDevices: async (): Promise<Device[]> => {
        const response = await axiosInstance.get(API_URL);
        return response.data.map((d: any) => ({
            ...d,
            status: mapStatusToFrontend(d.status)
        }));
    },

    getDeviceById: async (id: number): Promise<Device> => {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        const data = response.data;
        return {
            ...data,
            status: mapStatusToFrontend(data.status)
        };
    },

    createDevice: async (device: NewDevice): Promise<Device> => {
        const formattedDevice = {
            ...device,
            status: mapStatusToBackend(device.status),
            maintenanceAt: new Date(device.maintenanceAt).toISOString().slice(0, 19)
        };
        const response = await axiosInstance.post(API_URL, formattedDevice);
        return response.data;
    },

    updateDevice: async (id: number, device: NewDevice): Promise<Device> => {
        const formattedDevice = {
            ...device,
            status: mapStatusToBackend(device.status),
            maintenanceAt: new Date(device.maintenanceAt).toISOString().slice(0, 19)
        };
        const response = await axiosInstance.put(`${API_URL}/${id}`, formattedDevice);
        return response.data;
    },

    deleteDevice: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${API_URL}/${id}`);
    },

    searchDevices: async (searchTerm: string): Promise<Device[]> => {
        const response = await axiosInstance.get(`${API_URL}/search?searchTerm=${searchTerm}`);
        return response.data.map((d: any) => ({
            ...d,
            status: mapStatusToFrontend(d.status)
        }));
    },

    getDevicesByStatus: async (status: string): Promise<Device[]> => {
        const response = await axiosInstance.get(`${API_URL}/status/${mapStatusToBackend(status)}`);
        return response.data.map((d: any) => ({
            ...d,
            status: mapStatusToFrontend(d.status)
        }));
    }
};

// Helper functions for status mapping
function mapStatusToFrontend(status: string): 'ACTIVE' | 'MAINTENANCE' | 'BROKEN' {
    switch (status) {
        case 'ACTIVE': return 'ACTIVE';
        case 'MAINTENANCE': return 'MAINTENANCE';
        case 'BROKEN': return 'BROKEN';
        default: return 'ACTIVE';
    }
}

function mapStatusToBackend(status: string): string {
    switch (status) {
        case 'ACTIVE': return 'ACTIVE';
        case 'MAINTENANCE': return 'MAINTENANCE';
        case 'BROKEN': return 'BROKEN';
        case 'Hoạt động': return 'ACTIVE';
        case 'Bảo trì': return 'MAINTENANCE';
        case 'Hỏng': return 'BROKEN';
        default: return 'ACTIVE';
    }
}