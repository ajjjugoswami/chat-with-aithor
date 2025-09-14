export interface ServerAPIKey {
  _id: string;
  provider: string;
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
  picture?: string;
  isAdmin?: boolean;
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
  selectedProvider: string;
  setSelectedProvider: (provider: string) => void;
  onSave: () => void;
  availableProviders: { id: string; displayName: string }[];
  saving: boolean;
}