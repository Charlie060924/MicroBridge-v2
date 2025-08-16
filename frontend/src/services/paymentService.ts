import { PaymentData, PaymentResponse, PaymentIntent, CardData, PayMeData } from '@/types/payment';

class PaymentService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  /**
   * Create a payment intent for salary or subscription payment
   */
  async createPaymentIntent(paymentData: PaymentData): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Process payment with credit/debit card
   */
  async processCardPayment(
    paymentIntentId: string, 
    cardData: CardData
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          paymentIntentId,
          cardData: {
            number: cardData.number,
            expiry: cardData.expiry,
            cvv: cardData.cvv,
            name: cardData.name
          },
          saveCard: cardData.saveCard
        })
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Card payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    }
  }

  /**
   * Process payment with PayMe
   */
  async processPayMePayment(
    paymentIntentId: string,
    paymeData: PayMeData
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/payme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          paymentIntentId,
          mobileNumber: paymeData.mobileNumber,
          amount: paymeData.amount
        })
      });

      if (!response.ok) {
        throw new Error('PayMe payment failed');
      }

      return await response.json();
    } catch (error) {
      console.error('PayMe payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PayMe payment failed'
      };
    }
  }

  /**
   * Process payment with Alipay
   */
  async processAlipayPayment(paymentIntentId: string): Promise<PaymentResponse & { redirectUrl?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/alipay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ paymentIntentId })
      });

      if (!response.ok) {
        throw new Error('Alipay payment failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Alipay payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Alipay payment failed'
      };
    }
  }

  /**
   * Process payment with saved payment method
   */
  async processSavedPayment(
    paymentIntentId: string,
    savedMethodId: string
  ): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/saved`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          paymentIntentId,
          savedMethodId
        })
      });

      if (!response.ok) {
        throw new Error('Saved payment method failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Saved payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Saved payment failed'
      };
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentIntentId: string): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/status/${paymentIntentId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get payment status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  /**
   * Get saved payment methods for user
   */
  async getSavedPaymentMethods(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/saved-methods`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get saved payment methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting saved payment methods:', error);
      return [];
    }
  }

  /**
   * Download payment receipt
   */
  async downloadReceipt(transactionId: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/receipt/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download receipt');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error downloading receipt:', error);
      throw error;
    }
  }

  /**
   * Send payment confirmation email
   */
  async sendConfirmationEmail(transactionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/confirmation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ transactionId })
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }
  }

  /**
   * Calculate platform fees based on payment type
   */
  calculateFees(amount: number, type: 'salary' | 'subscription'): { platformFee: number; taxes: number; total: number } {
    let platformFee = 0;
    let taxes = 0;

    if (type === 'salary') {
      platformFee = Math.round(amount * 0.05); // 5% platform fee for salary payments
      taxes = 0; // No additional taxes on salary payments
    } else {
      platformFee = amount; // For subscriptions, the amount is the platform fee
      taxes = Math.round(amount * 0.1); // 10% tax on subscription payments
    }

    const total = amount + platformFee + taxes;

    return { platformFee, taxes, total };
  }

  /**
   * Format payment URL for different payment types
   */
  formatPaymentUrl(type: 'salary' | 'subscription', params: Record<string, string>): string {
    const baseUrl = '/billing/payment';
    const searchParams = new URLSearchParams(params);
    searchParams.set('type', type);
    
    return `${baseUrl}?${searchParams.toString()}`;
  }

  /**
   * Get authentication token from localStorage or cookies
   */
  private getAuthToken(): string {
    // In a real implementation, this would get the token from your auth system
    return localStorage.getItem('authToken') || '';
  }
}

export const paymentService = new PaymentService();
export default paymentService;

