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
} from '@mui/material';
import { MoreVert, Edit, Key, Delete } from '@mui/icons-material';
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
  return (
    <>
      <Card
        sx={{
          mb: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: (theme) => theme.shadows[3],
            borderColor: 'primary.main',
            transform: 'translateY(-1px)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
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
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      height: 24,
                    }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
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
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.8rem',
                    fontFamily: 'monospace',
                  }}
                >
                  Key ID: {keyData._id.substring(0, 16)}...
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                  }}
                >
                  Created: {new Date(keyData.createdAt).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem',
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
                    }}
                  >
                    Last: {new Date(keyData.lastUsed).toLocaleDateString()}
                  </Typography>
                )}
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
    </>
  );
}