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
  useMediaQuery,
  useTheme as useMuiTheme,
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
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

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
  };

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

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    key: APIKeyEntry
  ) => {
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
      maxWidth={isMobile ? false : "md"}
      fullWidth={!isMobile}
      fullScreen={isMobile}
      TransitionComponent={Slide}
      slotProps={{
        transition: { direction: "up" },
      }}
      PaperProps={{
        sx: {
          bgcolor: mode === "light" ? "#ffffff" : "#1a1a1a",
          color: mode === "light" ? "#000000" : "white",
          borderRadius: isMobile ? "0px" : "20px",
          border: "none",
          boxShadow:
            mode === "light"
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
          overflow: "hidden",
          background:
            mode === "light"
              ? "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
              : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          minHeight: isMobile ? "100vh" : "600px",
          maxHeight: isMobile ? "100vh" : "90vh",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: model?.color
            ? `linear-gradient(135deg, ${model.color}15 0%, ${model.color}25 100%)`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          p: isMobile ? 2 : 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 1 : 2,
                flex: 1,
                minWidth: 0,
                maxWidth: isMobile ? "calc(100% - 56px)" : "none", // Leave space for close button
              }}
            >
              <Box
                sx={{
                  width: isMobile ? 32 : 48,
                  height: isMobile ? 32 : 48,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: isMobile ? "16px" : "24px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                  flexShrink: 0,
                }}
              >
                {model?.icon || <Key />}
              </Box>
              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    fontWeight: 700,
                    color: mode === "light" ? "#1a1a1a" : "white",
                    mb: 0.25,
                    fontSize: isMobile ? "0.95rem" : undefined,
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Manage API Keys
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: mode === "light" ? "#666" : "#ccc",
                    fontWeight: 500,
                    fontSize: isMobile ? "0.75rem" : undefined,
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {model ? getProviderDisplayName(model.id) : ""}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.1)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                "&:active": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                alignSelf: "flex-start",
                mt: isMobile ? 0 : 0,
                ml: 1,
                flexShrink: 0,
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
              }}
            >
              <Close
                sx={{
                  color: mode === "light" ? "#666" : "white",
                  fontSize: isMobile ? "20px" : "24px"
                }}
              />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: isMobile ? 2 : 3, flex: 1 }}>
        {/* Existing Keys List */}
        {apiKeys.length > 0 && (
          <Box sx={{ mb: isMobile ? 2 : 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "space-between",
                mb: 2,
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 0,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: mode === "light" ? "#1a1a1a" : "white",
                  fontWeight: 600,
                  fontSize: isMobile ? "1.1rem" : undefined,
                }}
              >
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
                    borderWidth: "1.5px",
                    borderRadius: 2,
                    py: isMobile ? 1.25 : 1,
                    px: isMobile ? 2 : 2.5,
                    fontSize: isMobile ? "0.9rem" : "0.875rem",
                    fontWeight: 600,
                    textTransform: "none",
                    letterSpacing: "0.025em",
                    transition: "all 0.3s ease",
                    backgroundColor: mode === "light" ? "#ffffff" : "#333333",
                    "&:hover": {
                      borderColor: model?.color || "#667eea",
                      backgroundColor: model?.color
                        ? `${model.color}08`
                        : "#667eea08",
                      boxShadow: `0 4px 12px ${model?.color || "#667eea"}20`,
                      transform: "translateY(-1px)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                      boxShadow: `0 2px 6px ${model?.color || "#667eea"}15`,
                    },
                    alignSelf: isMobile ? "stretch" : "auto",
                  }}
                >
                   Add Key
                </Button>
              )}
            </Box>

            <List
              sx={{
                bgcolor: mode === "light" ? "#f8f9fa" : "#2a2a2a",
                borderRadius: 2,
                p: 0,
                overflow: "hidden",
              }}
            >
              {apiKeys.map((key, index) => (
                <Box key={key.id}>
                  <ListItem
                    sx={{
                      py: isMobile ? 1.5 : 2.5,
                      px: isMobile ? 2 : 3,
                      alignItems: "flex-start",
                      minHeight: isMobile ? 72 : "auto",
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: mode === "light" ? "#1a1a1a" : "white",
                              fontWeight: 600,
                              fontSize: isMobile ? "0.95rem" : undefined,
                              flex: 1,
                              minWidth: 0,
                              lineHeight: 1.3,
                            }}
                          >
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
                                fontSize: isMobile ? "0.7rem" : undefined,
                                height: isMobile ? 22 : "auto",
                                marginRight:"20px",
                                "& .MuiChip-label": {
                                  px: isMobile ? 1 : 1.5,
                                },
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.25 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: mode === "light" ? "#666" : "#ccc",
                              fontFamily: "monospace",
                              fontSize: isMobile ? "0.75rem" : "0.9rem",
                              mb: 0.5,
                              wordBreak: "break-all",
                            }}
                          >
                            {key.key.substring(0, isMobile ? 12 : 20)}...
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: mode === "light" ? "#888" : "#999",
                              display: "block",
                              fontSize: isMobile ? "0.65rem" : undefined,
                              lineHeight: 1.4,
                            }}
                          >
                            Added {new Date(key.addedAt).toLocaleDateString()} •
                            Used {key.usageCount || 0} times
                            {key.lastUsed &&
                              ` • Last used ${new Date(
                                key.lastUsed
                              ).toLocaleDateString()}`}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction
                      sx={{
                        right: isMobile ? 12 : 16,
                        top: isMobile ? 12 : 16,
                        transform: "none",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: isMobile ? 0.5 : 1,
                          flexDirection: "column",
                        }}
                      >
                        <IconButton
                          edge="end"
                          onClick={() => handleSetActive(key.id)}
                          disabled={key.isDefault}
                          sx={{
                            color: key.isDefault
                              ? model?.color || "#667eea"
                              : mode === "light"
                              ? "#666"
                              : "#ccc",
                            p: isMobile ? 0.75 : 1,
                            "&:hover": {
                              bgcolor: mode === "light" ? "#f0f0f0" : "#3a3a3a",
                            },
                            "&:active": {
                              bgcolor: mode === "light" ? "#e0e0e0" : "#4a4a4a",
                            },
                          }}
                        >
                          {key.isDefault ? (
                            <CheckCircle
                              sx={{
                                color: key.isDefault
                                  ? model?.color || "#667eea"
                                  : mode === "light"
                                  ? "#666"
                                  : "#ccc",
                                fontSize: isMobile ? "18px" : "24px",
                              }}
                            />
                          ) : (
                            <RadioButtonUnchecked
                              sx={{
                                fontSize: isMobile ? "18px" : "24px",
                              }}
                            />
                          )}
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={(e) => handleMenuOpen(e, key)}
                          sx={{
                            color: mode === "light" ? "#666" : "#ccc",
                            p: isMobile ? 0.75 : 1,
                            "&:hover": {
                              bgcolor: mode === "light" ? "#f0f0f0" : "#3a3a3a",
                            },
                            "&:active": {
                              bgcolor: mode === "light" ? "#e0e0e0" : "#4a4a4a",
                            },
                          }}
                        >
                          <MoreVert
                            sx={{
                              fontSize: isMobile ? "18px" : "24px"
                            }}
                          />
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
          <Box
            sx={{
              bgcolor: mode === "light"
                ? "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)"
                : "linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)",
              borderRadius: 3,
              p: isMobile ? 2 : 2.5,
              border: `1px solid ${mode === "light" ? "#e1e5e9" : "#404040"}`,
              mx: isMobile ? -0.5 : 0,
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 2.5,
                alignItems: isMobile ? "stretch" : "flex-start",
              }}
            >
              <TextField
                fullWidth={!isMobile}
                label="Key Name"
                value={newKeyName}
                onChange={(e) => {
                  setNewKeyName(e.target.value);
                  setError("");
                }}
                placeholder="e.g., My Primary OpenAI Key"
                sx={{
                  flex: isMobile ? 1 : 1,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: mode === "light" ? "#ffffff" : "#333333",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "& fieldset": {
                      borderColor: model?.color || "#667eea",
                      borderWidth: "1.5px",
                    },
                    "&:hover fieldset": {
                      borderColor: model?.color || "#667eea",
                      borderWidth: "2px",
                      boxShadow: `0 0 0 2px ${model?.color || "#667eea"}15`,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: model?.color || "#667eea",
                      borderWidth: "2px",
                      boxShadow: `0 0 0 4px ${model?.color || "#667eea"}20`,
                    },
                    "&.Mui-focused": {
                      backgroundColor: mode === "light" ? "#fefefe" : "#383838",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: mode === "light" ? "#6b7280" : "#cccccc",
                    fontWeight: 500,
                    fontSize: isMobile ? "0.85rem" : "0.875rem",
                    "&.Mui-focused": {
                      color: model?.color || "#667eea",
                      fontWeight: 600,
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: isMobile ? "16px" : "14px",
                    fontWeight: 500,
                    color: mode === "light" ? "#1f2937" : "#ffffff",
                    "&::placeholder": {
                      color: mode === "light" ? "#9ca3af" : "#888888",
                      opacity: 0.8,
                    },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: isMobile ? "0.85rem" : "0.875rem",
                  },
                }}
              />

              <TextField
                fullWidth={!isMobile}
                label="API Key"
                type={showPassword ? "text" : "password"}
                value={newApiKey}
                onChange={(e) => {
                  setNewApiKey(e.target.value);
                  setError("");
                }}
                error={!!error}
                helperText={
                  error ||
                  `Enter your ${model ? getProviderDisplayName(model.id) : ""} API key`
                }
                sx={{
                  flex: isMobile ? 1 : 1,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: mode === "light" ? "#ffffff" : "#333333",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "& fieldset": {
                      borderColor: model?.color || "#667eea",
                      borderWidth: "1.5px",
                    },
                    "&:hover fieldset": {
                      borderColor: model?.color || "#667eea",
                      borderWidth: "2px",
                      boxShadow: `0 0 0 2px ${model?.color || "#667eea"}15`,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: model?.color || "#667eea",
                      borderWidth: "2px",
                      boxShadow: `0 0 0 4px ${model?.color || "#667eea"}20`,
                    },
                    "&.Mui-focused": {
                      backgroundColor: mode === "light" ? "#fefefe" : "#383838",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: mode === "light" ? "#6b7280" : "#cccccc",
                    fontWeight: 500,
                    fontSize: isMobile ? "0.85rem" : "0.875rem",
                    "&.Mui-focused": {
                      color: model?.color || "#667eea",
                      fontWeight: 600,
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: isMobile ? "16px" : "14px",
                    fontWeight: 500,
                    fontFamily: "monospace",
                    color: mode === "light" ? "#1f2937" : "#ffffff",
                    "&::placeholder": {
                      color: mode === "light" ? "#9ca3af" : "#888888",
                      opacity: 0.8,
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: isMobile ? "0.7rem" : "0.75rem",
                    marginTop: isMobile ? 0.5 : 0.25,
                    fontWeight: 500,
                    color: error
                      ? "#ef4444"
                      : mode === "light"
                      ? "#6b7280"
                      : "#cccccc",
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: isMobile ? "0.85rem" : "0.875rem",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{
                        color: mode === "light" ? "#6b7280" : "#cccccc",
                        p: isMobile ? 0.75 : 0.5,
                        borderRadius: 1.5,
                        marginRight: "1px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: mode === "light" ? "#f3f4f6" : "#404040",
                          color: model?.color || "#667eea",
                          transform: "scale(1.05)",
                        },
                        "&:active": {
                          transform: "scale(0.95)",
                        },
                      }}
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ fontSize: isMobile ? "16px" : "18px" }} />
                      ) : (
                        <Visibility sx={{ fontSize: isMobile ? "16px" : "18px" }} />
                      )}
                    </IconButton>
                  ),
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: isMobile ? 1.5 : 2,
                flexDirection: "row",
                justifyContent: "flex-start",
                mt: isMobile ? 2.5 : 3,
                "& > button": {
                  width: isMobile ? "auto" : "150px",
                  py: isMobile ? 1 : 0.75,
                  px: isMobile ? 2 : 1.5,
                  fontSize: isMobile ? "0.85rem" : "0.8rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  letterSpacing: "0.025em",
                  transition: "all 0.3s ease",
                  minWidth: "auto",
                  "&:first-of-type": {
                    mr: isMobile ? 0 : 1,
                  },
                }
              }}
            >
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
                    borderColor: mode === "light" ? "#d1d5db" : "#555555",
                    borderWidth: "1.5px",
                    color: mode === "light" ? "#6b7280" : "#cccccc",
                    backgroundColor: mode === "light" ? "#ffffff" : "#333333",
                    "&:hover": {
                      borderColor: mode === "light" ? "#9ca3af" : "#777777",
                      backgroundColor: mode === "light" ? "#f9fafb" : "#404040",
                      color: mode === "light" ? "#374151" : "#ffffff",
                      transform: "translateY(-1px)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                onClick={editingKey ? handleUpdateKey : handleAddKey}
                sx={{
                  background: model?.color
                    ? `linear-gradient(135deg, ${model.color} 0%, ${model.color}dd 50%, ${model.color} 100%)`
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
                  color: "white",
                  fontWeight: 600,
                  "&:hover": {
                    background: model?.color
                      ? `linear-gradient(135deg, ${model.color}dd 0%, ${model.color} 50%, ${model.color}dd 100%)`
                      : "linear-gradient(135deg, #764ba2 0%, #667eea 50%, #764ba2 100%)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                {editingKey ? "Update" : "Add"}
              </Button>
            </Box>
          </Box>
        )}

        {/* Security Info */}
        <Fade in={true} timeout={800}>
          <Box
            sx={{
              mt: isMobile ? 2 : 3,
              p: isMobile ? 2 : 3,
              bgcolor: mode === "light" ? "#f0f8ff" : "#1a2332",
              borderRadius: "16px",
              border:
                mode === "light" ? "1px solid #e3f2fd" : "1px solid #2a3441",
              mx: isMobile ? -0.5 : 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 1.5 : 2,
                mb: isMobile ? 1.5 : 1,
              }}
            >
              <Security
                sx={{
                  color: model?.color || "#667eea",
                  fontSize: isMobile ? "18px" : "20px",
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  color: mode === "light" ? "#1565c0" : "#90caf9",
                  fontWeight: 600,
                  fontSize: isMobile ? "0.85rem" : undefined,
                  lineHeight: 1.3,
                }}
              >
                Security & Key Management
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: mode === "light" ? "#1976d2" : "#bbdefb",
                lineHeight: 1.6,
                fontSize: isMobile ? "0.8rem" : undefined,
                "& br": {
                  display: isMobile ? "none" : "auto",
                },
              }}
            >
              {isMobile ? (
                <>
                  • API keys are stored securely in your browser's local storage
                  <br />
                  • You can have multiple keys per model for redundancy
                  <br />
                  • Switch between keys when one reaches quota limits
                  <br />• Usage statistics help you track key performance
                </>
              ) : (
                <>
                  • API keys are stored securely in your browser's local storage
                  <br />
                  • You can have multiple keys per model for redundancy
                  <br />
                  • Switch between keys when one reaches quota limits
                  <br />• Usage statistics help you track key performance
                </>
              )}
            </Typography>
          </Box>
        </Fade>
      </DialogContent>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: isMobile ? "top" : "bottom",
          horizontal: isMobile ? "center" : "right",
        }}
        transformOrigin={{
          vertical: isMobile ? "bottom" : "top",
          horizontal: isMobile ? "center" : "right",
        }}
        PaperProps={{
          sx: {
            bgcolor: mode === "light" ? "#ffffff" : "#2a2a2a",
            color: mode === "light" ? "#000000" : "white",
            borderRadius: isMobile ? 2 : 1,
            minWidth: isMobile ? 180 : 160,
            boxShadow: mode === "light"
              ? "0 8px 32px rgba(0, 0, 0, 0.12)"
              : "0 8px 32px rgba(0, 0, 0, 0.4)",
            border: mode === "light"
              ? "1px solid rgba(0, 0, 0, 0.08)"
              : "1px solid rgba(255, 255, 255, 0.1)",
            "& .MuiMenuItem-root": {
              fontSize: isMobile ? "0.9rem" : "0.875rem",
              py: isMobile ? 1.5 : 1,
              px: isMobile ? 2 : 1.5,
              minHeight: isMobile ? 44 : "auto",
              "&:hover": {
                bgcolor: mode === "light" ? "#f5f5f5" : "#3a3a3a",
              },
              "&:active": {
                bgcolor: mode === "light" ? "#e8e8e8" : "#4a4a4a",
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => selectedKey && handleEditKey(selectedKey)}>
          <Edit sx={{ mr: 1.5, fontSize: isMobile ? "20px" : "18px" }} />
          Edit Key
        </MenuItem>
        <MenuItem
          onClick={() => selectedKey && handleDeleteKey(selectedKey.id)}
          sx={{
            color: "#f44336",
            "&:hover": {
              bgcolor: "rgba(244, 67, 54, 0.08)",
            },
          }}
        >
          <Delete sx={{ mr: 1.5, fontSize: isMobile ? "20px" : "18px" }} />
          Delete Key
        </MenuItem>
      </Menu>
    </Dialog>
  );
}
