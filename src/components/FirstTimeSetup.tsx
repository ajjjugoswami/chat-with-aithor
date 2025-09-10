import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Step,
  Stepper,
  StepLabel,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { Key, Rocket, Settings } from '@mui/icons-material';
import type { AIModel } from './AIModelTabs';
import { addAPIKey } from '../utils/enhancedApiKeys';

interface FirstTimeSetupProps {
  open: boolean;
  onClose: () => void;
  models: AIModel[];
}

export default function FirstTimeSetup({ open, onClose, models }: FirstTimeSetupProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [keyName, setKeyName] = useState('');

  const steps = ['Choose Model', 'Add API Key', 'Complete Setup'];

  const handleNext = () => {
    if (activeStep === 0 && selectedModel) {
      setKeyName(`My ${selectedModel.displayName} Key`);
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleComplete = () => {
    if (selectedModel && apiKey && keyName) {
      addAPIKey(selectedModel.id, apiKey, keyName);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: '#1a1a1a',
          color: 'white',
        }
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Rocket sx={{ fontSize: 48, color: '#00d4aa', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome to Chat with AI
          </Typography>
          <Typography variant="body1" sx={{ color: '#ccc' }}>
            Let's set up your first AI model to get started
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { color: '#ccc' } }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
              Choose your preferred AI model
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
              {models.slice(0, 3).map((model) => (
                <Card
                  key={model.id}
                  sx={{
                    bgcolor: selectedModel?.id === model.id ? '#333' : '#2a2a2a',
                    border: selectedModel?.id === model.id ? '2px solid #00d4aa' : '1px solid #404040',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#333',
                      transform: 'translateY(-2px)',
                    }
                  }}
                  onClick={() => setSelectedModel(model)}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {model.icon}
                    </Box>
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      {model.displayName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>
                      {model.name}
                    </Typography>
                    {selectedModel?.id === model.id && (
                      <Chip
                        label="Selected"
                        sx={{
                          mt: 2,
                          bgcolor: '#00d4aa',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {activeStep === 1 && selectedModel && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
              Add your {selectedModel.displayName} API Key
            </Typography>
            <Box sx={{ maxWidth: 500, mx: 'auto' }}>
              <TextField
                fullWidth
                label="Key Name"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g., My Primary Key, Work Account"
                sx={{ mb: 3 }}
                InputLabelProps={{ style: { color: '#ccc' } }}
                InputProps={{ style: { color: 'white' } }}
              />
              <TextField
                fullWidth
                label="API Key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                InputLabelProps={{ style: { color: '#ccc' } }}
                InputProps={{ style: { color: 'white' } }}
              />
              <Box sx={{ mt: 2, p: 2, bgcolor: '#2a3441', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Key sx={{ color: '#00d4aa', fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ color: '#90caf9' }}>
                    How to get your API key:
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#bbdefb' }}>
                  Visit the {selectedModel.displayName} website, create an account, and generate an API key from your dashboard.
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center' }}>
            <Settings sx={{ fontSize: 48, color: '#00d4aa', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Setup Complete!
            </Typography>
            <Typography variant="body1" sx={{ color: '#ccc', mb: 3 }}>
              You can now start chatting with {selectedModel?.displayName}. 
              You can add more API keys later in the Settings page.
            </Typography>
            <Box sx={{ p: 3, bgcolor: '#2a2a2a', borderRadius: 2, display: 'inline-block' }}>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                💡 <strong>Pro Tip:</strong> Add multiple API keys for the same model to avoid hitting rate limits!
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          sx={{ color: '#ccc' }}
        >
          Back
        </Button>
        <Box sx={{ flex: 1 }} />
        {activeStep === steps.length - 1 ? (
          <Button
            onClick={handleComplete}
            variant="contained"
            disabled={!selectedModel || !apiKey || !keyName}
            sx={{
              bgcolor: '#00d4aa',
              color: 'white',
              fontWeight: 600,
              '&:hover': { bgcolor: '#00b894' }
            }}
          >
            Get Started
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={activeStep === 0 && !selectedModel}
            sx={{
              bgcolor: '#00d4aa',
              color: 'white',
              fontWeight: 600,
              '&:hover': { bgcolor: '#00b894' }
            }}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
