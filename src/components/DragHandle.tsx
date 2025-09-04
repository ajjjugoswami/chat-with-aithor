import React from 'react';
import { Box } from '@mui/material';
import { DragIndicator } from '@mui/icons-material';

interface DragHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  position: 'left' | 'right';
  isVisible?: boolean;
}

export default function DragHandle({ onMouseDown, position, isVisible = true }: DragHandleProps) {
  if (!isVisible) return null;

  return (
    <Box
      onMouseDown={onMouseDown}
      sx={{
        position: 'absolute',
        [position]: -2,
        top: 0,
        bottom: 0,
        width: 2,
        cursor: 'col-resize',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        background: 'transparent',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          bgcolor: 'rgba(0, 122, 255, 0.2)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1,
            bgcolor: '#007aff',
          },
        },
        '&:hover .drag-icon': {
          opacity: 1,
          color: '#007aff',
        },
        '&:active': {
          bgcolor: 'rgba(0, 122, 255, 0.3)',
        },
      }}
    >
      <DragIndicator
        className="drag-icon"
        sx={{
          color: '#666',
          fontSize: 14,
          opacity: 0,
          transition: 'all 0.2s ease',
          transform: 'rotate(90deg)',
        }}
      />
    </Box>
  );
}
