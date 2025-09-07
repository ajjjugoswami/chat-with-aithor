// Global state to track which messages have already been typed
// This prevents re-triggering typewriter effect on component re-mounts

const TYPED_MESSAGES_KEY = 'typed-message-ids';

// Load typed message IDs from localStorage
const loadTypedMessageIds = (): Set<string> => {
  try {
    const stored = localStorage.getItem(TYPED_MESSAGES_KEY);
    if (stored) {
      const ids = JSON.parse(stored);
      return new Set(ids);
    }
  } catch (error) {
    console.error('Error loading typed message IDs:', error);
  }
  return new Set<string>();
};

// Save typed message IDs to localStorage
const saveTypedMessageIds = (ids: Set<string>): void => {
  try {
    localStorage.setItem(TYPED_MESSAGES_KEY, JSON.stringify([...ids]));
  } catch (error) {
    console.error('Error saving typed message IDs:', error);
  }
};

const typedMessageIds = loadTypedMessageIds(); // Initialize from localStorage
const activeTypewriters = new Set<() => void>(); // Track active typewriter cleanup functions
const typewriterStateListeners = new Set<(isActive: boolean) => void>(); // Track state change listeners

export const markMessageAsTyped = (messageId: string): void => {
  typedMessageIds.add(messageId);
  saveTypedMessageIds(typedMessageIds); // Persist to localStorage
};

export const hasMessageBeenTyped = (messageId: string): boolean => {
  return typedMessageIds.has(messageId);
};

export const clearTypedMessages = (): void => {
  typedMessageIds.clear();
  saveTypedMessageIds(typedMessageIds); // Clear from localStorage too
};

export const addActiveTypewriter = (cleanup: () => void): void => {
  const wasEmpty = activeTypewriters.size === 0;
  activeTypewriters.add(cleanup);
  
  // Notify listeners that typewriter state changed
  if (wasEmpty) {
    typewriterStateListeners.forEach(listener => listener(true));
  }
};

export const removeActiveTypewriter = (cleanup: () => void): void => {
  activeTypewriters.delete(cleanup);
  
  // Notify listeners that typewriter state changed
  if (activeTypewriters.size === 0) {
    typewriterStateListeners.forEach(listener => listener(false));
  }
};

export const stopAllTypewriters = (): void => {
  // Stop all active typewriters
  activeTypewriters.forEach(cleanup => cleanup());
  activeTypewriters.clear();
  
  // Notify listeners that all typewriters stopped
  typewriterStateListeners.forEach(listener => listener(false));
};

export const isAnyTypewriterActive = (): boolean => {
  return activeTypewriters.size > 0;
};

export const addTypewriterStateListener = (listener: (isActive: boolean) => void): (() => void) => {
  typewriterStateListeners.add(listener);
  
  // Return cleanup function
  return () => {
    typewriterStateListeners.delete(listener);
  };
};
