import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { Person, Add, VpnKey } from "@mui/icons-material";
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

  const [tabValue, setTabValue] = useState(0);
  const [usersWithKeys, setUsersWithKeys] = useState<UserWithKeys[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Add/Edit Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithKeys | null>(null);
  const [editingKey, setEditingKey] = useState<ServerAPIKey | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");

  // Menu state for API key cards
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedKey, setSelectedKey] = useState<ServerAPIKey | null>(null);

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
  const isAdmin = user?.email === "goswamiajay526@gmail.com";

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsersAndKeys();
    }
  }, [isAdmin]);

  const fetchAllUsersAndKeys = async () => {
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
  };

  const handleSaveKey = async () => {
    if (
      !selectedUser ||
      !newKeyName.trim() ||
      !newKeyValue.trim() ||
      !selectedProvider
    ) {
      setError("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const keyData = {
        provider: selectedProvider,
        key: newKeyValue.trim(),
        name: newKeyName.trim(),
        isDefault: false,
      };

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
    }
  };

  const handleDeleteKey = async (userId: string, keyId: string) => {
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
    }
    handleCloseMenu();
  };

  const handleSetActive = async (userId: string, keyId: string) => {
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
    }
    handleCloseMenu();
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
    setNewKeyValue("");
    setSelectedProvider(key.provider);
    setDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setEditingKey(null);
    setNewKeyName("");
    setNewKeyValue("");
    setSelectedProvider("");
    setError("");
  };

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    key: ServerAPIKey
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedKey(key);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedKey(null);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
        p: isMobile ? 2 : 4,
      }}
    >
      <Box sx={{ maxWidth: "100%", mx: "auto" }}>
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
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 3,
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
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: (theme) => theme.shadows[6],
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <img
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                        }}
                        src={user.picture || ""}
                      />

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontSize: "1rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {u.name || u.email}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", fontSize: "0.85rem" }}
                        >
                          {u.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}
                    >
                      {u.apiKeys.slice(0, 3).map((k) => (
                        <Box
                          key={k._id}
                          sx={{
                            bgcolor: "primary.light",
                            color: "primary.contrastText",
                            px: 1.5,
                            py: 0.6,
                            borderRadius: 2,
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          {k.provider}
                        </Box>
                      ))}
                      {u.apiKeys.length > 3 && (
                        <Box
                          sx={{
                            bgcolor: "grey.300",
                            px: 1.5,
                            py: 0.6,
                            borderRadius: 2,
                            fontSize: "0.8rem",
                            color: "text.secondary",
                            fontWeight: 500,
                          }}
                        >
                          +{u.apiKeys.length - 3} more
                        </Box>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                        mt: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => handleOpenAddDialog(u)}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                        }}
                      >
                        Add Key
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<VpnKey />}
                        onClick={() => {
                          setSelectedUser(u);
                          setTabValue(1);
                        }}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                      >
                        View Keys
                      </Button>
                    </Box>
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
              gap: 3,
              alignItems: "flex-start",
              flexDirection: { xs: "column", md: "row" },
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
                {usersWithKeys.map((u) => (
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

            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {selectedUser
                    ? selectedUser.name || selectedUser.email
                    : "Select a user"}
                </Typography>
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
              </Box>

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
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
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
                      menuAnchor={menuAnchor}
                      onMenuOpen={handleOpenMenu}
                      onMenuClose={handleCloseMenu}
                      selectedKey={selectedKey}
                    />
                  ))}
                </Box>
              )}
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
        />
      </Box>
    </Box>
  );
}
