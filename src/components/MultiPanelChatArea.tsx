import { Box, Typography, IconButton, Button, useMediaQuery, Tabs, Tab } from "@mui/material";
import { ExpandLess, Key } from "@mui/icons-material";
import { useState, useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import type { AIModel } from "./AIModelTabs";
import { hasAPIKey } from "../utils/apiKeys";
import APIKeyDialog from "./APIKeyDialog";
import { saveAPIKey } from "../utils/apiKeys";
import ResizablePanel from "./ResizablePanel";
import FormattedMessage from "./shared/FormattedMessage";
import {
  getPanelWidths,
  savePanelWidth,
  getPanelCollapsed,
  savePanelCollapsed,
} from "../utils/panelStorage";
import Lottie from "lottie-react";
import chatbotAnimation from "./shared/animation/chatbot.json";
import GeminiRobo from "./shared/animation/geminiRobo.json";
import { useTheme } from "../hooks/useTheme";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  modelId?: string;
}

interface ModelPanelProps {
  model: AIModel;
  messages: Message[];
  onToggle?: (modelId: string) => void;
  width: number;
  isCollapsed: boolean;
  onWidthChange: (width: number) => void;
  onToggleCollapse: () => void;
  showRightHandle?: boolean;
  isMobile?: boolean;
}

function ModelPanel({
  model,
  messages,
  width,
  isCollapsed,
  onWidthChange,
  onToggleCollapse,
  showRightHandle = true,
  isMobile = false,
}: ModelPanelProps) {
  const { mode } = useTheme();
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(hasAPIKey(model.id));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const modelMessages = messages.filter(
    (msg) => msg.sender === "user" || msg.modelId === model.id
  );

  // Scroll to bottom when messages change (new messages or chat selection)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]); // Trigger when messages array changes (new messages or chat selection)

  const handleSaveAPIKey = (modelId: string, apiKey: string) => {
    saveAPIKey(modelId, apiKey, model.displayName);
    setHasApiKey(true); // Update local state
    setApiKeyDialogOpen(false);
  };

  const panelContent = (
    <>
      {/* Model Header */}
      <Box
        sx={{
          p: 1,
          borderBottom:
            mode === "light" ? "1px solid #e0e0e0" : "1px solid #333",
          display: isMobile ? "none" : "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: mode === "light" ? "#f8f9fa" : "#202020",
          position: "sticky",
          top: 0,
          zIndex: 1,
          justifyContent: isCollapsed ? "center" : "space-between",
        }}
      >
        {!isCollapsed && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <div style={{ marginTop: "4px" }}>{model.icon}</div>
              <Typography
                variant="subtitle1"
                sx={{
                  color: mode === "light" ? "#333" : "white",
                  fontWeight: 600,
                }}
              >
                {model.displayName}
              </Typography>
            </Box>
            {/* Only show collapse button on desktop */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={onToggleCollapse}
                  sx={{
                    color: mode === "light" ? "#666" : "#888",
                    "&:hover": { color: mode === "light" ? "#333" : "white" },
                  }}
                >
                  <ExpandLess />
                </IconButton>
              </Box>
            )}
          </>
        )}

        {/* Only show collapsed state on desktop */}
        {!isMobile && isCollapsed && (
          <div 
            onClick={onToggleCollapse}
            style={{ cursor: 'pointer' }}
          >
            {model.icon}
          </div>
        )}
      </Box>

      {/* Messages Area - Only show when not collapsed */}
      {!isCollapsed && (
        <>
          <Box
            ref={scrollContainerRef}
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: mode === "light" ? "#f0f0f0" : "#1a1a1a",
              },
              "&::-webkit-scrollbar-thumb": {
                background: mode === "light" ? "#ccc" : "#444",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: mode === "light" ? "#bbb" : "#555",
              },
            }}
          >
            {!hasApiKey ? (
              /* Show API Key button when no API key exists */
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  height: "100%",
                  gap: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: mode === "light" ? "#999" : "#666",
                    textAlign: "center",
                  }}
                >
                  Add your API key to start chatting with {model.displayName}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Key />}
                  onClick={() => setApiKeyDialogOpen(true)}
                  sx={{
                    bgcolor: model.color,
                    color: "white",
                    borderRadius: 3,
                    textTransform: "none",
                    px: 3,
                    py: 1.5,
                    "&:hover": {
                      bgcolor: model.color,
                      filter: "brightness(1.1)",
                    },
                  }}
                >
                  Add API Key
                </Button>
              </Box>
            ) : modelMessages.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: mode === "light" ? "#999" : "#666",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                {model.displayName === "ChatGPT" ? (
                  <Lottie
                    animationData={GeminiRobo}
                    style={{
                      width: 250,
                      height: 250,
                    }}
                    loop={true}
                  />
                ) : (
                  <Lottie
                    animationData={chatbotAnimation}
                    style={{
                      width: 250,
                      height: 250,
                    }}
                    loop={true}
                  />
                )}
              </Box>
            ) : (
              modelMessages.map((message) => (
                <MessageBubble
                  key={`${model.id}-${message.id}`}
                  message={message}
                  modelColor={model.color}
                />
              ))
            )}
          </Box>
        </>
      )}

      {/* API Key Dialog */}
      <APIKeyDialog
        open={apiKeyDialogOpen}
        onClose={() => setApiKeyDialogOpen(false)}
        model={model}
        onSave={handleSaveAPIKey}
      />
    </>
  );

  return (
    <ResizablePanel
      initialWidth={width}
      minWidth={300}
      maxWidth={1000}
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
      onWidthChange={onWidthChange}
      showRightHandle={showRightHandle}
      collapsedWidth={60}
      isMobile={isMobile}
    >
      {panelContent}
    </ResizablePanel>
  );
}

function MessageBubble({
  message,
  modelColor,
}: {
  message: Message;
  modelColor?: string;
}) {
  const isThinking =
    message.content === "Thinking..." && message.sender === "ai";

  return (
    <FormattedMessage
      content={message.content}
      isUser={message.sender === "user"}
      modelColor={modelColor}
      timestamp={message.timestamp}
      isTyping={isThinking}
    />
  );
}

interface Chat {
  id: string;
  title: string;
  date: string;
}

interface MultiPanelChatAreaProps {
  models: AIModel[];
  messages: Message[];
  chatInput: ReactNode;
  onModelToggle?: (modelId: string) => void;
  // Mobile header props
  onNewChat: () => void;
  chats: Chat[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  onSettingsClick: () => void;
  onDeleteChat?: (chatId: string) => void;
}

export default function MultiPanelChatArea({
  models,
  messages,
  chatInput,
  onModelToggle,
}: MultiPanelChatAreaProps) {
  const { mode } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const enabledModels = useMemo(
    () => models.filter((model) => model.enabled),
    [models]
  );

  // Initialize panel widths and collapsed states
  const [panelWidths, setPanelWidths] = useState<{ [modelId: string]: number }>(
    () => {
      const stored = getPanelWidths();
      const initial: { [modelId: string]: number } = {};
      enabledModels.forEach((model) => {
        initial[model.id] = stored[model.id] || 380; // Default width
      });
      return initial;
    }
  );

  const [panelCollapsed, setPanelCollapsed] = useState<{
    [modelId: string]: boolean;
  }>(() => {
    const stored = getPanelCollapsed();
    const initial: { [modelId: string]: boolean } = {};
    enabledModels.forEach((model) => {
      initial[model.id] = stored[model.id] || false; // Default not collapsed
    });
    return initial;
  });

  // Mobile panel selection state
  const [selectedMobilePanel, setSelectedMobilePanel] = useState(0);

  // Update states when models change
  useEffect(() => {
    const storedWidths = getPanelWidths();
    const storedCollapsed = getPanelCollapsed();

    const newWidths: { [modelId: string]: number } = {};
    const newCollapsed: { [modelId: string]: boolean } = {};

    enabledModels.forEach((model) => {
      newWidths[model.id] = storedWidths[model.id] || 380;
      newCollapsed[model.id] = storedCollapsed[model.id] || false;
    });

    setPanelWidths(newWidths);
    setPanelCollapsed(newCollapsed);
  }, [enabledModels]);

  const handleWidthChange = (modelId: string, width: number) => {
    setPanelWidths((prev) => ({
      ...prev,
      [modelId]: width,
    }));
    savePanelWidth(modelId, width);
  };

  const handleToggleCollapse = (modelId: string) => {
    setPanelCollapsed((prev) => {
      const newCollapsed = !prev[modelId];
      savePanelCollapsed(modelId, newCollapsed);
      return {
        ...prev,
        [modelId]: newCollapsed,
      };
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: mode === "light" ? "#fff !important" : "#1a1a1a",
        flex: 1,
        overflow: "hidden", // Prevent whole app scroll
      }}
    >
    
      {isMobile && enabledModels.length > 0 && (
        <Box
          sx={{
            borderBottom: mode === "light" ? "1px solid #e0e0e0" : "1px solid #404040",
            bgcolor: mode === "light" ? "#f8f9fa" : "#202020",
          }}
        >
          <Tabs
            value={selectedMobilePanel}
            onChange={(_, newValue) => setSelectedMobilePanel(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                minWidth: "auto",
                px: 2,
                py: 1,
                fontSize: "0.875rem",
                textTransform: "none",
                color: mode === "light" ? "#666" : "#888",
                "&.Mui-selected": {
                  color: mode === "light" ? "#333" : "white",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: mode === "light" ? "#333" : "white",
              },
            }}
          >
            {enabledModels.map((model) => (
              <Tab
                key={model.id}
                label={model.displayName}
                icon={model.icon}
                iconPosition="start"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              />
            ))}
          </Tabs>
        </Box>
      )}
      {/* Multi-Panel Messages Container */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          overflowX: isMobile ? "hidden" : "auto", // Horizontal scroll for panels on desktop
          overflowY: isMobile ? "auto" : "hidden", // Vertical scroll for panels on mobile
          "&::-webkit-scrollbar": {
            height: isMobile ? "6px" : "8px",
            width: isMobile ? "6px" : "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: mode === "light" ? "#f0f0f0" : "#1a1a1a",
          },
          "&::-webkit-scrollbar-thumb": {
            background: mode === "light" ? "#ccc" : "#444",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: mode === "light" ? "#bbb" : "#555",
          },
        }}
      >
        {enabledModels.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              color: mode === "light" ? "#999" : "#666",
              fontSize: "18px",
              textAlign: "center",
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>
                No AI models enabled
              </Typography>
              <Typography>
                Enable at least one AI model from the tabs above to start
                chatting
              </Typography>
            </Box>
          </Box>
        ) : (
          enabledModels.map((model, index) => {
            // On mobile, only show the selected panel
            if (isMobile && index !== selectedMobilePanel) {
              return null;
            }
            
            return (
              <ModelPanel
                key={model.id}
                model={model}
                messages={messages}
                onToggle={onModelToggle}
                width={isMobile ? window.innerWidth : (panelWidths[model.id] || 380)} // Full width on mobile
                isCollapsed={isMobile ? false : (panelCollapsed[model.id] || false)} // Never collapsed on mobile
                onWidthChange={(width) => handleWidthChange(model.id, width)}
                onToggleCollapse={() => handleToggleCollapse(model.id)}
                showRightHandle={!isMobile && index < enabledModels.length - 1} // No handles on mobile, and don't show on last panel
                isMobile={isMobile} // Pass mobile state
              />
            );
          })
        )}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: isMobile ? 0 : 3,
          borderTop:
            mode === "light" ? "1px solid #e0e0e0" : "1px solid #404040",
        }}
      >
        {chatInput}
      </Box>
    </Box>
  );
}
