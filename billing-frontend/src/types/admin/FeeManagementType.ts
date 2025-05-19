export interface Resident {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    unitNumber: string;
    department: string;
    leaseStartDate: string;
    leaseEndDate: string;
    role: string;
    gender: string;
    hometown: string;
    address: string;
    description: string;
    birthday: string;
    stripeCustomerId: string;
    status: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    building?: 's1' | 's2';
}

export interface NewResident {
    name: string;
    email: string;
    phoneNumber: string;
    unitNumber: string;
    department: string;
    leaseStartDate: string | null;
    leaseEndDate: string | null;
    role: string;
    gender: string;
    hometown: string;
    address: string;
    description: string;
    birthday: string | null;
    stripeCustomerId: string;
    status: string;
    isActive: boolean;
    building?: 's1' | 's2';
}

export interface Fee {
    id: number;
    apartment: {
        id: number;
        name: string;
        building?: 's1' | 's2';
        ownerName: string;
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
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface NewFee {
    apartmentId: number;
    feeTypeId: number;
    amount: number;
    dueDate: string | null;
    description: string | null;
}

export interface FeeFilter {
    apartmentId?: number;
    feeTypeId?: number;
    status?: 'PAID' | 'UNPAID' | 'OVERDUE';
    startDate?: string;
    endDate?: string;
}