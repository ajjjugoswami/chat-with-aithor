import { Box } from '@mui/material';
import { useState } from 'react';
import type { ReactNode } from 'react';
import ResizablePanel from './ResizablePanel';
import { getSidebarWidth, saveSidebarWidth, getSidebarCollapsed, saveSidebarCollapsed } from '../utils/panelStorage';

interface ChatLayoutProps {
  sidebar: ReactNode;
  chatArea: ReactNode;
}

export default function ChatLayout({ sidebar, chatArea }: ChatLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(getSidebarWidth());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(getSidebarCollapsed());

  const handleSidebarWidthChange = (width: number) => {
    setSidebarWidth(width);
    saveSidebarWidth(width);
  };

  const handleSidebarToggleCollapse = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    saveSidebarCollapsed(newCollapsed);
  };

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
      {/* Sidebar with ResizablePanel */}
      <ResizablePanel
        initialWidth={sidebarWidth}
        minWidth={300}
        maxWidth={500}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleSidebarToggleCollapse}
        onWidthChange={handleSidebarWidthChange}
        showRightHandle={true}
        collapsedWidth={60}
      >
        <Box
          sx={{
            bgcolor: '#2a2a2a',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {sidebar}
        </Box>
      </ResizablePanel>
      
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
