import {
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { People, AddBox } from '@mui/icons-material';

interface AdminTabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function AdminTabs({ value, onChange }: AdminTabsProps) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs
        value={value}
        onChange={onChange}
        aria-label="admin tabs"
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            minHeight: 48,
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'primary.main',
              fontWeight: 600,
            },
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: 1.5,
            bgcolor: 'primary.main',
          },
        }}
      >
        <Tab
          icon={<People />}
          iconPosition="start"
          label="Users"
          sx={{
            '& .MuiTab-iconWrapper': {
              mr: 1,
            },
          }}
        />
        <Tab
          icon={<AddBox />}
          iconPosition="start"
          label="User Keys"
          sx={{
            '& .MuiTab-iconWrapper': {
              mr: 1,
            },
          }}
        />
      </Tabs>
    </Box>
  );
}