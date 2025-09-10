// Enhanced API Key management with multiple keys per model

interface LegacyAPIKey {
  modelId: string;
  key: string;
  name?: string;
  addedAt?: string;
}

interface LegacyAPIKeyFormat {
  modelId: string;
  key: string;
  name: string;
  addedAt: string;
}

export interface APIKeyEntry {
  id: string;
  modelId: string;
  key: string;
  name: string;
  addedAt: string;
  isActive: boolean;
  lastUsed?: string;
  usageCount?: number;
  isDefault?: boolean;
}

export interface ModelAPIKeyGroup {
  modelId: string;
  activeKeyId: string | null;
  keys: APIKeyEntry[];
}

const API_KEYS_STORAGE_KEY = 'ai-chat-api-keys-v2';
const LEGACY_API_KEYS_STORAGE_KEY = 'ai-chat-api-keys';

// Map individual model IDs to provider groups for shared API keys
const getProviderGroupId = (modelId: string): string => {
  if (modelId.includes('gpt') || modelId.includes('GPT') || modelId.includes('chatgpt')) {
    return 'openai'; // All OpenAI/ChatGPT models share the same API keys
  } else if (modelId.includes('gemini') || modelId.includes('Gemini')) {
    return 'gemini'; // All Gemini models share the same API keys
  } else if (modelId.includes('claude') || modelId.includes('Claude')) {
    return 'claude'; // All Claude models share the same API keys
  } else if (modelId.includes('deepseek') || modelId.includes('Deepseek')) {
    return 'deepseek'; // All DeepSeek models share the same API keys
  } else if (modelId.includes('perplexity') || modelId.includes('sonar')) {
    return 'perplexity'; // All Perplexity models share the same API keys
  }
  return modelId; // Fallback to original modelId for unknown providers
};

// Get friendly provider name for display
export const getProviderDisplayName = (modelId: string): string => {
  const providerGroupId = getProviderGroupId(modelId);
  switch (providerGroupId) {
    case 'openai':
      return 'OpenAI (ChatGPT)';
    case 'gemini':
      return 'Google Gemini';
    case 'claude':
      return 'Anthropic Claude';
    case 'deepseek':
      return 'DeepSeek';
    case 'perplexity':
      return 'Perplexity';
    default:
      return modelId;
  }
};

// Migration function for legacy API keys
const migrateLegacyAPIKeys = (): void => {
  try {
    const legacyKeys = localStorage.getItem(LEGACY_API_KEYS_STORAGE_KEY);
    if (legacyKeys) {
      const oldKeys = JSON.parse(legacyKeys);
      const newStructure: ModelAPIKeyGroup[] = [];
      
      oldKeys.forEach((oldKey: LegacyAPIKey) => {
        const newKey: APIKeyEntry = {
          id: `legacy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          modelId: oldKey.modelId,
          key: oldKey.key,
          name: oldKey.name || `${oldKey.modelId} Key`,
          addedAt: oldKey.addedAt || new Date().toISOString(),
          isActive: true,
          isDefault: true,
          usageCount: 0
        };
        
        const existingGroup = newStructure.find(g => g.modelId === oldKey.modelId);
        if (existingGroup) {
          existingGroup.keys.push(newKey);
        } else {
          newStructure.push({
            modelId: oldKey.modelId,
            activeKeyId: newKey.id,
            keys: [newKey]
          });
        }
      });
      
      localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(newStructure));
      localStorage.removeItem(LEGACY_API_KEYS_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error migrating legacy API keys:', error);
  }
};

export const getStoredAPIKeyGroups = (): ModelAPIKeyGroup[] => {
  try {
    // Check for migration
    const existingData = localStorage.getItem(API_KEYS_STORAGE_KEY);
    if (!existingData) {
      migrateLegacyAPIKeys();
    }
    
    const stored = localStorage.getItem(API_KEYS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading API key groups from localStorage:', error);
    return [];
  }
};

export const saveAPIKeyGroups = (groups: ModelAPIKeyGroup[]): void => {
  try {
    localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(groups));
  } catch (error) {
    console.error('Error saving API key groups to localStorage:', error);
  }
};

export const addAPIKey = (modelId: string, key: string, name: string): string => {
  try {
    const providerGroupId = getProviderGroupId(modelId);
    const groups = getStoredAPIKeyGroups();
    const keyId = `${providerGroupId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newKey: APIKeyEntry = {
      id: keyId,
      modelId: providerGroupId, // Store the provider group ID
      key,
      name,
      addedAt: new Date().toISOString(),
      isActive: true,
      usageCount: 0
    };
    
    const existingGroup = groups.find(g => g.modelId === providerGroupId);
    if (existingGroup) {
      // If this is the first key, make it default
      if (existingGroup.keys.length === 0) {
        newKey.isDefault = true;
        existingGroup.activeKeyId = keyId;
      }
      existingGroup.keys.push(newKey);
    } else {
      // New model group
      newKey.isDefault = true;
      groups.push({
        modelId: providerGroupId,
        activeKeyId: keyId,
        keys: [newKey]
      });
    }
    
    saveAPIKeyGroups(groups);
    return keyId;
  } catch (error) {
    console.error('Error adding API key:', error);
    throw error;
  }
};

export const updateAPIKey = (keyId: string, updates: Partial<APIKeyEntry>): void => {
  try {
    const groups = getStoredAPIKeyGroups();
    
    for (const group of groups) {
      const keyIndex = group.keys.findIndex(k => k.id === keyId);
      if (keyIndex >= 0) {
        group.keys[keyIndex] = { ...group.keys[keyIndex], ...updates };
        saveAPIKeyGroups(groups);
        return;
      }
    }
  } catch (error) {
    console.error('Error updating API key:', error);
  }
};

export const removeAPIKey = (keyId: string): void => {
  try {
    const groups = getStoredAPIKeyGroups();
    
    for (const group of groups) {
      const keyIndex = group.keys.findIndex(k => k.id === keyId);
      if (keyIndex >= 0) {
        group.keys.splice(keyIndex, 1);
        
        // If this was the active key, select another one
        if (group.activeKeyId === keyId) {
          if (group.keys.length > 0) {
            group.activeKeyId = group.keys[0].id;
            group.keys[0].isDefault = true;
          } else {
            group.activeKeyId = null;
          }
        }
        
        // Remove group if no keys left
        if (group.keys.length === 0) {
          const groupIndex = groups.findIndex(g => g.modelId === group.modelId);
          if (groupIndex >= 0) {
            groups.splice(groupIndex, 1);
          }
        }
        
        saveAPIKeyGroups(groups);
        return;
      }
    }
  } catch (error) {
    console.error('Error removing API key:', error);
  }
};

export const setActiveAPIKey = (modelId: string, keyId: string): void => {
  try {
    const providerGroupId = getProviderGroupId(modelId);
    const groups = getStoredAPIKeyGroups();
    const group = groups.find(g => g.modelId === providerGroupId);
    
    if (group && group.keys.find(k => k.id === keyId)) {
      // Update default flags
      group.keys.forEach(k => k.isDefault = k.id === keyId);
      group.activeKeyId = keyId;
      saveAPIKeyGroups(groups);
    }
  } catch (error) {
    console.error('Error setting active API key:', error);
  }
};

export const getActiveAPIKey = (modelId: string): APIKeyEntry | null => {
  try {
    const providerGroupId = getProviderGroupId(modelId);
    const groups = getStoredAPIKeyGroups();
    const group = groups.find(g => g.modelId === providerGroupId);
    
    if (group && group.activeKeyId) {
      const activeKey = group.keys.find(k => k.id === group.activeKeyId);
      if (activeKey) {
        return activeKey;
      }
    }
    
    // Fallback to first available key
    if (group && group.keys.length > 0) {
      return group.keys[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error getting active API key:', error);
    return null;
  }
};

export const getAPIKeyForModel = (modelId: string): string | null => {
  const activeKey = getActiveAPIKey(modelId);
  if (activeKey) {
    // Update usage tracking
    updateAPIKey(activeKey.id, {
      lastUsed: new Date().toISOString(),
      usageCount: (activeKey.usageCount || 0) + 1
    });
    return activeKey.key;
  }
  return null;
};

export const getAllAPIKeysForModel = (modelId: string): APIKeyEntry[] => {
  try {
    const providerGroupId = getProviderGroupId(modelId);
    const groups = getStoredAPIKeyGroups();
    const group = groups.find(g => g.modelId === providerGroupId);
    return group ? group.keys : [];
  } catch (error) {
    console.error('Error getting API keys for model:', error);
    return [];
  }
};

export const hasAPIKey = (modelId: string): boolean => {
  return getActiveAPIKey(modelId) !== null;
};

export const getAllAPIKeyGroups = (): ModelAPIKeyGroup[] => {
  return getStoredAPIKeyGroups();
};

// Legacy compatibility functions
export const getAllAPIKeys = (): LegacyAPIKeyFormat[] => {
  const groups = getStoredAPIKeyGroups();
  const legacyFormat: LegacyAPIKeyFormat[] = [];
  
  groups.forEach(group => {
    group.keys.forEach(key => {
      legacyFormat.push({
        modelId: key.modelId,
        key: key.key,
        name: key.name,
        addedAt: key.addedAt
      });
    });
  });
  
  return legacyFormat;
};

export const saveAPIKey = (modelId: string, key: string, name: string): void => {
  addAPIKey(modelId, key, name);
};
