import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Key,
  Save,
  Refresh,
  Close,
  ExpandMore,
  Person,
} from '@mui/icons-material';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import {
  getProviderDisplayName,
} from '../utils/enhancedApiKeys';

interface ServerAPIKey {
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

interface UserWithKeys {
  _id: string;
  email: string;
  name?: string;
  apiKeys: ServerAPIKey[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

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

  // Menu
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
        isDefault: false, // Admin can set this later if needed
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
        await fetchAllUsersAndKeys(); // Refresh the list
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
        await fetchAllUsersAndKeys(); // Refresh the list
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
        await fetchAllUsersAndKeys(); // Refresh the list
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
    setNewKeyValue(''); // Don't pre-fill the key value for security
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
        <Box sx={{ mb: 4 }}>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            sx={{
              fontWeight: 700,
              mb: 2,
              color: mode === 'light' ? '#1a1a1a' : '#fff',
            }}
          >
            Admin Dashboard - API Key Management
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: mode === 'light' ? '#666' : '#ccc',
              mb: 3,
            }}
          >
            Manage API keys for all users across different AI models
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="admin tabs"
            sx={{
              '& .MuiTab-root': {
                color: mode === 'light' ? '#666' : '#ccc',
                '&.Mui-selected': {
                  color: mode === 'light' ? '#1a1a1a' : '#fff',
                },
              },
              '& .MuiTabs-indicator': {
                bgcolor: mode === 'light' ? '#1a1a1a' : '#fff',
              },
            }}
          >
            <Tab label="All Users & Keys" />
            <Tab label="Add Key for User" />
          </Tabs>
        </Box>

        {/* All Users & Keys Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchAllUsersAndKeys}
              disabled={loading}
              sx={{
                borderColor: mode === 'light' ? '#666' : '#ccc',
                color: mode === 'light' ? '#666' : '#ccc',
              }}
            >
              Refresh
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {usersWithKeys.map((user) => (
                <Accordion
                  key={user._id}
                  sx={{
                    bgcolor: mode === 'light' ? '#fff' : '#1e1e1e',
                    borderRadius: 2,
                    '&:before': { display: 'none' },
                    boxShadow: mode === 'light'
                      ? '0 2px 8px rgba(0,0,0,0.1)'
                      : '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                        gap: 2,
                      },
                    }}
                  >
                    <Avatar sx={{ width: 40, height: 40 }}>
                      <Person />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {user.name || user.email}
                      </Typography>
                      <Typography variant="body2" sx={{ color: mode === 'light' ? '#666' : '#ccc' }}>
                        {user.email} • {user.apiKeys.length} API key{user.apiKeys.length !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAddDialog(user);
                      }}
                      sx={{ mr: 2 }}
                    >
                      Add Key
                    </Button>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    {user.apiKeys.length === 0 ? (
                      <Typography variant="body2" sx={{ color: mode === 'light' ? '#666' : '#ccc', textAlign: 'center', py: 2 }}>
                        No API keys configured for this user
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'grid', gap: 2 }}>
                        {user.apiKeys.map((key) => (
                          <Card
                            key={key._id}
                            sx={{
                              bgcolor: mode === 'light' ? '#f8f9fa' : '#2a2a2a',
                              borderRadius: 2,
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                      {key.name}
                                    </Typography>
                                    {key.isDefault && (
                                      <Chip
                                        label="Active"
                                        size="small"
                                        color="primary"
                                        sx={{ fontSize: '0.75rem' }}
                                      />
                                    )}
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: mode === 'light' ? '#666' : '#ccc',
                                      mb: 1,
                                      fontFamily: 'monospace',
                                    }}
                                  >
                                    Model: {getProviderDisplayName(key.modelId)}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: mode === 'light' ? '#666' : '#ccc',
                                      mb: 1,
                                    }}
                                  >
                                    Key: {key._id.substring(0, 20)}...
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: mode === 'light' ? '#888' : '#999',
                                    }}
                                  >
                                    Created: {new Date(key.createdAt).toLocaleDateString()} •
                                    Used: {key.usageCount} times
                                    {key.lastUsed && ` • Last used: ${new Date(key.lastUsed).toLocaleDateString()}`}
                                  </Typography>
                                </Box>
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenMenu(e, key);
                                  }}
                                  sx={{
                                    color: mode === 'light' ? '#666' : '#ccc',
                                  }}
                                >
                                  <MoreVert />
                                </IconButton>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
              {usersWithKeys.length === 0 && (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <Person sx={{ fontSize: 48, color: mode === 'light' ? '#ccc' : '#666', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: mode === 'light' ? '#666' : '#ccc' }}>
                    No users found
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </TabPanel>

        {/* Add Key for User Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card
            sx={{
              bgcolor: mode === 'light' ? '#fff' : '#1e1e1e',
              borderRadius: 2,
              boxShadow: mode === 'light'
                ? '0 2px 8px rgba(0,0,0,0.1)'
                : '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Add API Key for User
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: mode === 'light' ? '#666' : '#ccc' }}>
                Select a user and add an API key for their account
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  select
                  label="Select User"
                  value={selectedUser?._id || ''}
                  onChange={(e) => {
                    const user = usersWithKeys.find(u => u._id === e.target.value);
                    setSelectedUser(user || null);
                  }}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: mode === 'light' ? '#f5f5f5' : '#2a2a2a',
                    },
                  }}
                >
                  {usersWithKeys.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name || user.email} ({user.email})
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="AI Model"
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: mode === 'light' ? '#f5f5f5' : '#2a2a2a',
                    },
                  }}
                >
                  {availableModels.map((model) => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.displayName}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Key Name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., My OpenAI Key"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: mode === 'light' ? '#f5f5f5' : '#2a2a2a',
                    },
                  }}
                />

                <TextField
                  label="API Key"
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                  placeholder="Enter the API key"
                  fullWidth
                  type="password"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: mode === 'light' ? '#f5f5f5' : '#2a2a2a',
                      fontFamily: 'monospace',
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedUser(null);
                      setNewKeyName('');
                      setNewKeyValue('');
                      setSelectedModelId('');
                    }}
                    sx={{
                      borderColor: mode === 'light' ? '#666' : '#ccc',
                      color: mode === 'light' ? '#666' : '#ccc',
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveKey}
                    disabled={!selectedUser || !selectedModelId || !newKeyName.trim() || !newKeyValue.trim()}
                    sx={{
                      bgcolor: mode === 'light' ? '#1a1a1a' : '#fff',
                      color: mode === 'light' ? '#fff' : '#1a1a1a',
                      '&:hover': {
                        bgcolor: mode === 'light' ? '#333' : '#e0e0e0',
                      },
                    }}
                  >
                    Save Key
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Add/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingKey ? 'Edit API Key' : 'Add New API Key'}
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
              <Typography variant="body2" sx={{ color: mode === 'light' ? '#666' : '#ccc' }}>
                User: {selectedUser?.email}
              </Typography>
              
              <TextField
                select
                label="AI Model"
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                fullWidth
              >
                {availableModels.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.displayName}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Key Name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., My OpenAI Key"
                fullWidth
              />

              <TextField
                label="API Key"
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
                placeholder="Enter the API key"
                fullWidth
                type="password"
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={handleSaveKey}
                  startIcon={<Save />}
                >
                  {editingKey ? 'Update' : 'Save'}
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Context Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => selectedKey && selectedUser && handleOpenEditDialog(selectedUser, selectedKey)}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={() => selectedKey && selectedUser && handleSetActive(selectedUser._id, selectedKey._id)}>
            <Key sx={{ mr: 1 }} />
            Set as Active
          </MenuItem>
          <MenuItem
            onClick={() => selectedKey && selectedUser && handleDeleteKey(selectedUser._id, selectedKey._id)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}