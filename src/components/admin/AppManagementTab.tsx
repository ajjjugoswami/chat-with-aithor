import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from '@mui/material';
import { Settings, Refresh, Key } from '@mui/icons-material';

interface AppKey {
  _id: string;
  provider: string;
  isActive: boolean;
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
}

interface UserQuota {
  _id: string;
  userId: {
    _id: string;
    email: string;
    name?: string;
  };
  provider: string;
  usedCalls: number;
  maxFreeCalls: number;
  createdAt: Date;
  updatedAt: Date;
}

const API_BASE_URL = 'https://aithor-be.vercel.app/api';

const AppManagementTab = () => {
  const [appKeys, setAppKeys] = useState<AppKey[]>([]);
  const [userQuotas, setUserQuotas] = useState<UserQuota[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // App key form state
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'gemini'>('openai');
  const [apiKey, setApiKey] = useState('');
  const [savingKey, setSavingKey] = useState(false);

  // Reset quota dialog
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<UserQuota | null>(null);

  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  const fetchAppKeys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/app-keys`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppKeys(data);
      }
    } catch (error) {
      console.error('Error fetching app keys:', error);
    }
  };

  const fetchUserQuotas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/user-quotas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserQuotas(data);
      }
    } catch (error) {
      console.error('Error fetching user quotas:', error);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchAppKeys(), fetchUserQuotas()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveAppKey = async () => {
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }

    setSavingKey(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/app-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          provider: selectedProvider,
          key: apiKey.trim(),
        }),
      });

      if (response.ok) {
        setSuccess(`${selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)} API key updated successfully`);
        setApiKey('');
        await fetchAppKeys();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save API key');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error saving app key:', error);
    } finally {
      setSavingKey(false);
    }
  };

  const handleResetQuota = async () => {
    if (!selectedQuota) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/reset-quota/${selectedQuota.userId._id}/${selectedQuota.provider}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess('Quota reset successfully');
        await fetchUserQuotas();
        setResetDialogOpen(false);
        setSelectedQuota(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to reset quota');
      }
    } catch (error) {
      setError('Network error occurred');
            console.error('Error saving app key:', error);

    }
  };

  const getProviderDisplayName = (provider: string) => {
    return provider === 'openai' ? 'OpenAI' : 'Gemini';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* App Keys Management */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Key /> App API Keys Management
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Grid container spacing={3}>
            <Grid  sx={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label="Provider"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as 'openai' | 'gemini')}
                SelectProps={{ native: true }}
              >
                <option value="openai">OpenAI (Free Access)</option>
                <option value="gemini">Gemini (Free Access)</option>
              </TextField>
            </Grid>
            <Grid  sx={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="API Key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API key"
              />
            </Grid>
            <Grid  sx={{ xs: 12, md: 6 }}>
              <Button
                variant="contained"
                onClick={handleSaveAppKey}
                disabled={savingKey || !apiKey.trim()}
                startIcon={savingKey ? <div style={{ width: 20, height: 20 }} /> : <Key />}
              >
                {savingKey ? 'Saving...' : 'Save API Key'}
              </Button>
            </Grid>
          </Grid>

          {/* Current App Keys */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Current App Keys</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Provider</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Usage Count</TableCell>
                    <TableCell>Last Used</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appKeys.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No app keys configured
                      </TableCell>
                    </TableRow>
                  ) : (
                    appKeys.map((key) => (
                      <TableRow key={key._id}>
                        <TableCell>{getProviderDisplayName(key.provider)}</TableCell>
                        <TableCell>
                          <Chip
                            label={key.isActive ? 'Active' : 'Inactive'}
                            color={key.isActive ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{key.usageCount}</TableCell>
                        <TableCell>
                          {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>

      {/* User Quotas */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Settings /> User Quota Usage
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadData}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table size={isSmallScreen ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Used/Free</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userQuotas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No quota data available
                    </TableCell>
                  </TableRow>
                ) : (
                  userQuotas
                    .filter(quota => quota.provider === 'openai' || quota.provider === 'gemini')
                    .map((quota) => (
                    <TableRow key={`${quota.userId._id}-${quota.provider}`}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {quota.userId.name || quota.userId.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {quota.userId.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{getProviderDisplayName(quota.provider)}</TableCell>
                      <TableCell>
                        {quota.usedCalls}/{quota.maxFreeCalls}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={quota.usedCalls >= quota.maxFreeCalls ? 'Exceeded' : 'Active'}
                          color={quota.usedCalls >= quota.maxFreeCalls ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedQuota(quota);
                            setResetDialogOpen(true);
                          }}
                        >
                          Reset
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Reset Quota Dialog */}
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>Reset User Quota</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset the quota for {selectedQuota?.userId.name || selectedQuota?.userId.email}?
            This will reset their {getProviderDisplayName(selectedQuota?.provider || '')} usage to 0.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleResetQuota} variant="contained" color="primary">
            Reset Quota
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppManagementTab;