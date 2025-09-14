import {
  Box,
  Tabs,
  Tab,
  useMediaQuery,
} from '@mui/material';
import { People, AddBox, AdminPanelSettings } from '@mui/icons-material';

interface AdminTabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function AdminTabs({ value, onChange }: AdminTabsProps) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isSmallScreen = useMediaQuery('(max-width: 480px)');
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: isSmallScreen ? 2 : 3 }}>
      <Tabs
        value={value}
        onChange={onChange}
        aria-label="admin tabs"
        variant={isMobile ? "fullWidth" : "standard"}
        scrollButtons={isMobile ? "auto" : false}
        allowScrollButtonsMobile
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: isSmallScreen ? '0.8rem' : '0.95rem',
            minHeight: isSmallScreen ? 40 : 48,
            color: 'text.secondary',
            minWidth: isMobile ? 'auto' : 120,
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
          '& .MuiTabs-scrollButtons': {
            width: 32,
            '&.Mui-disabled': {
              opacity: 0.3,
            },
          },
        }}
      >
        <Tab
          icon={<People />}
          iconPosition="start"
          label={isSmallScreen ? "Users" : "Users"}
          sx={{
            '& .MuiTab-iconWrapper': {
              mr: isSmallScreen ? 0.5 : 1,
              fontSize: isSmallScreen ? '1rem' : '1.25rem',
            },
          }}
        />
        <Tab
          icon={<AddBox />}
          iconPosition="start"
          label={isSmallScreen ? "Keys" : "User Keys"}
          sx={{
            '& .MuiTab-iconWrapper': {
              mr: isSmallScreen ? 0.5 : 1,
              fontSize: isSmallScreen ? '1rem' : '1.25rem',
            },
          }}
        />
        <Tab
          icon={<AdminPanelSettings />}
          iconPosition="start"
          label={isSmallScreen ? "Admin" : "Admin Access"}
          sx={{
            '& .MuiTab-iconWrapper': {
              mr: isSmallScreen ? 0.5 : 1,
              fontSize: isSmallScreen ? '1rem' : '1.25rem',
            },
          }}
        />
      </Tabs>
    </Box>
  );
}