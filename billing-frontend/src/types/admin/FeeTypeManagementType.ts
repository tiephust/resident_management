export interface FeeType {
    id: number;
    name: string;
    category: string;
    unit: string;
    pricePerUnit: number;
    billingCycle: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NewFeeType {
    name: string;
    category: string;
    unit: string;
    pricePerUnit: number;
    billingCycle: string;
    description: string;
    isActive: boolean;
} 