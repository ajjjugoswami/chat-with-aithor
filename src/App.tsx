import { useState, useEffect } from "react";
import "./App.css";
import ChatLayout from "./components/ChatLayout";
import Sidebar from "./components/Sidebar";
import MultiPanelChatArea from "./components/MultiPanelChatArea";
import ChatInput from "./components/ChatInput";
import SettingsPage from "./components/SettingsPage";
import type { AIModel } from "./components/AIModelTabs";
import { hasAPIKey } from "./utils/apiKeys";
import { sendToAI, type ChatMessage } from "./services/aiServices";
import { saveChatsToStorage, loadChatsFromStorage } from "./utils/chatStorage";
import {
  getSidebarCollapsed,
  saveSidebarCollapsed,
} from "./utils/panelStorage";
import {
  ChatGptIcon,
  GeminiAi,
  DeepseekIcon,
  PerplexicityIcon,
  ClaudeIcon,
} from "./components/shared/Icons";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  modelId?: string;
}

interface Chat {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

function App() {
  const [currentView, setCurrentView] = useState<"chat" | "settings">("chat");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    getSidebarCollapsed()
  );

  const handleSidebarToggle = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    saveSidebarCollapsed(newCollapsed);
  };

  const [aiModels, setAiModels] = useState<AIModel[]>([
    {
      id: "gpt-4o-mini",
      name: "gpt-4o-mini",
      displayName: "ChatGPT",
      enabled: true,
      icon: <ChatGptIcon sx={{ fontSize: 20 }} />,
      // color: '#10a37f',
    },
    {
      id: "gemini-2.5-lite",
      name: "gemini-2.5-lite",
      displayName: "Gemini",
      enabled: true,
      icon: <GeminiAi sx={{ fontSize: 20 }} />,
      // color: '#4285f4',
    },
    {
      id: "deepseek-chat",
      name: "deepseek-chat",
      displayName: "DeepSeek Chat",
      enabled: true,
      icon: <DeepseekIcon sx={{ fontSize: 20 }} />,
      // color: '#1976d2',
    },
    {
      id: "perplexity-sonar",
      name: "perplexity-sonar",
      displayName: "Perplexity",
      enabled: true,
      icon: <PerplexicityIcon sx={{ fontSize: 20 }} />,
      // color: '#9c27b0',
    },
    {
      id: "claude-3-haiku",
      name: "claude-3-haiku",
      displayName: "Claude",
      enabled: true,
      icon: <ClaudeIcon sx={{ fontSize: 20 }} />,
      // color: '#ff6b35',
    },
  ]);

  const [chats, setChats] = useState<Chat[]>(() => loadChatsFromStorage());
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    undefined
  );

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    saveChatsToStorage(chats);
  }, [chats]);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
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
    setSelectedChatId(newChatId);
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    // If the deleted chat was selected, clear selection
    if (selectedChatId === chatId) {
      setSelectedChatId(undefined);
    }
  };

  const handleSendMessage = async (content: string) => {
    let currentChatId = selectedChatId;

    // If no chat is selected, create a new one
    if (!currentChatId) {
      const newChatId = Date.now().toString();
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
      currentChatId = newChatId;
    }

    const enabledModels = aiModels.filter((m) => m.enabled && hasAPIKey(m.id));

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
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
    enabledModels.forEach(async (model, index) => {
      try {
        // Add loading message
        const loadingMessageId = `loading-${Date.now()}-${index}`;
        const loadingMessage: Message = {
          id: loadingMessageId,
          content: "Thinking...",
          sender: "ai",
          timestamp: new Date(),
          modelId: model.id,
        };

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? { ...chat, messages: [...chat.messages, loadingMessage] }
              : chat
          )
        );

        // Call real AI API
        const response = await sendToAI(conversationHistory, model.id);

        // Replace loading message with actual response
        const aiMessage: Message = {
          id: (Date.now() + index + 1).toString(),
          content: response.success
            ? response.message!
            : `Error: ${response.error}`,
          sender: "ai",
          timestamp: new Date(),
          modelId: model.id,
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
      prev.map((model) =>
        model.id === modelId ? { ...model, enabled: !model.enabled } : model
      )
    );
  };

  return (
    <ChatLayout
      sidebarCollapsed={sidebarCollapsed}
      sidebar={
        <Sidebar
          onNewChat={handleNewChat}
          chats={chats}
          selectedChatId={selectedChatId}
          onChatSelect={setSelectedChatId}
          onSettingsClick={() => setCurrentView("settings")}
          onDeleteChat={handleDeleteChat}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
        />
      }
      chatArea={
        currentView === "settings" ? (
          <SettingsPage
            models={aiModels}
            onModelToggle={handleModelToggle}
            onBack={() => setCurrentView("chat")}
          />
        ) : (
          <MultiPanelChatArea
            models={aiModels}
            messages={selectedChat?.messages || []}
            onModelToggle={handleModelToggle}
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
  );
}

export default App;
