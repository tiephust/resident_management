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