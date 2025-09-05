import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import DragHandle from './DragHandle';
import { useTheme } from '../hooks/useTheme';

interface ResizablePanelProps {
  children: React.ReactNode;
  initialWidth: number;
  minWidth: number;
  maxWidth?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onWidthChange?: (width: number) => void;
  showRightHandle?: boolean;
  showLeftHandle?: boolean;
  collapsedWidth?: number;
  className?: string;
  isMobile?: boolean;
}

export default function ResizablePanel({
  children,
  initialWidth,
  minWidth,
  maxWidth = 1000,
  isCollapsed = false,
  onToggleCollapse,
  onWidthChange,
  showRightHandle = true,
  showLeftHandle = false,
  collapsedWidth = 60,
  className,
  isMobile = false,
}: ResizablePanelProps) {
  const { mode } = useTheme();
  const [width, setWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const actualWidth = isMobile ? '100%' : (isCollapsed ? collapsedWidth : width);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isCollapsed) return;
    
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width, isCollapsed]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startXRef.current;
    const newWidth = Math.max(
      minWidth,
      Math.min(maxWidth, startWidthRef.current + deltaX)
    );

    setWidth(newWidth);
    onWidthChange?.(newWidth);
  }, [isDragging, minWidth, maxWidth, onWidthChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle responsive behavior - auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      // Auto-collapse panels on mobile/tablet screens if not manually controlled
      if (screenWidth < 768 && !isCollapsed && onToggleCollapse) {
        // Only auto-collapse if the panel would be too narrow
        if (width > screenWidth * 0.3) {
          onToggleCollapse();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, isCollapsed, onToggleCollapse]);

  // Handle collapse/expand
  const handleToggleCollapse = () => {
    onToggleCollapse?.();
  };

  return (
    <Box
      ref={panelRef}
      className={className}
      sx={{
        width: actualWidth,
        minWidth: isMobile ? 'auto' : actualWidth,
        maxWidth: isMobile ? 'none' : actualWidth,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transition: isDragging ? 'none' : 'width 0.3s ease',
        bgcolor: mode === 'light' ? '#ffffff' : '#1a1a1a',
        borderRight: (showRightHandle && !isMobile) ? (mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333') : 'none',
        borderLeft: (showLeftHandle && !isMobile) ? (mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333') : 'none',
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>

      {/* Left Resize Handle */}
      {showLeftHandle && !isMobile && (
        <DragHandle 
          onMouseDown={handleMouseDown}
          position="left"
          isVisible={!isCollapsed}
        />
      )}

      {/* Right Resize Handle */}
      {showRightHandle && !isMobile && (
        <DragHandle 
          onMouseDown={handleMouseDown}
          position="right"
          isVisible={!isCollapsed}
        />
      )}

      {/* Collapsed State Expand Button */}
      {isCollapsed && onToggleCollapse && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
          }}
        >
          <IconButton
            onClick={handleToggleCollapse}
            sx={{
              color: '#666',
              bgcolor: '#2a2a2a',
              border: '1px solid #444',
              width: 32,
              height: 32,
              '&:hover': {
                color: 'white',
                bgcolor: '#333',
              },
            }}
          >
            {showRightHandle ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
