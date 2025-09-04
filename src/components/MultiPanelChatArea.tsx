import { Box, Typography, IconButton, Button } from "@mui/material";
import { ExpandLess, Key } from "@mui/icons-material";
import { useState, useEffect, useMemo } from "react";
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
}

function ModelPanel({
  model,
  messages,
  width,
  isCollapsed,
  onWidthChange,
  onToggleCollapse,
  showRightHandle = true,
}: ModelPanelProps) {
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(hasAPIKey(model.id));

  const modelMessages = messages.filter(
    (msg) => msg.sender === "user" || msg.modelId === model.id
  );

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
          borderBottom: "1px solid #333",
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "#202020",
          position: "sticky",
          top: 0,
          zIndex: 1,
          justifyContent: isCollapsed ? "center" : "space-between",
        }}
      >
        {!isCollapsed && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <div style={{marginTop:"4px"}}>{model.icon}</div>
              <Typography
                variant="subtitle1"
                sx={{ color: "white", fontWeight: 600 }}
              >
                {model.displayName}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                onClick={onToggleCollapse}
                sx={{ color: "#888", "&:hover": { color: "white" } }}
              >
                <ExpandLess />
              </IconButton>
            </Box>
          </>
        )}

        {isCollapsed && <div onClick={onToggleCollapse}>{model.icon}</div>}
      </Box>

      {/* Messages Area - Only show when not collapsed */}
      {!isCollapsed && (
        <>
          <Box
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
                background: "#1a1a1a",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#444",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#555",
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
                  sx={{ color: "#666", textAlign: "center" }}
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
                  color: "#666",
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
      maxWidth={600}
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
      onWidthChange={onWidthChange}
      showRightHandle={showRightHandle}
      collapsedWidth={60}
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

interface MultiPanelChatAreaProps {
  models: AIModel[];
  messages: Message[];
  chatInput: ReactNode;
  onModelToggle?: (modelId: string) => void;
}

export default function MultiPanelChatArea({
  models,
  messages,
  chatInput,
  onModelToggle,
}: MultiPanelChatAreaProps) {
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
        bgcolor: "#1a1a1a",
        flex: 1,
        overflow: "hidden", // Prevent whole app scroll
      }}
    >
      {/* Multi-Panel Messages Container */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          overflowX: "auto", // Horizontal scroll for panels
          overflowY: "hidden",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#1a1a1a",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#444",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
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
              color: "#666",
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
          enabledModels.map((model, index) => (
            <ModelPanel
              key={model.id}
              model={model}
              messages={messages}
              onToggle={onModelToggle}
              width={panelWidths[model.id] || 380}
              isCollapsed={panelCollapsed[model.id] || false}
              onWidthChange={(width) => handleWidthChange(model.id, width)}
              onToggleCollapse={() => handleToggleCollapse(model.id)}
              showRightHandle={index < enabledModels.length} // No handle on last panel
            />
          ))
        )}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          borderTop: "1px solid #404040",
          p: 2,
        }}
      >
        {chatInput}
      </Box>
    </Box>
  );
}
