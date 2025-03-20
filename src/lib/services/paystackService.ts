import axios from 'axios';

interface PaystackConfig {
  publicKey: string;
  secretKey: string;
}

interface PaystackTransaction {
  reference: string;
  amount: number;
  email: string;
  currency?: string;
  metadata?: Record<string, unknown>;
  callback_url?: string;
}

interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url?: string;
    reference?: string;
    status?: string;
    transaction?: string;
  };
}

class PaystackService {
  private readonly baseUrl = 'https://api.paystack.co';
  private readonly config: PaystackConfig;

  constructor(config: PaystackConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.config.secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  async initializeTransaction(transaction: PaystackTransaction): Promise<PaystackResponse> {
    try {
      // Ensure amount is a valid integer in kobo
      const amount = Math.round(transaction.amount);
      if (amount <= 0) {
        throw new Error('Invalid amount: Amount must be greater than 0');
      }

      // Validate email
      if (!transaction.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(transaction.email)) {
        throw new Error('Invalid email address');
      }

      const payload = {
        ...transaction,
        amount,
        currency: transaction.currency || 'GHS',
        callback_url: transaction.callback_url
      };

      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        payload,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Payment initialization failed');
      }
      throw error;
    }
  }

  async verifyTransaction(reference: string): Promise<PaystackResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Payment verification failed');
      }
      throw error;
    }
  }
}

// Initialize with environment variables
export const paystackService = new PaystackService({
  publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  secretKey: import.meta.env.VITE_PAYSTACK_SECRET_KEY,
});