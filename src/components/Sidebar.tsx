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
import { Add, Settings, Delete } from "@mui/icons-material";

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
}

export default function Sidebar({
  onNewChat,
  chats,
  selectedChatId,
  onChatSelect,
  onSettingsClick,
  onDeleteChat,
}: SidebarProps) {
  const groupedChats = chats.reduce((acc, chat) => {
    if (!acc[chat.date]) {
      acc[chat.date] = [];
    }
    acc[chat.date].push(chat);
    return acc;
  }, {} as Record<string, Chat[]>);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}
    >
      {/* Header with Logo */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#00d4aa",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}
        >
          <Typography
            sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}
          >
            AI
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
          AI Fiesta
        </Typography>
      </Box>

      {/* New Chat Button */}
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={onNewChat}
        sx={{
          mb: 2,
          color: "white",
          borderColor: "#404040",
          "&:hover": {
            borderColor: "#606060",
            bgcolor: "#333",
          },
        }}
      >
        New Chat
      </Button>

      {/* Chats Section */}
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

      {/* Bottom Section */}
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ bgcolor: "#404040", mb: 2 }} />

      

        {/* Settings */}
        <Button
          startIcon={<Settings />}
          onClick={onSettingsClick}
          sx={{ color: "#888", textTransform: "none" }}
        >
          Settings
        </Button>
      </Box>
    </Box>
  );
}
