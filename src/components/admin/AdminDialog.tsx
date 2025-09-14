import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  MenuItem,
} from '@mui/material';
import { Close, Save } from '@mui/icons-material';
import type { AdminDialogProps } from './types';

export default function AdminDialog({
  open,
  onClose,
  selectedUser,
  editingKey,
  newKeyName,
  setNewKeyName,
  newKeyValue,
  setNewKeyValue,
  selectedProvider,
  setSelectedProvider,
  onSave,
  availableProviders,
}: AdminDialogProps) {
  const handleSave = () => {
    if (!newKeyName.trim() || !newKeyValue.trim() || !selectedProvider) {
      return;
    }
    onSave();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: (theme) => theme.shadows[20],
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          pt: 3,
          px: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '1.25rem',
            color: 'text.primary',
          }}
        >
          {editingKey ? 'Edit API Key' : 'Add New API Key'}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
              bgcolor: 'action.hover',
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {selectedUser && (
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                User
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                }}
              >
                {selectedUser.name || selectedUser.email}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {selectedUser.email}
              </Typography>
            </Box>
          )}

          <TextField
            select
            label="AI Provider"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          >
            {availableProviders.map((provider) => (
              <MenuItem key={provider.id} value={provider.id}>
                {provider.displayName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Key Name"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="e.g., My Gemini Key 1, OpenAI Backup"
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            label="API Key"
            value={newKeyValue}
            onChange={(e) => setNewKeyValue(e.target.value)}
            placeholder="Enter the API key"
            fullWidth
            required
            type="password"
            multiline
            rows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontFamily: 'monospace',
                '& textarea': {
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                },
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 0,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<Save />}
          disabled={!selectedUser || !selectedProvider || !newKeyName.trim() || !newKeyValue.trim()}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            fontWeight: 500,
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {editingKey ? 'Update Key' : 'Save Key'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}