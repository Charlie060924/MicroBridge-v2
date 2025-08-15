export interface PaymentData {
  type: 'salary' | 'subscription';
  candidateName?: string;
  jobTitle?: string;
  startDate?: string;
  duration?: string;
  baseSalary?: number;
  platformFee?: number;
  planName?: string;
  planDuration?: string;
  taxes?: number;
  totalAmount: number;
}

export interface PaymentMethod {
  id: string;
  type: 'alipay' | 'payme' | 'card' | 'saved';
  name: string;
  description: string;
  icon: React.ReactNode;
  saved?: boolean;
  last4?: string;
}

export interface CardData {
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  saveCard: boolean;
}

export interface PayMeData {
  mobileNumber: string;
  amount: number;
}

export interface PaymentStep {
  id: number;
  name: string;
  completed: boolean;
}

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export interface SalaryPayment {
  candidateName: string;
  jobTitle: string;
  startDate: string;
  duration: string;
  baseSalary: number;
  platformFee: number;
  totalAmount: number;
}

export interface SubscriptionPayment {
  planName: string;
  planDuration: string;
  planCost: number;
  taxes: number;
  totalAmount: number;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  receiptUrl?: string;
  error?: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  metadata: {
    type: 'salary' | 'subscription';
    userId: string;
    candidateId?: string;
    projectId?: string;
    planId?: string;
  };
}
