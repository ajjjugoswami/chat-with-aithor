import {
  Box,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Divider,
  Paper,
  IconButton,
  Chip,
} from "@mui/material";
import { ArrowBack, Key, Edit, Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";
import type { AIModel } from "./AIModelTabs";
import { getAllAPIKeys, removeAPIKey, saveAPIKey, getAPIKeyForModel } from "../utils/apiKeys";
import APIKeyDialog from "./APIKeyDialog";
import { useTheme } from "../hooks/useTheme";

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
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [apiKeys, setApiKeys] = useState(getAllAPIKeys());

  // Refresh API keys when component mounts and when dialog closes
  useEffect(() => {
    setApiKeys(getAllAPIKeys());
  }, []);

  const handleEditAPIKey = (model: AIModel) => {
    setSelectedModel(model);
    setApiKeyDialogOpen(true);
  };

  const handleSaveAPIKey = (modelId: string, apiKey: string) => {
    const model = models.find(m => m.id === modelId);
    if (model) {
      saveAPIKey(modelId, apiKey, model.displayName);
    }
    // Force refresh by getting fresh data from localStorage
    setApiKeys(getAllAPIKeys());
    setApiKeyDialogOpen(false);
    setSelectedModel(null);
  };

  const handleRemoveAPIKey = (modelId: string) => {
    removeAPIKey(modelId);
    // Force refresh by getting fresh data from localStorage
    setApiKeys(getAllAPIKeys());
  };
  return (
    <Box
      sx={{
        height: "100%",
        bgcolor: mode === 'light' ? '#ffffff' : "#1a1a1a",
        color: mode === 'light' ? '#333' : "white",
        overflow: "auto",
        p: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        {onBack && (
          <IconButton
            onClick={onBack}
            sx={{
              color: mode === 'light' ? '#333' : "white",
              mr: 2,
              "&:hover": { bgcolor: mode === 'light' ? '#f0f0f0' : "#333" },
            }}
          >
            <ArrowBack />
          </IconButton>
        )}
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Settings
        </Typography>
      </Box>

      {/* AI Models Section */}
      <Paper
        sx={{
          bgcolor: mode === 'light' ? '#f8f9fa' : "#2a2a2a",
          border: mode === 'light' ? "1px solid #e0e0e0" : "1px solid #404040",
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: mode === 'light' ? '#333' : "white" }}>
            AI Models
          </Typography>
          <Typography variant="body2" sx={{ color: mode === 'light' ? '#666' : "#888", mb: 3 }}>
            Enable or disable AI models that will appear in your chat dashboard.
          </Typography>

          <List>
            {models.map((model, index) => (
              <Box key={model.id}>
                <ListItem
                  sx={{
                    py: 2,
                    borderRadius: 1,
                    "&:hover": { bgcolor: mode === 'light' ? '#f0f0f0' : "#333" },
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      marginRight: 20,
                    }}
                  >
                    {model.icon}
                  </div>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{ color: mode === 'light' ? '#333' : "white", fontWeight: 500 }}
                      >
                        {model.displayName}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: mode === 'light' ? '#666' : "#888" }}>
                        {model.name} - {model.enabled ? "Active" : "Inactive"}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={model.enabled}
                      onChange={() => onModelToggle(model.id)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: model.color,
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: model.color,
                          },
                        "& .MuiSwitch-track": {
                          backgroundColor: "#666",
                        },
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                {index < models.length - 1 && (
                  <Divider sx={{ bgcolor: "#404040", mx: 2 }} />
                )}
              </Box>
            ))}
          </List>
        </Box>
      </Paper>

      {/* API Keys Section */}
      <Paper
        sx={{
          bgcolor: mode === 'light' ? '#f8f9fa' : "#2a2a2a",
          border: mode === 'light' ? "1px solid #e0e0e0" : "1px solid #404040",
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: mode === 'light' ? '#333' : "white" }}>
            API Keys
          </Typography>
          <Typography variant="body2" sx={{ color: mode === 'light' ? '#666' : "#888", mb: 3 }}>
            Manage your API keys for different AI models. Only models with API
            keys will respond to your messages.
          </Typography>

          <List>
            {models.map((model, index) => {
              const modelApiKey = apiKeys.find(
                (key) => key.modelId === model.id
              );
              return (
                <Box key={model.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      borderRadius: 1,
                      "&:hover": { bgcolor: mode === 'light' ? '#f0f0f0' : "#333" },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: model.color,
                        mr: 2,
                      }}
                    >
                      <Key />
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ color: mode === 'light' ? '#333' : "#fff", fontWeight: 500 }}
                          >
                            {model.displayName}
                          </Typography>
                          {modelApiKey && (
                            <Chip
                              label="Configured"
                              size="small"
                              sx={{
                                bgcolor: model.color,
                                color: mode === 'light' ? '#fff' : "#fff",
                                fontSize: "0.7rem",
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ color: "#888" }}>
                          {modelApiKey
                            ? `Added on ${new Date(
                                modelApiKey.addedAt
                              ).toLocaleDateString()}`
                            : "No API key configured"}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          onClick={() => handleEditAPIKey(model)}
                          sx={{
                            color: model.color,
                            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                          }}
                        >
                          <Edit />
                        </IconButton>
                        {modelApiKey && (
                          <IconButton
                            onClick={() => handleRemoveAPIKey(model.id)}
                            sx={{
                              color: "#f44336",
                              "&:hover": { bgcolor: "rgba(244,67,54,0.1)" },
                            }}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < models.length - 1 && (
                    <Divider sx={{ bgcolor: "#404040", mx: 2 }} />
                  )}
                </Box>
              );
            })}
          </List>
        </Box>
      </Paper>

     
      {/* API Key Dialog */}
      {selectedModel && (
        <APIKeyDialog
          open={apiKeyDialogOpen}
          onClose={() => setApiKeyDialogOpen(false)}
          model={selectedModel}
          onSave={handleSaveAPIKey}
          existingKey={getAPIKeyForModel(selectedModel.id) || ""}
        />
      )}
    </Box>
  );
}
