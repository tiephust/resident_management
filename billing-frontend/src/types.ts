export interface PaymentIntentResponse {
  client_secret: string;
  id: string;
  status: string;
}

export interface Resident {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  unitNumber: string;
  leaseStartDate: string;
  leaseEndDate: string;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  description: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  dueDate: string;
  residentId: string;
  resident: Resident;
  stripePaymentId?: string;
  createdAt: string;
  updatedAt: string;
} 