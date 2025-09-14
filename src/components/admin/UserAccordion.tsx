import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Add, ExpandMore, Person } from '@mui/icons-material';
import type { UserWithKeys } from './types';

interface UserAccordionProps {
  user: UserWithKeys;
  onAddKey: (user: UserWithKeys) => void;
  children: React.ReactNode;
}

export default function UserAccordion({ user, onAddKey, children }: UserAccordionProps) {
  return (
    <Accordion
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        mb: 2,
        boxShadow: (theme) => theme.shadows[2],
        '&:before': { display: 'none' },
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore sx={{ color: 'primary.main' }} />}
        sx={{
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            gap: 2,
            py: 1,
          },
          borderRadius: 3,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'primary.main',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}
        >
          <Person />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              color: 'text.primary',
              mb: 0.5,
            }}
          >
            {user.name || user.email}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.9rem',
            }}
          >
            {user.email} • {user.apiKeys.length} API key{user.apiKeys.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<Add />}
          onClick={(e) => {
            e.stopPropagation();
            onAddKey(user);
          }}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Add Key
        </Button>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0, pb: 2 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
}