export interface ServerAPIKey {
  _id: string;
  modelId: string;
  name: string;
  isActive: boolean;
  isDefault: boolean;
  lastUsed?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithKeys {
  _id: string;
  email: string;
  name?: string;
  apiKeys: ServerAPIKey[];
}

export interface AdminDialogProps {
  open: boolean;
  onClose: () => void;
  selectedUser: UserWithKeys | null;
  editingKey: ServerAPIKey | null;
  newKeyName: string;
  setNewKeyName: (name: string) => void;
  newKeyValue: string;
  setNewKeyValue: (value: string) => void;
  selectedModelId: string;
  setSelectedModelId: (modelId: string) => void;
  onSave: () => void;
  availableModels: { id: string; displayName: string }[];
}