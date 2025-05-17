export interface Fee {
    id: number;
    resident: {
        id: number;
        name: string;
    };
    feeType: {
        id: number;
        name: string;
        category: string;
        unit: string;
        pricePerUnit: number;
    };
    amount: number;
    dueDate: string;
    paymentDate: string | null;
    status: 'PAID' | 'UNPAID' | 'OVERDUE';
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface NewFee {
    resident: {
        id: number;
    };
    feeType: {
        id: number;
    };
    amount: number;
    dueDate: string;
    description: string;
}

export interface FeeFilter {
    residentId?: number;
    feeTypeId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
} 