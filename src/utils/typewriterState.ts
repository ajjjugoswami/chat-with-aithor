// Global state to track which messages have already been typed
// This prevents re-triggering typewriter effect on component re-mounts

const typedMessageIds = new Set<string>();
const activeTypewriters = new Set<() => void>(); // Track active typewriter cleanup functions

export const markMessageAsTyped = (messageId: string): void => {
  typedMessageIds.add(messageId);
};

export const hasMessageBeenTyped = (messageId: string): boolean => {
  return typedMessageIds.has(messageId);
};

export const clearTypedMessages = (): void => {
  typedMessageIds.clear();
};

export const addActiveTypewriter = (cleanup: () => void): void => {
  activeTypewriters.add(cleanup);
};

export const removeActiveTypewriter = (cleanup: () => void): void => {
  activeTypewriters.delete(cleanup);
};

export const stopAllTypewriters = (): void => {
  // Stop all active typewriters
  activeTypewriters.forEach(cleanup => cleanup());
  activeTypewriters.clear();
};
