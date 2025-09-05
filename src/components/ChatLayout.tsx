import { Box, useMediaQuery } from '@mui/material';
import type { ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';

interface ChatLayoutProps {
  sidebar: ReactNode;
  chatArea: ReactNode;
  sidebarCollapsed?: boolean;
}

export default function ChatLayout({ sidebar, chatArea, sidebarCollapsed = false }: ChatLayoutProps) {
  const { mode } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        height: isMobile ? '100dvh' : '100vh', // Use dvh for mobile
        minHeight: isMobile ? '100svh' : '100vh', // Fallback for older browsers
        bgcolor: mode === 'light' ? '#ffffff' : '#1a1a1a',
        color: mode === 'light' ? '#000000' : 'white',
        overflow: isMobile ? 'auto' : 'hidden',
        position: isMobile ? 'relative' : 'static',
      }}
    >
      {/* Mobile Header - Show only on mobile */}
      {isMobile && sidebar}

      {/* Sidebar - Show only on desktop */}
      {!isMobile && (
        <Box
          sx={{
            width: sidebarCollapsed ? 60 : 280,
            minWidth: sidebarCollapsed ? 60 : 280,
            bgcolor: mode === 'light' ? '#f5f5f5' : '#2a2a2a',
            borderRight: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #404040',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            transition: 'width 0.3s ease',
          }}
        >
          {sidebar}
        </Box>
      )}
      
      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: isMobile ? 'visible' : 'hidden',
          minWidth: 0,
          height: isMobile ? 'auto' : '100%',
          minHeight: isMobile ? 'calc(100dvh - 56px)' : 'auto', // Subtract header height on mobile
          backgroundColor: mode === "light" ? "#fff !important" : "#202020",
        }}
      >
        {chatArea}
      </Box>
    </Box>
  );
}
