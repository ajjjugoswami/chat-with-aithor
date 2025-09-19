import {
  Box,
  TextField,
  IconButton,
  Paper,
  Chip,
  Typography,
  Tooltip,
  useMediaQuery,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import {
  Send,
  AttachFile,
  Image,
  Mic,
  MicOff,
  Close,
  InsertDriveFile,
  PictureAsPdf,
  Description,
  Code,
  Stop,
} from "@mui/icons-material";
import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "../hooks/useTheme";
import { useTypewriterState } from "../hooks/useTypewriterState";
import { stopAllTypewriters } from "../utils/typewriterState";

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onerror: (event: Event) => void;
  onend: () => void;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

interface UploadedFile {
  id: string;
  file: File;
  type: "image" | "document" | "code" | "pdf" | "other";
  preview?: string;
}

interface ChatInputProps {
  onSendMessage: (message: string, files?: UploadedFile[]) => void;
  disabled?: boolean;
  selectedModel?: string;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  selectedModel,
}: ChatInputProps) {
  const { mode } = useTheme();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTypewriterActive = useTypewriterState();
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            setMessage((prev) => prev + finalTranscript);
            setVoiceTranscript("");
          } else {
            setVoiceTranscript(interimTranscript);
          }
        };

        recognitionRef.current.onerror = (event: Event) => {
          console.error("Speech recognition error:", event);
          setIsRecording(false);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setIsRecording(false);
          setVoiceTranscript("");
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startVoiceRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  }, [isRecording]);

  const stopVoiceRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const toggleVoiceRecording = useCallback(() => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  }, [isRecording, stopVoiceRecording, startVoiceRecording]);

  // Global ESC key handler for voice recording
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isRecording) {
        stopVoiceRecording();
      }
    };

    if (isRecording) {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isRecording, stopVoiceRecording]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const context = urlParams.get("context");

    if (context) {
      const decodedContext = decodeURIComponent(context);
      setMessage(decodedContext);

      // Clear the URL parameters to avoid re-setting on refresh
      const newUrl = window.location.pathname + window.location.hash;
      console.log("Clearing URL to:", newUrl);
      window.history.replaceState({}, document.title, newUrl);
    } else {
      console.log("No context parameter found");
    }
  }, []);

  const getFileType = (file: File): UploadedFile["type"] => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type === "application/pdf") return "pdf";
    if (
      file.type.includes("text/") ||
      file.name.match(
        /\.(js|ts|jsx|tsx|py|java|cpp|c|html|css|json|xml|yaml|yml)$/i
      )
    )
      return "code";
    if (
      file.type.includes("document") ||
      file.name.match(/\.(doc|docx|txt|rtf)$/i)
    )
      return "document";
    return "other";
  };

  const getFileIcon = (type: UploadedFile["type"]) => {
    switch (type) {
      case "image":
        return <Image />;
      case "pdf":
        return <PictureAsPdf />;
      case "code":
        return <Code />;
      case "document":
        return <Description />;
      default:
        return <InsertDriveFile />;
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const fileType = getFileType(file);
      const id = Math.random().toString(36).substr(2, 9);

      const newFile: UploadedFile = {
        id,
        file,
        type: fileType,
      };

      // Create preview for images
      if (fileType === "image") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === id ? { ...f, preview: e.target?.result as string } : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      setUploadedFiles((prev) => [...prev, newFile]);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleSend = () => {
    if (message.trim() || uploadedFiles.length > 0) {
      onSendMessage(message.trim(), uploadedFiles);
      setMessage("");
      setUploadedFiles([]);
    }
  };

  const handleStopTypewriter = () => {
    stopAllTypewriters();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Close voice recording on Escape
    if (e.key === "Escape" && isRecording) {
      stopVoiceRecording();
    }
  };

  return (
    <Box sx={{ position: "relative", p: isMobile ? 0.5 : 1 }}>
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFileUpload(e.target.files)}
      />
      <input
        type="file"
        ref={fileInputRef}
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* File previews */}
      {uploadedFiles.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {uploadedFiles.map((file) => (
              <Chip
                key={file.id}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      maxWidth: 200,
                    }}
                  >
                    {file.type === "image" && file.preview ? (
                      <Box
                        component="img"
                        src={file.preview}
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: 0.5,
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      getFileIcon(file.type)
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: "inherit",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 150,
                      }}
                    >
                      {file.file.name}
                    </Typography>
                  </Box>
                }
                onDelete={() => removeFile(file.id)}
                deleteIcon={<Close />}
                sx={{
                  bgcolor: "rgba(102, 126, 234, 0.1)",
                  color: "#fff",
                  border: "1px solid rgba(102, 126, 234, 0.3)",
                  "& .MuiChip-deleteIcon": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&:hover": {
                      color: "#fff",
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Gradient border container */}
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          position: "relative",
          background: isDragOver
            ? "linear-gradient(135deg, #43e97b 0%, #38f9d7 25%, #667eea 50%, #764ba2 75%, #f093fb 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
          borderRadius: 4,
          padding: "2px",
          transition: "all 0.3s ease",
          transform: isDragOver ? "scale(1.02)" : "scale(1)",
          "&:hover": {
            background:
              "linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #f5576c 60%, #4facfe 80%, #43e97b 100%)",
            // transform: 'scale(1.02)',
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
          },
          "&:focus-within": {
            background:
              "linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #f5576c 60%, #4facfe 80%, #43e97b 100%)",
          },
        }}
      >
        {/* Input container */}
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center", // Changed from 'flex-end' to 'center' for better alignment
            background:
              mode === "light"
                ? "linear-gradient(145deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%)"
                : "linear-gradient(145deg, #000 0%, #2a2a2a 50%, #000 100%)", // Softer dark gradient
            borderRadius: 3.5,
            p: 2, // Increased padding from 1.5 to 2
            gap: 1.5, // Increased gap for better spacing
            position: "relative",
            overflow: "hidden",
            minHeight: "70px", // Added minimum height
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                mode === "light"
                  ? "linear-gradient(145deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 50%, rgba(0,0,0,0.03) 100%)"
                  : "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.12) 100%)", // Enhanced overlay for better visibility
              pointerEvents: "none",
            },
          }}
        >
          {/* File attachment buttons */}
          <Box
            sx={{
              display: "flex",
              gap: isMobile ? 0.5 : 0.75,
              alignItems: "center", // Better alignment
            }}
          >
            <Tooltip title="Upload Image">
              <IconButton
                size="small"
                onClick={() => imageInputRef.current?.click()}
                sx={{
                  color: mode === "light" ? "#666" : "#999",
                  background:
                    mode === "light"
                      ? "rgba(0,0,0,0.03)"
                      : "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  border:
                    mode === "light"
                      ? "1px solid rgba(0,0,0,0.1)"
                      : "1px solid rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  width: isMobile ? 32 : 36, // Slightly larger for better alignment
                  height: isMobile ? 32 : 36,
                  "&:hover": {
                    color: mode === "light" ? "#333" : "#fff",
                    background:
                      "linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  },
                }}
              >
                <Image sx={{ fontSize: isMobile ? "1rem" : "1.1rem" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload File">
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  color: mode === "light" ? "#666" : "#999",
                  background:
                    mode === "light"
                      ? "rgba(0,0,0,0.03)"
                      : "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  border:
                    mode === "light"
                      ? "1px solid rgba(0,0,0,0.1)"
                      : "1px solid rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  width: isMobile ? 32 : 36, // Slightly larger for better alignment
                  height: isMobile ? 32 : 36,
                  "&:hover": {
                    color: mode === "light" ? "#333" : "#fff",
                    background:
                      "linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  },
                }}
              >
                <AttachFile sx={{ fontSize: isMobile ? "1rem" : "1.1rem" }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Text input */}
          <TextField
            multiline
            maxRows={6}
            placeholder={
              selectedModel ? `Ask...` : "Ask..."
            }
            value={
              message +
              (isRecording && voiceTranscript ? ` ${voiceTranscript}` : "")
            }
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled || isRecording}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                color: mode === "light" ? "#333" : "#fff",
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: "400",
                lineHeight: "1.5",
                "& ::placeholder": {
                  color: mode === "light" ? "#666" : "#888",
                  opacity: 1,
                  fontStyle: "italic",
                },
              },
            }}
            sx={{
              flex: 1,
              "& .MuiInputBase-root": {
                bgcolor: "transparent",
                borderRadius: 2,
                padding: isMobile ? "10px 12px" : "12px 16px", // Increased padding
                minHeight: "20px", // Added minimum height for input
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor:
                    mode === "light"
                      ? "rgba(0,0,0,0.02)"
                      : "rgba(255,255,255,0.02)",
                },
                "&.Mui-focused": {
                  backgroundColor:
                    mode === "light"
                      ? "rgba(0,0,0,0.05)"
                      : "rgba(255,255,255,0.05)",
                },
              },
            }}
          />

          {/* Action buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 0.75,
              alignItems: "center", // Better alignment
            }}
          >
            <Tooltip title={isRecording ? "Stop Recording" : "Voice Input"}>
              <IconButton
                size="small"
                onClick={toggleVoiceRecording}
                sx={{
                  color: isRecording
                    ? "#ff4444"
                    : mode === "light"
                    ? "#666"
                    : "#999",
                  background: isRecording
                    ? "rgba(255, 68, 68, 0.1)"
                    : mode === "light"
                    ? "rgba(0,0,0,0.03)"
                    : "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  border: isRecording
                    ? "1px solid rgba(255, 68, 68, 0.3)"
                    : mode === "light"
                    ? "1px solid rgba(0,0,0,0.1)"
                    : "1px solid rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                  width: 36, // Consistent size
                  height: 36,
                  animation: isRecording ? "pulse 1.5s infinite" : "none",
                  "&:hover": {
                    color: isRecording
                      ? "#ff6666"
                      : mode === "light"
                      ? "#333"
                      : "#fff",
                    background: isRecording
                      ? "rgba(255, 68, 68, 0.2)"
                      : "linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))",
                    transform: "translateY(-2px)",
                    boxShadow: isRecording
                      ? "0 4px 12px rgba(255, 68, 68, 0.4)"
                      : "0 4px 12px rgba(102, 126, 234, 0.3)",
                  },
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.1)" },
                    "100%": { transform: "scale(1)" },
                  },
                }}
              >
                {isRecording ? (
                  <MicOff sx={{ fontSize: "1.1rem" }} />
                ) : (
                  <Mic sx={{ fontSize: "1.1rem" }} />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip
              title={isTypewriterActive ? "Stop Typing" : "Send Message"}
            >
              <IconButton
                onClick={isTypewriterActive ? handleStopTypewriter : handleSend}
                disabled={
                  isTypewriterActive
                    ? false
                    : (!message.trim() && uploadedFiles.length === 0) ||
                      disabled
                }
                size="medium"
                sx={{
                  background: isTypewriterActive
                    ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 50%, #d63447 100%)" // Red gradient for stop
                    : message.trim() || uploadedFiles.length > 0
                    ? "linear-gradient(135deg, #00d4aa 0%, #00b894 50%, #00a085 100%)"
                    : mode === "light"
                    ? "rgba(0,0,0,0.1)"
                    : "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  width: isMobile ? 36 : 40, // Consistent sizing
                  height: isMobile ? 36 : 40,
                  "&:hover": {
                    background: isTypewriterActive
                      ? "linear-gradient(135deg, #ff7979 0%, #ff6b6b 50%, #ee5a52 100%)" // Lighter red on hover
                      : message.trim() || uploadedFiles.length > 0
                      ? "linear-gradient(135deg, #00e6c0 0%, #00d4aa 50%, #00b894 100%)"
                      : "rgba(255,255,255,0.15)",
                    transform: "translateY(-2px) scale(1.05)",
                    boxShadow: isTypewriterActive
                      ? "0 6px 20px rgba(255, 107, 107, 0.4)" // Red shadow for stop
                      : message.trim() || uploadedFiles.length > 0
                      ? "0 6px 20px rgba(0, 212, 170, 0.4)"
                      : "0 4px 12px rgba(255,255,255,0.2)",
                  },
                  "&.Mui-disabled": {
                    background: "rgba(255,255,255,0.05)",
                    color: "#666",
                    border: "1px solid rgba(255,255,255,0.1)",
                  },
                }}
              >
                {isTypewriterActive ? (
                  <Stop sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }} />
                ) : (
                  <Send sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Voice Recording Dialog */}
        <Dialog
          open={isRecording}
          onClose={stopVoiceRecording}
          PaperProps={{
            sx: {
              bgcolor:
                mode === "light"
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(0,0,0,0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 3,
              border:
                mode === "light"
                  ? "1px solid rgba(0,0,0,0.1)"
                  : "1px solid rgba(255,255,255,0.1)",
              minWidth: 300,
              maxWidth: 400,
              position: "relative",
            },
          }}
        >
          {/* Close button */}
          <IconButton
            onClick={stopVoiceRecording}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: mode === "light" ? "#666" : "#999",
              zIndex: 1,
              background:
                mode === "light"
                  ? "rgba(0,0,0,0.05)"
                  : "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                background:
                  mode === "light"
                    ? "rgba(0,0,0,0.1)"
                    : "rgba(255,255,255,0.1)",
                color: mode === "light" ? "#333" : "#fff",
              },
            }}
          >
            <Close sx={{ fontSize: "1.2rem" }} />
          </IconButton>

          <DialogContent sx={{ textAlign: "center", p: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <CircularProgress
                  size={80}
                  sx={{
                    color: "#ff4444",
                    animation: "pulse 1.5s infinite",
                    "@keyframes pulse": {
                      "0%": { opacity: 0.6, transform: "scale(1)" },
                      "50%": { opacity: 1, transform: "scale(1.1)" },
                      "100%": { opacity: 0.6, transform: "scale(1)" },
                    },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#ff4444",
                  }}
                >
                  <Mic sx={{ fontSize: "2rem" }} />
                </Box>
              </Box>

              <Typography
                variant="h6"
                sx={{ color: mode === "light" ? "#333" : "#fff" }}
              >
                {isListening ? "Listening..." : "Starting..."}
              </Typography>

              {voiceTranscript && (
                <Box
                  sx={{
                    bgcolor:
                      mode === "light"
                        ? "rgba(0,0,0,0.05)"
                        : "rgba(255,255,255,0.05)",
                    borderRadius: 2,
                    p: 2,
                    maxWidth: "100%",
                    border:
                      mode === "light"
                        ? "1px solid rgba(0,0,0,0.1)"
                        : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: mode === "light" ? "#666" : "#999",
                      fontStyle: "italic",
                      minHeight: "1.5em",
                    }}
                  >
                    {voiceTranscript || "Say something..."}
                  </Typography>
                </Box>
              )}

              <Typography
                variant="caption"
                sx={{
                  color: mode === "light" ? "#666" : "#888",
                  textAlign: "center",
                }}
              >
                Click the X or microphone button to stop recording
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}
