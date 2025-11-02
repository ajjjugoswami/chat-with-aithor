/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import ChatLayout from "./components/ChatLayout";
import Sidebar from "./components/Sidebar";
import MultiPanelChatArea from "./components/MultiPanelChatArea";
import ChatInput from "./components/ChatInput";
import SettingsPage from "./components/SettingsPage";
import HelpPage from "./components/HelpPage";
import WelcomeModal from "./components/WelcomeModal";
import FeedbackDialog from "./components/FeedbackDialog";
import EnhancedAPIKeyDialog from "./components/EnhancedAPIKeyDialog";
import type { AIModel } from "./components/AIModelTabs";
import { hasAPIKey } from "./utils/enhancedApiKeys";
import { sendToAI, getProviderFromModelId, type ChatMessage } from "./services/aiServices";
import { saveChatsToStorage, loadChatsFromStorage } from "./utils/chatStorage";
import { stopAllTypewriters, markMessageAsTyped } from "./utils/typewriterState";
import {
  getSidebarCollapsed,
  saveSidebarCollapsed,
  getPanelEnabled,
  getPanelVariant,
} from "./utils/panelStorage";
import { getModelEnabledStates, saveModelEnabledState } from "./utils/modelStorage";
import { getDefaultVariantForModel } from "./types/modelVariants";
import {
  ChatGptIcon,
  GeminiAi,
  DeepseekIcon,
  PerplexicityIcon,
  ClaudeIcon,
} from "./components/shared/Icons";
import { useTheme } from "./hooks/useTheme";
import { useWelcomeModal } from "./hooks/useWelcomeModal";
import MobileHeader from "./components/MobileHeader";
import { useMediaQuery, Snackbar, Alert } from "@mui/material";
import { AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import AHDjs from "ahdjs";
import React from "react";
import { useAuth } from "./hooks/useAuth";

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

interface Chat {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

function App() {
  const { id: chatIdParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { quotas } = useContext<any>(AuthContext);
  const { pathname } = useLocation();

  const currentView = location.pathname === "/settings" ? "settings" : location.pathname === "/help" ? "help" : "chat";
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    getSidebarCollapsed()
  );
  const { shouldShow: showWelcome, hide: hideWelcome } = useWelcomeModal();

  const handleSidebarToggle = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    saveSidebarCollapsed(newCollapsed);
  };
  const { mode } = useTheme();

  const [aiModels, setAiModels] = useState<AIModel[]>(() => {
    const savedStates = getModelEnabledStates();
    return [
      {
        id: "gpt-4o-mini",
        name: "gpt-4o-mini",
        displayName: "ChatGPT",
        enabled: savedStates["gpt-4o-mini"] ?? true,
        icon: (
          <ChatGptIcon
            sx={{ fontSize: 20, color: mode === "light" ? "#333" : "white" }}
          />
        ),
        color: "#10a37f",
      },
      {
        id: "gemini-2.0-flash",
        name: "gemini-2.0-flash",
        displayName: "Gemini",
        enabled: savedStates["gemini-2.0-flash"] ?? true,
        icon: <GeminiAi sx={{ fontSize: 20 }} />,
        color: "#4285f4",
      },
      {
        id: "perplexity-sonar",
        name: "perplexity-sonar",
        displayName: "Perplexity",
        enabled: savedStates["perplexity-sonar"] ?? true,
        icon: <PerplexicityIcon sx={{ fontSize: 20 }} />,
        color: "#9c27b0",
      },
      {
        id: "deepseek-chat",
        name: "deepseek-chat",
        displayName: "DeepSeek Chat",
        enabled: savedStates["deepseek-chat"] ?? true,
        icon: <DeepseekIcon sx={{ fontSize: 20 }} />,
        color: "#1976d2",
      },
      
      {
        id: "claude-3-haiku",
        name: "claude-3-haiku",
        displayName: "Claude",
        enabled: savedStates["claude-3-haiku"] ?? true,
        icon: <ClaudeIcon sx={{ fontSize: 20 }} />,
        color: "#ff6b35",
      },
    ];
  });

  const [chats, setChats] = useState<Chat[]>(() => loadChatsFromStorage());
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    chatIdParam || undefined
  );

  useEffect(() => {
    setSelectedChatId(chatIdParam || undefined);
  }, [chatIdParam]);

  // Mark all existing AI messages as already typed on app load (one-time initialization)
  useEffect(() => {
    const initialChats = loadChatsFromStorage();
    initialChats.forEach(chat => {
      chat.messages.forEach(message => {
        if (message.sender === 'ai' && message.content !== 'Thinking...') {
          markMessageAsTyped(message.id);
        }
      });
    });
  }, []); // Only run once on mount

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    saveChatsToStorage(chats);
  }, [chats]);

  const { user } = useAuth();
console.log("User ID:", user);
   const fetchTours = async (pathname:any) => {
    try {
      const ahdJS = AHDjs(undefined, {
        applicationId: "68fe3656ea23fd016a4484e5",
        apiHost: "https://pagepilot.fabbuilder.com",
        visitorId: user?.id,
        showProgressbar: false,
      });
      await ahdJS.showHighlights(`/${pathname}`, true);
  
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  };
  const toCamelCase = (str: string) => {
    return str
      .replace(/^\//, "")
      .replace(/[-_/](.)/g, (_, char) => char.toUpperCase());
  };

  console.log("Pathname:", toCamelCase(pathname));
  useEffect(() => {
    const processPathname = toCamelCase(pathname);
    fetchTours(processPathname);
  }, [pathname, user?.id]);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const handleNewChat = () => {
    const newChatId = uuidv4();
    const newChat: Chat = {
      id: newChatId,
      title: "New Chat",
      date: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    navigate(`/chat/c/${newChatId}`);
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    // If the deleted chat was selected, navigate to main chat
    if (selectedChatId === chatId) {
      navigate("/chat");
    }
  };

  const handleSettingsClick = () => {
    // Stop any active typewriter animations when navigating to settings
    stopAllTypewriters();
    navigate("/settings");
  };

  const handleHelpClick = () => {
    // Stop any active typewriter animations when navigating to help
    stopAllTypewriters();
    navigate("/help");
  };

  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const [quotaExceeded, setQuotaExceeded] = useState<{ provider: string } | null>(null);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [blockedProviders, setBlockedProviders] = useState<{ [provider: string]: boolean }>({});

  // Access auth context to refresh quotas
  const authCtx = React.useContext(AuthContext);

  const openAPIKeyDialogForProvider = (modelId: string) => {
    const providerId = modelId;
    setQuotaExceeded({ provider: providerId });
    setKeyDialogOpen(true);
  };

  const handleFeedbackClick = () => {
    setFeedbackDialogOpen(true);
  };

  const handleBackToChat = () => {
    // Stop any active typewriter animations when navigating back
    stopAllTypewriters();
    navigate(-1);
  };

  const handleChatSelect = (chatId: string) => {
    // Stop any active typewriter animations when switching chats
    stopAllTypewriters();
    navigate(`/chat/c/${chatId}`);
  };

  const handleSendMessage = async (content: string) => {
    let currentChatId = selectedChatId;

    // If no chat is seleFcted, create a new one
    if (!currentChatId) {
      const newChatId = uuidv4();
      const newChat: Chat = {
        id: newChatId,
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        date: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        messages: [],
      };

      setChats((prev) => [newChat, ...prev]);
      setSelectedChatId(newChatId);
      navigate(`/chat/c/${newChatId}`);
      currentChatId = newChatId;
    }

    const enabledModels = aiModels.filter((m) => {
      if (!m.enabled) return false;
      const id = m.id.toLowerCase();
      const isOpenAIorGemini = id.includes("gpt") || id.includes("chatgpt") || id.includes("gemini");
      // If provider is blocked due to free quota exceeded and no user key, skip it
      const providerId = id.includes('gemini') ? 'gemini' : (id.includes('gpt') || id.includes('chatgpt')) ? 'openai' : id;
      if (blockedProviders[providerId] && !hasAPIKey(m.id)) {
        return false;
      }
      return hasAPIKey(m.id) || isOpenAIorGemini;
    });

    // Get currently enabled panel states
    const currentPanelStates = getPanelEnabled();
    const currentlyEnabledPanels = enabledModels
      .filter(model => currentPanelStates[model.id] !== false)
      .map(model => model.id);

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      enabledPanels: currentlyEnabledPanels, // Track which panels were enabled
    };

    // Add user message immediately
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, userMessage],
            title:
              chat.messages.length === 0
                ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
                : chat.title,
          };
        }
        return chat;
      })
    );

    // Get conversation history for context
    const currentChat = chats.find((chat) => chat.id === currentChatId);
    const conversationHistory: ChatMessage[] =
      currentChat?.messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      })) || [];

    // Add the new user message to history
    conversationHistory.push({
      role: "user",
      content: content,
    });

    // Send to each enabled model with API key
    const panelEnabledStates = getPanelEnabled();
    
    enabledModels.forEach(async (model, index) => {
      // Skip if panel is disabled
      if (panelEnabledStates[model.id] === false) {
        return;
      }

      // Check if user has API key or quota for this model
      const userHasAPIKey = hasAPIKey(model.id);
      const provider = getProviderFromModelId(model.id);
      const hasRemainingQuota = (provider === 'openai' || provider === 'gemini') &&
        (authCtx?.quotas?.[provider as keyof typeof authCtx.quotas]?.remainingCalls ?? 0) > 0;

      // If no API key and no remaining quota, don't show loading animation
      // Just return early - the UI will show the "Add API Key" button
      if (!userHasAPIKey && !hasRemainingQuota) {
        return;
      }

      try {
        // Add loading message only if user has API key or remaining quota
        const loadingMessageId = `loading-${Date.now()}-${index}`;
        const loadingMessage: Message = {
          id: loadingMessageId,
          content: "Thinking...",
          sender: "ai",
          timestamp: new Date(),
          modelId: model.id,
          isNewMessage: true, // This is a new message that should show thinking animation
        };

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? { ...chat, messages: [...chat.messages, loadingMessage] }
              : chat
          )
        );

        // Call real AI API
        // Get the selected variant for this model, fallback to default if not found
        const selectedVariantId = getPanelVariant(model.id);
        const defaultVariant = getDefaultVariantForModel(model.id);
        const actualModelId = selectedVariantId || defaultVariant?.id || model.id;

        const response = await sendToAI(conversationHistory, actualModelId, authCtx?.quotas);

        // After each send, refresh quotas so UI shows updated remaining calls
        authCtx?.refreshQuotas?.();

        // Handle quota exceeded
        if (!response.success && response.quotaExceeded) {
          setQuotaExceeded({ provider: response.provider || model.id });
          // Block this provider until user adds own key
          const provider = (response.provider || model.id).toLowerCase();
          setBlockedProviders(prev => ({ ...prev, [provider]: true }));
          
          // Remove loading message and show error
          setChats((prev) =>
            prev.map((chat) => {
              if (chat.id === currentChatId) {
                const updatedMessages = chat.messages.filter(
                  (msg) => msg.id !== loadingMessageId
                );
                return { ...chat, messages: [...updatedMessages] };
              }
              return chat;
            })
          );
          return;
        }

        // Handle requires user key for non-free providers
        if (!response.success && response.requiresUserKey) {
          setQuotaExceeded({ provider: response.provider || model.id });
          const provider = (response.provider || model.id).toLowerCase();
          setBlockedProviders(prev => ({ ...prev, [provider]: true }));
          
          // Remove loading message and show error
          setChats((prev) =>
            prev.map((chat) => {
              if (chat.id === currentChatId) {
                const updatedMessages = chat.messages.filter(
                  (msg) => msg.id !== loadingMessageId
                );
                return { ...chat, messages: [...updatedMessages] };
              }
              return chat;
            })
          );
          return;
        }

        // Replace loading message with actual response
        const aiMessage: Message = {
          id: (Date.now() + index + 1).toString(),
          content: response.success
            ? response.message!
            : `Error: ${response.error}`,
          sender: "ai",
          timestamp: new Date(),
          modelId: model.id,
          isNewMessage: true, // This is a new message that should show typewriter effect
          images: response.success ? response.images : undefined,
          imageLinks: response.success && response.images 
            ? response.images.map(img => `data:${img.mimeType};base64,${img.data}`)
            : undefined,
        };

        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id === currentChatId) {
              const updatedMessages = chat.messages.map((msg) =>
                msg.id === loadingMessageId ? aiMessage : msg
              );
              return { ...chat, messages: updatedMessages };
            }
            return chat;
          })
        );

        // Update quota information if available
        if (response.usage) {
          // Quota information is now handled by AuthContext
          // The verify endpoint will update this automatically
        }
      } catch (error) {
        // Handle any unexpected errors
        const errorMessage: Message = {
          id: `error-${Date.now()}-${index}`,
          content: `Error: ${
            error instanceof Error ? error.message : "Unknown error occurred"
          }`,
          sender: "ai",
          timestamp: new Date(),
          modelId: model.id,
          isNewMessage: true, // This is a new error message
        };

        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id === currentChatId) {
              const updatedMessages = chat.messages.filter(
                (msg) => msg.id !== `loading-${Date.now()}-${index}`
              );
              return { ...chat, messages: [...updatedMessages, errorMessage] };
            }
            return chat;
          })
        );
      }
    });
  };

  const handleModelToggle = (modelId: string) => {
    setAiModels((prev) =>
      prev.map((model) => {
        if (model.id === modelId) {
          const newEnabled = !model.enabled;
          saveModelEnabledState(modelId, newEnabled);
          return { ...model, enabled: newEnabled };
        }
        return model;
      })
    );
  };
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Add body class for mobile keyboard handling
  useEffect(() => {
    document.body.classList.add('chat-active');
    document.documentElement.classList.add('chat-active');
    
    return () => {
      document.body.classList.remove('chat-active');
      document.documentElement.classList.remove('chat-active');
    };
  }, []);

  return (
    <div className="chat-interface">
      <ChatLayout
        sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <>
          {isMobile ? (
            <MobileHeader
              onNewChat={handleNewChat}
              chats={chats}
              selectedChatId={selectedChatId}
              onChatSelect={handleChatSelect}
              onSettingsClick={handleSettingsClick}
              onHelpClick={handleHelpClick}
              onFeedbackClick={handleFeedbackClick}
              onDeleteChat={handleDeleteChat}
            />
          ) : (
            <Sidebar
              onNewChat={handleNewChat}
              chats={chats}
              selectedChatId={selectedChatId}
              onChatSelect={handleChatSelect}
              onSettingsClick={handleSettingsClick}
              onHelpClick={handleHelpClick}
              onFeedbackClick={handleFeedbackClick}
              onDeleteChat={handleDeleteChat}
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={handleSidebarToggle}
            />
          )}
        </>
      }
      chatArea={
        currentView === "settings" ? (
          <SettingsPage
            models={aiModels}
            onModelToggle={handleModelToggle}
            onBack={handleBackToChat}
          />
        ) : currentView === "help" ? (
          <HelpPage onBack={handleBackToChat} />
        ) : (
          <MultiPanelChatArea
            models={aiModels}
            messages={selectedChat?.messages || []}
            onModelToggle={handleModelToggle}
            onNewChat={handleNewChat}
            chats={chats}
            selectedChatId={selectedChatId}
            onChatSelect={handleChatSelect}
            onDeleteChat={handleDeleteChat}
            userQuotas={quotas}
            onOpenAPIKeyDialog={openAPIKeyDialogForProvider}
            chatInput={
              <ChatInput
                onSendMessage={handleSendMessage}
                selectedModel={`${
                  aiModels.filter((m) => m.enabled).length
                } models enabled`}
              />
            }
          />
        )
      }
    />
    
    {/* Welcome Modal */}
    <WelcomeModal open={showWelcome} onClose={hideWelcome} />

    {/* Feedback Dialog */}
    <FeedbackDialog
      open={feedbackDialogOpen}
      onClose={() => setFeedbackDialogOpen(false)}
    />

    {/* API Key Dialog for quota exceeded */}
    <EnhancedAPIKeyDialog
      open={keyDialogOpen}
      onClose={() => setKeyDialogOpen(false)}
      model={aiModels.find(m => m.id === quotaExceeded?.provider) || null}
      onSave={() => {
        // Unblock providers when a key is saved
        if (quotaExceeded?.provider) {
          const prov = quotaExceeded.provider.toLowerCase();
          setBlockedProviders(prev => {
            const updated = { ...prev };
            delete updated[prov];
            return updated;
          });
        }
        setQuotaExceeded(null);
        // Refresh quotas just in case
        authCtx?.refreshQuotas?.();
      }}
    />

    {/* Removed Quota Over Dialog; handled via overlay CTA in chat panel */}

    {/* Quota Exceeded Notification */}
    <Snackbar 
      open={!!quotaExceeded} 
      autoHideDuration={6000} 
      onClose={() => setQuotaExceeded(null)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={() => setQuotaExceeded(null)} 
        severity="warning" 
        sx={{ width: '100%' }}
      >
        {quotaExceeded?.provider === 'openai' || quotaExceeded?.provider === 'gemini' 
          ? `Free ${quotaExceeded?.provider} quota exceeded. Please contact support or add your own API key to continue.`
          : `Please add your own API key for ${quotaExceeded?.provider} provider.`
        }
      </Alert>
    </Snackbar>
    </div>
  );
}

export default App;
