import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Settings,
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import Sidebar from "./Sidebar";

interface Chat {
  id: string;
  title: string;
  date: string;
}

interface MobileHeaderProps {
  onNewChat: () => void;
  chats: Chat[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  onSettingsClick: () => void;
  onDeleteChat?: (chatId: string) => void;
}

export default function MobileHeader({
  onNewChat,
  chats,
  selectedChatId,
  onChatSelect,
  onSettingsClick,
  onDeleteChat,
}: MobileHeaderProps) {
  const { mode, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleChatSelect = (chatId: string) => {
    onChatSelect(chatId);
    setDrawerOpen(false); // Close drawer when chat is selected
  };

  // Only render on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <>
      <AppBar
        position="static"
        elevation={1}
        sx={{
          bgcolor: mode === "light" ? "#f8f9fa" : "#202020",
          borderBottom: mode === "light" ? "1px solid #e0e0e0" : "1px solid #404040",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: "56px !important" }}>
          {/* Left side - Burger menu */}
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              color: mode === "light" ? "#333" : "white",
              "&:hover": {
                bgcolor: mode === "light" ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Center - Brand name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/logo.png" alt="Logo" style={{ height: 24 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: mode === "light" ? "#133487" : "white",
                fontWeight: "bold",
                fontFamily: "'Orbitron', 'Roboto Mono', 'Monaco', 'Consolas', monospace",
                letterSpacing: "1px",
                fontSize: "1.1rem",
              }}
            >
              AITHOR
            </Typography>
          </Box>

          {/* Right side - Theme toggle and Settings */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {/* Theme toggle */}
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: mode === "light" ? "#666" : "#bbb",
                "&:hover": {
                  color: mode === "light" ? "#333" : "white",
                  bgcolor: mode === "light" ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.08)",
                },
              }}
              size="small"
            >
              {mode === "light" ? <LightMode /> : <DarkMode />}
            </IconButton>

            {/* Settings */}
            <IconButton
              onClick={onSettingsClick}
              sx={{
                color: mode === "light" ? "#666" : "#bbb",
                "&:hover": {
                  color: mode === "light" ? "#333" : "white",
                  bgcolor: mode === "light" ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.08)",
                },
              }}
              size="small"
            >
              <Settings />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer with Sidebar content */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            bgcolor: mode === "light" ? "#f5f5f5" : "background.paper",
            borderRight: mode === "light" ? "1px solid #e0e0e0" : "1px solid #404040",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Sidebar
            onNewChat={() => {
              onNewChat();
              setDrawerOpen(false);
            }}
            chats={chats}
            selectedChatId={selectedChatId}
            onChatSelect={handleChatSelect}
            onSettingsClick={() => {
              onSettingsClick();
              setDrawerOpen(false);
            }}
            onDeleteChat={onDeleteChat}
            isCollapsed={false}
          />
        </Box>
      </Drawer>
    </>
  );
}
