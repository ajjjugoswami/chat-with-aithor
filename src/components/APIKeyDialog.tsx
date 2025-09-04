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
import { useState } from "react";
import type { AIModel } from "./AIModelTabs";

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
          bgcolor: "#2a2a2a",
          color: "white",
          border: "1px solid #404040",
        },
      }}
    >
      <DialogTitle sx={{ color: "white" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {model && <div>{model.icon}</div>}
          <Box>
            <Typography variant="h6">
              {existingKey ? "Edit" : "Add"} API Key
            </Typography>
            <Typography variant="body2" sx={{ color: "#888" }}>
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
              color: "white",
              "& fieldset": {
                borderColor: "#404040",
              },
              "&:hover fieldset": {
                borderColor: "#606060",
              },
              "&.Mui-focused fieldset": {
                borderColor: model?.color || "#007aff",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#888",
              "&.Mui-focused": {
                color: model?.color || "#007aff",
              },
            },
            "& .MuiFormHelperText-root": {
              color: error ? "#f44336" : "#888",
            },
          }}
        />

        <Box sx={{ mt: 2, p: 2, bgcolor: "#1a1a1a", borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: "#888" }}>
            💡 Your API key is stored locally in your browser and never sent to
            our servers.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} sx={{ color: "#888" }}>
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
