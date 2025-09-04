// API Key management utilities

export interface APIKey {
  modelId: string;
  key: string;
  name: string;
  addedAt: string;
}

const API_KEYS_STORAGE_KEY = 'ai-chat-api-keys';

export const getStoredAPIKeys = (): APIKey[] => {
  try {
    const stored = localStorage.getItem(API_KEYS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading API keys from localStorage:', error);
    return [];
  }
};

export const saveAPIKey = (modelId: string, key: string, name: string): void => {
  try {
    const apiKeys = getStoredAPIKeys();
    const existingIndex = apiKeys.findIndex(apiKey => apiKey.modelId === modelId);
    
    const newAPIKey: APIKey = {
      modelId,
      key,
      name,
      addedAt: new Date().toISOString(),
    };
    
    if (existingIndex >= 0) {
      apiKeys[existingIndex] = newAPIKey;
    } else {
      apiKeys.push(newAPIKey);
    }
    
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(apiKeys));
  } catch (error) {
    console.error('Error saving API key to localStorage:', error);
  }
};

export const removeAPIKey = (modelId: string): void => {
  try {
    const apiKeys = getStoredAPIKeys();
    const filteredKeys = apiKeys.filter(apiKey => apiKey.modelId !== modelId);
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(filteredKeys));
  } catch (error) {
    console.error('Error removing API key from localStorage:', error);
  }
};

export const getAPIKeyForModel = (modelId: string): string | null => {
  const apiKeys = getStoredAPIKeys();
  const apiKey = apiKeys.find(key => key.modelId === modelId);
  return apiKey ? apiKey.key : null;
};

export const hasAPIKey = (modelId: string): boolean => {
  return getAPIKeyForModel(modelId) !== null;
};

export const getAllAPIKeys = (): APIKey[] => {
  return getStoredAPIKeys();
};
