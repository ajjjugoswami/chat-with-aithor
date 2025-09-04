import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface ChatLayoutProps {
  sidebar: ReactNode;
  chatArea: ReactNode;
  sidebarCollapsed?: boolean;
}

export default function ChatLayout({ sidebar, chatArea, sidebarCollapsed = false }: ChatLayoutProps) {

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#1a1a1a',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: sidebarCollapsed ? 60 : 280,
          minWidth: sidebarCollapsed ? 60 : 280,
          bgcolor: '#2a2a2a',
          borderRight: '1px solid #404040',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          transition: 'width 0.3s ease',
        }}
      >
        {sidebar}
      </Box>
      
      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden', // Prevent chat area from causing app scroll
          minWidth: 0, // Allow flex shrinking
        }}
      >
        {chatArea}
      </Box>
    </Box>
  );
}
