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

export interface AIModel {
  id: string;
  name: string;
  displayName: string;
  enabled: boolean;
  icon?: string;
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
  return (
    <Box
      sx={{
        bgcolor: '#1a1a1a',
        borderBottom: '1px solid #404040',
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
          background: '#1a1a1a',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#444',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
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
            bgcolor: model.enabled ? '#2a2a2a' : '#1a1a1a',
            borderRadius: 2,
            p: 1,
            border: `1px solid ${model.enabled ? '#404040' : '#2a2a2a'}`,
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
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {model.displayName}
                </Typography>
                <IconButton size="small" sx={{ p: 0, ml: 0.5 }}>
                  <KeyboardArrowDown sx={{ fontSize: 16, color: '#888' }} />
                </IconButton>
                <IconButton size="small" sx={{ p: 0 }}>
                  <Launch sx={{ fontSize: 14, color: '#888' }} />
                </IconButton>
              </Box>
            }
            onClick={() => onModelSelect(model.id)}
            sx={{
              bgcolor: selectedModelId === model.id ? '#333' : 'transparent',
              color: model.enabled ? 'white' : '#666',
              border: `1px solid ${selectedModelId === model.id ? '#555' : 'transparent'}`,
              borderRadius: 2,
              height: 40,
              cursor: 'pointer',
              opacity: model.enabled ? 1 : 0.6,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: selectedModelId === model.id ? '#404040' : '#333',
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
