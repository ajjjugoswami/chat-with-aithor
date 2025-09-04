import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import { Add, Settings, Delete, ChevronLeft, ChevronRight, Logout } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";

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
  
  const groupedChats = chats.reduce((acc, chat) => {
    if (!acc[chat.date]) {
      acc[chat.date] = [];
    }
    acc[chat.date].push(chat);
    return acc;
  }, {} as Record<string, Chat[]>);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: isCollapsed ? 1 : 2,
        alignItems: isCollapsed ? "center" : "stretch",
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
            <img src="/aithor.png" style={{ width: "35px" }} />
          </Box>
          {!isCollapsed && (
            <Typography
              variant="h6"
              sx={{ 
                color: "white", 
                fontWeight: "bold",
                fontFamily: "'Orbitron', 'Roboto Mono', 'Monaco', 'Consolas', monospace",
                letterSpacing: "2px",
                fontSize: "1.4rem"
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
              color: "#888",
              position: isCollapsed ? "absolute" : "static",
              top: isCollapsed ? "40px" : "auto",
              left: isCollapsed ? "50%" : "auto",
              transform: isCollapsed ? "translateX(-50%)" : "none",
              "&:hover": {
                color: "white",
                bgcolor: "#333",
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
            color: "white",
            borderColor: "#404040",
            borderRadius: "12px",
            "&:hover": {
              borderColor: "#606060",
              bgcolor: "#333",
            },
          }}
        >
          New Chat
        </Button>
      )}

      {/* Chats Section */}
      {!isCollapsed && (
        <>
          <Typography variant="body2" sx={{ color: "#888", mb: 1 }}>
            Chats
          </Typography>

          {/* Chat List */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {Object.entries(groupedChats).map(([date, dateChats]) => (
              <Box key={date} sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: "#666", pl: 1 }}>
                  {date}
                </Typography>
                <List dense>
                  {dateChats.map((chat) => (
                    <ListItem
                      key={chat.id}
                      sx={{
                        borderRadius: 1,
                        bgcolor:
                          selectedChatId === chat.id ? "#333" : "transparent",
                        "&:hover": {
                          bgcolor: "#2a2a2a",
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
                          sx: { color: "white", cursor: "pointer" },
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
                            color: "#666",
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

      {/* Bottom Section */}
      <Box sx={{ mt: "auto" }}>
        {!isCollapsed && <Divider sx={{ bgcolor: "#404040", mb: 2 }} />}

        {/* User Info and Sign Out */}
        {!isCollapsed && user && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: "#888", mb: 1 }}>
              {user.name}
            </Typography>
            <Button
              startIcon={<Logout />}
              onClick={signOut}
              sx={{ 
                color: "#888", 
                textTransform: "none",
                "&:hover": {
                  color: "#f44336",
                  bgcolor: "rgba(244, 67, 54, 0.1)",
                }
              }}
            >
              Sign Out
            </Button>
          </Box>
        )}

        {/* Settings */}
        {isCollapsed ? (
          <IconButton
            onClick={onSettingsClick}
            sx={{
              color: "#888",
              "&:hover": {
                color: "white",
                bgcolor: "#333",
              },
            }}
          >
            <Settings />
          </IconButton>
        ) : (
          <Button
            startIcon={<Settings />}
            onClick={onSettingsClick}
            sx={{ color: "#888", textTransform: "none", outline: "none" }}
          >
            Settings
          </Button>
        )}
      </Box>
    </Box>
  );
}
