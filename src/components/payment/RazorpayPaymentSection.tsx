import React from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { Shield, CreditCard, Smartphone } from 'lucide-react';
import type { Plan } from './types';

interface RazorpayPaymentSectionProps {
  selectedPlan: Plan | null;
  loading: boolean;
  onPayNow: () => void;
  mode: 'light' | 'dark';
}

const RazorpayPaymentSection: React.FC<RazorpayPaymentSectionProps> = ({
  selectedPlan,
  loading,
  onPayNow,
  mode,
}) => {
  if (!selectedPlan) return null;

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: mode === 'light' ? '#333' : '#fff' }}>
          Pay with Razorpay
        </Typography>
        <Typography variant="body1" sx={{ color: mode === 'light' ? '#555' : '#ddd', mb: 3 }}>
          Secure payment gateway with multiple options
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 3 }}>
          {[
            { icon: <Shield size={16} />, label: 'Secure Payment' },
            { icon: <CreditCard size={16} />, label: 'Credit/Debit Card' },
            { icon: <Smartphone size={16} />, label: 'UPI' },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                bgcolor: mode === 'light' ? '#e3f2fd' : '#1a237e',
                borderRadius: '20px',
                color: mode === 'light' ? '#1976d2' : '#90caf9',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              {item.icon}
              {item.label}
            </Box>
          ))}
        </Box>

        <Box sx={{ p: 3, bgcolor: mode === 'light' ? '#e8f5e8' : '#0f1b0f', borderRadius: '12px', border: '1px solid #4caf50', mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            ✅ Automatic Verification
          </Typography>
          <Typography variant="body2" sx={{ color: mode === 'light' ? '#666' : '#ccc', textAlign: 'center', mt: 1 }}>
            Payment success/failure will be confirmed automatically
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={onPayNow}
          disabled={loading}
          sx={{
            py: 2,
            borderRadius: '12px',
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
            },
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1.1rem',
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : `Pay ₹${selectedPlan.price} Now`}
        </Button>
      </Box>
    </Box>
  );
};export default RazorpayPaymentSection;