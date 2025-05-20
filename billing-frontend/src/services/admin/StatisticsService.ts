// services/StatisticsService.ts

import axiosInstance from '../axiosInstance';
import {
    StatisticsData,
    StatisticsFilter
} from '../../types/admin/StatisticsType';

const API_URL = '/api/statistics';

export const StatisticsService = {
    async getStatistics(filter: StatisticsFilter = {}): Promise<StatisticsData> {
        try {
            const response = await axiosInstance.get(API_URL, {
                params: filter
            });

            // Transform data to match our types
            const data = response.data;

            return {
                residentStats: data.residentStats || [],
                financialStats: data.financialStats || [],
                serviceStats: data.serviceStats || [],
                totalResidents: data.totalResidents || 0,
                totalApartments: data.totalApartments || 0
            };
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    },

    // You can add more specific methods if needed
    async getResidentStats(buildingId?: string): Promise<ResidentStat[]> {
        const response = await axiosInstance.get(`${API_URL}/residents`, {
            params: { buildingId }
        });
        return response.data;
    },

    async getFinancialStats(startDate?: string, endDate?: string): Promise<FinancialStat[]> {
        const response = await axiosInstance.get(`${API_URL}/financial`, {
            params: { startDate, endDate }
        });
        return response.data;
    },

    async getServiceStats(buildingId?: string): Promise<ServiceStat[]> {
        const response = await axiosInstance.get(`${API_URL}/services`, {
            params: { buildingId }
        });
        return response.data;
    }
};