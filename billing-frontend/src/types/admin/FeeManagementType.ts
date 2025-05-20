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
    apartmentId: number;
    feeTypeId: number;
    amount: number;
    dueDate: string;
    paymentDate: string | null;
    status: 'PAID' | 'UNPAID' | 'OVERDUE' | 'PROCESSING';
    description: string | null;
    stripePaymentIntentId: string | null;
    stripePaymentStatus: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface NewFee {
    apartmentId: number;
    feeTypeId: number;
    amount: number;
    dueDate: string;
    description: string | null;
    status: 'PAID' | 'UNPAID' | 'OVERDUE' | 'PROCESSING';
}

export interface FeeFilter {
    apartmentId?: number;
    feeTypeId?: number;
    status?: 'PAID' | 'UNPAID' | 'OVERDUE' | 'PROCESSING';
    startDate?: string;
    endDate?: string;
}