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
  Switch,
  Tooltip,
  useMediaQuery,
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
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

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
  onDeleteChat,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const { signOut, user } = useAuth();
  const { mode, toggleTheme } = useTheme();
  console.log(user, "ajay");
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
        bgcolor: mode === "light" ? "#f5f5f5" : "background.paper",
        borderRight:
          mode === "light" ? "1px solid #e0e0e0" : "1px solid #404040",
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
              width: 35,
              height: 35,
              bgcolor: "#fff0",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: isCollapsed ? 0 : 2,
            }}
          >
            <img src="/logo.png" alt="Logo" style={{ height: 32 }} />
          </Box>
          {!isCollapsed && (
            <Typography
              variant="h6"
              sx={{
                color: mode === "light" ? "#133487" : "white",
                fontWeight: "bold",
                fontFamily:
                  "'Orbitron', 'Roboto Mono', 'Monaco', 'Consolas', monospace",
                letterSpacing: "2px",
                fontSize: "1.4rem",
              }}
            >
              AITHOR
            </Typography>
          )}
        </Box>

        {onToggleCollapse && (
          <IconButton
            onClick={onToggleCollapse}
            sx={{
              color: mode === "light" ? "#666" : "#888",
              position: isCollapsed ? "absolute" : "static",
              top: isCollapsed ? "40px" : "auto",
              left: isCollapsed ? "50%" : "auto",
              transform: isCollapsed ? "translateX(-50%)" : "none",
              "&:hover": {
                color: mode === "light" ? "#333" : "white",
                bgcolor: mode === "light" ? "#e0e0e0" : "#333",
              },
            }}
            size="small"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Box>

      {isCollapsed ? (
        // <IconButton
        //   onClick={onNewChat}
        //   sx={{
        //     mb: 2,
        //     color: "white",
        //     bgcolor: "transparent",
        //     border: "1px solid #404040",
        //     borderRadius: 1,
        //     "&:hover": {
        //       borderColor: "#606060",
        //       bgcolor: "#333",
        //     },
        //   }}
        // >
        //   <Add />
        // </IconButton>
        <></>
      ) : (
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={onNewChat}
          sx={{
            mb: 2,
            color: mode === "light" ? "#133487" : "white",
            borderColor: mode === "light" ? "#133487" : "#404040",
            borderRadius: "12px",
            "&:hover": {
              borderColor: mode === "light" ? "#115293" : "#606060",
              bgcolor: mode === "light" ? "rgba(19, 52, 135, 0.04)" : "#333",
            },
          }}
        >
          New Chat
        </Button>
      )}

      {/* Chats Section */}
      {!isCollapsed && (
        <>
          <Typography
            variant="body2"
            sx={{ color: mode === "light" ? "#666" : "#888", mb: 1 }}
          >
            Chats
          </Typography>

          {/* Chat List */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {Object?.entries(groupedChats).map(([date, dateChats]) => (
              <Box key={date} sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{ color: mode === "light" ? "#999" : "#666", pl: 1 }}
                >
                  {date}
                </Typography>
                <List dense>
                  {dateChats.map((chat) => (
                    <ListItem
                      key={chat.id}
                      sx={{
                        borderRadius: 1,
                        bgcolor:
                          selectedChatId === chat.id
                            ? mode === "light"
                              ? "#e3f2fd"
                              : "#333"
                            : "transparent",
                        "&:hover": {
                          bgcolor: mode === "light" ? "#f5f5f5" : "#2a2a2a",
                          "& .delete-button": {
                            opacity: 1,
                          },
                        },
                        pr: 1,
                      }}
                    >
                      <ListItemText
                        onClick={() => onChatSelect(chat.id)}
                        primary={chat.title}
                        primaryTypographyProps={{
                          variant: "body2",
                          sx: {
                            color: mode === "light" ? "#333" : "white",
                            cursor: "pointer",
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
                            transition: "opacity 0.2s",
                            color: mode === "light" ? "#999" : "#666",
                            "&:hover": {
                              color: "#f44336",
                              bgcolor: "rgba(244, 67, 54, 0.1)",
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Box>
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

          {/* Theme Toggle */}
          {isCollapsed ? (
            <Tooltip
              title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
            >
              <IconButton
                onClick={toggleTheme}
                sx={{
                  color: mode === "light" ? "#666" : "#bbb",
                  mb: 1,
                  ml: 1,
                  border:
                    mode === "light"
                      ? "1px solid #e0e0e0"
                      : "1px solid #404040",
                  borderRadius: "8px",
                  "&:hover": {
                    color: mode === "light" ? "#333" : "white",
                    bgcolor: mode === "light" ? "#f0f0f0" : "#333",
                    borderColor: mode === "light" ? "#ccc" : "#606060",
                    transform: "translateY(-1px)",
                    boxShadow:
                      mode === "light"
                        ? "0 4px 8px rgba(0, 0, 0, 0.1)"
                        : "0 4px 8px rgba(0, 0, 0, 0.3)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {mode === "light" ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid transparent",
                "&:hover": {
                  bgcolor: mode === "light" ? "#f0f0f0" : "#333",
                  borderColor: mode === "light" ? "#e0e0e0" : "#606060",
                  transform: "translateY(-1px)",
                  boxShadow:
                    mode === "light"
                      ? "0 4px 8px rgba(0, 0, 0, 0.1)"
                      : "0 4px 8px rgba(0, 0, 0, 0.3)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {mode === "light" ? (
                  <LightMode sx={{ color: "#bbb" }} />
                ) : (
                  <DarkMode sx={{ color: "#666" }} />
                )}
                <Typography
                  sx={{
                    color: mode === "light" ? "#666" : "#bbb",
                    fontSize: "0.9rem",
                  }}
                >
                  {mode === "light" ? "Light Mode" : "Dark Mode"}
                </Typography>
              </Box>
              <Switch
                checked={mode === "dark"}
                onChange={toggleTheme}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#667eea",
                    "&:hover": {
                      backgroundColor: "rgba(102, 126, 234, 0.08)",
                    },
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#667eea",
                  },
                }}
              />
            </Box>
          )}

          {/* Settings */}
          {isCollapsed ? (
            <IconButton
              onClick={onSettingsClick}
              sx={{
                color: mode === "light" ? "#666" : "#bbb",
                mb: 2,
                ml: 1,
                border:
                  mode === "light" ? "1px solid #e0e0e0" : "1px solid #404040",
                borderRadius: "8px",
                "&:hover": {
                  color: mode === "light" ? "#333" : "white",
                  bgcolor: mode === "light" ? "#f0f0f0" : "#333",
                  borderColor: mode === "light" ? "#ccc" : "#606060",
                  transform: "translateY(-1px)",
                  boxShadow:
                    mode === "light"
                      ? "0 4px 8px rgba(0, 0, 0, 0.1)"
                      : "0 4px 8px rgba(0, 0, 0, 0.3)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Settings />
            </IconButton>
          ) : (
            <Button
              startIcon={<Settings />}
              onClick={onSettingsClick}
              sx={{
                color: mode === "light" ? "#666" : "#bbb",
                textTransform: "none",
                outline: "none",
                mb: 2,
                justifyContent: "flex-start",
                width: "100%",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid transparent",
                "&:hover": {
                  color: mode === "light" ? "#333" : "white",
                  bgcolor: mode === "light" ? "#f0f0f0" : "#333",
                  borderColor: mode === "light" ? "#e0e0e0" : "#606060",
                  transform: "translateY(-1px)",
                  boxShadow:
                    mode === "light"
                      ? "0 4px 8px rgba(0, 0, 0, 0.1)"
                      : "0 4px 8px rgba(0, 0, 0, 0.3)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Settings
            </Button>
          )}

          {/* User Panel */}
          {user && (
            <Box
              sx={{
                position: "relative",
                borderRadius: "16px",
                p: "2px", // Space for gradient border
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
    </Box>
  );
}
