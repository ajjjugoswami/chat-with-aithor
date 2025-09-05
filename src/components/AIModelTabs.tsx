import { 
  Box, 
  Chip, 
  Switch, 
  Typography,
  IconButton
} from '@mui/material';
import { 
  KeyboardArrowDown,
  Launch
} from '@mui/icons-material';
import type { ReactElement } from 'react';
import { useTheme } from '../hooks/useTheme';

export interface AIModel {
  id: string;
  name: string;
  displayName: string;
  enabled: boolean;
  icon?: string | ReactElement;
  color?: string;
}

interface AIModelTabsProps {
  models: AIModel[];
  selectedModelId: string;
  onModelSelect: (modelId: string) => void;
  onModelToggle: (modelId: string) => void;
}

export default function AIModelTabs({ 
  models, 
  selectedModelId, 
  onModelSelect, 
  onModelToggle 
}: AIModelTabsProps) {
  const { mode } = useTheme();
  
  return (
    <Box
      sx={{
        bgcolor: mode === 'light' ? '#f8f9fa' : '#1a1a1a',
        borderBottom: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #404040',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        overflowX: 'auto',
        minHeight: 60,
        flexShrink: 0, // Prevent tabs from shrinking
        '&::-webkit-scrollbar': {
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: mode === 'light' ? '#f0f0f0' : '#1a1a1a',
        },
        '&::-webkit-scrollbar-thumb': {
          background: mode === 'light' ? '#ccc' : '#444',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: mode === 'light' ? '#bbb' : '#555',
        },
      }}
    >
      {models.map((model) => (
        <Box
          key={model.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            minWidth: 'fit-content',
            bgcolor: model.enabled 
              ? (mode === 'light' ? '#e3f2fd' : '#2a2a2a')
              : (mode === 'light' ? '#ffffff' : '#1a1a1a'),
            borderRadius: 2,
            p: 1,
            border: `1px solid ${model.enabled 
              ? (mode === 'light' ? '#bbdefb' : '#404040')
              : (mode === 'light' ? '#e0e0e0' : '#2a2a2a')}`,
            transition: 'all 0.2s ease',
          }}
        >
          {/* Toggle Switch */}
          <Switch
            checked={model.enabled}
            onChange={() => onModelToggle(model.id)}
            size="small"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: model.color,
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: model.color,
              },
              '& .MuiSwitch-track': {
                backgroundColor: '#666',
              },
            }}
          />

          {/* Model Tab */}
          <Chip
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {model.icon && (
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '4px',
                      bgcolor: model.enabled ? model.color : '#666',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {model.icon}
                  </Box>
                )}
                <Typography variant="body2" sx={{ 
                  fontWeight: 500,
                  color: mode === 'light' ? '#333' : 'inherit'
                }}>
                  {model.displayName}
                </Typography>
                <IconButton size="small" sx={{ p: 0, ml: 0.5 }}>
                  <KeyboardArrowDown sx={{ 
                    fontSize: 16, 
                    color: mode === 'light' ? '#666' : '#888' 
                  }} />
                </IconButton>
                <IconButton size="small" sx={{ p: 0 }}>
                  <Launch sx={{ 
                    fontSize: 14, 
                    color: mode === 'light' ? '#666' : '#888' 
                  }} />
                </IconButton>
              </Box>
            }
            onClick={() => onModelSelect(model.id)}
            sx={{
              bgcolor: selectedModelId === model.id 
                ? (mode === 'light' ? '#e3f2fd' : '#333') 
                : 'transparent',
              color: model.enabled 
                ? (mode === 'light' ? '#333' : 'white') 
                : (mode === 'light' ? '#999' : '#666'),
              border: `1px solid ${selectedModelId === model.id 
                ? (mode === 'light' ? '#bbdefb' : '#555') 
                : 'transparent'}`,
              borderRadius: 2,
              height: 40,
              cursor: 'pointer',
              opacity: model.enabled ? 1 : 0.6,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: selectedModelId === model.id 
                  ? (mode === 'light' ? '#bbdefb' : '#404040') 
                  : (mode === 'light' ? '#f0f0f0' : '#333'),
              },
              '& .MuiChip-label': {
                px: 2,
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
