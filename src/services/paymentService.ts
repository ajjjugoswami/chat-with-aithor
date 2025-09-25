import type { RazorpayOptions, RazorpaySuccessResponse, RazorpayErrorResponse } from '../types/razorpay';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://aithor-be.vercel.app';

export interface CreateOrderRequest {
  amount: number;
  currency?: string;
  receipt?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
  key: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface CreateQRRequest {
  amount: number;
  currency?: string;
  description?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  payment_id?: string;
  order_id?: string;
}

export interface CreateQRResponse {
  success: boolean;
  qr: {
    id: string;
    image_url: string;
    status: string;
  };
  qr_string: string;
  qr_id: string;
}

export const paymentService = {
  /**
   * Create a Razorpay order
   */
  createOrder: async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return response.json();
  },

  /**
   * Create a Razorpay QR code
   */
  createQR: async (qrData: CreateQRRequest): Promise<CreateQRResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/payment/create-qr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(qrData),
    });

    if (!response.ok) {
      throw new Error('Failed to create QR code');
    }

    return response.json();
  },

  /**
   * Verify payment after successful payment
   */
  verifyPayment: async (verificationData: VerifyPaymentRequest): Promise<VerifyPaymentResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(verificationData),
    });

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    return response.json();
  },

  /**
   * Initialize Razorpay payment
   */
  initiatePayment: (orderResponse: CreateOrderResponse, onSuccess: (response: RazorpaySuccessResponse) => void, onFailure: (error: RazorpayErrorResponse) => void) => {
    const options: RazorpayOptions = {
      key: orderResponse.key,
      amount: orderResponse.order.amount,
      currency: orderResponse.order.currency,
      order_id: orderResponse.order.id,
      name: 'AIthor AI',
      description: 'AI Chat Service Payment',
      handler: onSuccess,
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      notes: {
        address: 'AIthor AI Payment',
      },
      theme: {
        color: '#3399cc',
      },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', onFailure);

    return rzp;
  },
};