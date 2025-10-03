import React from 'react';
import { Box, Typography } from '@mui/material';
import { QrCode, CreditCard } from 'lucide-react';

interface PaymentMethodSelectorProps {
  paymentMethod: 'razorpay' | 'qr';
  onMethodChange: (method: 'razorpay' | 'qr') => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ paymentMethod, onMethodChange }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
        Choose Payment Method
      </Typography>

      <Box sx={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e0e0', maxWidth: '300px', mx: 'auto' }}>
        <Box
          onClick={() => onMethodChange('qr')}
          sx={{
            flex: 1,
            p: 2,
            cursor: 'pointer',
            background: paymentMethod === 'qr' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff',
            color: paymentMethod === 'qr' ? '#fff' : '#666',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            borderRight: '1px solid #e0e0e0',
            '&:hover': {
              background: paymentMethod === 'qr' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
            },
          }}
        >
          <QrCode size={28} />
        </Box>

        <Box
          onClick={() => onMethodChange('razorpay')}
          sx={{
            flex: 1,
            p: 2,
            cursor: 'pointer',
            background: paymentMethod === 'razorpay' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff',
            color: paymentMethod === 'razorpay' ? '#fff' : '#666',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: paymentMethod === 'razorpay' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
            },
          }}
        >
          <CreditCard size={28} />
        </Box>
      </Box>

      <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: '#666' }}>
        {paymentMethod === 'qr' ? 'Direct UPI Payment' : 'Card, UPI & Net Banking'}
      </Typography>
    </Box>
  );
};

export default PaymentMethodSelector;