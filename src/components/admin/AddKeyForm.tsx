import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
} from '@mui/material';
import { Save, Clear } from '@mui/icons-material';
import type { UserWithKeys } from './types';

interface AddKeyFormProps {
  users: UserWithKeys[];
  selectedUser: UserWithKeys | null;
  onUserChange: (user: UserWithKeys | null) => void;
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
  keyName: string;
  onKeyNameChange: (name: string) => void;
  keyValue: string;
  onKeyValueChange: (value: string) => void;
  onSave: () => void;
  onClear: () => void;
  availableProviders: { id: string; displayName: string }[];
  loading?: boolean;
}

export default function AddKeyForm({
  users,
  selectedUser,
  onUserChange,
  selectedProvider,
  onProviderChange,
  keyName,
  onKeyNameChange,
  keyValue,
  onKeyValueChange,
  onSave,
  onClear,
  availableProviders,
  loading = false,
}: AddKeyFormProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: (theme) => theme.shadows[4],
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Save sx={{ fontSize: '1.5rem' }} />
          Add API Key for User
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 4,
            color: 'text.secondary',
            fontSize: '0.95rem',
          }}
        >
          Select a user and add an API key for their account. The key will be securely stored and managed.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            select
            label="Select User"
            value={selectedUser?._id || ''}
            onChange={(e) => {
              const user = users.find(u => u._id === e.target.value);
              onUserChange(user || null);
            }}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          >
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {user.name || user.email}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                    {user.email}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="AI Provider"
            value={selectedProvider}
            onChange={(e) => onProviderChange(e.target.value)}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          >
            {availableProviders.map((provider) => (
              <MenuItem key={provider.id} value={provider.id}>
                {provider.displayName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Key Name"
            value={keyName}
            onChange={(e) => onKeyNameChange(e.target.value)}
            placeholder="e.g., My Gemini Key 1, OpenAI Backup"
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            label="API Key"
            value={keyValue}
            onChange={(e) => onKeyValueChange(e.target.value)}
            placeholder="Enter the API key"
            fullWidth
            required
            type="password"
            multiline
            rows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontFamily: 'monospace',
                '& textarea': {
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                },
              },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              mt: 2,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={onClear}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                fontWeight: 500,
              }}
            >
              Clear Form
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={onSave}
              disabled={!selectedUser || !selectedProvider || !keyName.trim() || !keyValue.trim() || loading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                fontWeight: 500,
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {loading ? 'Saving...' : 'Save Key'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}