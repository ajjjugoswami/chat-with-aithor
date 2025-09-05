import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { AIModel } from "./AIModelTabs";
import { useTheme } from "../hooks/useTheme";

interface APIKeyDialogProps {
  open: boolean;
  onClose: () => void;
  model: AIModel | null;
  onSave: (modelId: string, apiKey: string) => void;
  existingKey?: string;
}

export default function APIKeyDialog({
  open,
  onClose,
  model,
  onSave,
  existingKey = "",
}: APIKeyDialogProps) {
  const [apiKey, setApiKey] = useState(existingKey);
  const [error, setError] = useState("");
  const { mode } = useTheme();

  // Update apiKey state when existingKey prop changes
  useEffect(() => {
    setApiKey(existingKey);
  }, [existingKey]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError("Please enter an API key");
      return;
    }

    if (!model) {
      setError("No model selected");
      return;
    }

    onSave(model.id, apiKey.trim());
    setApiKey("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setApiKey(existingKey);
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: mode === 'light' ? "#ffffff" : "#000",
          color: mode === 'light' ? "#000000" : "white",
          border: mode === 'light' ? "1px solid #e0e0e0" : "1px solid #404040",
        },
      }}
    >
      <DialogTitle sx={{ color: mode === 'light' ? "#000000" : "white" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {model && <div>{model.icon}</div>}
          <Box>
            <Typography variant="h6">
              {existingKey ? "Edit" : "Add"} API Key
            </Typography>
            <Typography variant="body2" sx={{ color: mode === 'light' ? "#666666" : "#888" }}>
              {model?.displayName}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="API Key"
          type="password"
          fullWidth
          variant="outlined"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            setError("");
          }}
          error={!!error}
          helperText={error || `Enter your ${model?.displayName} API key`}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: mode === 'light' ? "#000000" : "white",
              "& fieldset": {
                borderColor: mode === 'light' ? "#e0e0e0" : "#404040",
              },
              "&:hover fieldset": {
                borderColor: mode === 'light' ? "#bdbdbd" : "#606060",
              },
              "&.Mui-focused fieldset": {
                borderColor: model?.color || "#007aff",
              },
            },
            "& .MuiInputLabel-root": {
              color: mode === 'light' ? "#666666" : "#888",
              "&.Mui-focused": {
                color: model?.color || "#007aff",
              },
            },
            "& .MuiFormHelperText-root": {
              color: error ? "#f44336" : (mode === 'light' ? "#666666" : "#888"),
            },
          }}
        />

        <Box sx={{ mt: 2, p: 2, bgcolor: mode === 'light' ? "#f5f5f5" : "#1a1a1a", borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: mode === 'light' ? "#666666" : "#888" }}>
            💡 Your API key is stored locally in your browser and never sent to
            our servers.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} sx={{ color: mode === 'light' ? "#666666" : "#888" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            bgcolor: model?.color || "#007aff",
            "&:hover": {
              bgcolor: model?.color || "#0056b3",
              filter: "brightness(1.1)",
            },
          }}
        >
          {existingKey ? "Update" : "Save"} API Key
        </Button>
      </DialogActions>
    </Dialog>
  );
}
