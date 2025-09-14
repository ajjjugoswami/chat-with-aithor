import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { MessageSquare } from 'lucide-react';

const StyledFeedbackSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : '#1a1a1a',
  padding: theme.spacing(8, 0),
  borderTop: `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#374151'}`,
}));

const FeedbackPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#2a2a2a',
  borderRadius: '16px',
  boxShadow: theme.palette.mode === 'light'
    ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    : '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
  border: `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#374151'}`,
}));

export default function FeedbackSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('https://aithor-be.vercel.app/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', feedback: '' });
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Feedback submission error:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledFeedbackSection>
      <Container maxWidth="md">
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem' },
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Share Your Feedback
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Help us improve Aithor by sharing your thoughts, suggestions, or reporting any issues you've encountered.
          </Typography>
        </Box>

        <FeedbackPaper elevation={0}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Thank you for your feedback! We'll review it soon.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                  disabled={loading}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                  disabled={loading}
                />
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Your Feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                required
                multiline
                rows={4}
                placeholder="Tell us what you think..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
                disabled={loading}
              />
            </Box>
            <Box display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!formData.name || !formData.email || !formData.feedback}
                startIcon={loading ? <CircularProgress size={20} /> : <MessageSquare size={20} />}
                sx={{
                  minWidth: '200px',
                  py: 1.5,
                  px: 4,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                 
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Submitting...' : 'Send Feedback'}
              </Button>
            </Box>
          </Box>
        </FeedbackPaper>
      </Container>
    </StyledFeedbackSection>
  );
}