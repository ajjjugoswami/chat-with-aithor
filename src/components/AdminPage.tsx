import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import {
  AdminHeader,
  AdminTabs,
  UserAccordion,
  APIKeyCard,
  AdminDialog,
  AddKeyForm,
  type UserWithKeys,
  type ServerAPIKey,
} from './admin';

export default function AdminPage() {
  const { mode } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 600px)');

  const [tabValue, setTabValue] = useState(0);
  const [usersWithKeys, setUsersWithKeys] = useState<UserWithKeys[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add/Edit Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithKeys | null>(null);
  const [editingKey, setEditingKey] = useState<ServerAPIKey | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');

  // Menu state for API key cards
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedKey, setSelectedKey] = useState<ServerAPIKey | null>(null);

  // Available models for selection
  const availableModels = [
    { id: 'gpt-4o-mini', displayName: 'ChatGPT (GPT-4o Mini)' },
    { id: 'gpt-4', displayName: 'ChatGPT (GPT-4)' },
    { id: 'gpt-3.5-turbo', displayName: 'ChatGPT (GPT-3.5 Turbo)' },
    { id: 'gemini-2.0-flash', displayName: 'Google Gemini 2.0 Flash' },
    { id: 'gemini-pro', displayName: 'Google Gemini Pro' },
    { id: 'claude-3-haiku', displayName: 'Anthropic Claude 3 Haiku' },
    { id: 'claude-3-sonnet', displayName: 'Anthropic Claude 3 Sonnet' },
    { id: 'deepseek-chat', displayName: 'DeepSeek Chat' },
    { id: 'perplexity-sonar', displayName: 'Perplexity Sonar' },
  ];

  // Check if user is admin
  const isAdmin = user?.email === 'goswamiajay526@gmail.com';

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsersAndKeys();
    }
  }, [isAdmin]);

  const fetchAllUsersAndKeys = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('https://aithor-be.vercel.app/api/api-keys/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsersWithKeys(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch users and keys');
      }
    } catch (err) {
      setError('Network error while fetching data');
      console.error('Error fetching users and keys:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = async () => {
    if (!selectedUser || !newKeyName.trim() || !newKeyValue.trim() || !selectedModelId) {
      setError('All fields are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const keyData = {
        modelId: selectedModelId,
        key: newKeyValue.trim(),
        name: newKeyName.trim(),
        isDefault: false,
      };

      const url = editingKey
        ? `https://aithor-be.vercel.app/api/api-keys/admin/${selectedUser._id}/${editingKey._id}`
        : `https://aithor-be.vercel.app/api/api-keys/admin/${selectedUser._id}`;

      const method = editingKey ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(keyData),
      });

      if (response.ok) {
        await fetchAllUsersAndKeys();
        handleCloseDialog();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save API key');
      }
    } catch (err) {
      setError('Network error while saving API key');
      console.error('Error saving key:', err);
    }
  };

  const handleDeleteKey = async (userId: string, keyId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`https://aithor-be.vercel.app/api/api-keys/admin/${userId}/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchAllUsersAndKeys();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete API key');
      }
    } catch (err) {
      setError('Network error while deleting API key');
      console.error('Error deleting key:', err);
    }
    handleCloseMenu();
  };

  const handleSetActive = async (userId: string, keyId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`https://aithor-be.vercel.app/api/api-keys/admin/${userId}/${keyId}/active`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchAllUsersAndKeys();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to set active API key');
      }
    } catch (err) {
      setError('Network error while setting active API key');
      console.error('Error setting active key:', err);
    }
    handleCloseMenu();
  };

  const handleOpenAddDialog = (user: UserWithKeys) => {
    setSelectedUser(user);
    setEditingKey(null);
    setNewKeyName('');
    setNewKeyValue('');
    setSelectedModelId('');
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (user: UserWithKeys, key: ServerAPIKey) => {
    setSelectedUser(user);
    setEditingKey(key);
    setNewKeyName(key.name);
    setNewKeyValue('');
    setSelectedModelId(key.modelId);
    setDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setEditingKey(null);
    setNewKeyName('');
    setNewKeyValue('');
    setSelectedModelId('');
    setError('');
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, key: ServerAPIKey) => {
    setMenuAnchor(event.currentTarget);
    setSelectedKey(key);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedKey(null);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClearForm = () => {
    setSelectedUser(null);
    setNewKeyName('');
    setNewKeyValue('');
    setSelectedModelId('');
  };

  if (!isAdmin) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: mode === 'light' ? '#f5f5f5' : '#121212',
        }}
      >
        <Typography variant="h6" color="error">
          Access Denied: Admin privileges required
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: mode === 'light' ? '#f5f5f5' : '#121212',
        color: mode === 'light' ? '#000' : '#fff',
        p: isMobile ? 2 : 4,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <AdminHeader
          onRefresh={fetchAllUsersAndKeys}
          loading={loading}
          error={error}
          onClearError={() => setError('')}
        />

        {/* Tabs */}
        <AdminTabs value={tabValue} onChange={handleTabChange} />

        {/* Tab Content */}
        {tabValue === 0 && (
          <Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                <CircularProgress size={60} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {usersWithKeys.map((user) => (
                  <UserAccordion
                    key={user._id}
                    user={user}
                    onAddKey={handleOpenAddDialog}
                  >
                    {user.apiKeys.length === 0 ? (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          textAlign: 'center',
                          py: 4,
                          fontStyle: 'italic',
                        }}
                      >
                        No API keys configured for this user
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'grid', gap: 1 }}>
                        {user.apiKeys.map((key) => (
                          <APIKeyCard
                            key={key._id}
                            keyData={key}
                            onEdit={(key) => handleOpenEditDialog(user, key)}
                            onSetActive={(keyId) => handleSetActive(user._id, keyId)}
                            onDelete={(keyId) => handleDeleteKey(user._id, keyId)}
                            menuAnchor={menuAnchor}
                            onMenuOpen={handleOpenMenu}
                            onMenuClose={handleCloseMenu}
                            selectedKey={selectedKey}
                          />
                        ))}
                      </Box>
                    )}
                  </UserAccordion>
                ))}
                {usersWithKeys.length === 0 && (
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 8,
                      bgcolor: 'background.paper',
                      borderRadius: 3,
                      border: '2px dashed',
                      borderColor: 'divider',
                    }}
                  >
                    <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                      No users found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Users will appear here once they register
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <AddKeyForm
            users={usersWithKeys}
            selectedUser={selectedUser}
            onUserChange={setSelectedUser}
            selectedModelId={selectedModelId}
            onModelChange={setSelectedModelId}
            keyName={newKeyName}
            onKeyNameChange={setNewKeyName}
            keyValue={newKeyValue}
            onKeyValueChange={setNewKeyValue}
            onSave={handleSaveKey}
            onClear={handleClearForm}
            availableModels={availableModels}
            loading={loading}
          />
        )}

        {/* Add/Edit Dialog */}
        <AdminDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          selectedUser={selectedUser}
          editingKey={editingKey}
          newKeyName={newKeyName}
          setNewKeyName={setNewKeyName}
          newKeyValue={newKeyValue}
          setNewKeyValue={setNewKeyValue}
          selectedModelId={selectedModelId}
          setSelectedModelId={setSelectedModelId}
          onSave={handleSaveKey}
          availableModels={availableModels}
        />
      </Box>
    </Box>
  );
}