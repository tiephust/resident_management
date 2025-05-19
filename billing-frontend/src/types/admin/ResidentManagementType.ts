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
    password: string;
    gender: string;
    hometown: string;
    address: string;
    description: string;
    birthday: string;
    stripeCustomerId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    bills: any[];
    building?: 's1' | 's2';
    apartmentId?: number;
}

export type NewResident = Omit<Resident, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'bills'>;