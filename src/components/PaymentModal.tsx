/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Alert,
  IconButton,
} from '@mui/material';
import { X, ArrowLeft } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import type { CreateOrderResponse } from '../services/paymentService';
import { useTheme } from '../hooks/useTheme';
import type { Plan } from './payment/types';
import PlanSelector from './payment/PlanSelector';
import PaymentMethodSelector from './payment/PaymentMethodSelector';
import QRPaymentSection from './payment/QRPaymentSection';
import RazorpayPaymentSection from './payment/RazorpayPaymentSection';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [currentStep, setCurrentStep] = useState<'plan' | 'payment'>('plan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'qr'>('qr');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const { mode } = useTheme();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setCurrentStep('payment');
  };

  const handleBackToPlans = () => {
    setCurrentStep('plan');
    setError('');
    setSuccess('');
    setQrCodeUrl('');
  };

  const handlePaymentSuccess = () => {
    setSuccess('Payment successful! Your account has been upgraded.');
    setLoading(false);
    setSelectedPlan(null);
    setCurrentStep('plan');
    // Optionally refresh user data or quotas here
  };

  const handleQRPayment = async () => {
    if (!selectedPlan) {
      setError('Please select a plan first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create QR code via backend API
      const qrResponse = await paymentService.createQR({
        amount: selectedPlan.price * 100, // Convert to paisa
        currency: 'INR',
        description: `${selectedPlan.name} - Account Upgrade`,
      });

      if (qrResponse.success) {
        setQrCodeUrl(qrResponse.qr.image_url);
        setSuccess('QR Code generated! Scan with any UPI app to pay directly. Payment will be verified automatically.');
      } else {
        setError('Failed to generate QR code. Please try again.');
      }

      setLoading(false);
    } catch {
      setError('Failed to generate QR code. Please try again.');
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError('Please select a plan first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create order
      const orderResponse: CreateOrderResponse = await paymentService.createOrder({
        amount: selectedPlan.price * 100, // Convert to paisa
        currency: 'INR',
      });

      // Initialize Razorpay checkout
      const options = {
        key: orderResponse.key,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        name: 'AI Thor',
        description: `${selectedPlan.name} - Account Upgrade`,
        order_id: orderResponse.order.id,
        handler: function () {
          handlePaymentSuccess();
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
        },
        theme: {
          color: '#667eea',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch {
      setError('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPlan(null);
    setCurrentStep('plan');
    setError('');
    setSuccess('');
    setQrCodeUrl('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          background: mode === 'light' ? '#fff' : '#1e1e1e',
          maxHeight: '90vh',
          overflow: 'auto',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {currentStep === 'payment' && (
            <IconButton onClick={handleBackToPlans} size="small" sx={{ mr: 1 }}>
              <ArrowLeft size={20} />
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: mode === 'light' ? '#333' : '#fff',
            }}
          >
            {currentStep === 'plan' ? 'Choose Your Plan' : `Pay ₹${selectedPlan?.price} - ${selectedPlan?.name}`}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 4 }}>
          {currentStep === 'plan' ? (
            <>
              <Typography
                variant="body1"
                sx={{
                  color: mode === 'light' ? '#666' : '#ccc',
                  mb: 4,
                  textAlign: 'center',
                  fontSize: '1.1rem'
                }}
              >
                Choose your plan to upgrade your account
              </Typography>

              <PlanSelector
                onPlanSelect={handlePlanSelect}
                mode={mode}
              />
            </>
          ) : (
            <>
              <Typography
                variant="body1"
                sx={{
                  color: mode === 'light' ? '#666' : '#ccc',
                  mb: 3,
                  textAlign: 'center',
                  fontSize: '1.1rem'
                }}
              >
                Choose your payment method
              </Typography>

              <PaymentMethodSelector
                paymentMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
              />

              <Box sx={{ mt: 3 }}>
                {paymentMethod === 'qr' && (
                  <QRPaymentSection
                    selectedPlan={selectedPlan}
                    qrCodeUrl={qrCodeUrl}
                    loading={loading}
                    onGenerateQR={handleQRPayment}
                    mode={mode}
                  />
                )}

                {paymentMethod === 'razorpay' && (
                  <RazorpayPaymentSection
                    selectedPlan={selectedPlan}
                    loading={loading}
                    onPayNow={handlePayment}
                    mode={mode}
                  />
                )}
              </Box>

              {(error || success) && (
                <Box sx={{ mt: 3 }}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {success}
                    </Alert>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;