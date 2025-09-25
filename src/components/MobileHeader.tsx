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
  HelpOutline,
} from "@mui/icons-material";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";
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
  onHelpClick: () => void;
  onFeedbackClick: () => void;
  onDeleteChat?: (chatId: string) => void;
}

export default function MobileHeader({
  onNewChat,
  chats,
  selectedChatId,
  onChatSelect,
  onSettingsClick,
  onHelpClick,
  onFeedbackClick,
  onDeleteChat,
}: MobileHeaderProps) {
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

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
        elevation={0}
        sx={{
          background:
            mode === "light"
              ? "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
              : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          borderBottom:
            mode === "light"
              ? "1px solid rgba(0, 0, 0, 0.08)"
              : "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          boxShadow:
            mode === "light"
              ? "0 2px 12px rgba(0, 0, 0, 0.04)"
              : "0 2px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: "48px !important", // Reduced height
            px: 2, // Increased padding
            py: 1,
          }}
        >
          {/* Left side - Burger menu */}
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              color: mode === "light" ? "#333" : "white",
              background:
                mode === "light"
                  ? "rgba(0, 0, 0, 0.03)"
                  : "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border:
                mode === "light"
                  ? "1px solid rgba(0, 0, 0, 0.08)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
              width: 40,
              height: 40,
              "&:hover": {
                background:
                  mode === "light"
                    ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))"
                    : "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
                transform: "scale(1.05)",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <MenuIcon sx={{ fontSize: "1.2rem" }} />
          </IconButton>

          {/* Center - Brand name */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 32, // Increased size
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  mode === "light"
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
              }}
            >
              <img
                src="/logo.png"
                alt="Logo"
                style={{
                  height: 20,
                  width: 20,
                  filter: "brightness(0) invert(1)", // Make logo white
                }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: mode === "light" ? "#133487" : "white",
                fontWeight: "bold",
                fontFamily:
                  "'Orbitron', 'Roboto Mono', 'Monaco', 'Consolas', monospace",
                letterSpacing: "0.5px",
                fontSize: "1rem",
              }}
            >
              AITHOR
            </Typography>
          </Box>

          {/* Right side - Theme toggle and Settings */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Theme toggle */}
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: mode === "light" ? "#666" : "#bbb",
                background:
                  mode === "light"
                    ? "rgba(0, 0, 0, 0.03)"
                    : "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border:
                  mode === "light"
                    ? "1px solid rgba(0, 0, 0, 0.08)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                width: 36,
                height: 36,
                "&:hover": {
                  background:
                    mode === "light"
                      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))"
                      : "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                },
                transition: "all 0.3s ease",
              }}
              size="small"
            >
              {mode === "light" ? (
                <LightMode sx={{ fontSize: "1.1rem" }} />
              ) : (
                <DarkMode sx={{ fontSize: "1.1rem" }} />
              )}
            </IconButton>

            {/* Help */}
            <IconButton
              onClick={() => {
                onHelpClick();
                navigate("/help");
              }}
              sx={{
                color: mode === "light" ? "#666" : "#bbb",
                background:
                  mode === "light"
                    ? "rgba(0, 0, 0, 0.03)"
                    : "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border:
                  mode === "light"
                    ? "1px solid rgba(0, 0, 0, 0.08)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                width: 36,
                height: 36,
                "&:hover": {
                  background:
                    mode === "light"
                      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))"
                      : "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                },
                transition: "all 0.3s ease",
              }}
              size="small"
            >
              <HelpOutline sx={{ fontSize: "1.1rem" }} />
            </IconButton>

            {/* Settings */}
            <IconButton
              onClick={() => {
                onSettingsClick();
                navigate("/settings");
              }}
              sx={{
                color: mode === "light" ? "#666" : "#bbb",
                background:
                  mode === "light"
                    ? "rgba(0, 0, 0, 0.03)"
                    : "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border:
                  mode === "light"
                    ? "1px solid rgba(0, 0, 0, 0.08)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                width: 36,
                height: 36,
                "&:hover": {
                  background:
                    mode === "light"
                      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))"
                      : "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                },
                transition: "all 0.3s ease",
              }}
              size="small"
            >
              <Settings sx={{ fontSize: "1.1rem" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: 320, // Increased width for better mobile experience
            background:
              mode === "light"
                ? "#fafbfc"
                : "#1e1e1e",
            borderRight:
              mode === "light"
                ? "1px solid rgba(0, 0, 0, 0.08)"
                : "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            boxShadow:
              mode === "light"
                ? "2px 0 12px rgba(0, 0, 0, 0.05)"
                : "2px 0 12px rgba(0, 0, 0, 0.3)",
          },
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
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
              navigate("/settings");
              setDrawerOpen(false);
            }}
            onHelpClick={() => {
              onHelpClick();
              navigate("/help");
              setDrawerOpen(false);
            }}
            onFeedbackClick={() => {
              onFeedbackClick();
              setDrawerOpen(false);
            }}
            onDeleteChat={onDeleteChat}
           />
        </Box>
      </Drawer>
    </>
  );
}
