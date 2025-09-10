import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { useEffect, useRef, useCallback } from "react";
import FormattedMessage from "./shared/FormattedMessage";
import { useTheme } from "../hooks/useTheme";
import { hasMessageBeenTyped, markMessageAsTyped } from "../utils/typewriterState";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  modelId?: string;
  enabledPanels?: string[];
  isNewMessage?: boolean; // Track if this is a newly received message (for typewriter effect)
  images?: Array<{ mimeType: string; data: string }>; // Base64 encoded images
  imageLinks?: string[]; // Store image URLs/links for generated images
}

interface ChatAreaProps {
  messages: Message[];
  chatInput: ReactNode;
}

export default function ChatArea({ messages, chatInput }: ChatAreaProps) {
  const { mode } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change (new messages or chat selection)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]); // Trigger when messages array changes

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: mode === "light" 
          ? "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)"
          : "linear-gradient(180deg, #121212 0%, #0a0a0a 100%)",
        flex: 1,
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: mode === "light"
          ? "0 4px 12px rgba(0, 0, 0, 0.05)"
          : "0 4px 12px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Messages Container */}
      <Box
        ref={scrollContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: mode === "light" 
              ? "rgba(0, 0, 0, 0.2)" 
              : "rgba(255, 255, 255, 0.2)",
            borderRadius: "10px",
            "&:hover": {
              background: mode === "light" 
                ? "rgba(0, 0, 0, 0.3)" 
                : "rgba(255, 255, 255, 0.3)",
            },
          },
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

  // Check if this message should show typewriter effect
  const shouldShowTypewriter = 
    message.sender === "ai" && 
    !isThinking && 
    message.isNewMessage === true && 
    !hasMessageBeenTyped(message.id);

  const handleTypewriterComplete = useCallback(() => {
    markMessageAsTyped(message.id);
  }, [message.id]);

  return (
    <FormattedMessage
      content={message.content}
      isUser={message.sender === "user"}
      timestamp={message.timestamp}
      isTyping={isThinking}
      enableTypewriter={shouldShowTypewriter}
      isNewMessage={shouldShowTypewriter}
      onTypewriterComplete={handleTypewriterComplete}
      images={message.images}
      imageLinks={message.imageLinks}
    />
  );
}
