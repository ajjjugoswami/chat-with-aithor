import { Box } from "@mui/material";
import type { ReactNode } from "react";
import FormattedMessage from "./shared/FormattedMessage";
import { useTheme } from "../hooks/useTheme";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatAreaProps {
  messages: Message[];
  chatInput: ReactNode;
}

export default function ChatArea({ messages, chatInput }: ChatAreaProps) {
  const { mode } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: mode === "light" ? "#ffffff" : "#1a1a1a",
        flex: 1,
      }}
    >
      {/* Messages Container */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: mode === "light" ? "#999" : "#666",
              fontSize: "18px",
            }}
          >
            Start a conversation...
          </Box>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          borderTop:
            mode === "light" ? "1px solid #e0e0e0" : "1px solid #404040",
          p: 2,
          backgroundColor: mode === "light" ? "#fff !important" : "#202020",
        }}
      >
        {chatInput}
      </Box>
    </Box>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isThinking =
    message.content === "Thinking..." && message.sender === "ai";

  return (
    <FormattedMessage
      content={message.content}
      isUser={message.sender === "user"}
      timestamp={message.timestamp}
      isTyping={isThinking}
    />
  );
}
