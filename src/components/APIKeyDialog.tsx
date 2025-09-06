import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Fade,
  Slide,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Close, Security, Key, Visibility, VisibilityOff } from "@mui/icons-material";
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
  const [showPassword, setShowPassword] = useState(false);
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
        },
      }}
    >
      {/* Header with gradient background */}
      <Box
        sx={{
          background: model?.color 
            ? `linear-gradient(135deg, ${model.color}15 0%, ${model.color}25 100%)`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          p: 3,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: model?.color 
              ? `radial-gradient(circle at 70% 30%, ${model.color}20 0%, transparent 50%)`
              : "radial-gradient(circle at 70% 30%, rgba(102, 126, 234, 0.3) 0%, transparent 50%)",
          },
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
                  // bgcolor: model?.color || "#667eea",
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
                  {existingKey ? "Update" : "Add"} API Key
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: mode === 'light' ? "#666" : "#ccc",
                  fontWeight: 500
                }}>
                  {model?.displayName}
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

      <DialogContent sx={{ p: 3 }}>
        <TextField
          autoFocus
          margin="dense"
          label="API Key"
          type={showPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            setError("");
          }}
          error={!!error}
          helperText={error || `Enter your ${model?.displayName} API key`}
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
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              color: mode === 'light' ? "#000000" : "white",
              bgcolor: mode === 'light' ? "#f8f9fa" : "#2a2a2a",
              transition: "all 0.3s ease",
              "& fieldset": {
                borderColor: mode === 'light' ? "#e0e0e0" : "#404040",
                borderWidth: "2px",
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
              color: mode === 'light' ? "#666666" : "#888",
              fontWeight: 500,
              "&.Mui-focused": {
                color: model?.color || "#667eea",
              },
            },
            "& .MuiFormHelperText-root": {
              color: error ? "#f44336" : (mode === 'light' ? "#666666" : "#888"),
              fontWeight: 500,
            },
          }}
        />

        <Fade in={true} timeout={800}>
          <Box sx={{ 
            mt: 3, 
            p: 3, 
            bgcolor: mode === 'light' ? "#f0f8ff" : "#1a2332", 
            borderRadius: "16px",
            border: mode === 'light' ? "1px solid #e3f2fd" : "1px solid #2a3441",
            background: mode === 'light' 
              ? "linear-gradient(135deg, #f0f8ff 0%, #e8f4fd 100%)"
              : "linear-gradient(135deg, #1a2332 0%, #233041 100%)",
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
                Security & Privacy
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ 
              color: mode === 'light' ? "#1976d2" : "#bbdefb",
              lineHeight: 1.6
            }}>
              � Your API key is encrypted and stored locally in your browser. It's never transmitted to our servers and remains completely private.
            </Typography>
          </Box>
        </Fade>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={handleClose} 
          sx={{ 
            color: mode === 'light' ? "#666666" : "#888",
            fontWeight: 600,
            borderRadius: "12px",
            px: 3,
            py: 1.5,
            "&:hover": {
              bgcolor: mode === 'light' ? "#f5f5f5" : "#333",
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            background: model?.color 
              ? `linear-gradient(135deg, ${model.color} 0%, ${model.color}dd 100%)`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "12px",
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: `0 8px 25px ${model?.color || "#667eea"}40`,
            "&:hover": {
              background: model?.color 
                ? `linear-gradient(135deg, ${model.color}dd 0%, ${model.color}bb 100%)`
                : "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              transform: "translateY(-2px)",
              boxShadow: `0 12px 35px ${model?.color || "#667eea"}50`,
            },
            transition: "all 0.3s ease",
          }}
        >
          {existingKey ? "Update" : "Save"} API Key
        </Button>
      </DialogActions>
    </Dialog>
  );
}
