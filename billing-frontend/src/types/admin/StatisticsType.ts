// types/StatisticsType.ts

export interface ResidentStat {
    name: string;
    value: number;
    color?: string;
    total?: string;
}

export interface FinancialStat {
    month: string;
    income: number;
    expenses: number;
    profit: number;
}

export interface ServiceStat {
    id: number;
    name: string;
    value: number;
    total?: string;
}

export interface StatisticsData {
    residentStats: ResidentStat[];
    financialStats: FinancialStat[];
    serviceStats: ServiceStat[];
    totalResidents: number;
    totalApartments: number;
}

export interface StatisticsFilter {
    buildingId?: string;
    startDate?: string;
    endDate?: string;
}