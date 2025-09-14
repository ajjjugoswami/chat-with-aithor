import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import {
  Person,
  Add,
  VpnKey,
  AdminPanelSettings,
  PersonAdd,
  PersonRemove,
} from "@mui/icons-material";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import {
  AdminHeader,
  AdminTabs,
  APIKeyCard,
  AdminDialog,
  type UserWithKeys,
  type ServerAPIKey,
} from "./admin";

export default function AdminPage() {
  const { mode } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 960px)");
  const isSmallScreen = useMediaQuery("(max-width: 480px)");

  const [tabValue, setTabValue] = useState(0);
  const [usersWithKeys, setUsersWithKeys] = useState<UserWithKeys[]>([]);
  console.log(usersWithKeys);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [settingActive, setSettingActive] = useState(false);
  console.log(usersWithKeys);
  // Add/Edit Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithKeys | null>(null);
  const [editingKey, setEditingKey] = useState<ServerAPIKey | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");

  // Available providers for selection
  const availableProviders = [
    { id: "ChatGPT", displayName: "ChatGPT" },
    { id: "Gemini", displayName: "Gemini" },
    { id: "DeepSeek", displayName: "DeepSeek" },
    { id: "Claude", displayName: "Claude" },
    { id: "Perplexity", displayName: "Perplexity" },
    { id: "Ollama", displayName: "Ollama" },
  ];

  // Check if user is admin
  const isAdmin = user?.isAdmin;

  const fetchAllUsersAndKeys = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch(
        "https://aithor-be.vercel.app/api/api-keys/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsersWithKeys(data);

        // Update selectedUser to point to the fresh data if it exists
        if (selectedUser) {
          const updatedSelectedUser = data.find(
            (u: UserWithKeys) => u._id === selectedUser._id
          );
          if (updatedSelectedUser) {
            setSelectedUser(updatedSelectedUser);
          } else {
            // If the selected user is no longer in the data, clear selection
            setSelectedUser(null);
          }
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch users and keys");
      }
    } catch (err) {
      setError("Network error while fetching data");
      console.error("Error fetching users and keys:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsersAndKeys();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveKey = async () => {
    if (!selectedUser || !newKeyName.trim() || !selectedProvider) {
      setError("Provider, name are required");
      return;
    }

    // For editing, API key is not required if user wants to keep current
    if (!editingKey && !newKeyValue.trim()) {
      setError("API key is required for new keys");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const keyData: {
        provider: string;
        name: string;
        isDefault: boolean;
        key?: string;
      } = {
        provider: selectedProvider,
        name: newKeyName.trim(),
        isDefault: false,
      };

      // Only include key if it's provided (for editing, empty means keep current)
      if (newKeyValue.trim()) {
        keyData.key = newKeyValue.trim();
      }

      const url = editingKey
        ? `https://aithor-be.vercel.app/api/api-keys/admin/${selectedUser._id}/${editingKey._id}`
        : `https://aithor-be.vercel.app/api/api-keys/admin/${selectedUser._id}`;

      const method = editingKey ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(keyData),
      });

      if (response.ok) {
        await fetchAllUsersAndKeys();
        handleCloseDialog();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save API key");
      }
    } catch (err) {
      setError("Network error while saving API key");
      console.error("Error saving key:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKey = async (userId: string, keyId: string) => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch(
        `https://aithor-be.vercel.app/api/api-keys/admin/${userId}/${keyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await fetchAllUsersAndKeys();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete API key");
      }
    } catch (err) {
      setError("Network error while deleting API key");
      console.error("Error deleting key:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleSetActive = async (userId: string, keyId: string) => {
    setSettingActive(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch(
        `https://aithor-be.vercel.app/api/api-keys/admin/${userId}/${keyId}/active`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await fetchAllUsersAndKeys();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to set active API key");
      }
    } catch (err) {
      setError("Network error while setting active API key");
      console.error("Error setting active key:", err);
    } finally {
      setSettingActive(false);
    }
  };

  const handleOpenAddDialog = (user: UserWithKeys) => {
    setSelectedUser(user);
    setEditingKey(null);
    setNewKeyName("");
    setNewKeyValue("");
    setSelectedProvider("");
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (user: UserWithKeys, key: ServerAPIKey) => {
    setSelectedUser(user);
    setEditingKey(key);
    setNewKeyName(key.name);
    setNewKeyValue(""); // Keep empty for security - user can re-enter if needed
    setSelectedProvider(key.provider);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    // Don't clear selectedUser to keep the user selected in the panel
    // setSelectedUser(null);
    setEditingKey(null);
    setNewKeyName("");
    setNewKeyValue("");
    setSelectedProvider("");
    setError("");
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleAdminAccess = async (user: UserWithKeys) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch(
        `https://aithor-be.vercel.app/api/auth/${
          user.isAdmin ? "revoke" : "grant"
        }-admin/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update admin access");
      }

      // Refresh the users list to reflect the change
      await fetchAllUsersAndKeys();
    } catch (error) {
      console.error("Error toggling admin access:", error);
      setError("Failed to update admin access");
    }
  };

  // Clear form handler is not used in the new UI; AdminDialog handles its own clearing

  if (!isAdmin) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: mode === "light" ? "#f5f5f5" : "#121212",
        }}
      >
        <Typography variant="h6" color="error">
          Access Denied: Admin privileges required
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: mode === "light" ? "#f5f5f5" : "#121212",
        color: mode === "light" ? "#000" : "#fff",
        p: isSmallScreen ? 2 : isMobile ? 2 : 4,
        "& .webkit-scrollbar": { display: "none" },
      }}
    >
      <Box
        sx={{
          maxWidth: "100%",
          mx: "auto",
          "& .webkit-scrollbar": { display: "none" },
        }}
      >
        {/* Header */}
        <AdminHeader
          onRefresh={fetchAllUsersAndKeys}
          loading={loading}
          error={error}
          onClearError={() => setError("")}
        />

        {/* Tabs */}
        <AdminTabs value={tabValue} onChange={handleTabChange} />

        {/* Tab Content */}
        {tabValue === 0 && (
          <Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
                <CircularProgress size={60} />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isSmallScreen
                    ? "1fr"
                    : isMobile
                    ? "repeat(auto-fit, minmax(280px, 1fr))"
                    : "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: isSmallScreen ? 2 : 3,
                }}
              >
                {usersWithKeys.map((u) => (
                  <Box
                    key={u._id}
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 3,
                      p: 3,
                      boxShadow: (theme) => theme.shadows[3],
                      border: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      minHeight: 220,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: (theme) => theme.shadows[6],
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: isSmallScreen ? "flex-start" : "center",
                        gap: isSmallScreen ? 1.5 : 2,
                        mb: 2,
                        flexDirection: isSmallScreen ? "column" : "row",
                      }}
                    >
                      <Avatar
                        src={u.picture}
                        alt={u.name || u.email}
                        sx={{
                          width: isSmallScreen ? 40 : 56,
                          height: isSmallScreen ? 40 : 56,
                          flexShrink: 0,
                          mb: isSmallScreen ? 1 : 0,
                        }}
                      >
                        {(u.name || u.email || "").charAt(0).toUpperCase()}
                      </Avatar>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontSize: isSmallScreen ? "1rem" : "1.1rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            mb: 0.5,
                          }}
                        >
                          {u.name || u.email}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            fontSize: isSmallScreen ? "0.8rem" : "0.85rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {u.email}
                        </Typography>
                        {u.isAdmin && (
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            <AdminPanelSettings
                              sx={{ fontSize: "0.8rem", color: "primary.main" }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                color: "primary.main",
                                fontWeight: 500,
                                fontSize: "0.7rem",
                              }}
                            >
                              Admin
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {u.apiKeys.length === 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontStyle: "italic",
                          fontSize: "0.75rem",
                        }}
                      >
                        No API keys
                      </Typography>
                    )}

                    {/* Spacer to maintain consistent card height */}
                    <Box sx={{ flex: 1 }} />

                    {u.isAdmin && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: isSmallScreen ? 1 : 1,
                          justifyContent: "flex-start",
                          alignItems: "center",
                          pt: 1,
                          flexDirection: isSmallScreen ? "column" : "row",
                          width: "100%",
                        }}
                      >
                        <Button
                          variant="outlined"
                          size={isSmallScreen ? "small" : "small"}
                          startIcon={<Add />}
                          onClick={() => handleOpenAddDialog(u)}
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                            px: isSmallScreen ? 1.5 : 2,
                            py: isSmallScreen ? 0.5 : 1,
                            width: isSmallScreen ? "100%" : "auto",
                            mb: isSmallScreen ? 1 : 0,
                          }}
                        >
                          Add Key
                        </Button>
                        <Button
                          variant="contained"
                          size={isSmallScreen ? "small" : "small"}
                          startIcon={<VpnKey />}
                          onClick={() => {
                            setSelectedUser(u);
                            setTabValue(1);
                          }}
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                            px: isSmallScreen ? 1.5 : 2,
                            py: isSmallScreen ? 0.5 : 1,
                            width: isSmallScreen ? "100%" : "auto",
                            "&:hover": { bgcolor: "primary.dark" },
                          }}
                        >
                          View Keys
                        </Button>
                      </Box>
                    )}

                    {!u.isAdmin && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          pt: 1,
                          opacity: 0.7,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontStyle: "italic",
                            fontSize: "0.75rem",
                          }}
                        >
                          Standard User
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}

                {usersWithKeys.length === 0 && (
                  <Box
                    sx={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      p: 8,
                      bgcolor: "background.paper",
                      borderRadius: 3,
                      border: "2px dashed",
                      borderColor: "divider",
                    }}
                  >
                    <Person
                      sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ color: "text.secondary", mb: 1 }}
                    >
                      No users found
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Users will appear here once they register
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box
            sx={{
              display: "flex",
              gap: isSmallScreen ? 2 : 3,
              alignItems: "flex-start",
              flexDirection: isTablet ? "column" : "row",
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", md: 320 },
                bgcolor: "background.paper",
                borderRadius: 3,
                p: 3,
                boxShadow: (theme) => theme.shadows[3],
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Person /> Users
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {usersWithKeys
                  .filter((u) => u.isAdmin)
                  .map((u) => (
                    <Box
                      key={u._id}
                      onClick={() => setSelectedUser(u)}
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        p: 1,
                        borderRadius: 1.5,
                        cursor: "pointer",
                        bgcolor:
                          selectedUser?._id === u._id
                            ? "action.selected"
                            : "transparent",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <Avatar
                        src={u.picture}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "primary.main",
                          fontSize: "0.95rem",
                          fontWeight: 700,
                        }}
                      >
                        {u.name
                          ? u.name.charAt(0).toUpperCase()
                          : u.email.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {u.name || u.email}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {u.email}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
              </Box>
            </Box>

            <Box sx={{ flex: 1, width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {selectedUser && (
                    <Avatar
                      src={selectedUser.picture}
                      sx={{ width: 48, height: 48 }}
                    >
                      {(selectedUser.name || selectedUser.email || "")
                        .charAt(0)
                        .toUpperCase()}
                    </Avatar>
                  )}
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {selectedUser
                      ? selectedUser.name || selectedUser.email
                      : "Select a user"}
                  </Typography>
                </Box>
                {selectedUser && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => handleOpenAddDialog(selectedUser)}
                      sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                      Add Key
                    </Button>
                  </Box>
                )}
              </Box>{" "}
              {!selectedUser ? (
                <Box
                  sx={{
                    p: 6,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    border: "1px dashed",
                    borderColor: "divider",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Choose a user from the left to view and manage their API
                    keys.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                    gap: 3,
                  }}
                >
                  {selectedUser.apiKeys.length === 0 && (
                    <Box
                      sx={{
                        gridColumn: "1 / -1",
                        p: 4,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        border: "1px dashed",
                        borderColor: "divider",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        This user has no API keys yet.
                      </Typography>
                    </Box>
                  )}

                  {selectedUser.apiKeys.map((key) => (
                    <APIKeyCard
                      key={key._id}
                      keyData={key}
                      onEdit={(key) => handleOpenEditDialog(selectedUser, key)}
                      onSetActive={(keyId) =>
                        handleSetActive(selectedUser._id, keyId)
                      }
                      onDelete={(keyId) =>
                        handleDeleteKey(selectedUser._id, keyId)
                      }
                      deleting={deleting}
                      settingActive={settingActive}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        )}

        {tabValue === 2 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: 3,
                p: 3,
                boxShadow: (theme) => theme.shadows[3],
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <AdminPanelSettings /> Admin Access Management
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                Grant or revoke admin access for users. Admin users can access
                this admin panel and manage API keys for all users.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>     
                {usersWithKeys.map((u) => (
                  <Box
                    key={u._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: isSmallScreen ? 2 : 3,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.paper",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: (theme) => theme.shadows[2],
                        borderColor: "primary.light",
                      },
                      flexDirection: isSmallScreen ? "column" : "row",
                      gap: isSmallScreen ? 2 : 0,
                      minHeight: isSmallScreen ? "auto" : 80,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: isSmallScreen ? 2 : 3,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Avatar
                        src={u.picture}
                        sx={{
                          width: isSmallScreen ? 48 : 56,
                          height: isSmallScreen ? 48 : 56,
                          bgcolor: u.isAdmin ? "primary.main" : "grey.400",
                          fontSize: isSmallScreen ? "1.2rem" : "1.5rem",
                          fontWeight: 700,
                        }}
                      >
                        {(u.name || u.email || "").charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              fontSize: isSmallScreen ? "1rem" : "1.1rem",
                              color: "text.primary",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {u.name || u.email}
                          </Typography>
                          {u.isAdmin && (
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                px: 1,
                                py: 0.25,
                                bgcolor: "success.main",
                                color: "success.contrastText",
                                borderRadius: 1,
                                fontSize: "0.7rem",
                                fontWeight: 600,
                              }}
                            >
                              <AdminPanelSettings sx={{ fontSize: "0.8rem" }} />
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "0.65rem",
                                  lineHeight: 1,
                                }}
                              >
                                ADMIN
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            fontSize: isSmallScreen ? "0.8rem" : "0.85rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {u.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexShrink: 0,
                        width: isSmallScreen ? "100%" : "auto",
                        justifyContent: isSmallScreen ? "center" : "flex-end",
                      }}
                    >
                      {u.isAdmin ? (
                        <Button
                          variant="outlined"
                          size={isSmallScreen ? "small" : "medium"}
                          startIcon={<PersonRemove />}
                          onClick={() => handleToggleAdminAccess(u)}
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                            px: isSmallScreen ? 2 : 3,
                            py: isSmallScreen ? 0.75 : 1,
                            borderColor: "error.main",
                            color: "error.main",
                            minWidth: isSmallScreen ? 120 : 140,
                            "&:hover": {
                              borderColor: "error.dark",
                              bgcolor: "error.light",
                              color: "error.dark",
                            },
                          }}
                        >
                          {isSmallScreen ? "Remove Admin" : "Remove as Admin"}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size={isSmallScreen ? "small" : "medium"}
                          startIcon={<PersonAdd />}
                          onClick={() => handleToggleAdminAccess(u)}
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                            px: isSmallScreen ? 2 : 3,
                            py: isSmallScreen ? 0.75 : 1,
                            bgcolor: "success.main",
                            minWidth: isSmallScreen ? 120 : 140,
                            "&:hover": {
                              bgcolor: "success.dark",
                            },
                          }}
                        >
                          {isSmallScreen ? "Grant Admin" : "Grant Access"}
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Add/Edit Dialog */}
        <AdminDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          selectedUser={selectedUser}
          editingKey={editingKey}
          newKeyName={newKeyName}
          setNewKeyName={setNewKeyName}
          newKeyValue={newKeyValue}
          setNewKeyValue={setNewKeyValue}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          onSave={handleSaveKey}
          availableProviders={availableProviders}
          saving={saving}
        />
      </Box>
    </Box>
  );
}
