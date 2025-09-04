// Chat storage utilities for localStorage
export interface StoredMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string; // Store as string for JSON serialization
  modelId?: string;
}

export interface StoredChat {
  id: string;
  title: string;
  date: string;
  messages: StoredMessage[];
}

export interface Chat {
  id: string;
  title: string;
  date: string;
  messages: {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    modelId?: string;
  }[];
}

const CHATS_STORAGE_KEY = 'ai-chat-conversations';

export const saveChatsToStorage = (chats: Chat[]): void => {
  try {
    const storedChats = chats.map(chat => ({
      ...chat,
      messages: chat.messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }))
    }));
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(storedChats));
  } catch (error) {
    console.error('Error saving chats to localStorage:', error);
  }
};

export const loadChatsFromStorage = (): Chat[] => {
  try {
    const stored = localStorage.getItem(CHATS_STORAGE_KEY);
    if (!stored) return [];
    
    const storedChats: StoredChat[] = JSON.parse(stored);
    return storedChats.map((chat) => ({
      ...chat,
      messages: chat.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Error loading chats from localStorage:', error);
    return [];
  }
};

export const clearChatsStorage = (): void => {
  try {
    localStorage.removeItem(CHATS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing chats from localStorage:', error);
  }
};
