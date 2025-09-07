// Global state to track which messages have already been typed
// This prevents re-triggering typewriter effect on component re-mounts

const typedMessageIds = new Set<string>();

export const markMessageAsTyped = (messageId: string): void => {
  typedMessageIds.add(messageId);
};

export const hasMessageBeenTyped = (messageId: string): boolean => {
  return typedMessageIds.has(messageId);
};

export const clearTypedMessages = (): void => {
  typedMessageIds.clear();
};
