import {
  Box,
  Menu,
  MenuItem,
  Typography,
  Chip,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import type { ModelVariant } from '../types/modelVariants';

interface ModelVariantSelectorProps {
  variants: ModelVariant[];
  selectedVariant: ModelVariant;
  onVariantSelect: (variant: ModelVariant) => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export default function ModelVariantSelector({
  variants,
  selectedVariant,
  onVariantSelect,
  disabled = false,
  size = 'small',
}: ModelVariantSelectorProps) {
  const { mode } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled && variants.length > 1) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleVariantSelect = (variant: ModelVariant) => {
    onVariantSelect(variant);
    handleClose();
  };

  if (variants.length <= 1) {
    return null; // Don't show selector if there's only one variant
  }

  return (
    <>
      <Tooltip
        title={
          disabled 
            ? "Add API key to change model variants"
            : variants.length <= 1 
              ? "No other variants available"
              : "Select model variant"
        }
        arrow
        placement="top"
      >
        <Box
          onClick={handleClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: disabled || variants.length <= 1 ? 'default' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            minWidth: size === 'small' ? 'auto' : 120,
          }}
        >
        {/* Colored indicator for selected variant */}
        <Box
          sx={{
            width: size === 'small' ? 8 : 12,
            height: size === 'small' ? 8 : 12,
            borderRadius: '50%',
            bgcolor: disabled 
              ? (mode === 'light' ? '#ddd' : '#444')
              : (selectedVariant.color || '#666'),
            mr: 1,
            border: `1px solid ${mode === 'light' ? '#e0e0e0' : '#444'}`,
            transition: 'background-color 0.2s ease',
            opacity: disabled ? 0.6 : 1,
          }}
        />
        
        {/* Show variant name only on larger screens and medium size */}
        {!isMobile && size === 'medium' && (
          <Typography
            variant="caption"
            sx={{
              color: disabled 
                ? (mode === 'light' ? '#999' : '#666')
                : (mode === 'light' ? '#666' : '#888'),
              fontSize: '0.75rem',
              mr: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 80,
            }}
          >
            {selectedVariant.displayName}
          </Typography>
        )}

        {/* Always show variant name on small size for better visibility */}
        {size === 'small' && (
          <Typography
            variant="caption"
            sx={{
              color: disabled 
                ? (mode === 'light' ? '#999' : '#666')
                : (mode === 'light' ? '#666' : '#888'),
              fontSize: '0.7rem',
              mr: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 60,
            }}
          >
            {selectedVariant.displayName}
          </Typography>
        )}

        {/* Dropdown arrow - only show if not disabled and has multiple variants */}
        {variants.length > 1 && (
          <KeyboardArrowDown
            sx={{
              fontSize: size === 'small' ? 14 : 16,
              color: disabled 
                ? (mode === 'light' ? '#ccc' : '#555')
                : (mode === 'light' ? '#666' : '#888'),
              transition: 'transform 0.2s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              opacity: disabled ? 0.5 : 1,
            }}
          />
        )}
      </Box>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: mode === 'light' ? '#ffffff' : '#2a2a2a',
            border: `1px solid ${mode === 'light' ? '#e0e0e0' : '#444'}`,
            borderRadius: 2,
            minWidth: 180,
            boxShadow: mode === 'light' 
              ? '0 4px 20px rgba(0,0,0,0.1)'
              : '0 4px 20px rgba(0,0,0,0.3)',
            '& .MuiMenuItem-root': {
              py: 1,
              px: 2,
            },
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {variants.map((variant) => (
          <MenuItem
            key={variant.id}
            onClick={() => handleVariantSelect(variant)}
            selected={variant.id === selectedVariant.id}
            sx={{
              '&.Mui-selected': {
                bgcolor: mode === 'light' ? '#f0f8ff' : '#333',
              },
              '&:hover': {
                bgcolor: mode === 'light' ? '#f5f5f5' : '#383838',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                width: '100%',
              }}
            >
              {/* Colored indicator */}
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: variant.color || '#666',
                  border: `1px solid ${mode === 'light' ? '#e0e0e0' : '#444'}`,
                  flexShrink: 0,
                }}
              />
              
              {/* Variant name */}
              <Typography
                variant="body2"
                sx={{
                  color: mode === 'light' ? '#333' : '#fff',
                  flex: 1,
                }}
              >
                {variant.displayName}
              </Typography>

              {/* Tier indicator */}
              <Chip
                label={variant.tier}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  bgcolor: variant.tier === 'free' 
                    ? (mode === 'light' ? '#e8f5e8' : '#1a3d1a')
                    : (mode === 'light' ? '#fff3cd' : '#3d3d1a'),
                  color: variant.tier === 'free'
                    ? (mode === 'light' ? '#2e7d32' : '#66bb6a')
                    : (mode === 'light' ? '#856404' : '#ffcc02'),
                  border: 'none',
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
