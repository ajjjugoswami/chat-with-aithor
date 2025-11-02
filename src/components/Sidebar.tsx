import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  useMediaQuery,
  Fade,
  Slide,
  LinearProgress,
} from "@mui/material";
import {
  Add,
  Settings,
  Delete,
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
}: SidebarProps) {
  const { user, quotas } = useAuth();
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
        p: 2,
        alignItems: "stretch",
        background: mode === "light" ? "#fafbfc" : "#1e1e1e",
        borderRight: isMobile
          ? "none"
          : mode === "light"
          ? "0.5px solid rgba(0, 0, 0, 0.06)"
          : "0.5px solid rgba(255, 255, 255, 0.06)",
        overflow: isMobile ? "auto" : "visible",
        maxHeight: isMobile ? "100vh" : "100%",
        minWidth: isMobile ? "280px" : "auto",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, #667eea 0%, #4facfe 50%, #00f2fe 100%)",
          zIndex: 1,
          width: isMobile ? "340px" : "280px",
        },
      }}
    >
      {/* Header with Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          justifyContent: "space-between",
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
              mr: 2,
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
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: mode === "light" ? "#333" : "#fff",
                fontWeight: 800,
                fontFamily:
                  "'Orbitron', 'Roboto Mono', 'Monaco', 'Consolas', monospace",
                letterSpacing: "2px",
                fontSize: { xs: "1.5rem", sm: "1.5rem" },
              }}
            >
              AITHOR
            </Typography>
          </Box>
        </Box>
      </Box>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          onNewChat();
        }}
        className="new-chat-btn"
        sx={{
          mb: 2,
          background: mode === "light" ? "#667eea" : "#333",
          color: "white",
          borderRadius: "10px",
          py: 0.8,
          px: 3,
          fontWeight: 600,
          textTransform: "none",
          fontSize: "1rem",
          border: "none",
          "&:hover": {
            background: mode === "light" ? "#5a6fd8" : "#444",
          },
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        New Chat
      </Button>

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
            <Box sx={{ mb: 2 }}>
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
              <List dense sx={{ mt: 0.5 }}>
                {dateChats.map((chat, index) => (
                  <Slide
                    in={true}
                    timeout={300 + index * 100}
                    direction="right"
                    key={chat.id}
                  >
                    <ListItem
                      sx={{
                        borderRadius: "8px",
                        mb: 0.3,
                        background:
                          selectedChatId === chat.id
                            ? mode === "light"
                              ? "rgba(102, 126, 234, 0.1)"
                              : "rgba(0, 0, 0, 0.3)"
                            : "transparent",

                        "&:hover": {
                          transform: "translateX(2px)",
                          "& .delete-button": {
                            opacity: 1,
                          },
                        },
                        px: 1,
                        py: 0.5,
                        minHeight: "36px",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <ListItemText
                        onClick={() => onChatSelect(chat.id)}
                        primary={chat.title}
                        primaryTypographyProps={{
                          variant: "body2",
                          sx: {
                            color: mode === "light" ? "#333" : "#fff",
                            cursor: "pointer",
                            fontWeight: selectedChatId === chat.id ? 600 : 400,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.85rem",
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

      {!isMobile && (
        <Box sx={{ mt: "auto" }}>
          <Divider
            sx={{ bgcolor: mode === "light" ? "#e0e0e0" : "#404040", mb: 2 }}
          />

          {/* Theme Toggle, Settings, and Help Icons */}

          {user && quotas && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                borderRadius: "12px",
                background:
                  quotas.openai.remainingCalls <= 0 &&
                  quotas.gemini.remainingCalls <= 0
                    ? "#2c1919"
                    : mode === "light"
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(255, 255, 255, 0.05)",
                border:
                  quotas.openai.remainingCalls <= 0 &&
                  quotas.gemini.remainingCalls <= 0
                    ? "1px solid #ef4444"
                    : mode === "light"
                    ? "1px solid rgba(0, 0, 0, 0.08)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: mode === "light" ? "#333" : "#fff",
                  fontWeight: 600,
                  fontSize: "1rem",
                  mb: 2,
                }}
              >
                Free Plan
              </Typography>

              {/* OpenAI Quota */}
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: mode === "light" ? "#333" : "#fff",
                      fontWeight: 500,
                      fontSize: "0.85rem",
                    }}
                  >
                    OpenAI
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: mode === "light" ? "#666" : "#ccc",
                      fontSize: "0.75rem",
                    }}
                  >
                    {quotas.openai.remainingCalls}/{quotas.openai.maxFreeCalls}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    (quotas.openai.usedCalls / quotas.openai.maxFreeCalls) * 100
                  }
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor:
                      mode === "light"
                        ? "rgba(0, 0, 0, 0.1)"
                        : "rgba(255, 255, 255, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        quotas.openai.remainingCalls > 0
                          ? "#10b981"
                          : "#ef4444",
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>

              {/* Gemini Quota */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: mode === "light" ? "#333" : "#fff",
                      fontWeight: 500,
                      fontSize: "0.85rem",
                    }}
                  >
                    Gemini
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: mode === "light" ? "#666" : "#ccc",
                      fontSize: "0.75rem",
                    }}
                  >
                    {quotas.gemini.remainingCalls}/{quotas.gemini.maxFreeCalls}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    (quotas.gemini.usedCalls / quotas.gemini.maxFreeCalls) * 100
                  }
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor:
                      mode === "light"
                        ? "rgba(0, 0, 0, 0.1)"
                        : "rgba(255, 255, 255, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        quotas.gemini.remainingCalls > 0
                          ? "#10b981"
                          : "#ef4444",
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              // gap: 4,
              // mb: 2,
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
                onClick={onSettingsClick}
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
                onClick={onHelpClick}
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
        </Box>
      )}

      {isMobile && (
        <>
          {/* Free Quotas Card - Mobile */}
          {user && quotas && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                borderRadius: "12px",
                background:
                  quotas.openai.remainingCalls <= 0 &&
                  quotas.gemini.remainingCalls <= 0
                    ? "#2c1919"
                    : mode === "light"
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(255, 255, 255, 0.05)",
                border:
                  quotas.openai.remainingCalls <= 0 &&
                  quotas.gemini.remainingCalls <= 0
                    ? "1px solid #ef4444"
                    : mode === "light"
                    ? "1px solid rgba(0, 0, 0, 0.08)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: mode === "light" ? "#333" : "#fff",
                  fontWeight: 600,
                  fontSize: "1rem",
                  mb: 2,
                }}
              >
                Free Plan
              </Typography>

              {/* OpenAI Quota */}
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: mode === "light" ? "#333" : "#fff",
                      fontWeight: 500,
                      fontSize: "0.85rem",
                    }}
                  >
                    OpenAI
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: mode === "light" ? "#666" : "#ccc",
                      fontSize: "0.75rem",
                    }}
                  >
                    {quotas.openai.remainingCalls}/{quotas.openai.maxFreeCalls}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    (quotas.openai.usedCalls / quotas.openai.maxFreeCalls) * 100
                  }
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor:
                      mode === "light"
                        ? "rgba(0, 0, 0, 0.1)"
                        : "rgba(255, 255, 255, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        quotas.openai.remainingCalls > 0
                          ? "#10b981"
                          : "#ef4444",
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>

              {/* Gemini Quota */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: mode === "light" ? "#333" : "#fff",
                      fontWeight: 500,
                      fontSize: "0.85rem",
                    }}
                  >
                    Gemini
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: mode === "light" ? "#666" : "#ccc",
                      fontSize: "0.75rem",
                    }}
                  >
                    {quotas.gemini.remainingCalls}/{quotas.gemini.maxFreeCalls}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    (quotas.gemini.usedCalls / quotas.gemini.maxFreeCalls) * 100
                  }
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor:
                      mode === "light"
                        ? "rgba(0, 0, 0, 0.1)"
                        : "rgba(255, 255, 255, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        quotas.gemini.remainingCalls > 0
                          ? "#10b981"
                          : "#ef4444",
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            </Box>
          )}

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

          {/* Admin Button - Mobile */}
          {user?.isAdmin && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                  width: "100%",
                  borderRadius: "8px",
                  border:
                    mode === "light"
                      ? "1px solid rgba(255, 107, 53, 0.3)"
                      : "1px solid rgba(255, 138, 101, 0.3)",
                  background:
                    mode === "light"
                      ? "rgba(255, 255, 255, 0.9)"
                      : "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
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
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
