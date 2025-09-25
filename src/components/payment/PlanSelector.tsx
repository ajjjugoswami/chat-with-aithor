import React from 'react';
import { Typography, Box } from '@mui/material';
import type { Plan } from './types';
import { PLANS } from './types';
import PlanCard from './PlanCard';

interface PlanSelectorProps {
  onPlanSelect: (plan: Plan) => void;
  mode: 'light' | 'dark';
}

const PlanSelector: React.FC<PlanSelectorProps> = ({ onPlanSelect, mode }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: mode === 'light' ? '#333' : '#fff', textAlign: 'center' }}>
        Choose Your Plan
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          maxWidth: '700px',
          mx: 'auto'
        }}
      >
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={false}
            onSelect={() => onPlanSelect(plan)}
            mode={mode}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PlanSelector;