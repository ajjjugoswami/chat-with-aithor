import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { MoreVert, Edit, Key, Delete, ContentCopy } from "@mui/icons-material";
import { useState } from "react";
import type { ServerAPIKey } from "./types";
import { getProviderDisplayName } from "../../utils/enhancedApiKeys";

interface APIKeyCardProps {
  keyData: ServerAPIKey;
  onEdit: (key: ServerAPIKey) => void;
  onSetActive: (keyId: string) => void;
  onDelete: (keyId: string) => void;
  menuAnchor: HTMLElement | null;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, key: ServerAPIKey) => void;
  onMenuClose: () => void;
  selectedKey: ServerAPIKey | null;
}

export default function APIKeyCard({
  keyData,
  onEdit,
  onSetActive,
  onDelete,
  menuAnchor,
  onMenuOpen,
  onMenuClose,
  selectedKey,
}: APIKeyCardProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyKeyId = async () => {
    try {
      await navigator.clipboard.writeText(keyData._id);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy Key ID:", err);
    }
  };
  return (
    <>
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          minHeight: 200,
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
            p: 3,
            pb: 2,
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
              mb: 2,
              flex: 1,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
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
                    fontSize: "1rem",
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
                    size="small"
                    color="primary"
                    variant="filled"
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      height: 24,
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
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    bgcolor: "background.default",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontFamily: "monospace",
                      fontSize: "0.9rem",
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
                      fontSize: "0.9rem",
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
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.8rem",
                      fontFamily: "monospace",
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Key ID: {keyData._id.substring(0, 16)}...
                  </Typography>
                  <Tooltip title="Copy Key ID">
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

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mt: "auto",
                  pt: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      Created:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.primary",
                        fontSize: "0.75rem",
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
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      Used:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "primary.main",
                        fontSize: "0.75rem",
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
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      Last used:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "success.main",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {new Date(keyData.lastUsed).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <IconButton
              onClick={(e) => onMenuOpen(e, keyData)}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: "primary.light",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease-in-out",
                flexShrink: 0,
                alignSelf: "flex-start",
                borderRadius: 2,
                p: 1,
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor) && selectedKey?._id === keyData._id}
        onClose={onMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 160,
            boxShadow: (theme) => theme.shadows[12],
            border: "1px solid",
            borderColor: "divider",
            mt: 1,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            onEdit(keyData);
            onMenuClose();
          }}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            mx: 0.5,
            mb: 0.5,
            "&:hover": {
              bgcolor: "primary.light",
              color: "primary.main",
              borderRadius: 2,
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Edit sx={{ mr: 1.5, fontSize: "1.1rem" }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onSetActive(keyData._id);
            onMenuClose();
          }}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            mx: 0.5,
            mb: 0.5,
            "&:hover": {
              bgcolor: "success.light",
              color: "success.main",
              borderRadius: 2,
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Key sx={{ mr: 1.5, fontSize: "1.1rem" }} />
          Set as Active
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(keyData._id);
            onMenuClose();
          }}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            mx: 0.5,
            color: "error.main",
            "&:hover": {
              bgcolor: "error.light",
              color: "error.dark",
              borderRadius: 2,
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Delete sx={{ mr: 1.5, fontSize: "1.1rem" }} />
          Delete
        </MenuItem>
      </Menu>

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
