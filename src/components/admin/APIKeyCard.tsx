import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { Edit, Key, Delete, ContentCopy } from "@mui/icons-material";
import { useState } from "react";
import type { ServerAPIKey } from "./types";
import { getProviderDisplayName } from "../../utils/enhancedApiKeys";
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface APIKeyCardProps {
  keyData: ServerAPIKey;
  onEdit: (key: ServerAPIKey) => void;
  onSetActive: (keyId: string) => void;
  onDelete: (keyId: string) => void;
  deleting: boolean;
  settingActive: boolean;
}

export default function APIKeyCard({
  keyData,
  onEdit,
  onSetActive,
  onDelete,
  deleting,
  settingActive,
}: APIKeyCardProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 640px)');
  const isVerySmallScreen = useMediaQuery('(max-width: 480px)');

  const handleCopyKeyId = async () => {
    try {
      // If revealed and key is available, copy the actual API key value.
      const toCopy = revealed && keyData.key ? keyData.key : keyData._id;
      await navigator.clipboard.writeText(toCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy Key:", err);
    }
  };
  return (
    <>
      <Card
        sx={{
          mb: 2,
          borderRadius: isVerySmallScreen ? 2 : 3,
          border: "1px solid",
          borderColor: "divider",
          minHeight: isVerySmallScreen ? 140 : (isSmallScreen ? 160 : 200),
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease-in-out",
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}08 100%)`,
          "&:hover": {
            boxShadow: (theme) => theme.shadows[8],
            borderColor: "primary.main",
            // transform: "translateY(-2px)",
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}08 100%)`,
          },
        }}
      >
        <CardContent
          sx={{
            p: isVerySmallScreen ? 1.5 : (isSmallScreen ? 2 : 3),
            pb: isVerySmallScreen ? 1.5 : (isSmallScreen ? 1.5 : 2),
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: isVerySmallScreen ? 1 : (isSmallScreen ? 1.5 : 2),
              flex: 1,
              flexDirection: isVerySmallScreen ? "column" : (isSmallScreen ? "column" : "row"),
              gap: isVerySmallScreen ? 1 : (isSmallScreen ? 1.5 : 0),
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0, mr: isVerySmallScreen ? 0 : (isSmallScreen ? 0 : 2) }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: isVerySmallScreen ? 0.75 : (isSmallScreen ? 1 : 1.5),
                  mb: isVerySmallScreen ? 0.75 : (isSmallScreen ? 1 : 1.5),
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    width: isVerySmallScreen ? 8 : 12,
                    height: isVerySmallScreen ? 8 : 12,
                    borderRadius: "50%",
                    bgcolor: keyData.isActive ? "success.main" : "warning.main",
                    flexShrink: 0,
                    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
                  }}
                />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: isVerySmallScreen ? "0.8rem" : (isSmallScreen ? "0.95rem" : "1rem"),
                      color: "text.primary",
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {keyData.name}
                  </Typography>
                {keyData.isDefault && (
                  <Chip
                    label="Default"
                    size={isVerySmallScreen ? "small" : "small"}
                    color="primary"
                    variant="filled"
                    sx={{
                      fontSize: isVerySmallScreen ? "0.6rem" : (isSmallScreen ? "0.65rem" : "0.7rem"),
                      fontWeight: 600,
                      height: isVerySmallScreen ? 18 : (isSmallScreen ? 20 : 24),
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  mb: isVerySmallScreen ? 1.5 : 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: isVerySmallScreen ? "flex-start" : "center",
                    gap: isVerySmallScreen ? 0.5 : 1,
                    p: isVerySmallScreen ? 0.75 : (isSmallScreen ? 1 : 1.5),
                    bgcolor: "background.default",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    flexDirection: isVerySmallScreen ? "column" : "row",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontFamily: "monospace",
                      fontSize: isVerySmallScreen ? "0.7rem" : "0.9rem",
                      fontWeight: 600,
                      minWidth: "fit-content",
                    }}
                  >
                    Provider:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "primary.main",
                      fontWeight: 600,
                      fontSize: isVerySmallScreen ? "0.7rem" : "0.9rem",
                    }}
                  >
                    {getProviderDisplayName(keyData.provider)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                    p: isVerySmallScreen ? 0.5 : (isSmallScreen ? 0.75 : 1),
                    bgcolor: "background.default",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: isVerySmallScreen ? "0.65rem" : "0.8rem",
                        fontFamily: "monospace",
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {/* Show masked API key if key available, otherwise show truncated ID */}
                      {keyData.key ? (
                        `Key: ${revealed ? keyData.key : keyData.key.replace(/.(?=.{4})/g, '*')}`
                      ) : (
                        `Key ID: ${isVerySmallScreen ? keyData._id.substring(0, 8) : (isSmallScreen ? keyData._id.substring(0, 12) : keyData._id.substring(0, 16))}...`
                      )}
                    </Typography>

                    {/* Reveal / Copy controls */}
                    {keyData.key ? (
                      <Tooltip title={revealed ? 'Hide key' : 'Reveal key'}>
                        <IconButton
                          onClick={() => setRevealed((s) => !s)}
                          size="small"
                          sx={{ color: 'text.secondary', padding: '2px' }}
                        >
                          {revealed ? <VisibilityOff sx={{ fontSize: '0.95rem' }} /> : <Visibility sx={{ fontSize: '0.95rem' }} />}
                        </IconButton>
                      </Tooltip>
                    ) : null}

                    <Tooltip title={keyData.key ? 'Copy API Key' : 'Copy Key ID'}>
                      <IconButton
                        onClick={handleCopyKeyId}
                        size="small"
                        sx={{
                          color: "text.secondary",
                          "&:hover": {
                            color: "primary.main",
                          },
                          padding: "2px",
                          flexShrink: 0,
                        }}
                      >
                        <ContentCopy sx={{ fontSize: "0.9rem" }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: isVerySmallScreen ? 0.75 : 1,
                  mt: "auto",
                  pt: isVerySmallScreen ? 1.5 : 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: isVerySmallScreen ? 1 : 3,
                    alignItems: isVerySmallScreen ? "flex-start" : "center",
                    flexWrap: isVerySmallScreen ? "wrap" : "wrap",
                    justifyContent: isVerySmallScreen ? "flex-start" : "space-between",
                    flexDirection: isVerySmallScreen ? "column" : "row",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontSize: isVerySmallScreen ? "0.6rem" : "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      Created:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.primary",
                        fontSize: isVerySmallScreen ? "0.6rem" : "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {new Date(keyData.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontSize: isVerySmallScreen ? "0.6rem" : "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      Used:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "primary.main",
                        fontSize: isVerySmallScreen ? "0.6rem" : "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {keyData.usageCount} times
                    </Typography>
                  </Box>
                </Box>
                {keyData.lastUsed && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontSize: isVerySmallScreen ? "0.6rem" : "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      Last used:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "success.main",
                        fontSize: isVerySmallScreen ? "0.6rem" : "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {new Date(keyData.lastUsed).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: isVerySmallScreen ? "row" : (isSmallScreen ? "row" : "column"),
                gap: isVerySmallScreen ? 0.25 : (isSmallScreen ? 0.5 : 1),
                flexShrink: 0,
                justifyContent: isVerySmallScreen ? "center" : "flex-start",
                mt: isVerySmallScreen ? 1 : 0,
                pt: isVerySmallScreen ? 1 : 0,
                borderTop: isVerySmallScreen ? "1px solid" : "none",
                borderColor: isVerySmallScreen ? "divider" : "transparent",
                width: isVerySmallScreen ? "100%" : "auto",
              }}
            >
              <Tooltip title="Edit API Key">
                <IconButton
                  onClick={() => onEdit(keyData)}
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                      // bgcolor: "primary.light",
                    },
                    transition: "all 0.2s ease-in-out",
                    borderRadius: 2,
                    p: isVerySmallScreen ? 0.5 : (isSmallScreen ? 0.75 : 1),
                  }}
                >
                  <Edit fontSize={isVerySmallScreen ? "small" : "small"} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Set as Active">
                <IconButton
                  onClick={() => onSetActive(keyData._id)}
                  disabled={settingActive}
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "success.main",
                    },
                    transition: "all 0.2s ease-in-out",
                    borderRadius: 2,
                    p: isVerySmallScreen ? 0.5 : (isSmallScreen ? 0.75 : 1),
                  }}
                >
                  <Key fontSize={isVerySmallScreen ? "small" : "small"} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete API Key">
                <IconButton
                  onClick={() => onDelete(keyData._id)}
                  disabled={deleting}
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "error.main",
                    },
                    transition: "all 0.2s ease-in-out",
                    borderRadius: 2,
                    p: isVerySmallScreen ? 0.5 : (isSmallScreen ? 0.75 : 1),
                  }}
                >
                  <Delete fontSize={isVerySmallScreen ? "small" : "small"} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setCopySuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Key ID copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
