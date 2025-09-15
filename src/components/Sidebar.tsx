import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Tooltip,
  useMediaQuery,
  Chip,
  Fade,
  Slide,
} from "@mui/material";
import {
  Add,
  Settings,
  Delete,
  ChevronLeft,
  ChevronRight,
  Logout,
  LightMode,
  DarkMode,
  Chat as ChatIcon,
  HelpOutline,
  Shield,
} from "@mui/icons-material";
import { MessageSquare } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";

interface Chat {
  id: string;
  title: string;
  date: string;
}

interface SidebarProps {
  onNewChat: () => void;
  chats: Chat[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  onSettingsClick: () => void;
  onHelpClick: () => void;
  onFeedbackClick: () => void;
  onDeleteChat?: (chatId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  onNewChat,
  chats,
  selectedChatId,
  onChatSelect,
  onSettingsClick,
  onHelpClick,
  onFeedbackClick,
  onDeleteChat,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const { signOut, user } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const groupedChats = chats?.reduce((acc, chat) => {
    if (!acc[chat.date]) {
      acc[chat.date] = [];
    }
    acc[chat.date].push(chat);
    return acc;
  }, {} as Record<string, Chat[]>);
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: isCollapsed ? 1 : 2,
        alignItems: isCollapsed ? "center" : "stretch",
        background:
          mode === "light"
            ? "linear-gradient(180deg, #fafbfc 0%, #ffffff 100%)"
            : "linear-gradient(180deg, #1e1e1e 0%, #121212 100%)",
        borderRight:
          mode === "light"
            ? "1px solid rgba(0, 0, 0, 0.06)"
            : "1px solid rgba(255, 255, 255, 0.06)",
        position: "relative",
        backdropFilter: "blur(10px)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background:
            "linear-gradient(90deg, #667eea 0%, #4facfe 50%, #00f2fe 100%)",
          zIndex: 1,
        },
      }}
    >
      {/* Header with Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          justifyContent: isCollapsed ? "center" : "space-between",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: isCollapsed ? 0 : 2,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
            }}
          >
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                height: 28,
                width: 28,
                position: "relative",
                zIndex: 1,
                filter: "brightness(1.2) contrast(1.1)",
              }}
            />
          </Box>
          {!isCollapsed && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #4facfe 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  fontWeight: 800,
                  fontFamily:
                    "'Orbitron', 'Roboto Mono', 'Monaco', 'Consolas', monospace",
                  letterSpacing: "2px",
                  fontSize: "1.5rem",
                  mb: 0.5,
                }}
              >
                AITHOR
              </Typography>
            </Box>
          )}
        </Box>

        {onToggleCollapse && (
          <IconButton
            onClick={onToggleCollapse}
            sx={{
              color: mode === "light" ? "#666" : "#888",
              position: isCollapsed ? "absolute" : "static",
              top: isCollapsed ? "50px" : "auto",
              left: isCollapsed ? "50%" : "auto",
              transform: isCollapsed ? "translateX(-50%)" : "none",
              background:
                mode === "light"
                  ? "rgba(255, 255, 255, 0.8)"
                  : "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border:
                mode === "light"
                  ? "1px solid rgba(0, 0, 0, 0.08)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
              "&:hover": {
                color: mode === "light" ? "#333" : "white",
                background:
                  mode === "light"
                    ? "rgba(255, 255, 255, 0.95)"
                    : "rgba(255, 255, 255, 0.1)",
                transform: isCollapsed
                  ? "translateX(-50%) scale(1.05)"
                  : "scale(1.05)",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            size="small"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Box>

      {isCollapsed ? (
        <Tooltip title="New Chat" placement="right">
          <IconButton
            onClick={() => {
              onNewChat();
            }}
            sx={{
              mb: 2,
              mt: 5,
              width: 44,
              height: 44,
              background: "linear-gradient(135deg, #667eea 0%, #00b4d8 100%)",
              color: "white",
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #0096c7 100%)",
                transform: "translateY(-2px) scale(1.05)",
                boxShadow: "0 12px 35px rgba(102, 126, 234, 0.5)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Add />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            onNewChat();
          }}
          sx={{
            mb: 2,
            background: "linear-gradient(135deg, #5a6fd8 0%, #0096c7 100%)",

            color: "white",
            borderRadius: "10px",
            py: 0.8,
            px: 3,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
            // boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
            border: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #667eea 0%, #00b4d8 100%)",

              // transform: "translateY(-2px)",
              // boxShadow: "0 12px 35px rgba(102, 126, 234, 0.5)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          New Chat
        </Button>
      )}

      {/* Chats Section */}
      {!isCollapsed && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <ChatIcon
              sx={{
                color: mode === "light" ? "#667eea" : "#888",
                fontSize: "20px",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: mode === "light" ? "#333" : "#fff",
                fontWeight: 600,
                fontSize: "1.1rem",
              }}
            >
              Chats
            </Typography>
            <Chip
              label={chats?.length || 0}
              size="small"
              sx={{
                background:
                  mode === "light"
                    ? "linear-gradient(135deg, #667eea 0%, #4facfe 100%)"
                    : "rgba(102, 126, 234, 0.2)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.7rem",
                height: "20px",
                ml: "auto",
              }}
            />
          </Box>

          {/* Chat List */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background:
                  mode === "light"
                    ? "rgba(0, 0, 0, 0.1)"
                    : "rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background:
                  mode === "light"
                    ? "rgba(0, 0, 0, 0.2)"
                    : "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            {Object?.entries(groupedChats).map(([date, dateChats]) => (
              <Fade in={true} timeout={500} key={date}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: mode === "light" ? "#888" : "#666",
                      pl: 1,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontSize: "0.7rem",
                    }}
                  >
                    {date}
                  </Typography>
                  <List dense sx={{ mt: 1 }}>
                    {dateChats.map((chat, index) => (
                      <Slide
                        in={true}
                        timeout={300 + index * 100}
                        direction="right"
                        key={chat.id}
                      >
                        <ListItem
                          sx={{
                            borderRadius: "12px",
                            mb: 0.5,
                            background:
                              selectedChatId === chat.id
                                ? mode === "light"
                                  ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
                                  : "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)"
                                : "transparent",
                            border:
                              selectedChatId === chat.id
                                ? "1px solid rgba(102, 126, 234, 0.3)"
                                : "1px solid transparent",
                            "&:hover": {
                              background:
                                mode === "light"
                                  ? "rgba(102, 126, 234, 0.05)"
                                  : "rgba(255, 255, 255, 0.03)",
                              border: "1px solid rgba(102, 126, 234, 0.2)",
                              transform: "translateX(4px)",
                              "& .delete-button": {
                                opacity: 1,
                              },
                            },
                            pr: 1,
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          <ListItemText
                            onClick={() => {
                              onChatSelect(chat.id);
                              navigate(`/chat/c/${chat.id}`);
                            }}
                            primary={chat.title}
                            primaryTypographyProps={{
                              variant: "body2",
                              sx: {
                                color: mode === "light" ? "#333" : "#fff",
                                cursor: "pointer",
                                fontWeight:
                                  selectedChatId === chat.id ? 600 : 400,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              },
                            }}
                            sx={{ flex: 1 }}
                          />
                          {onDeleteChat && (
                            <IconButton
                              className="delete-button"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChat(chat.id);
                              }}
                              sx={{
                                opacity: 0,
                                transition: "all 0.2s",
                                color: mode === "light" ? "#999" : "#666",
                                background: "rgba(244, 67, 54, 0.1)",
                                "&:hover": {
                                  color: "#f44336",
                                  background: "rgba(244, 67, 54, 0.2)",
                                  transform: "scale(1.1)",
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </ListItem>
                      </Slide>
                    ))}
                  </List>
                </Box>
              </Fade>
            ))}
          </Box>
        </>
      )}

      {!isMobile && (
        <Box sx={{ mt: "auto" }}>
          {!isCollapsed && (
            <Divider
              sx={{ bgcolor: mode === "light" ? "#e0e0e0" : "#404040", mb: 2 }}
            />
          )}

          {/* Theme Toggle, Settings, and Help Icons */}
          {isCollapsed ? (
            <>
              {/* Theme Toggle - Collapsed */}
              <Tooltip
                title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
                placement="right"
              >
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    mb: 1,
                    ml: 1,
                    width: 44,
                    height: 44,
                    background:
                      mode === "light"
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border:
                      mode === "light"
                        ? "1px solid rgba(0, 0, 0, 0.08)"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                    color: mode === "light" ? "#667eea" : "#4facfe",
                    "&:hover": {
                      background:
                        mode === "light"
                          ? "rgba(255, 255, 255, 1)"
                          : "rgba(255, 255, 255, 0.1)",
                      transform: "translateY(-2px) scale(1.05)",
                      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.2)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {mode === "light" ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>

              {/* Settings - Collapsed */}
              <Tooltip title="Settings" placement="right">
                <IconButton
                  onClick={() => {
                    onSettingsClick();
                    navigate("/settings");
                  }}
                  sx={{
                    mb: 1,
                    ml: 1,
                    width: 44,
                    height: 44,
                    background:
                      mode === "light"
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border:
                      mode === "light"
                        ? "1px solid rgba(0, 0, 0, 0.08)"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                    color: mode === "light" ? "#667eea" : "#888",
                    "&:hover": {
                      background:
                        mode === "light"
                          ? "rgba(255, 255, 255, 1)"
                          : "rgba(255, 255, 255, 0.1)",
                      color: mode === "light" ? "#5a6fd8" : "white",
                      transform: "translateY(-2px) scale(1.05)",
                      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.2)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Settings />
                </IconButton>
              </Tooltip>

              {/* Help - Collapsed */}
              <Tooltip title="Help" placement="right">
                <IconButton
                  onClick={() => {
                    onHelpClick();
                    navigate("/help");
                  }}
                  sx={{
                    mb: 2,
                    ml: 1,
                    width: 44,
                    height: 44,
                    background:
                      mode === "light"
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border:
                      mode === "light"
                        ? "1px solid rgba(0, 0, 0, 0.08)"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                    color: mode === "light" ? "#667eea" : "#888",
                    "&:hover": {
                      background:
                        mode === "light"
                          ? "rgba(255, 255, 255, 1)"
                          : "rgba(255, 255, 255, 0.1)",
                      color: mode === "light" ? "#5a6fd8" : "white",
                      transform: "translateY(-2px) scale(1.05)",
                      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.2)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <HelpOutline />
                </IconButton>
              </Tooltip>

              {/* Feedback - Collapsed */}
              <Tooltip title="Feedback" placement="right">
                <IconButton
                  onClick={onFeedbackClick}
                  sx={{
                    mb: 1,
                    ml: 1,
                    width: 44,
                    height: 44,
                    background:
                      mode === "light"
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border:
                      mode === "light"
                        ? "1px solid rgba(0, 0, 0, 0.08)"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                    color: mode === "light" ? "#667eea" : "#888",
                    "&:hover": {
                      background:
                        mode === "light"
                          ? "rgba(255, 255, 255, 1)"
                          : "rgba(255, 255, 255, 0.1)",
                      color: mode === "light" ? "#5a6fd8" : "white",
                      transform: "translateY(-2px) scale(1.05)",
                      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.2)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <MessageSquare size={20} />
                </IconButton>
              </Tooltip>

              {/* Admin - Collapsed - Only visible to admin */}
              {user?.isAdmin && (
                <Tooltip title="Admin Panel" placement="right">
                  <IconButton
                    onClick={() => navigate("/admin")}
                    sx={{
                      mb: 2,
                      ml: 1,
                      width: 44,
                      height: 44,
                      background:
                        mode === "light"
                          ? "rgba(255, 255, 255, 0.9)"
                          : "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border:
                        mode === "light"
                          ? "1px solid rgba(0, 0, 0, 0.08)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      color: mode === "light" ? "#ff6b35" : "#ff8a65",
                      "&:hover": {
                        background:
                          mode === "light"
                            ? "rgba(255, 255, 255, 1)"
                            : "rgba(255, 255, 255, 0.1)",
                        color: mode === "light" ? "#e55a2b" : "white",
                        transform: "translateY(-2px) scale(1.05)",
                        boxShadow: "0 8px 25px rgba(255, 107, 53, 0.3)",
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <Shield />
                  </IconButton>
                </Tooltip>
              )}
            </>
          ) : (
            /* Uncollapsed - Icons in a row */
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                // gap: 4,
                mb: 2,
                p: 1,
                borderRadius: "16px",
                background:
                  mode === "light"
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border:
                  mode === "light"
                    ? "1px solid rgba(0, 0, 0, 0.08)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Theme Toggle */}
              <Tooltip
                title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
              >
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    width: 40,
                    height: 40,
                    color: mode === "light" ? "#667eea" : "#4facfe",
                    "&:hover": {
                      background:
                        mode === "light"
                          ? "rgba(102, 126, 234, 0.1)"
                          : "rgba(255, 255, 255, 0.1)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {mode === "light" ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>

              {/* Settings */}
              <Tooltip title="Settings">
                <IconButton
                  onClick={() => {
                    onSettingsClick();
                    navigate("/settings");
                  }}
                  sx={{
                    width: 40,
                    height: 40,
                    color: mode === "light" ? "#667eea" : "#888",
                    "&:hover": {
                      background:
                        mode === "light"
                          ? "rgba(102, 126, 234, 0.1)"
                          : "rgba(255, 255, 255, 0.1)",
                      color: mode === "light" ? "#5a6fd8" : "white",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Settings />
                </IconButton>
              </Tooltip>

              {/* Help */}
              <Tooltip title="Help">
                <IconButton
                  onClick={() => {
                    onHelpClick();
                    navigate("/help");
                  }}
                  sx={{
                    width: 40,
                    height: 40,
                    color: mode === "light" ? "#667eea" : "#888",
                    "&:hover": {
                      background:
                        mode === "light"
                          ? "rgba(102, 126, 234, 0.1)"
                          : "rgba(255, 255, 255, 0.1)",
                      color: mode === "light" ? "#5a6fd8" : "white",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <HelpOutline />
                </IconButton>
              </Tooltip>

              {/* Feedback */}
              <Tooltip title="Feedback">
                <IconButton
                  onClick={onFeedbackClick}
                  sx={{
                    width: 40,
                    height: 40,
                    color: mode === "light" ? "#667eea" : "#888",
                    "&:hover": {
                      background:
                        mode === "light"
                          ? "rgba(102, 126, 234, 0.1)"
                          : "rgba(255, 255, 255, 0.1)",
                      color: mode === "light" ? "#5a6fd8" : "white",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <MessageSquare size={20} />
                </IconButton>
              </Tooltip>

              {/* Admin - Only visible to admin */}
              {user?.isAdmin && (
                <Tooltip title="Admin Panel">
                  <IconButton
                    onClick={() => navigate("/admin")}
                    sx={{
                      width: 40,
                      height: 40,
                      color: mode === "light" ? "#ff6b35" : "#ff8a65",
                      "&:hover": {
                        background:
                          mode === "light"
                            ? "rgba(255, 107, 53, 0.1)"
                            : "rgba(255, 255, 255, 0.1)",
                        color: mode === "light" ? "#e55a2b" : "white",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <Shield />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}

          {/* User Panel */}
          {user && (
            <Box
              sx={{
                position: "relative",
                borderRadius: "16px",
                p: "2px", // Space for gradient border
                background: "linear-gradient(135deg, #667eea 0%, #4facfe 100%)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "2px",
                  left: "2px",
                  right: "2px",
                  bottom: "2px",
                  background: mode === "light" ? "#f5f5f5" : "#1a1a1a",
                  borderRadius: "14px",
                  zIndex: 1,
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                  p: isCollapsed ? 1.5 : 2,
                  display: "flex",
                  flexDirection: isCollapsed ? "column" : "row",
                  alignItems: "start",
                  gap: isCollapsed ? 1 : 2,
                  borderRadius: "14px",
                }}
              >
                {/* User Avatar */}
                <Avatar
                  src={user.picture}
                  alt={user.name}
                  sx={{
                    width: isCollapsed ? 30 : 44,
                    height: isCollapsed ? 30 : 44,
                    border: "2px solid transparent",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #4facfe 100%)",
                    "& .MuiAvatar-img": {
                      borderRadius: "50%",
                    },
                  }}
                />

                {/* User Info and Sign Out Button */}
                {!isCollapsed && (
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: mode === "light" ? "#333" : "white",
                        fontWeight: 600,
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "0.9rem",
                      }}
                    >
                      {user.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: mode === "light" ? "#666" : "#bbb",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        mb: 1.5,
                        fontSize: "0.75rem",
                      }}
                    >
                      {user.email}
                    </Typography>
                    <Button
                      startIcon={<Logout />}
                      onClick={signOut}
                      size="small"
                      sx={{
                        color: mode === "light" ? "#666" : "#bbb",
                        textTransform: "none",
                        fontSize: "0.75rem",
                        minHeight: "32px",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border:
                          mode === "light"
                            ? "1px solid #e0e0e0"
                            : "1px solid #404040",
                        width: "100%",
                        justifyContent: "flex-start",
                        "&:hover": {
                          color: "#fff",
                          bgcolor: "rgba(244, 67, 54, 0.1)",
                          borderColor: "#f44336",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 8px rgba(244, 67, 54, 0.2)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      Sign Out
                    </Button>
                  </Box>
                )}

                {/* Collapsed Sign Out Button */}
                {isCollapsed && (
                  <IconButton
                    onClick={signOut}
                    size="small"
                    sx={{
                      color: mode === "light" ? "#666" : "#bbb",
                      border:
                        mode === "light"
                          ? "1px solid #e0e0e0"
                          : "1px solid #404040",
                      borderRadius: "8px",
                      "&:hover": {
                        color: "#fff",
                        bgcolor: "rgba(244, 67, 54, 0.1)",
                        borderColor: "#f44336",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 8px rgba(244, 67, 54, 0.2)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <Logout fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {isMobile && (
        <>
          {/* Feedback Button - Mobile */}
          <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
            <Button
              startIcon={<MessageSquare size={16} />}
              onClick={onFeedbackClick}
              size="small"
              sx={{
                color: mode === "light" ? "#667eea" : "#888",
                textTransform: "none",
                fontSize: "0.75rem",
                minHeight: "32px",
                padding: "6px 12px",
                width: "100%",
                borderRadius: "8px",
                border:
                  mode === "light"
                    ? "1px solid rgba(102, 126, 234, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.3)",
                background:
                  mode === "light"
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  color: "#fff",
                  bgcolor: "rgba(102, 126, 234, 0.1)",
                  borderColor: "#667eea",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 8px rgba(102, 126, 234, 0.2)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Feedback
            </Button>
          </Box>

          {user && (
            <Box
              sx={{
                position: "relative",
                borderRadius: "16px",
                p: "2px", // Space for gradient border
                background: "linear-gradient(135deg, #667eea 0%, #4facfe 100%)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "2px",
                  left: "2px",
                  right: "2px",
                  bottom: "2px",
                  background: mode === "light" ? "#f5f5f5" : "#1a1a1a",
                  borderRadius: "14px",
                  zIndex: 1,
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                  p: isCollapsed ? 1.5 : 2,
                  display: "flex",
                  flexDirection: isCollapsed ? "column" : "row",
                  alignItems: "start",
                  gap: isCollapsed ? 1 : 2,
                  borderRadius: "14px",
                }}
              >
                {/* User Avatar */}
                <Avatar
                  src={user.picture}
                  alt={user.name}
                  sx={{
                    width: isCollapsed ? 30 : 44,
                    height: isCollapsed ? 30 : 44,
                    border: "2px solid transparent",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #4facfe 100%)",
                    "& .MuiAvatar-img": {
                      borderRadius: "50%",
                    },
                  }}
                />

                {/* User Info and Sign Out Button */}
                {!isCollapsed && (
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: mode === "light" ? "#333" : "white",
                        fontWeight: 600,
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "0.9rem",
                      }}
                    >
                      {user.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: mode === "light" ? "#666" : "#bbb",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        mb: 1.5,
                        fontSize: "0.75rem",
                      }}
                    >
                      {user.email}
                    </Typography>

                    {/* Admin Button - Mobile */}
                    {user?.isAdmin && (
                      <Button
                        startIcon={<Shield />}
                        onClick={() => navigate("/admin")}
                        size="small"
                        sx={{
                          color: mode === "light" ? "#ff6b35" : "#ff8a65",
                          textTransform: "none",
                          fontSize: "0.75rem",
                          minHeight: "32px",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          border:
                            mode === "light"
                              ? "1px solid rgba(255, 107, 53, 0.3)"
                              : "1px solid rgba(255, 138, 101, 0.3)",
                          width: "100%",
                          justifyContent: "flex-start",
                          mb: 1,
                          "&:hover": {
                            color: "#fff",
                            bgcolor: "rgba(255, 107, 53, 0.1)",
                            borderColor: "#ff6b35",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 8px rgba(255, 107, 53, 0.2)",
                          },
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        Admin Panel
                      </Button>
                    )}

                    <Button
                      startIcon={<Logout />}
                      onClick={signOut}
                      size="small"
                      sx={{
                        color: mode === "light" ? "#666" : "#bbb",
                        textTransform: "none",
                        fontSize: "0.75rem",
                        minHeight: "32px",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border:
                          mode === "light"
                            ? "1px solid #e0e0e0"
                            : "1px solid #404040",
                        width: "100%",
                        justifyContent: "flex-start",
                        "&:hover": {
                          color: "#fff",
                          bgcolor: "rgba(244, 67, 54, 0.1)",
                          borderColor: "#f44336",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 8px rgba(244, 67, 54, 0.2)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      Sign Out
                    </Button>
                  </Box>
                )}

                {/* Collapsed Sign Out Button */}
                {isCollapsed && (
                  <IconButton
                    onClick={signOut}
                    size="small"
                    sx={{
                      color: mode === "light" ? "#666" : "#bbb",
                      border:
                        mode === "light"
                          ? "1px solid #e0e0e0"
                          : "1px solid #404040",
                      borderRadius: "8px",
                      "&:hover": {
                        color: "#fff",
                        bgcolor: "rgba(244, 67, 54, 0.1)",
                        borderColor: "#f44336",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 8px rgba(244, 67, 54, 0.2)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <Logout fontSize="small" />
                  </IconButton>
                )}

                {/* Admin Button - Mobile Collapsed */}
                {isCollapsed && user?.isAdmin && (
                  <IconButton
                    onClick={() => navigate("/admin")}
                    size="small"
                    sx={{
                      color: mode === "light" ? "#ff6b35" : "#ff8a65",
                      border:
                        mode === "light"
                          ? "1px solid rgba(255, 107, 53, 0.3)"
                          : "1px solid rgba(255, 138, 101, 0.3)",
                      borderRadius: "8px",
                      mt: 1,
                      "&:hover": {
                        color: "#fff",
                        bgcolor: "rgba(255, 107, 53, 0.1)",
                        borderColor: "#ff6b35",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 8px rgba(255, 107, 53, 0.2)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <Shield fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
