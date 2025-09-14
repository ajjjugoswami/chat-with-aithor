import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { MoreVert, Edit, Key, Delete, ContentCopy } from '@mui/icons-material';
import { useState } from 'react';
import type { ServerAPIKey } from './types';
import { getProviderDisplayName } from '../../utils/enhancedApiKeys';

interface APIKeyCardProps {
  keyData: ServerAPIKey;
  onEdit: (key: ServerAPIKey) => void;
  onSetActive: (keyId: string) => void;
  onDelete: (keyId: string) => void;
  menuAnchor: HTMLElement | null;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, key: ServerAPIKey) => void;
  onMenuClose: () => void;
  selectedKey: ServerAPIKey | null;
}

export default function APIKeyCard({
  keyData,
  onEdit,
  onSetActive,
  onDelete,
  menuAnchor,
  onMenuOpen,
  onMenuClose,
  selectedKey,
}: APIKeyCardProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyKeyId = async () => {
    try {
      await navigator.clipboard.writeText(keyData._id);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy Key ID:', err);
    }
  };
  return (
    <>
      <Card
        sx={{
          mb: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: (theme) => theme.shadows[3],
            borderColor: 'primary.main',
            transform: 'translateY(-1px)',
          },
        }}
      >
        <CardContent sx={{ p: 3, pb: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flex: 1 }}>
            <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'text.primary',
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {keyData.name}
                </Typography>
                {keyData.isDefault && (
                  <Chip
                    label="Active"
                    size="small"
                    color="primary"
                    variant="filled"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      height: 22,
                      flexShrink: 0,
                    }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  Provider: {getProviderDisplayName(keyData.provider)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      flex: 1,
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Key ID: {keyData._id.substring(0, 16)}...
                  </Typography>
                  <Tooltip title="Copy Key ID">
                    <IconButton
                      onClick={handleCopyKeyId}
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                        },
                        padding: '2px',
                        flexShrink: 0,
                      }}
                    >
                      <ContentCopy sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 'auto' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Created: {new Date(keyData.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Used: {keyData.usageCount} times
                  </Typography>
                  {keyData.lastUsed && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Last: {new Date(keyData.lastUsed).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            <IconButton
              onClick={(e) => onMenuOpen(e, keyData)}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover',
                },
                flexShrink: 0,
                alignSelf: 'flex-start',
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor) && selectedKey?._id === keyData._id}
        onClose={onMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 140,
            boxShadow: (theme) => theme.shadows[8],
          },
        }}
      >
        <MenuItem
          onClick={() => {
            onEdit(keyData);
            onMenuClose();
          }}
          sx={{
            py: 1.5,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <Edit sx={{ mr: 1.5, fontSize: '1.1rem' }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onSetActive(keyData._id);
            onMenuClose();
          }}
          sx={{
            py: 1.5,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <Key sx={{ mr: 1.5, fontSize: '1.1rem' }} />
          Set as Active
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(keyData._id);
            onMenuClose();
          }}
          sx={{
            py: 1.5,
            color: 'error.main',
            '&:hover': {
              bgcolor: 'error.light',
              color: 'error.dark',
            },
          }}
        >
          <Delete sx={{ mr: 1.5, fontSize: '1.1rem' }} />
          Delete
        </MenuItem>
      </Menu>

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setCopySuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Key ID copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}