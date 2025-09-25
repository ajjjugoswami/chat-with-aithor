import {
  Box,
  Typography,
  Switch,
  IconButton,
  Chip,
  Card,
  CardContent,
  Avatar,
  Button,
  LinearProgress,
} from "@mui/material";
import {
  ArrowLeft,
  Zap,
  Key,
  Edit,
  Wifi,
  Lock,
  User,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import type { AIModel } from "./AIModelTabs";
import {
  getActiveAPIKey,
  getAllAPIKeysForModel,
} from "../utils/enhancedApiKeys";
import EnhancedAPIKeyDialog from "./EnhancedAPIKeyDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface SettingsPageProps {
  models: AIModel[];
  onModelToggle: (modelId: string) => void;
  onBack?: () => void;
}

export default function SettingsPage({
  models,
  onModelToggle,
  onBack,
}: SettingsPageProps) {
  const { mode } = useTheme();
  const { user, signOut, quotas } = useAuth();
  const navigate = useNavigate();
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEditAPIKey = (model: AIModel) => {
    setSelectedModel(model);
    setApiKeyDialogOpen(true);
  };

  const handleDialogClose = () => {
    // Trigger a re-render to refresh API key data
    setRefreshKey((prev) => prev + 1);
    setApiKeyDialogOpen(false);
    setSelectedModel(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  return (
    <Box
      sx={{
        height: "100%",
        bgcolor: mode === "light" ? "#ffffff" : "#121212",
        color: mode === "light" ? "#1a1a1a" : "white",
        overflow: "auto",
        p: 3,
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        {onBack && (
          <IconButton
            onClick={onBack}
            sx={{
              color: mode === "light" ? "#1a1a1a" : "white",
              mr: 2,
              "&:hover": { bgcolor: mode === "light" ? "#f3f4f6" : "#1a1a1a" },
              p: 1,
            }}
          >
            <ArrowLeft size={20} />
          </IconButton>
        )}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: mode === "light" ? "#1a1a1a" : "white",
          }}
        >
          Settings
        </Typography>
      </Box>

      {/* User Profile Section */}
      {user && (
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <User size={16} color="#8b5cf6" />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: mode === "light" ? "#1a1a1a" : "white",
                fontWeight: 600,
                fontSize: "1.1rem",
              }}
            >
              User Profile
            </Typography>
          </Box>

          <Card
            sx={{
              bgcolor: mode === "light" ? "#ffffff" : "#0e0e0e",
              border: "none",
              borderRadius: 3,
              boxShadow:
                mode === "light"
                  ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  src={user.picture}
                  alt={user.name}
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 3,
                    border: "2px solid #8b5cf6",
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: mode === "light" ? "#1a1a1a" : "white",
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: mode === "light" ? "#6b7280" : "#9ca3af",
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Box>

              {/* Quota Information */}
              {quotas && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: mode === "light" ? "#1a1a1a" : "white",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Free Quotas
                  </Typography>

                  {/* OpenAI Quota */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: mode === "light" ? "#1a1a1a" : "white",
                          fontWeight: 500,
                        }}
                      >
                        OpenAI
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: mode === "light" ? "#6b7280" : "#9ca3af",
                        }}
                      >
                        {quotas.openai.remainingCalls}/
                        {quotas.openai.maxFreeCalls}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (quotas.openai.usedCalls / quotas.openai.maxFreeCalls) *
                        100
                      }
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          mode === "light"
                            ? "rgba(0, 0, 0, 0.1)"
                            : "rgba(255, 255, 255, 0.1)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor:
                            quotas.openai.remainingCalls > 0
                              ? "#10b981"
                              : "#ef4444",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  {/* Gemini Quota */}
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: mode === "light" ? "#1a1a1a" : "white",
                          fontWeight: 500,
                        }}
                      >
                        Gemini
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: mode === "light" ? "#6b7280" : "#9ca3af",
                        }}
                      >
                        {quotas.gemini.remainingCalls}/
                        {quotas.gemini.maxFreeCalls}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (quotas.gemini.usedCalls / quotas.gemini.maxFreeCalls) *
                        100
                      }
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          mode === "light"
                            ? "rgba(0, 0, 0, 0.1)"
                            : "rgba(255, 255, 255, 0.1)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor:
                            quotas.gemini.remainingCalls > 0
                              ? "#10b981"
                              : "#ef4444",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="outlined"
                  startIcon={<Lock size={16} />}
                  onClick={() => setChangePasswordDialogOpen(true)}
                  sx={{
                    color: mode === "light" ? "#6b7280" : "#9ca3af",
                    borderColor: mode === "light" ? "#d1d5db" : "#374151",
                    "&:hover": {
                      borderColor: mode === "light" ? "#9ca3af" : "#6b7280",
                      bgcolor:
                        mode === "light"
                          ? "rgba(107, 114, 128, 0.1)"
                          : "rgba(156, 163, 175, 0.1)",
                    },
                  }}
                >
                  Change Password
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LogOut size={16} />}
                  onClick={handleSignOut}
                  sx={{
                    color: "#ef4444",
                    borderColor: "#ef4444",
                    "&:hover": {
                      borderColor: "#dc2626",
                      bgcolor: "rgba(239, 68, 68, 0.1)",
                    },
                  }}
                >
                  Sign Out
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* AI Models Section */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            <Zap size={16} color="#8b5cf6" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: mode === "light" ? "#1a1a1a" : "white",
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          >
            AI Models
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: mode === "light" ? "#6b7280" : "#9ca3af",
            mb: 3,
            fontSize: "0.9rem",
          }}
        >
          Enable or disable AI models that will appear in your chat dashboard.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {models.map((model) => (
            <Box
              key={model.id}
              sx={{
                borderRadius: 3,
                padding: "1px",
                background:
                  mode === "light"
                    ? "linear-gradient(135deg, #e5e7eb, #d1d5db, #f3f4f6) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899) border-box"
                    : "linear-gradient(135deg, #1e1e1e, #121212, #1a1a1a) padding-box, linear-gradient(135deg, #667eea, #764ba2, #667eea) border-box",
                border: "1px solid transparent",
                position: "relative",
                overflow: "visible",
              }}
            >
              <Card
                sx={{
                  bgcolor: mode === "light" ? "#ffffff" : "#0e0e0e",
                  border: "none",
                  borderRadius: 3,
                  position: "relative",
                  overflow: "visible",
                  minHeight: 140,
                  boxShadow:
                    mode === "light"
                      ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                      : "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 3,
                        padding: "5px",
                        border: `2px solid ${model.color || "#4c1d95"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                        flexShrink: 0,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      {model.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: mode === "light" ? "#1a1a1a" : "white",
                          fontWeight: 600,
                          fontSize: "1rem",
                          mb: 0.5,
                          lineHeight: 1.2,
                        }}
                      >
                        {model.displayName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: mode === "light" ? "#6b7280" : "#9ca3af",
                          fontSize: "0.8rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {model.name}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Chip
                      label={model.enabled ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        bgcolor: model.enabled
                          ? mode === "light"
                            ? "#dcfce7"
                            : "#064e3b"
                          : mode === "light"
                          ? "#f3f4f6"
                          : "#374151",
                        color: model.enabled
                          ? mode === "light"
                            ? "#15803d"
                            : "#10b981"
                          : mode === "light"
                          ? "#6b7280"
                          : "#9ca3af",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        height: 20,
                        borderRadius: 2,
                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                    <Switch
                      checked={model.enabled}
                      onChange={() => onModelToggle(model.id)}
                      size="small"
                    />
                  </Box>
                </CardContent>

                {/* Connection indicator - just wifi icon */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                  }}
                >
                  <Wifi size={14} color="#10b981" />
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* API Keys Section */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            <Key size={16} color="#8b5cf6" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: mode === "light" ? "#1a1a1a" : "white",
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          >
            API Keys
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: mode === "light" ? "#6b7280" : "#9ca3af",
            mb: 3,
            fontSize: "0.9rem",
          }}
        >
          Manage your API keys for different AI models. Only models with API
          keys will respond to your messages.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
            gap: 2,
          }}
        >
          {models.map((model) => {
            // Use refreshKey to force re-evaluation of API keys
            const activeKey =
              refreshKey >= 0 ? getActiveAPIKey(model.id) : null;
            const allKeys = getAllAPIKeysForModel(model.id);
            return (
              <Box
                key={model.id}
                sx={{
                  borderRadius: 3,
                  padding: "1px",
                  background:
                    mode === "light"
                      ? "linear-gradient(135deg, #e5e7eb, #d1d5db, #f3f4f6) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899) border-box"
                      : "linear-gradient(135deg, #1e1e1e, #121212, #1a1a1a) padding-box, linear-gradient(135deg, #667eea, #764ba2, #667eea) border-box",
                  border: "1px solid transparent",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                <Card
                  sx={{
                    bgcolor: mode === "light" ? "#ffffff" : "#0e0e0e",
                    border: "none",
                    borderRadius: 3,
                    position: "relative",
                    overflow: "visible",
                    minHeight: 120,
                    boxShadow:
                      mode === "light"
                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                        : "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", flex: 1 }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            padding: "5px",
                            border: `2px solid ${model.color || "#4c1d95"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                            flexShrink: 0,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          {model.icon}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                color: mode === "light" ? "#1a1a1a" : "white",
                                fontWeight: 600,
                                fontSize: "1rem",
                                lineHeight: 1.2,
                              }}
                            >
                              {model.displayName}
                            </Typography>
                            {activeKey && (
                              <Chip
                                label={`${allKeys.length} key${
                                  allKeys.length !== 1 ? "s" : ""
                                }`}
                                size="small"
                                sx={{
                                  bgcolor:
                                    mode === "light" ? "#dcfce7" : "#064e3b",
                                  color:
                                    mode === "light" ? "#15803d" : "#10b981",
                                  fontSize: "0.7rem",
                                  fontWeight: 500,
                                  height: 18,
                                  borderRadius: 2,
                                  "& .MuiChip-label": {
                                    px: 1,
                                  },
                                }}
                              />
                            )}
                          </Box>
                          {activeKey ? (
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color:
                                    mode === "light" ? "#6b7280" : "#9ca3af",
                                  fontSize: "0.8rem",
                                  lineHeight: 1.2,
                                  fontWeight: 600,
                                }}
                              >
                                Active: {activeKey.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: mode === "light" ? "#888" : "#999",
                                  display: "block",
                                }}
                              >
                                Used {activeKey.usageCount || 0} times
                              </Typography>
                            </Box>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{
                                color: mode === "light" ? "#6b7280" : "#9ca3af",
                                fontSize: "0.8rem",
                                lineHeight: 1.2,
                              }}
                            >
                              No API key configured
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <IconButton
                          onClick={() => handleEditAPIKey(model)}
                          sx={{
                            color: mode === "light" ? "#6b7280" : "#6b7280",
                            "&:hover": {
                              bgcolor:
                                mode === "light"
                                  ? "rgba(107, 114, 128, 0.1)"
                                  : "rgba(156, 163, 175, 0.1)",
                              color: mode === "light" ? "#374151" : "#9ca3af",
                            },
                            width: 32,
                            height: 32,
                            p: 0.5,
                          }}
                        >
                          <Edit size={14} />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Enhanced API Key Dialog */}
      {selectedModel && (
        <EnhancedAPIKeyDialog
          open={apiKeyDialogOpen}
          onClose={handleDialogClose}
          model={selectedModel}
          onSave={handleDialogClose}
        />
      )}

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onClose={() => setChangePasswordDialogOpen(false)}
        onSuccess={() => {
          // Optional: Show success message or refresh user data
          console.log("Password changed successfully");
        }}
      />
    </Box>
  );
}
