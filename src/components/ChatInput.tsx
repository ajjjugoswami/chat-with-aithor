import { 
  Box, 
  TextField, 
  IconButton, 
  Paper
} from '@mui/material';
import { 
  Send, 
  AttachFile, 
  Image,
  Mic
} from '@mui/icons-material';
import { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  selectedModel?: string;
}

export default function ChatInput({ onSendMessage, disabled = false, selectedModel }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
     
      {/* Input container */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          bgcolor: '#2a2a2a',
          border: '1px solid #404040',
          borderRadius: 3,
          p: 1,
          gap: 1,
        }}
      >
        {/* File attachment buttons */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            sx={{ 
              color: '#888',
              '&:hover': { color: 'white', bgcolor: '#404040' },
            }}
          >
            <Image />
          </IconButton>
          <IconButton
            size="small"
            sx={{ 
              color: '#888',
              '&:hover': { color: 'white', bgcolor: '#404040' },
            }}
          >
            <AttachFile />
          </IconButton>
        </Box>

        {/* Text input */}
        <TextField
          multiline
          maxRows={6}
          placeholder={selectedModel ? `Ask ${selectedModel}...` : "Ask me anything..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              color: 'white',
              fontSize: '16px',
              '& ::placeholder': {
                color: '#666',
                opacity: 1,
              },
            },
          }}
          sx={{
            flex: 1,
            '& .MuiInputBase-root': {
              bgcolor: 'transparent',
            },
          }}
        />

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end' }}>
          <IconButton
            size="small"
            sx={{ 
              color: '#888',
              '&:hover': { color: 'white', bgcolor: '#404040' },
            }}
          >
            <Mic />
          </IconButton>
          
          <IconButton
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            sx={{
              bgcolor: message.trim() ? '#00d4aa' : '#404040',
              color: 'white',
              '&:hover': {
                bgcolor: message.trim() ? '#00b894' : '#404040',
              },
              '&.Mui-disabled': {
                bgcolor: '#404040',
                color: '#666',
              },
            }}
          >
            <Send />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
