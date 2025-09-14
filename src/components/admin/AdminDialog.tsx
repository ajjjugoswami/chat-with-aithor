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
  InputAdornment,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import { Close, Save, ContentCopy, Key as KeyIcon, Person, Security } from '@mui/icons-material';
import { useState } from 'react';
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
  saving,
}: AdminDialogProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyKey = async () => {
    if (newKeyValue.trim()) {
      try {
        await navigator.clipboard.writeText(newKeyValue.trim());
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy API key:', err);
      }
    }
  };

  const handleSave = () => {
    if (!newKeyName.trim() || !selectedProvider) {
      return;
    }

    // For editing, API key is not required if user wants to keep current
    if (!editingKey && !newKeyValue.trim()) {
      return;
    }

    onSave();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: (theme) => theme.shadows[24],
          background: (theme) => theme.palette.background.paper,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}08 100%)`,
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: (theme) =>
              `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.secondary.main} 100%)`,
            borderRadius: '4px 4px 0 0',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          pt: 4,
          px: 4,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.background.paper} 100%)`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: (theme) => theme.shadows[4],
            }}
          >
            <Security sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.2,
              }}
            >
              {editingKey ? 'Edit API Key' : 'Add New API Key'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mt: 0.5,
              }}
            >
              {editingKey ? 'Update your API key configuration' : 'Configure a new API key for AI services'}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
              bgcolor: 'action.hover',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease-in-out',
            borderRadius: 2,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 4, pb: 3, pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {selectedUser && (
            <Box
              sx={{
                p: 3,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}04 100%)`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'primary.main',
                    fontWeight: 600,
                  }}
                >
                  <Person />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      lineHeight: 1.2,
                    }}
                  >
                    {selectedUser.name || selectedUser.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                    }}
                  >
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label="API Key Management"
                size="small"
                color="primary"
                variant="outlined"
                sx={{
                  alignSelf: 'flex-start',
                  fontWeight: 500,
                  borderRadius: 2,
                }}
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              select
              label="AI Provider"
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              fullWidth
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.02)',
                  '&:hover': {
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                  },
                  '&.Mui-focused': {
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                    boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}20`,
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              {availableProviders.map((provider) => (
                <MenuItem
                  key={provider.id}
                  value={provider.id}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    '&:hover': {
                      background: (theme) => theme.palette.primary.main + '10',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <KeyIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    {provider.displayName}
                  </Box>
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
                  borderRadius: 3,
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.02)',
                  '&:hover': {
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                  },
                  '&.Mui-focused': {
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                    boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}20`,
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: 'primary.main',
                  },
                },
              }}
            />

            <TextField
              label="API Key"
              value={newKeyValue}
              onChange={(e) => setNewKeyValue(e.target.value)}
              placeholder={editingKey ? "Enter new API key value (leave empty to keep current)" : "Enter the API key"}
              fullWidth
              required={!editingKey}
              type="password"
              multiline
              rows={4}
              InputProps={{
                endAdornment: newKeyValue.trim() ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleCopyKey}
                      edge="end"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease-in-out',
                        borderRadius: 2,
                      }}
                      title="Copy API Key"
                    >
                      <ContentCopy />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.02)',
                  fontFamily: 'monospace',
                  '&:hover': {
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                  },
                  '&.Mui-focused': {
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                    boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}20`,
                  },
                  '& textarea': {
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  '&.Mui-focused': {
                    color: 'primary.main',
                  },
                },
              }}
            />

            {editingKey && (
              <Box
                sx={{
                  p: 3,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 165, 0, 0.1)'
                      : 'rgba(255, 165, 0, 0.05)',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'warning.main',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                }}
              >
                <Security sx={{ color: 'warning.main', fontSize: 20, mt: 0.5 }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: 'warning.main',
                      mb: 1,
                    }}
                  >
                    Security Notice
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.5,
                    }}
                  >
                    For security reasons, the existing API key is not displayed. Enter a new key only if you want to update it. Leave empty to keep the current key.
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 4,
          pb: 4,
          pt: 2,
          gap: 2,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}02 100%)`,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            px: 4,
            py: 1.5,
            fontWeight: 500,
            borderColor: 'divider',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'text.primary',
              color: 'text.primary',
              bgcolor: 'action.hover',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<Save />}
          // disabled={saving || !selectedUser || !selectedProvider || !newKeyName.trim() || (!editingKey && !newKeyValue.trim())}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: (theme) => theme.shadows[4],
            '&:hover': {
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              transform: 'translateY(-2px)',
              boxShadow: (theme) => theme.shadows[8],
            },
            '&:disabled': {
              background: 'action.disabledBackground',
              color: 'action.disabled',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {saving ? 'Saving...' : (editingKey ? 'Update Key' : 'Save Key')}
        </Button>
      </DialogActions>

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            borderRadius: 3,
            boxShadow: (theme) => theme.shadows[8],
          },
        }}
      >
        <Alert
          onClose={() => setCopySuccess(false)}
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 3,
            fontWeight: 500,
            '& .MuiAlert-icon': {
              fontSize: 20,
            },
          }}
        >
          API Key copied to clipboard!
        </Alert>
      </Snackbar>
    </Dialog>
  );
}