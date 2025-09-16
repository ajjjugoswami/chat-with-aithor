import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, IconButton, AppBar, useMediaQuery, useTheme } from '@mui/material';
import { Dashboard as DashboardIcon, People as PeopleIcon, Key as KeyIcon, AdminPanelSettings as AdminIcon, Settings as SettingsIcon, Feedback as FeedbackIcon, ArrowBack, LightMode, DarkMode, Menu as MenuIcon } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../../hooks/useTheme';

const drawerWidth = 280;

interface NavigationItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { icon: DashboardIcon, label: 'Dashboard', path: '/admin' },
  { icon: PeopleIcon, label: 'Users', path: '/admin/users' },
  { icon: KeyIcon, label: 'User Keys', path: '/admin/user-keys' },
  { icon: AdminIcon, label: 'Admin Access', path: '/admin/admin-access' },
  { icon: SettingsIcon, label: 'App Management', path: '/admin/app-management' },
  { icon: FeedbackIcon, label: 'User Feedback', path: '/admin/feedback' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useCustomTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleItemClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };
  const handleBackToApp = () => navigate('/chat');
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, borderBottom: 1, borderColor: 'divider', backgroundColor: mode === 'light' ? '#f8f9fa' : '#1a1a1a' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AdminIcon sx={{ color: mode === 'light' ? '#1976d2' : '#90caf9', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: mode === 'light' ? '#1976d2' : '#90caf9', fontSize: '1.1rem' }}>
            Admin Panel
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ px: 2, py: 1 }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  backgroundColor: isActive ? (mode === 'light' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(144, 202, 249, 0.08)') : 'transparent',
                  border: isActive ? `1px solid ${mode === 'light' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(144, 202, 249, 0.2)'}` : '1px solid transparent',
                  '&:hover': {
                    backgroundColor: isActive ? (mode === 'light' ? 'rgba(25, 118, 210, 0.12)' : 'rgba(144, 202, 249, 0.12)') : (mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)'),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? (mode === 'light' ? '#1976d2' : '#90caf9') : (mode === 'light' ? '#666' : '#aaa') }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{ '& .MuiListItemText-primary': { fontSize: '0.95rem', fontWeight: isActive ? 600 : 500 } }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        sx={{
          display: { xs: 'block', md: 'none' },
          bgcolor: mode === 'light' ? '#fff' : '#2d2d2d',
          color: mode === 'light' ? '#000' : '#fff',
          boxShadow: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: 'inherit' }}
          >
            <MenuIcon />
          </IconButton>
          <AdminIcon sx={{ color: mode === 'light' ? '#1976d2' : '#90caf9', fontSize: 24, mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: mode === 'light' ? '#1976d2' : '#90caf9' }}>
            Admin Panel
          </Typography>
          <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.primary', mr: 1 }}>
            {mode === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>
          <IconButton onClick={handleBackToApp} size="small" sx={{ color: 'text.primary' }}>
            <ArrowBack />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Navigation */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: mode === 'light' ? '#fff' : '#2d2d2d',
              borderRight: `1px solid ${mode === 'light' ? '#e0e0e0' : '#404040'}`,
            },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: mode === 'light' ? '#fff' : '#2d2d2d',
              borderRight: `1px solid ${mode === 'light' ? '#e0e0e0' : '#404040'}`,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          width: { md: `calc(100% - ${drawerWidth}px)` }, 
          minHeight: '100vh', 
          bgcolor: mode === 'light' ? '#f5f5f5' : '#1a1a1a',
          mt: { xs: '64px', md: 0 }, // Add top margin on mobile for AppBar
        }}
      >
        {/* Desktop Header */}
        <Box 
          sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider', 
            bgcolor: mode === 'light' ? '#fff' : '#2d2d2d' 
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Aithor Admin</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.primary', '&:hover': { color: mode === 'light' ? '#1976d2' : '#90caf9' } }} title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
              {mode === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
            <IconButton onClick={handleBackToApp} size="small" sx={{ color: 'text.primary', '&:hover': { color: mode === 'light' ? '#1976d2' : '#90caf9' } }} title="Back to Chat">
              <ArrowBack />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ p: 3, maxWidth: '100%' }}>{children}</Box>
      </Box>
    </Box>
  );
}
