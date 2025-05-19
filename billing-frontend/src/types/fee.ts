export interface FeeDTO {
    id: string;
    residentId: string;
    residentName: string;
    feeTypeId: string;
    feeTypeName: string;
    amount: number;
    dueDate: string;
    paymentDate?: string;
    status: 'PAID' | 'UNPAID' | 'OVERDUE';
    description?: string;
    stripePaymentIntentId?: string;
    stripePaymentStatus?: string;
    createdAt: string;
    updatedAt: string;
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