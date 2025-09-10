import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Fade,
  Slide,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  Close,
  Security,
  Key,
  Visibility,
  VisibilityOff,
  Add,
  MoreVert,
  Edit,
  Delete,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import type { AIModel } from "./AIModelTabs";
import { useTheme } from "../hooks/useTheme";
import {
  getAllAPIKeysForModel,
  addAPIKey,
  removeAPIKey,
  updateAPIKey,
  setActiveAPIKey,
  getProviderDisplayName,
  type APIKeyEntry,
} from "../utils/enhancedApiKeys";

interface EnhancedAPIKeyDialogProps {
  open: boolean;
  onClose: () => void;
  model: AIModel | null;
  onSave?: () => void;
}

export default function EnhancedAPIKeyDialog({
  open,
  onClose,
  model,
  onSave,
}: EnhancedAPIKeyDialogProps) {
  const [apiKeys, setApiKeys] = useState<APIKeyEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const [newKeyName, setNewKeyName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedKey, setSelectedKey] = useState<APIKeyEntry | null>(null);
  const [editingKey, setEditingKey] = useState<APIKeyEntry | null>(null);
  const { mode } = useTheme();

  // Load API keys when dialog opens
  useEffect(() => {
    if (open && model) {
      const keys = getAllAPIKeysForModel(model.id);
      setApiKeys(keys);
      setShowAddForm(keys.length === 0);
    }
  }, [open, model]);

  const handleAddKey = () => {
    if (!newApiKey.trim()) {
      setError("Please enter an API key");
      return;
    }

    if (!newKeyName.trim()) {
      setError("Please enter a name for this API key");
      return;
    }

    if (!model) {
      setError("No model selected");
      return;
    }

    try {
      addAPIKey(model.id, newApiKey.trim(), newKeyName.trim());
      const updatedKeys = getAllAPIKeysForModel(model.id);
      setApiKeys(updatedKeys);
      setNewApiKey("");
      setNewKeyName("");
      setShowAddForm(false);
      setError("");
      onSave?.();
    } catch {
      setError("Failed to add API key");
    }
    }

  const handleUpdateKey = () => {
    if (!editingKey) return;

    if (!newApiKey.trim()) {
      setError("Please enter an API key");
      return;
    }

    if (!newKeyName.trim()) {
      setError("Please enter a name for this API key");
      return;
    }

    try {
      updateAPIKey(editingKey.id, {
        key: newApiKey.trim(),
        name: newKeyName.trim(),
      });
      const updatedKeys = getAllAPIKeysForModel(model!.id);
      setApiKeys(updatedKeys);
      setEditingKey(null);
      setNewApiKey("");
      setNewKeyName("");
      setError("");
      onSave?.();
    } catch {
      setError("Failed to update API key");
    }
  };

  const handleDeleteKey = (keyId: string) => {
    try {
      removeAPIKey(keyId);
      const updatedKeys = getAllAPIKeysForModel(model!.id);
      setApiKeys(updatedKeys);
      onSave?.();
    } catch {
      setError("Failed to delete API key");
    }
    setMenuAnchor(null);
    setSelectedKey(null);
  };

  const handleSetActive = (keyId: string) => {
    try {
      setActiveAPIKey(model!.id, keyId);
      const updatedKeys = getAllAPIKeysForModel(model!.id);
      setApiKeys(updatedKeys);
      onSave?.();
    } catch {
      setError("Failed to set active API key");
    }
    setMenuAnchor(null);
    setSelectedKey(null);
  };

  const handleEditKey = (key: APIKeyEntry) => {
    setEditingKey(key);
    setNewApiKey(key.key);
    setNewKeyName(key.name);
    setShowAddForm(true);
    setMenuAnchor(null);
    setSelectedKey(null);
  };

  const handleClose = () => {
    setNewApiKey("");
    setNewKeyName("");
    setShowAddForm(false);
    setEditingKey(null);
    setError("");
    onClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, key: APIKeyEntry) => {
    setMenuAnchor(event.currentTarget);
    setSelectedKey(key);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedKey(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Slide}
      slotProps={{ 
        transition: { direction: "up" } 
      }}
      PaperProps={{
        sx: {
          bgcolor: mode === 'light' ? "#ffffff" : "#1a1a1a",
          color: mode === 'light' ? "#000000" : "white",
          borderRadius: "20px",
          border: "none",
          boxShadow: mode === 'light' 
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
            : "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
          overflow: "hidden",
          background: mode === 'light' 
            ? "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
            : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          minHeight: "600px",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: model?.color 
            ? `linear-gradient(135deg, ${model.color}15 0%, ${model.color}25 100%)`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          p: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "24px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                }}
              >
                {model?.icon || <Key />}
              </Box>
              <Box>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700,
                  color: mode === 'light' ? "#1a1a1a" : "white",
                  mb: 0.5
                }}>
                  Manage API Keys
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: mode === 'light' ? "#666" : "#ccc",
                  fontWeight: 500
                }}>
                  {model ? getProviderDisplayName(model.id) : ""}
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={handleClose}
              sx={{ 
                bgcolor: "rgba(255, 255, 255, 0.1)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" }
              }}
            >
              <Close sx={{ color: mode === 'light' ? "#666" : "white" }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3, flex: 1 }}>
        {/* Existing Keys List */}
        {apiKeys.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6" sx={{ 
                color: mode === 'light' ? "#1a1a1a" : "white",
                fontWeight: 600
              }}>
                Saved API Keys ({apiKeys.length})
              </Typography>
              {!showAddForm && (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setShowAddForm(true)}
                  sx={{
                    borderColor: model?.color || "#667eea",
                    color: model?.color || "#667eea",
                    "&:hover": {
                      borderColor: model?.color || "#667eea",
                      bgcolor: `${model?.color || "#667eea"}10`,
                    }
                  }}
                >
                  Add Key
                </Button>
              )}
            </Box>

            <List sx={{ bgcolor: mode === 'light' ? "#f8f9fa" : "#2a2a2a", borderRadius: 2 }}>
              {apiKeys.map((key, index) => (
                <Box key={key.id}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ 
                            color: mode === 'light' ? "#1a1a1a" : "white",
                            fontWeight: 600
                          }}>
                            {key.name}
                          </Typography>
                          {key.isDefault && (
                            <Chip
                              label="Active"
                              size="small"
                              color="primary"
                              sx={{
                                bgcolor: model?.color || "#667eea",
                                color: "white",
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ 
                            color: mode === 'light' ? "#666" : "#ccc",
                            fontFamily: "monospace",
                            fontSize: "0.9rem"
                          }}>
                            {key.key.substring(0, 20)}...
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: mode === 'light' ? "#888" : "#999",
                            display: "block",
                            mt: 0.5
                          }}>
                            Added {new Date(key.addedAt).toLocaleDateString()} • 
                            Used {key.usageCount || 0} times
                            {key.lastUsed && ` • Last used ${new Date(key.lastUsed).toLocaleDateString()}`}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton
                          edge="end"
                          onClick={() => handleSetActive(key.id)}
                          disabled={key.isDefault}
                          sx={{ 
                            color: key.isDefault ? (model?.color || "#667eea") : (mode === 'light' ? "#666" : "#ccc")
                          }}
                        >
                          {key.isDefault ? <CheckCircle /> : <RadioButtonUnchecked />}
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={(e) => handleMenuOpen(e, key)}
                          sx={{ color: mode === 'light' ? "#666" : "#ccc" }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < apiKeys.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Box>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <Box sx={{ 
            bgcolor: mode === 'light' ? "#f8f9fa" : "#2a2a2a",
            borderRadius: 2,
            p: 3,
            border: `2px solid ${model?.color || "#667eea"}30`
          }}>
            <Typography variant="h6" sx={{ 
              color: mode === 'light' ? "#1a1a1a" : "white",
              fontWeight: 600,
              mb: 2
            }}>
              {editingKey ? "Edit API Key" : "Add New API Key"}
            </Typography>

            <TextField
              fullWidth
              label="Key Name"
              value={newKeyName}
              onChange={(e) => {
                setNewKeyName(e.target.value);
                setError("");
              }}
              placeholder="e.g., My Primary OpenAI Key, Work Account, Personal Key"
              sx={{ 
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: mode === 'light' ? "#e0e0e0" : "#404040",
                  },
                  "&:hover fieldset": {
                    borderColor: model?.color || "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: model?.color || "#667eea",
                    boxShadow: `0 0 0 3px ${model?.color || "#667eea"}20`,
                  },
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: model?.color || "#667eea",
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="API Key"
              type={showPassword ? "text" : "password"}
              value={newApiKey}
              onChange={(e) => {
                setNewApiKey(e.target.value);
                setError("");
              }}
              error={!!error}
              helperText={error || `Enter your ${model ? getProviderDisplayName(model.id) : ""} API key`}
              sx={{ 
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: mode === 'light' ? "#e0e0e0" : "#404040",
                  },
                  "&:hover fieldset": {
                    borderColor: model?.color || "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: model?.color || "#667eea",
                    boxShadow: `0 0 0 3px ${model?.color || "#667eea"}20`,
                  },
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: model?.color || "#667eea",
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: mode === 'light' ? "#666" : "#ccc" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={editingKey ? handleUpdateKey : handleAddKey}
                sx={{
                  background: model?.color 
                    ? `linear-gradient(135deg, ${model.color} 0%, ${model.color}dd 100%)`
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                {editingKey ? "Update Key" : "Add Key"}
              </Button>
              {apiKeys.length > 0 && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingKey(null);
                    setNewApiKey("");
                    setNewKeyName("");
                    setError("");
                  }}
                  sx={{
                    borderColor: mode === 'light' ? "#ccc" : "#666",
                    color: mode === 'light' ? "#666" : "#ccc",
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* Security Info */}
        <Fade in={true} timeout={800}>
          <Box sx={{ 
            mt: 3, 
            p: 3, 
            bgcolor: mode === 'light' ? "#f0f8ff" : "#1a2332", 
            borderRadius: "16px",
            border: mode === 'light' ? "1px solid #e3f2fd" : "1px solid #2a3441",
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Security sx={{ 
                color: model?.color || "#667eea",
                fontSize: "20px"
              }} />
              <Typography variant="subtitle2" sx={{ 
                color: mode === 'light' ? "#1565c0" : "#90caf9",
                fontWeight: 600
              }}>
                Security & Key Management
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ 
              color: mode === 'light' ? "#1976d2" : "#bbdefb",
              lineHeight: 1.6
            }}>
              • API keys are stored securely in your browser's local storage<br/>
              • You can have multiple keys per model for redundancy<br/>
              • Switch between keys when one reaches quota limits<br/>
              • Usage statistics help you track key performance
            </Typography>
          </Box>
        </Fade>
      </DialogContent>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: mode === 'light' ? "#ffffff" : "#2a2a2a",
            color: mode === 'light' ? "#000000" : "white",
          }
        }}
      >
        <MenuItem onClick={() => selectedKey && handleEditKey(selectedKey)}>
          <Edit sx={{ mr: 1, fontSize: "18px" }} />
          Edit Key
        </MenuItem>
        <MenuItem 
          onClick={() => selectedKey && handleDeleteKey(selectedKey.id)}
          sx={{ color: "#f44336" }}
        >
          <Delete sx={{ mr: 1, fontSize: "18px" }} />
          Delete Key
        </MenuItem>
      </Menu>
    </Dialog>
  );
}
