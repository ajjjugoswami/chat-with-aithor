// Model enabled/disabled state storage utilities
const MODEL_ENABLED_KEY = 'chat-model-enabled';

interface ModelEnabledStates {
  [modelId: string]: boolean;
}

export function getModelEnabledStates(): ModelEnabledStates {
  try {
    const stored = localStorage.getItem(MODEL_ENABLED_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveModelEnabledState(modelId: string, enabled: boolean) {
  try {
    const enabledStates = getModelEnabledStates();
    enabledStates[modelId] = enabled;
    localStorage.setItem(MODEL_ENABLED_KEY, JSON.stringify(enabledStates));
  } catch {
    // Ignore localStorage errors
  }
}

export function getModelEnabledState(modelId: string): boolean | null {
  try {
    const enabledStates = getModelEnabledStates();
    return enabledStates[modelId] ?? null; // Return null if not found
  } catch {
    return null;
  }
}
