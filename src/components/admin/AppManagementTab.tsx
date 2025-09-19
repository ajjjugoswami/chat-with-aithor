import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
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
  DialogContent,
  DialogActions,
  useMediaQuery,
  Stack,
  useTheme,
  IconButton,
  Fade,
  CircularProgress,
} from "@mui/material";
import { Settings, Refresh, Key, Visibility, VisibilityOff, Close } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchAppManagementData,
  clearError,
  resetInitialized,
  type UserQuota,
} from "../../store/slices/appManagementSlice";
import CustomLoading from '../CustomLoading';

interface UserQuotaGroup {
  user: {
    _id: string;
    email: string;
    name?: string;
  } | null;
  openai: UserQuota | null;
  gemini: UserQuota | null;
}

const API_BASE_URL = "https://aithor-be.vercel.app/api";

const AppManagementTab = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { appKeys, userQuotas, loading, error } = useAppSelector(
    (state) => state.appManagement
  );

  // Component local state for form handling
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");

  // App key form state
  const [selectedProvider, setSelectedProvider] = useState<"openai" | "gemini">(
    "openai"
  );
  const [apiKey, setApiKey] = useState("");
  const [savingKey, setSavingKey] = useState(false);
  // Edit key dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editKeyId, setEditKeyId] = useState<string | null>(null);
  const [editKeyValue, setEditKeyValue] = useState("");
  const [showCurrentKey, setShowCurrentKey] = useState(false);
  const [showNewKey, setShowNewKey] = useState(false);

  // App key reveal states
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  // Reset quota dialog
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<UserQuota | null>(null);

  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Theme-aware colors
  const cardBgColor =
    theme.palette.mode === "light" ? "background.paper" : "grey.900";
  const sectionBgColor =
    theme.palette.mode === "light" ? "grey.50" : "grey.800";
  const borderColor = theme.palette.mode === "light" ? "divider" : "grey.700";

  // Remove initialization logic from AppManagementTab - handled by AppManagementPage
  // const isInitializedRef = useRef(false);
  // useEffect(() => { ... }, [dispatch, initialized]);

  const handleRefresh = () => {
    dispatch(clearError());
    dispatch(resetInitialized());
    dispatch(fetchAppManagementData());
  };

  const handleSaveAppKey = async () => {
    if (!apiKey.trim()) {
      setLocalError("API key is required");
      return;
    }

    setSavingKey(true);
    setLocalError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/admin/app-key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          provider: selectedProvider,
          key: apiKey.trim(),
        }),
      });

      if (response.ok) {
        setSuccess(
          `${
            selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)
          } API key updated successfully`
        );
        setApiKey("");
        // Refresh data after successful save
        dispatch(fetchAppManagementData());
      } else {
        const errorData = await response.json();
        setLocalError(errorData.error || "Failed to save API key");
      }
    } catch (error) {
      setLocalError("Network error occurred");
      console.error("Error saving app key:", error);
    } finally {
      setSavingKey(false);
    }
  };

  const handleToggleAppKey = async (keyId: string) => {
    setLocalError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/admin/app-key/${keyId}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message);
        // Refresh data after successful toggle
        dispatch(fetchAppManagementData());
      } else {
        const errorData = await response.json();
        setLocalError(errorData.error || "Failed to toggle app key status");
      }
    } catch (error) {
      setLocalError("Network error occurred");
      console.error("Error toggling app key:", error);
    }
  };

  const handleResetQuota = async () => {
    if (!selectedQuota || !selectedQuota.userId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/admin/reset-quota/${selectedQuota.userId._id}/${selectedQuota.provider}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSuccess("Quota reset successfully");
        // Refresh data after successful reset
        dispatch(fetchAppManagementData());
        setResetDialogOpen(false);
        setSelectedQuota(null);
      } else {
        const errorData = await response.json();
        setLocalError(errorData.error || "Failed to reset quota");
      }
    } catch (error) {
      setLocalError("Network error occurred");
      console.error("Error resetting quota:", error);
    }
  };

  const getProviderDisplayName = (provider: string) => {
    return provider === "openai" ? "OpenAI" : "Gemini";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <CustomLoading />
      </Box>
    );
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button
            size="small"
            onClick={() => {
              dispatch(clearError());
              handleRefresh();
            }}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      )}
      {/* App Keys Management */}
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1, sm: 2 },
              mb: 3,
            }}
          >
            <Key
              sx={{
                color: "primary.main",
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                fontWeight: 600,
              }}
            >
              App API Keys Management
            </Typography>
          </Box>

          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || localError}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Form Layout */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: { xs: 2, sm: 3 },
              alignItems: "end",
            }}
          >
            <TextField
              select
              fullWidth
              label="Provider"
              value={selectedProvider}
              onChange={(e) =>
                setSelectedProvider(e.target.value as "openai" | "gemini")
              }
              SelectProps={{ native: true }}
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#2a2a2a",
                  '& fieldset': {
                    borderColor: theme.palette.mode === "light" ? "#e0e0e0" : "#404040",
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.mode === "light" ? "#b3b3b3" : "#666",
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.mode === "light" ? "#666" : "#ccc",
                  '&.Mui-focused': {
                    color: '#667eea',
                  },
                },
              }}
            >
              <option value="openai">OpenAI (Free Access)</option>
              <option value="gemini">Gemini (Free Access)</option>
            </TextField>

            <TextField
              fullWidth
              label="API Key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key"
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#2a2a2a",
                  '& fieldset': {
                    borderColor: theme.palette.mode === "light" ? "#e0e0e0" : "#404040",
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.mode === "light" ? "#b3b3b3" : "#666",
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.mode === "light" ? "#666" : "#ccc",
                  '&.Mui-focused': {
                    color: '#667eea',
                  },
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleSaveAppKey}
              disabled={savingKey || !apiKey.trim()}
              startIcon={savingKey ? <CircularProgress size={16} /> : <Key />}
              size={isMobile ? "small" : "medium"}
              sx={{
                height: "fit-content",
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              {savingKey ? "Saving..." : "Save API Key"}
            </Button>
          </Box>

          {/* Current App Keys */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                fontWeight: 600,
                fontSize: { xs: "1rem", sm: "1.125rem" },
              }}
            >
              Current App Keys
            </Typography>

            {isMobile ? (
              // Mobile Card Layout
              <Stack spacing={2}>
                {appKeys.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      No app keys configured
                    </Typography>
                  </Paper>
                ) : (
                  appKeys.map((key) => (
                    <Card
                      key={key._id}
                      variant="outlined"
                      sx={{
                        bgcolor: cardBgColor,
                        borderColor: borderColor,
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                            {getProviderDisplayName(key.provider)}
                          </Typography>
                          <Chip
                            label={key.isActive ? "Active" : "Inactive"}
                            color={key.isActive ? "success" : "error"}
                            size="small"
                          />
                        </Box>
                        
                        {/* API Key Display */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            API Key
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                              fullWidth
                              value={revealedKeys[key._id] 
                                ? (key.key || '')
                                : (key.key || '').replace(/.(?=.{4})/g, '*')
                              }
                              InputProps={{
                                readOnly: true,
                              }}
                              size="small"
                              sx={{
                                '& .MuiInputBase-input': {
                                  fontFamily: 'monospace',
                                  fontSize: '0.75rem',
                                },
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#2a2a2a",
                                  '& fieldset': {
                                    borderColor: theme.palette.mode === "light" ? "#e0e0e0" : "#404040",
                                  },
                                  '&:hover fieldset': {
                                    borderColor: theme.palette.mode === "light" ? "#b3b3b3" : "#666",
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#667eea',
                                  },
                                },
                                '& .MuiInputLabel-root': {
                                  color: theme.palette.mode === "light" ? "#666" : "#ccc",
                                  '&.Mui-focused': {
                                    color: '#667eea',
                                  },
                                },
                              }}
                            />
                            <IconButton
                              onClick={() => setRevealedKeys(prev => ({
                                ...prev,
                                [key._id]: !prev[key._id]
                              }))}
                              size="small"
                              sx={{ flexShrink: 0 }}
                            >
                              {revealedKeys[key._id] ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </Box>
                        </Box>
                        
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Usage Count
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {key.usageCount}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Last Used
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {key.lastUsed
                                ? new Date(key.lastUsed).toLocaleDateString()
                                : "Never"}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant={key.isActive ? "outlined" : "contained"}
                            color={key.isActive ? "error" : "success"}
                            fullWidth
                            onClick={() => handleToggleAppKey(key._id)}
                          >
                            {key.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            fullWidth
                            onClick={() => {
                              setEditKeyId(key._id);
                              setEditKeyValue("");
                              setShowCurrentKey(false);
                              setShowNewKey(false);
                              setEditDialogOpen(true);
                            }}
                          >
                            Edit Key
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Stack>
            ) : (
              // Desktop Table Layout
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Provider</TableCell>
                      <TableCell>API Key</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Usage Count</TableCell>
                      <TableCell>Last Used</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appKeys.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No app keys configured
                        </TableCell>
                      </TableRow>
                    ) : (
                      appKeys.map((key) => (
                        <TableRow key={key._id}>
                          <TableCell>
                            {getProviderDisplayName(key.provider)}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
                              <TextField
                                fullWidth
                                value={revealedKeys[key._id] 
                                  ? (key.key || '')
                                  : (key.key || '').replace(/.(?=.{4})/g, '*')
                                }
                                InputProps={{
                                  readOnly: true,
                                }}
                                size="small"
                                sx={{
                                  '& .MuiInputBase-input': {
                                    fontFamily: 'monospace',
                                    fontSize: '0.75rem',
                                  },
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#2a2a2a",
                                    '& fieldset': {
                                      borderColor: theme.palette.mode === "light" ? "#e0e0e0" : "#404040",
                                    },
                                    '&:hover fieldset': {
                                      borderColor: theme.palette.mode === "light" ? "#b3b3b3" : "#666",
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#667eea',
                                    },
                                  },
                                  '& .MuiInputLabel-root': {
                                    color: theme.palette.mode === "light" ? "#666" : "#ccc",
                                    '&.Mui-focused': {
                                      color: '#667eea',
                                    },
                                  },
                                }}
                              />
                              <IconButton
                                onClick={() => setRevealedKeys(prev => ({
                                  ...prev,
                                  [key._id]: !prev[key._id]
                                }))}
                                size="small"
                                sx={{ flexShrink: 0 }}
                              >
                                {revealedKeys[key._id] ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={key.isActive ? "Active" : "Inactive"}
                              color={key.isActive ? "success" : "error"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{key.usageCount}</TableCell>
                          <TableCell>
                            {key.lastUsed
                              ? new Date(key.lastUsed).toLocaleDateString()
                              : "Never"}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant={key.isActive ? "outlined" : "contained"}
                                color={key.isActive ? "error" : "success"}
                                onClick={() => handleToggleAppKey(key._id)}
                              >
                                {key.isActive ? "Deactivate" : "Activate"}
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setEditKeyId(key._id);
                                  setEditKeyValue("");
                                  setShowCurrentKey(false);
                                  setShowNewKey(false);
                                  setEditDialogOpen(true);
                                }}
                              >
                                Edit
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
          {/* Edit Key Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#1a1a1a",
                color: theme.palette.mode === "light" ? "#000000" : "white",
                borderRadius: "20px",
                border: "none",
                boxShadow:
                  theme.palette.mode === "light"
                    ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    : "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
                overflow: "hidden",
                background:
                  theme.palette.mode === "light"
                    ? "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
                    : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                minHeight: "500px",
                maxHeight: "90vh",
              },
            }}
          >
            {/* Custom Header */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                p: 3,
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
                      gap: 2,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
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
                        flexShrink: 0,
                      }}
                    >
                      <Key />
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
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: theme.palette.mode === "light" ? "#1a1a1a" : "white",
                          mb: 0.25,
                          lineHeight: 1.2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Edit API Key
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.mode === "light" ? "#666" : "#ccc",
                          fontWeight: 500,
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {getProviderDisplayName(appKeys.find(k => k._id === editKeyId)?.provider || '')}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => setEditDialogOpen(false)}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                      "&:active": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                      alignSelf: "flex-start",
                      ml: 1,
                      flexShrink: 0,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <Close
                      sx={{
                        color: theme.palette.mode === "light" ? "#666" : "white",
                        fontSize: "24px",
                      }}
                    />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <DialogContent sx={{ p: 3, flex: 1 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Current API Key
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    value={showCurrentKey 
                      ? (appKeys.find(k => k._id === editKeyId)?.key || '')
                      : (appKeys.find(k => k._id === editKeyId)?.key || '').replace(/.(?=.{4})/g, '*')
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                    size="small"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#2a2a2a",
                        '& fieldset': {
                          borderColor: theme.palette.mode === "light" ? "#e0e0e0" : "#404040",
                        },
                        '&:hover fieldset': {
                          borderColor: theme.palette.mode === "light" ? "#b3b3b3" : "#666",
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: theme.palette.mode === "light" ? "#666" : "#ccc",
                        '&.Mui-focused': {
                          color: '#667eea',
                        },
                      },
                    }}
                  />
                  <IconButton
                    onClick={() => setShowCurrentKey(!showCurrentKey)}
                    size="small"
                    sx={{ flexShrink: 0 }}
                  >
                    {showCurrentKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {showCurrentKey ? 'Key is visible' : 'Key is masked for security'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  New API Key
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Enter new API key"
                    type={showNewKey ? "text" : "password"}
                    value={editKeyValue}
                    onChange={(e) => setEditKeyValue(e.target.value)}
                    placeholder="Enter new API key"
                    size="small"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#2a2a2a",
                        '& fieldset': {
                          borderColor: theme.palette.mode === "light" ? "#e0e0e0" : "#404040",
                        },
                        '&:hover fieldset': {
                          borderColor: theme.palette.mode === "light" ? "#b3b3b3" : "#666",
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: theme.palette.mode === "light" ? "#666" : "#ccc",
                        '&.Mui-focused': {
                          color: '#667eea',
                        },
                      },
                    }}
                  />
                  <IconButton
                    onClick={() => setShowNewKey(!showNewKey)}
                    size="small"
                    sx={{ flexShrink: 0 }}
                  >
                    {showNewKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {showNewKey ? 'Key is visible as you type' : 'Key is hidden for security'}
                </Typography>
              </Box>

              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Warning:</strong> Updating this key will replace the current API key. 
                  Make sure the new key is valid and has the necessary permissions.
                </Typography>
              </Alert>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 2 }}>
              <Button 
                onClick={() => {
                  setEditDialogOpen(false);
                  setEditKeyId(null);
                  setEditKeyValue("");
                  setShowCurrentKey(false);
                  setShowNewKey(false);
                }}
                sx={{
                  borderColor: "#667eea",
                  color: "#667eea",
                  borderWidth: "1.5px",
                  borderRadius: 2,
                  py: 1.25,
                  px: 2.5,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textTransform: "none",
                  letterSpacing: "0.025em",
                  transition: "all 0.3s ease",
                  backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#333333",
                  "&:hover": {
                    borderColor: "#667eea",
                    backgroundColor: "#667eea08",
                    boxShadow: "0 4px 12px #667eea20",
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "0 2px 6px #667eea15",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!editKeyId || !editKeyValue.trim()) return;
                  setSavingKey(true);
                  setLocalError("");
                  setSuccess("");
                  try {
                    const token = localStorage.getItem("token");
                    const response = await fetch(
                      `${API_BASE_URL}/admin/app-key`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ 
                          provider: appKeys.find(k => k._id === editKeyId)?.provider,
                          key: editKeyValue.trim() 
                        }),
                      }
                    );
                    if (response.ok) {
                      setSuccess("API key updated successfully");
                      setEditDialogOpen(false);
                      setEditKeyId(null);
                      setEditKeyValue("");
                      setShowCurrentKey(false);
                      setShowNewKey(false);
                      // Refresh data after successful update
                      dispatch(fetchAppManagementData());
                    } else {
                      const errorData = await response.json();
                      setLocalError(
                        errorData.error || "Failed to update API key"
                      );
                    }
                  } catch (error) {
                    setLocalError("Network error occurred");
                    console.error("Error updating app key:", error);
                  } finally {
                    setSavingKey(false);
                  }
                }}
                variant="contained"
                disabled={savingKey || !editKeyValue.trim()}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: 2,
                  py: 1.25,
                  px: 2.5,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textTransform: "none",
                  letterSpacing: "0.025em",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "0 2px 10px rgba(102, 126, 234, 0.4)",
                  },
                  "&:disabled": {
                    background: theme.palette.mode === "light" ? "#e0e0e0" : "#555555",
                    color: theme.palette.mode === "light" ? "#999999" : "#cccccc",
                    boxShadow: "none",
                    transform: "none",
                  },
                }}
                startIcon={savingKey ? <CircularProgress size={16} /> : null}
              >
                {savingKey ? "Updating..." : "Update Key"}
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>

      {/* User Quotas */}
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 2, sm: 0 },
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Settings
                sx={{
                  color: "primary.main",
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  fontWeight: 600,
                }}
              >
                User Quota Usage
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
              size={isMobile ? "small" : "medium"}
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 2, sm: 3 },
                alignSelf: { xs: "flex-start", sm: "auto" },
              }}
            >
              {isMobile ? "Refresh" : "Refresh Data"}
            </Button>
          </Box>

          {isMobile ? (
            // Mobile Card Layout for User Quotas
            <Stack spacing={2}>
              {userQuotas.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No quota data available
                  </Typography>
                </Paper>
              ) : (
                Object.values(
                  userQuotas
                    .filter(
                      (quota) =>
                        quota.provider === "openai" ||
                        quota.provider === "gemini"
                    )
                    .reduce((acc, quota) => {
                      const userId = quota.userId?._id || "unknown";
                      if (!acc[userId]) {
                        acc[userId] = {
                          user: quota.userId,
                          openai: null,
                          gemini: null,
                        };
                      }
                      if (quota.provider === "openai") {
                        acc[userId].openai = quota;
                      } else if (quota.provider === "gemini") {
                        acc[userId].gemini = quota;
                      }
                      return acc;
                    }, {} as Record<string, UserQuotaGroup>)
                ).map((userGroup: UserQuotaGroup) => (
                  <Card
                    key={userGroup.user?._id || "unknown"}
                    variant="outlined"
                    sx={{
                      bgcolor: cardBgColor,
                      borderColor: borderColor,
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontSize: "1rem", fontWeight: 600 }}
                        >
                          {userGroup.user?.name ||
                            userGroup.user?.email ||
                            "Unknown User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {userGroup.user?.email || "No email"}
                        </Typography>
                      </Box>

                      {/* OpenAI Section */}
                      <Box
                        sx={{
                          mb: 2,
                          p: 1.5,
                          bgcolor: sectionBgColor,
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            OpenAI
                          </Typography>
                          {userGroup.openai ? (
                            <Chip
                              label={
                                userGroup.openai.usedCalls >=
                                userGroup.openai.maxFreeCalls
                                  ? "Exceeded"
                                  : "Active"
                              }
                              color={
                                userGroup.openai.usedCalls >=
                                userGroup.openai.maxFreeCalls
                                  ? "error"
                                  : "success"
                              }
                              size="small"
                            />
                          ) : (
                            <Chip
                              label="No Data"
                              color="default"
                              size="small"
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Used:{" "}
                          {userGroup.openai
                            ? `${userGroup.openai.usedCalls}/${userGroup.openai.maxFreeCalls}`
                            : "N/A"}
                        </Typography>
                        {userGroup.openai && (
                          <Button
                            size="small"
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 1 }}
                            onClick={() => {
                              setSelectedQuota(userGroup.openai);
                              setResetDialogOpen(true);
                            }}
                          >
                            Reset OpenAI Quota
                          </Button>
                        )}
                      </Box>

                      {/* Gemini Section */}
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: sectionBgColor,
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Gemini
                          </Typography>
                          {userGroup.gemini ? (
                            <Chip
                              label={
                                userGroup.gemini.usedCalls >=
                                userGroup.gemini.maxFreeCalls
                                  ? "Exceeded"
                                  : "Active"
                              }
                              color={
                                userGroup.gemini.usedCalls >=
                                userGroup.gemini.maxFreeCalls
                                  ? "error"
                                  : "success"
                              }
                              size="small"
                            />
                          ) : (
                            <Chip
                              label="No Data"
                              color="default"
                              size="small"
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Used:{" "}
                          {userGroup.gemini
                            ? `${userGroup.gemini.usedCalls}/${userGroup.gemini.maxFreeCalls}`
                            : "N/A"}
                        </Typography>
                        {userGroup.gemini && (
                          <Button
                            size="small"
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 1 }}
                            onClick={() => {
                              setSelectedQuota(userGroup.gemini);
                              setResetDialogOpen(true);
                            }}
                          >
                            Reset Gemini Quota
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          ) : (
            // Desktop Table Layout
            <TableContainer component={Paper} variant="outlined">
              <Table size={isSmallScreen ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>OpenAI Used/Free</TableCell>
                    <TableCell>OpenAI Status</TableCell>
                    <TableCell>Gemini Used/Free</TableCell>
                    <TableCell>Gemini Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userQuotas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No quota data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Group quotas by user
                    Object.values(
                      userQuotas
                        .filter(
                          (quota) =>
                            quota.provider === "openai" ||
                            quota.provider === "gemini"
                        )
                        .reduce((acc, quota) => {
                          const userId = quota.userId?._id || "unknown";
                          if (!acc[userId]) {
                            acc[userId] = {
                              user: quota.userId,
                              openai: null,
                              gemini: null,
                            };
                          }
                          if (quota.provider === "openai") {
                            acc[userId].openai = quota;
                          } else if (quota.provider === "gemini") {
                            acc[userId].gemini = quota;
                          }
                          return acc;
                        }, {} as Record<string, UserQuotaGroup>)
                    ).map((userGroup: UserQuotaGroup) => (
                      <TableRow key={userGroup.user?._id || "unknown"}>
                        <TableCell>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {userGroup.user?.name ||
                                userGroup.user?.email ||
                                "Unknown User"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {userGroup.user?.email || "No email"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {userGroup.openai
                            ? `${userGroup.openai.usedCalls}/${userGroup.openai.maxFreeCalls}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {userGroup.openai ? (
                            <Chip
                              label={
                                userGroup.openai.usedCalls >=
                                userGroup.openai.maxFreeCalls
                                  ? "Exceeded"
                                  : "Active"
                              }
                              color={
                                userGroup.openai.usedCalls >=
                                userGroup.openai.maxFreeCalls
                                  ? "error"
                                  : "success"
                              }
                              size="small"
                            />
                          ) : (
                            <Chip
                              label="No Data"
                              color="default"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {userGroup.gemini
                            ? `${userGroup.gemini.usedCalls}/${userGroup.gemini.maxFreeCalls}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {userGroup.gemini ? (
                            <Chip
                              label={
                                userGroup.gemini.usedCalls >=
                                userGroup.gemini.maxFreeCalls
                                  ? "Exceeded"
                                  : "Active"
                              }
                              color={
                                userGroup.gemini.usedCalls >=
                                userGroup.gemini.maxFreeCalls
                                  ? "error"
                                  : "success"
                              }
                              size="small"
                            />
                          ) : (
                            <Chip
                              label="No Data"
                              color="default"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                          >
                            {userGroup.openai && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setSelectedQuota(userGroup.openai);
                                  setResetDialogOpen(true);
                                }}
                              >
                                Reset OpenAI
                              </Button>
                            )}
                            {userGroup.gemini && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setSelectedQuota(userGroup.gemini);
                                  setResetDialogOpen(true);
                                }}
                              >
                                Reset Gemini
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Reset Quota Dialog */}
      <Dialog 
        open={resetDialogOpen} 
        onClose={() => setResetDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#1a1a1a",
            color: theme.palette.mode === "light" ? "#000000" : "white",
            borderRadius: "20px",
            border: "none",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
            overflow: "hidden",
            background:
              theme.palette.mode === "light"
                ? "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
                : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            minHeight: "300px",
            maxHeight: "90vh",
          },
        }}
      >
        {/* Custom Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
            p: 3,
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
                  gap: 2,
                  flex: 1,
                  minWidth: 0,
                }}
              >
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
                    flexShrink: 0,
                  }}
                >
                  <Refresh />
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
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.mode === "light" ? "#1a1a1a" : "white",
                      mb: 0.25,
                      lineHeight: 1.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Reset User Quota
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.mode === "light" ? "#666" : "#ccc",
                      fontWeight: 500,
                      lineHeight: 1.3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {getProviderDisplayName(selectedQuota?.provider || '')}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => setResetDialogOpen(false)}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                  "&:active": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                  alignSelf: "flex-start",
                  ml: 1,
                  flexShrink: 0,
                  width: 48,
                  height: 48,
                }}
              >
                <Close
                  sx={{
                    color: theme.palette.mode === "light" ? "#666" : "white",
                    fontSize: "24px",
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <DialogContent sx={{ p: 3, flex: 1 }}>
          <Typography
            sx={{
              color: theme.palette.mode === "light" ? "#1a1a1a" : "white",
              fontSize: "1rem",
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            Are you sure you want to reset the quota for{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#ff6b6b" }}>
              {selectedQuota?.userId?.name ||
                selectedQuota?.userId?.email ||
                "Unknown User"}
            </Box>
            ? This will reset their{" "}
            <Box component="span" sx={{ fontWeight: 600 }}>
              {getProviderDisplayName(selectedQuota?.provider || "")}
            </Box>{" "}
            usage to 0.
          </Typography>
          <Alert 
            severity="warning" 
            sx={{ 
              mt: 2,
              backgroundColor: theme.palette.mode === "light" ? "#fff3cd" : "#2d1b1b",
              color: theme.palette.mode === "light" ? "#856404" : "#d4a574",
              borderColor: theme.palette.mode === "light" ? "#ffeaa7" : "#5d4037",
            }}
          >
            <Typography variant="body2">
              <strong>Warning:</strong> This action cannot be undone. The user's quota will be permanently reset.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 2 }}>
          <Button 
            onClick={() => setResetDialogOpen(false)}
            sx={{
              borderColor: "#ff6b6b",
              color: "#ff6b6b",
              borderWidth: "1.5px",
              borderRadius: 2,
              py: 1.25,
              px: 2.5,
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "none",
              letterSpacing: "0.025em",
              transition: "all 0.3s ease",
              backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#333333",
              "&:hover": {
                borderColor: "#ff6b6b",
                backgroundColor: "#ff6b6b08",
                boxShadow: "0 4px 12px #ff6b6b20",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
                boxShadow: "0 2px 6px #ff6b6b15",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleResetQuota}
            sx={{
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
              color: "white",
              borderRadius: 2,
              py: 1.25,
              px: 2.5,
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "none",
              letterSpacing: "0.025em",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(255, 107, 107, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #e55a5a 0%, #d64a1a 100%)",
                boxShadow: "0 6px 20px rgba(255, 107, 107, 0.6)",
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(0)",
                boxShadow: "0 2px 10px rgba(255, 107, 107, 0.4)",
              },
            }}
          >
            Reset Quota
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppManagementTab;
