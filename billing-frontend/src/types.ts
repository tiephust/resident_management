export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  phoneNumber?: string;
  unitNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resident extends User {
  leaseStartDate: string;
  leaseEndDate: string;
  stripeCustomerId?: string;
}

export interface Admin extends User {
  department: string;
}

export interface PaymentIntentResponse {
  client_secret: string;
  id: string;
  status: string;
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

export enum UserRole {
  RESIDENT = 'RESIDENT',
  ADMIN = 'ADMIN',
  MANAGEMENT = 'MANAGEMENT'
} 