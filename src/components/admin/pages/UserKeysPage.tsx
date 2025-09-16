import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Alert, IconButton, Tooltip, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useTheme } from '../../../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAdminUsers, clearError, resetAdminState } from '../../../store/slices/adminSlice';
import UserKeysTabs from '../UserKeysTabs';
import AdminDialog from '../AdminDialog';
import type { UserWithKeys, ServerAPIKey } from '../types';

export default function UserKeysPage() {
  const { mode } = useTheme();
  const dispatch = useAppDispatch();
  const isInitializedRef = useRef(false);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isVerySmallMobile = useMediaQuery('(max-width: 480px)');
  
  // Add state for selected user
  const [selectedUser, setSelectedUser] = useState<UserWithKeys | null>(null);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ServerAPIKey | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [settingActive, setSettingActive] = useState(false);
  
  const {
    adminUsers,
    loadingAdminUsers,
    error,
    adminUsersInitialized,
  } = useAppSelector((state) => state.admin);

  // Available providers for selection
  const availableProviders = [
    { id: "ChatGPT", displayName: "ChatGPT" },
    { id: "Gemini", displayName: "Gemini" },
    { id: "DeepSeek", displayName: "DeepSeek" },
    { id: "Claude", displayName: "Claude" },
    { id: "Perplexity", displayName: "Perplexity" },
    { id: "Ollama", displayName: "Ollama" },
  ];

  useEffect(() => {
    if (!adminUsersInitialized && !loadingAdminUsers && !isInitializedRef.current) {
      isInitializedRef.current = true;
      dispatch(fetchAdminUsers());
    }
  }, [dispatch, adminUsersInitialized, loadingAdminUsers]);

  // Clear selected user if it's no longer in the admin users list
  useEffect(() => {
    if (selectedUser && adminUsers.length > 0) {
      const userStillExists = adminUsers.find(user => user._id === selectedUser._id);
      if (!userStillExists) {
        setSelectedUser(null);
      } else {
        // Update the selected user with fresh data
        setSelectedUser(userStillExists);
      }
    }
  }, [adminUsers, selectedUser]);

  const handleRefresh = () => {
    isInitializedRef.current = false; // Reset the ref for fresh initialization
    dispatch(resetAdminState()); // Reset state first to clear initialized flag
    dispatch(fetchAdminUsers()); // Fetch fresh data
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleOpenAddDialog = (user: UserWithKeys) => {
    setSelectedUser(user);
    setEditingKey(null);
    setNewKeyName('');
    setNewKeyValue('');
    setSelectedProvider('ChatGPT');
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (user: UserWithKeys, key: ServerAPIKey) => {
    setSelectedUser(user);
    setEditingKey(key);
    setNewKeyName(key.name);
    setNewKeyValue(''); // Don't pre-fill the key value for security
    setSelectedProvider(key.provider);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingKey(null);
    setNewKeyName('');
    setNewKeyValue('');
    setSelectedProvider('');
  };

  const handleSaveKey = async () => {
    if (!selectedUser || !newKeyName.trim() || !selectedProvider) {
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const keyData: {
        provider: string;
        name: string;
        isDefault: boolean;
        key?: string;
      } = {
        provider: selectedProvider,
        name: newKeyName.trim(),
        isDefault: false,
      };

      // Only include key if it's provided (for editing, empty means keep current)
      if (newKeyValue.trim()) {
        keyData.key = newKeyValue.trim();
      }

      const url = editingKey
        ? `https://aithor-be.vercel.app/api/api-keys/admin/${selectedUser._id}/${editingKey._id}`
        : `https://aithor-be.vercel.app/api/api-keys/admin/${selectedUser._id}`;

      const method = editingKey ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(keyData),
      });

      if (response.ok) {
        // Refresh the admin users data
        dispatch(fetchAdminUsers());
        handleCloseDialog();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save API key');
      }
    } catch (error) {
      console.error('Error saving key:', error);
      // You could add error state handling here
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKey = async (userId: string, keyId: string) => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `https://aithor-be.vercel.app/api/api-keys/admin/${userId}/${keyId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Refresh the admin users data
        dispatch(fetchAdminUsers());
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete API key');
      }
    } catch (error) {
      console.error('Error deleting key:', error);
      // You could add error state handling here
    } finally {
      setDeleting(false);
    }
  };

  const handleSetActive = async (userId: string, keyId: string) => {
    setSettingActive(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `https://aithor-be.vercel.app/api/api-keys/admin/${userId}/${keyId}/set-active`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Refresh the admin users data
        dispatch(fetchAdminUsers());
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set active API key');
      }
    } catch (error) {
      console.error('Error setting active key:', error);
      // You could add error state handling here
    } finally {
      setSettingActive(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 0, sm: 0 } }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 0.5, sm: 0 }
      }}>
        <Typography
          variant={isMobile ? (isSmallMobile ? "h5" : "h4") : "h4"}
          component="h1"
          sx={{
            color: mode === 'light' ? '#333' : '#fff',
            fontWeight: 600,
            fontSize: { 
              xs: isVerySmallMobile ? '1.25rem' : '1.5rem', 
              sm: '2rem', 
              md: '2.125rem' 
            },
            lineHeight: { xs: 1.2, sm: 1.167 }
          }}
        >
          {isVerySmallMobile ? 'Keys' : (isSmallMobile ? 'User Keys' : 'User Keys Management')}
        </Typography>
        
        <Tooltip title="Refresh Data">
          <IconButton
            onClick={handleRefresh}
            disabled={loadingAdminUsers}
            size={isVerySmallMobile ? "small" : (isMobile ? "small" : "medium")}
            sx={{
              color: mode === 'light' ? '#1976d2' : '#90caf9',
              borderRadius: 2,
              border: `1px solid ${mode === 'light' ? '#1976d2' : '#90caf9'}`,
              p: isVerySmallMobile ? 0.5 : (isMobile ? 0.75 : 1),
              '&:hover': {
                borderColor: mode === 'light' ? '#1565c0' : '#64b5f6',
                backgroundColor: mode === 'light' ? 'rgba(25, 118, 210, 0.04)' : 'rgba(144, 202, 249, 0.04)',
              },
              '&:disabled': {
                borderColor: 'action.disabled',
                color: 'action.disabled',
              }
            }}
          >
            <RefreshIcon fontSize={isVerySmallMobile ? "small" : (isMobile ? "small" : "medium")} />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          onClose={handleClearError}
          sx={{ 
            mb: { xs: 2, sm: 3 },
            mx: { xs: 0.5, sm: 0 }
          }}
        >
          {error}
        </Alert>
      )}

      <Box sx={{ px: { xs: 0.5, sm: 0 } }}>
        <UserKeysTabs
          usersWithKeys={adminUsers}
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
          handleOpenAddDialog={handleOpenAddDialog}
          handleOpenEditDialog={handleOpenEditDialog}
          handleDeleteKey={handleDeleteKey}
          handleSetActive={handleSetActive}
          deleting={deleting}
          settingActive={settingActive}
          loading={loadingAdminUsers}
        />
      </Box>

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
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
        onSave={handleSaveKey}
        availableProviders={availableProviders}
        saving={saving}
      />
    </Box>
  );
}