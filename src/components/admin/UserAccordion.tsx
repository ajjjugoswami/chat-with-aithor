import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Typography,
  Button,
  Box,
  useMediaQuery,
} from '@mui/material';
import { Add, ExpandMore, Person } from '@mui/icons-material';
import type { UserWithKeys } from './types';

interface UserAccordionProps {
  user: UserWithKeys;
  onAddKey: (user: UserWithKeys) => void;
  children: React.ReactNode;
}

export default function UserAccordion({ user, onAddKey, children }: UserAccordionProps) {
   const isSmallScreen = useMediaQuery('(max-width: 640px)');
  return (
    <Accordion
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        mb: isSmallScreen ? 1.5 : 2,
        boxShadow: (theme) => theme.shadows[2],
        '&:before': { display: 'none' },
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore sx={{ color: 'primary.main', fontSize: isSmallScreen ? '1.25rem' : '1.5rem' }} />}
        sx={{
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            gap: isSmallScreen ? 1 : 2,
            py: isSmallScreen ? 0.75 : 1,
          },
          borderRadius: 3,
          '&:hover': {
            bgcolor: 'action.hover',
          },
          minHeight: isSmallScreen ? 56 : 64,
        }}
      >
        <Avatar
          sx={{
            width: isSmallScreen ? 40 : 48,
            height: isSmallScreen ? 40 : 48,
            bgcolor: 'primary.main',
            fontSize: isSmallScreen ? '1rem' : '1.2rem',
            fontWeight: 'bold',
            flexShrink: 0,
          }}
        >
          <Person />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: isSmallScreen ? '1rem' : '1.1rem',
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
              fontSize: isSmallScreen ? '0.8rem' : '0.9rem',
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