export interface Resident {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    stripeCustomerId?: string;
}

export interface Bill {
    id: number;
    description: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'FAILED';
    dueDate: string;
    createdAt: string;
    stripePaymentId?: string;
    resident: Resident;
}

export interface PaymentIntentResponse {
    clientSecret: string;
    publicKey: string;
}

export interface Message {
    content : string;
}