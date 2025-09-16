/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Key } from "@mui/icons-material";
import { ChevronUp } from "lucide-react";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import type { AIModel } from "./AIModelTabs";
import { hasAPIKey } from "../utils/enhancedApiKeys";
import EnhancedAPIKeyDialog from "./EnhancedAPIKeyDialog";
import ResizablePanel from "./ResizablePanel";
import FormattedMessage from "./shared/FormattedMessage";
import ModelVariantSelector from "./ModelVariantSelector";
import {
  getPanelWidths,
  savePanelWidth,
  getPanelCollapsed,
  savePanelCollapsed,
  getPanelEnabled,
  savePanelEnabled,
  getPanelVariants,
  savePanelVariant,
} from "../utils/panelStorage";
import {
  getVariantsForModel,
  getDefaultVariantForModel,
  type ModelVariant,
} from "../types/modelVariants";
import Lottie from "lottie-react";
import chatbotAnimation from "./shared/animation/chatbot.json";
import perplexicityAniamtion from "./shared/animation/perplexcityAnimation.json";
import GeminiRobo from "./shared/animation/geminiRobo.json";
import { useTheme } from "../hooks/useTheme";
import { hasMessageBeenTyped, markMessageAsTyped } from "../utils/typewriterState";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  modelId?: string;
  enabledPanels?: string[]; // Track which panels were enabled when this message was sent
  isNewMessage?: boolean; // Track if this is a newly received message (for typewriter effect)
  images?: Array<{ mimeType: string; data: string }>; // Base64 encoded images
  imageLinks?: string[]; // Store image URLs/links for generated images
}

interface ModelPanelProps {
  model: AIModel;
  messages: Message[];
  onToggle?: (modelId: string) => void;
  width: number;
  isCollapsed: boolean;
  isEnabled: boolean;
  onWidthChange: (width: number) => void;
  onToggleCollapse: () => void;
  onToggleEnabled: () => void;
  showRightHandle?: boolean;
  isMobile?: boolean;
  selectedVariant: ModelVariant;
  onVariantChange: (variant: ModelVariant) => void;
  userQuotas?: { [provider: string]: { usedCalls: number; maxFreeCalls: number; remainingCalls: number } };
  isBlocked?: boolean;
  onOpenAPIKeyDialog?: (modelId: string) => void;
}

function ModelPanel({
  model,
  messages,
  width,
  isCollapsed,
  isEnabled,
  onWidthChange,
  onToggleCollapse,
  onToggleEnabled,
  showRightHandle = true,
  isMobile = false,
  selectedVariant,
  onVariantChange,
  userQuotas = {},
  isBlocked = false,
  onOpenAPIKeyDialog,
}: ModelPanelProps) {
  const { mode } = useTheme();
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(hasAPIKey(model.id));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check for API key changes when dialog state changes
  useEffect(() => {
    setHasApiKey(hasAPIKey(model.id));
  }, [model.id, apiKeyDialogOpen]);

  // Filter messages and handle panel enabled state
  const filteredMessages = useMemo(() => {
    // Don't show any messages if panel is disabled
    if (!isEnabled) {
      return [];
    }

    const modelMessages = messages.filter((msg) => {
      // For AI messages, only show if they belong to this model
      if (msg.sender === "ai") {
        return msg.modelId === model.id;
      }

      // For user messages, only show if this panel was enabled when the message was sent
      if (msg.sender === "user") {
        // If enabledPanels is not set (backward compatibility), show all user messages
        if (!msg.enabledPanels) {
          return true;
        }
        // Only show user message if this panel was enabled when it was sent
        return msg.enabledPanels.includes(model.id);
      }

      return false;
    });

    console.log(
      `Panel ${model.displayName} - isEnabled: ${isEnabled}, modelMessages: ${modelMessages.length}`
    );
    
    return modelMessages;
  }, [messages, model.id, isEnabled, model.displayName]);

  // Scroll to bottom when messages change (new messages or chat selection)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [filteredMessages]); // Trigger when filtered messages array changes

  const handleSaveAPIKey = () => {
    // Refresh API key status
    setHasApiKey(hasAPIKey(model.id));
    setApiKeyDialogOpen(false);
  };

  const panelContent = (
    <>
      {/* Model Header */}
      <Box
        sx={{
          p: isMobile ? 0.75 : 1.5,
          borderBottom: "none",
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 1 : 2,
          background: mode === "light" 
            ? "linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%)"
            : "linear-gradient(135deg, #1e1e1e 0%, #1a1a1a 100%)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          justifyContent: isCollapsed ? "center" : "space-between",
          backdropFilter: "blur(10px)",
           boxShadow: mode === "light"
            ? "0 2px 8px rgba(0, 0, 0, 0.04)"
            : "0 2px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        {!isCollapsed && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 1 : 2,
                flex: 1,
              }}
            >
              <div style={{ marginTop: "4px" }}>{model.icon}</div>
              <Typography
                variant="subtitle1"
                sx={{
                  color: mode === "light" ? "#333" : "white",
                  fontWeight: 600,
                  fontSize: isMobile ? "0.875rem" : "1rem",
                  opacity: isEnabled ? 1 : 0.5,
                }}
              >
                {model.displayName}
                {/* Show quota info for free providers */}
                {(model.id === 'gpt-4o-mini' || model.id === 'gemini-2.0-flash') && (
                  <Typography
                    component="span"
                    sx={{
                      ml: 1,
                      fontSize: "0.75rem",
                      fontWeight: 400,
                      color: mode === "light" ? "#666" : "#ccc",
                      opacity: isEnabled ? 1 : 0.5,
                    }}
                  >
                    {(() => {
                      const providerKey = model.id === 'gpt-4o-mini' ? 'openai' : 'gemini';
                      const remaining = (userQuotas && userQuotas[providerKey]?.remainingCalls) ?? 10;
                      return `(${remaining} free left)`;
                    })()}
                  </Typography>
                )}
                {/* Show selected variant if different from base model */}
              </Typography>

              {/* Model Variant Selector - show on both mobile and desktop, disabled without API key (except for free providers) */}
              <ModelVariantSelector
                variants={getVariantsForModel(model.id)}
                selectedVariant={selectedVariant}
                onVariantSelect={onVariantChange}
                disabled={(!(model.id === 'gpt-4o-mini' || model.id === 'gemini-2.0-flash') && !hasApiKey) || !isEnabled}
                size="small"
              />
            </Box>
            {/* Controls for both mobile and desktop */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isEnabled}
                    onChange={onToggleEnabled}
                    size="small"
                    // sx={{
                    //   "& .MuiSwitch-thumb": {
                    //     backgroundColor: isEnabled ? model.color : "#ccc",
                    //   },
                      
                    // }}
                  />
                }
                label=""
                sx={{ m: 0 }}
              />
              {!isMobile && (
                <IconButton
                  size="small"
                  onClick={onToggleCollapse}
                  sx={{
                    color: mode === "light" ? "#666" : "#888",
                    "&:hover": { color: mode === "light" ? "#333" : "white" },
                  }}
                >
                  <ChevronUp size={20} />
                </IconButton>
              )}
            </Box>
          </>
        )}

        {/* Only show collapsed state on desktop */}
        {!isMobile && isCollapsed && (
          <div onClick={onToggleCollapse} style={{ cursor: "pointer" }}>
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
              p: isMobile ? 1 : 2,
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 1 : 1.5,
              minHeight: isMobile ? "calc(100dvh - 260px)" : "auto", // Reduced for smaller header
              height: isMobile ? "auto" : "100%",
              backgroundColor: mode === "light" ? "#f8f9fa" : "#0a0a0a",
              position: 'relative',
              "&::-webkit-scrollbar": {
                display:"none"
              },
              "&::-webkit-scrollbar-track": {
                background: mode === "light" 
                  ? "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)" 
                  : "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)",
              },
              "&::-webkit-scrollbar-thumb": {
                background: mode === "light" 
                  ? "linear-gradient(180deg, #6c757d 0%, #495057 100%)" 
                  : "linear-gradient(180deg, #6c757d 0%, #adb5bd 100%)",
                borderRadius: "10px",
                border: mode === "light" 
                  ? "1px solid #e9ecef" 
                  : "1px solid #1a1a1a",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: mode === "light" 
                    ? "linear-gradient(180deg, #495057 0%, #343a40 100%)" 
                    : "linear-gradient(180deg, #adb5bd 0%, #f8f9fa 100%)",
                  transform: "scaleX(1.2)",
                },
                "&:active": {
                  background: mode === "light" 
                    ? "linear-gradient(180deg, #343a40 0%, #212529 100%)" 
                    : "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
                },
              },
            }}
          >
            {isBlocked && !hasApiKey && (
              <Box sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(3px)',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
                p: 2,
                textAlign: 'center',
              }}>
                <Typography sx={{ color: 'white' }}>
                  Free quota is over for {model.displayName}. Please contact support or add your API key to continue.
                </Typography>
                <Button variant="contained" onClick={() => onOpenAPIKeyDialog?.(model.id)}>Add API Key</Button>
              </Box>
            )}
            {!isEnabled ? (
              /* Show disabled message when panel is disabled */
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
                  Panel is disabled. Enable it to start chatting with{" "}
                  {model.displayName}
                </Typography>
              </Box>
            ) : !hasApiKey && !(model.id === 'gpt-4o-mini' || model.id === 'gemini-2.0-flash') ? (
              /* Show API Key button when no API key exists (except for free providers) */
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
                  Add your API key to start chatting with <br/> {model.displayName}
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
            ) : filteredMessages.length === 0 ? (
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
                    style={{ width: 250, height: 250 }}
                    loop={true}
                  />
                ) : model.displayName === "Gemini" ? (
                  <Lottie
                    animationData={chatbotAnimation}
                    style={{ width: 250, height: 250 }}
                    loop={true}
                  />
                ) : (
                  <Lottie
                    animationData={perplexicityAniamtion}
                    style={{ width: 250, height: 250 }}
                    loop={true}
                  />
                )}
              </Box>
            ) : (
              filteredMessages.map((message) => (
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
      <EnhancedAPIKeyDialog
        open={apiKeyDialogOpen}
        onClose={() => {
          setApiKeyDialogOpen(false);
          setHasApiKey(hasAPIKey(model.id)); // Refresh API key status
        }}
        model={model}
        onSave={handleSaveAPIKey}
      />
    </>
  );

  return (
    <ResizablePanel
      initialWidth={width}
      minWidth={410}
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
      modelColor={modelColor}
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
  onDeleteChat?: (chatId: string) => void;
  userQuotas?: any;
  blockedProviders?: { [provider: string]: boolean };
  onOpenAPIKeyDialog?: (modelId: string) => void;
}

export default function MultiPanelChatArea({
  models,
  messages,
  chatInput,
  onModelToggle,
  userQuotas = {},
  blockedProviders = {},
  onOpenAPIKeyDialog,
}: MultiPanelChatAreaProps) {
  const { mode } = useTheme();
  const isMobile = useMediaQuery("(max-width: 640px)");
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
        initial[model.id] = stored[model.id] || 430; // Default width
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

  const [panelEnabled, setPanelEnabled] = useState<{
    [modelId: string]: boolean;
  }>(() => {
    const stored = getPanelEnabled();
    const initial: { [modelId: string]: boolean } = {};
    enabledModels.forEach((model) => {
      initial[model.id] = stored[model.id] !== false; // Default enabled (true)
    });
    return initial;
  });

  // Model variants state - track selected variant for each panel
  const [selectedVariants, setSelectedVariants] = useState<{
    [modelId: string]: ModelVariant;
  }>(() => {
    const initial: { [modelId: string]: ModelVariant } = {};
    const storedVariants = getPanelVariants();

    enabledModels.forEach((model) => {
      const storedVariantId = storedVariants[model.id];
      let selectedVariant: ModelVariant | null = null;

      if (storedVariantId) {
        // Try to find the stored variant
        const variants = getVariantsForModel(model.id);
        selectedVariant =
          variants.find((v) => v.id === storedVariantId) || null;
      }

      // Fall back to default if stored variant not found
      if (!selectedVariant) {
        selectedVariant = getDefaultVariantForModel(model.id);
      }

      if (selectedVariant) {
        initial[model.id] = selectedVariant;
      }
    });
    return initial;
  });

  // Update states when models change
  useEffect(() => {
    const storedWidths = getPanelWidths();
    const storedCollapsed = getPanelCollapsed();
    const storedEnabled = getPanelEnabled();
    const storedVariants = getPanelVariants();

    const newWidths: { [modelId: string]: number } = {};
    const newCollapsed: { [modelId: string]: boolean } = {};
    const newEnabled: { [modelId: string]: boolean } = {};
    const newVariants: { [modelId: string]: ModelVariant } = {};

    enabledModels.forEach((model) => {
      newWidths[model.id] = storedWidths[model.id] || 430;
      newCollapsed[model.id] = storedCollapsed[model.id] || false;
      newEnabled[model.id] = storedEnabled[model.id] !== false; // Default enabled

      // Initialize variant if not already set
      const storedVariantId = storedVariants[model.id];
      let selectedVariant: ModelVariant | null = null;

      if (storedVariantId) {
        const variants = getVariantsForModel(model.id);
        selectedVariant =
          variants.find((v) => v.id === storedVariantId) || null;
      }

      if (!selectedVariant) {
        selectedVariant = getDefaultVariantForModel(model.id);
      }

      if (selectedVariant) {
        newVariants[model.id] = selectedVariant;
      }
    });

    setPanelWidths(newWidths);
    setPanelCollapsed(newCollapsed);
    setPanelEnabled(newEnabled);

    // Only update variants for new models, preserve existing selections
    setSelectedVariants((prev) => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(newVariants).filter(([modelId]) => !prev[modelId])
      ),
    }));
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

  const handleToggleEnabled = (modelId: string) => {
     setPanelEnabled((prev) => {
      const newEnabled = !prev[modelId];
      
      savePanelEnabled(modelId, newEnabled);
      return {
        ...prev,
        [modelId]: newEnabled,
      };
    });
  };

  const handleVariantChange = (modelId: string, variant: ModelVariant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [modelId]: variant,
    }));
    // Save to localStorage
    savePanelVariant(modelId, variant.id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: isMobile ? "auto" : "100%",
        minHeight: isMobile ? "calc(100dvh - 100px)" : "100%", // Subtract smaller header height
        backgroundColor: mode === "light" ? "#fff !important" : "#1a1a1a",
        flex: 1,
        overflow: isMobile ? "visible" : "hidden",
        position: "relative",
      }}
    >
      {/* Mobile Tabs - Disabled to show horizontal panels instead
      {isMobile && enabledModels.length > 0 && (
        <Box
          sx={{
            borderBottom:
              mode === "light" ? "1px solid #e0e0e0" : "1px solid #404040",
            bgcolor: mode === "light" ? "#f8f9fa" : "#202020",
          }}aa
        >
          <Tabs
            value={selectedMobilePanel}
            onChange={(_, newValue) => setSelectedMobilePanel(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                minWidth: "auto",
                px: 1.5,
                py: 0.5,
                fontSize: "0.75rem",
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
      )} */}
      {/* Multi-Panel Messages Container */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "row", // Always horizontal for both desktop and mobile
          overflowX: "auto", // Horizontal scroll for both desktop and mobile
          overflowY: "hidden", // Prevent vertical scroll on container
          "&::-webkit-scrollbar": {
            height: isMobile ? "4px" : "6px", // Thinner scrollbar on mobile
            width: isMobile ? "4px" : "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: mode === "light" 
              ? "linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)" 
              : "linear-gradient(90deg, #1a1a1a 0%, #0a0a0a 100%)",
          },
          "&::-webkit-scrollbar-thumb": {
            background: mode === "light" 
              ? "linear-gradient(90deg, #6c757d 0%, #495057 100%)" 
              : "linear-gradient(90deg, #6c757d 0%, #adb5bd 100%)",
            borderRadius: "10px",
            border: mode === "light" 
              ? "1px solid #e9ecef" 
              : "1px solid #0a0a0a",
            transition: "all 0.3s ease",
            "&:hover": {
              background: mode === "light" 
                ? "linear-gradient(90deg, #495057 0%, #343a40 100%)" 
                : "linear-gradient(90deg, #adb5bd 0%, #f8f9fa 100%)",
              transform: "scaleY(1.2)",
            },
            "&:active": {
              background: mode === "light" 
                ? "linear-gradient(90deg, #343a40 0%, #212529 100%)" 
                : "linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)",
            },
          },
          "&::-webkit-scrollbar-corner": {
            background: mode === "light" 
              ? "linear-gradient(45deg, #f8f9fa 0%, #e9ecef 100%)" 
              : "linear-gradient(45deg, #1a1a1a 0%, #0a0a0a 100%)",
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
            // Show all panels on both mobile and desktop for comparison

            return (
              <ModelPanel
                key={`${model.id}-${panelEnabled[model.id]}`}
                model={model}
                messages={messages}
                onToggle={onModelToggle}
                width={
                  isMobile ? 500 : panelWidths[model.id] || 430 // 500px minimum width on mobile for horizontal scroll
                }
                isCollapsed={
                  isMobile ? false : panelCollapsed[model.id] || false
                } // Never collapsed on mobile
                isEnabled={panelEnabled[model.id] !== false}
                onWidthChange={(width) => handleWidthChange(model.id, width)}
                onToggleCollapse={() => handleToggleCollapse(model.id)}
                onToggleEnabled={() => handleToggleEnabled(model.id)}
                showRightHandle={!isMobile && index < enabledModels.length} // No handles on mobile, and don't show on last panel
                isMobile={isMobile} // Pass mobile state
                selectedVariant={
                  selectedVariants[model.id] ||
                  getDefaultVariantForModel(model.id)!
                }
                onVariantChange={(variant) =>
                  handleVariantChange(model.id, variant)
                }
                userQuotas={userQuotas}
                isBlocked={(() => {
                  const id = model.id.toLowerCase();
                  const provider = id.includes('gemini') ? 'gemini' : (id.includes('gpt') || id.includes('chatgpt')) ? 'openai' : id;
                  return !!blockedProviders[provider];
                })()}
                onOpenAPIKeyDialog={onOpenAPIKeyDialog}
              />
            );
          })
        )}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: isMobile ? 0.5 : 2,
          borderTop:
            mode === "light" ? "1px solid #e0e0e0" : "1px solid #404040",
        }}
      >
        {chatInput}
      </Box>
    </Box>
  );
}
