import api from './api';

export interface Bill {
  id: number;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  clientSecret: string;
}

class BillService {
  async getBills(): Promise<Bill[]> {
    const response = await api.get<Bill[]>('/bills');
    return response.data;
  }

  async getBillById(id: number): Promise<Bill> {
    const response = await api.get<Bill>(`/bills/${id}`);
    return response.data;
  }

  async createPaymentIntent(billId: number): Promise<PaymentIntent> {
    const response = await api.post<PaymentIntent>(`/bills/${billId}/payment-intent`);
    return response.data;
  }

  async getPaymentHistory(): Promise<Bill[]> {
    const response = await api.get<Bill[]>('/bills/history');
    return response.data;
  }
}

export default new BillService(); 