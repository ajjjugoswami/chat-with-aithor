import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const OTPContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  background: "#ffffff",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  border: "1px solid #e5e7eb",
  borderRadius: theme.spacing(3),
}));

const OTPInputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const OTPInput = styled(TextField)(({ theme }) => ({
  width: 50,
  height: 50,
  '& .MuiInputBase-root': {
    height: 50,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    background: "#ffffff",
    borderRadius: theme.spacing(2),
    transition: "all 0.3s ease",
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    '& fieldset': {
      borderColor: "#059669",
      borderWidth: "2px",
    },
    '&:hover fieldset': {
      borderColor: "#047857",
      borderWidth: "2px",
    },
    '&.Mui-focused fieldset': {
      borderColor: "#059669",
      borderWidth: "3px",
      boxShadow: "0 0 0 4px rgba(5, 150, 105, 0.15)",
    },
  },
  '& .MuiInputLabel-root': {
    color: "#6b7280",
    '&.Mui-focused': {
      color: "#059669",
      fontWeight: 600,
    },
  },
  '& .MuiOutlinedInput-input': {
    color: "#000000",
    fontWeight: 600,
    textAlign: 'center',
  },
  '& .MuiOutlinedInput-input::placeholder': {
    color: "#9ca3af",
    opacity: 1,
  },
}));

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<{ success: boolean; message: string }>;
  onResend: () => Promise<{ success: boolean; message: string }>;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerify,
  onResend,
  onCancel,
  title = "Verify Your Email",
  subtitle = "We've sent a 6-digit code to your email address"
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }

    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
    }

    setOtp(newOtp);

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    const input = document.getElementById(`otp-input-${focusIndex}`);
    input?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await onVerify(otpString);
      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.message);
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await onResend();
      if (result.success) {
        setSuccess(result.message);
        setTimeLeft(300); // Reset timer
        setCanResend(false);
        setOtp(['', '', '', '', '', '']); // Clear OTP inputs
        const firstInput = document.getElementById('otp-input-0');
        firstInput?.focus();
      } else {
        setError(result.message);
      }
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <OTPContainer elevation={0}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
        <Typography variant="body2" fontWeight="medium" mt={1}>
          {email}
        </Typography>
      </Box>

      <OTPInputContainer>
        {otp.map((digit, index) => (
          <OTPInput
            key={index}
            id={`otp-input-${index}`}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            inputProps={{
              maxLength: 1,
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
            variant="outlined"
            autoComplete="off"
          />
        ))}
      </OTPInputContainer>

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

      <Box display="flex" gap={2} justifyContent="center" mb={2}>
        <Button
          variant="contained"
          onClick={handleVerify}
          disabled={!isOtpComplete || loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={20} /> : 'Verify'}
        </Button>

        {onCancel && (
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </Box>

      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary" mb={1}>
          {canResend ? (
            'Didn\'t receive the code?'
          ) : (
            `Resend code in ${formatTime(timeLeft)}`
          )}
        </Typography>

        <Button
          variant="text"
          onClick={handleResend}
          disabled={!canResend || resendLoading}
          sx={{
            textTransform: 'none',
            fontSize: '0.875rem',
            '&:disabled': {
              color: 'text.disabled',
            },
          }}
        >
          {resendLoading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Sending...
            </>
          ) : (
            'Resend Code'
          )}
        </Button>
      </Box>
    </OTPContainer>
  );
};

export default OTPVerification;