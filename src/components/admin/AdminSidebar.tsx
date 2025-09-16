import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Key as KeyIcon,
  AdminPanelSettings as AdminIcon,
  Settings as SettingsIcon,
  Feedback as FeedbackIcon,
} from '@mui/icons-material';
import { useTheme } from '../../hooks/useTheme';
import { DRAWER_WIDTH } from './constants';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/admin/users',
    },
    {
      text: 'User Keys',
      icon: <KeyIcon />,
      path: '/admin/user-keys',
    },
    {
      text: 'Admin Access',
      icon: <AdminIcon />,
      path: '/admin/admin-access',
    },
    {
      text: 'App Management',
      icon: <SettingsIcon />,
      path: '/admin/app-management',
    },
    {
      text: 'User Feedback',
      icon: <FeedbackIcon />,
      path: '/admin/feedback',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onMobileClose();
    }
  };

  const drawerContent = (
    <Box>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          borderBottom: `1px solid ${mode === 'light' ? '#e0e0e0' : '#333'}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: mode === 'light' ? '#333' : '#fff',
          }}
        >
          Admin Panel
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  bgcolor: isActive 
                    ? mode === 'light' 
                      ? 'rgba(25, 118, 210, 0.08)' 
                      : 'rgba(144, 202, 249, 0.16)'
                    : 'transparent',
                  color: isActive
                    ? mode === 'light'
                      ? '#1976d2'
                      : '#90caf9'
                    : mode === 'light'
                      ? '#666'
                      : '#ccc',
                  '&:hover': {
                    bgcolor: mode === 'light'
                      ? 'rgba(25, 118, 210, 0.04)'
                      : 'rgba(144, 202, 249, 0.08)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isActive ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            bgcolor: mode === 'light' ? '#fff' : '#1e1e1e',
            borderRight: `1px solid ${mode === 'light' ? '#e0e0e0' : '#333'}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            bgcolor: mode === 'light' ? '#fff' : '#1e1e1e',
            borderRight: `1px solid ${mode === 'light' ? '#e0e0e0' : '#333'}`,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}