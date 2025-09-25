import React from 'react';
import { Typography, Box, Button, CircularProgress } from '@mui/material';
import { QrCode } from 'lucide-react';
import type { Plan } from './types';

interface QRPaymentSectionProps {
  selectedPlan: Plan | null;
  qrCodeUrl: string;
  loading: boolean;
  onGenerateQR: () => void;
  mode: 'light' | 'dark';
}

const QRPaymentSection: React.FC<QRPaymentSectionProps> = ({
  selectedPlan,
  qrCodeUrl,
  loading,
  onGenerateQR,
  mode,
}) => {
  if (!selectedPlan) return null;

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: mode === 'light' ? '#333' : '#fff' }}>
            <QrCode /> Pay via QR Code
          </Typography>

          {qrCodeUrl ? (
            <Box
              component="img"
              src={qrCodeUrl}
              alt="UPI QR Code"
              sx={{
                width: { xs: 180, md: 200 },
                height: { xs: 180, md: 200 },
                borderRadius: '16px',
                border: '3px solid #667eea',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
              }}
            />
          ) : (
            <Box
              sx={{
                width: { xs: 180, md: 200 },
                height: { xs: 180, md: 200 },
                background: mode === 'light' ? '#f5f5f5' : '#333',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #667eea',
              }}
            >
              <Typography variant="body2" sx={{ color: mode === 'light' ? '#666' : '#ccc', textAlign: 'center', px: 2 }}>
                Click "Generate QR Code" to create payment QR
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ color: mode === 'light' ? '#555' : '#ddd', mb: 2, textAlign: 'center' }}>
            Scan this QR code with any UPI app to pay <strong>₹{selectedPlan.price}</strong> directly
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
            {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
              <Box
                key={app}
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: mode === 'light' ? '#e3f2fd' : '#1a237e',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  color: mode === 'light' ? '#1976d2' : '#90caf9',
                  fontWeight: 500,
                }}
              >
                {app}
              </Box>
            ))}
          </Box>

          <Box sx={{ p: 2, bgcolor: mode === 'light' ? '#e8f5e8' : '#0f1b0f', borderRadius: '12px', border: '1px solid #4caf50', mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              ✅ Automatic Verification
            </Typography>
            <Typography variant="body2" sx={{ color: mode === 'light' ? '#666' : '#ccc', textAlign: 'center', mt: 1 }}>
              Payment will be verified automatically once completed in your UPI app
            </Typography>
          </Box>

          <Button
            fullWidth
             onClick={onGenerateQR}
            disabled={loading}
            sx={{
              py: 1.5,
              color: '#fff',
              borderRadius: '12px',
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
              },
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate QR Code'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default QRPaymentSection;