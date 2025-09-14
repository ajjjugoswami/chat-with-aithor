import { useState, useEffect, useCallback } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";

import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import {
  AdminHeader,
  AdminTabs,
  AdminDialog,
  type UserWithKeys,
  type ServerAPIKey,
} from "./admin";
import UsersTab from "./admin/UsersTab";
import UserKeysTabs from "./admin/UserKeysTabs";
import AdminAccessTab from "./admin/AdminAccessTab";

export default function AdminPage() {
  const { mode } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isSmallScreen = useMediaQuery("(max-width: 480px)");

  const [tabValue, setTabValue] = useState(0);
  const [usersWithKeys, setUsersWithKeys] = useState<UserWithKeys[]>([]);
  console.log(usersWithKeys);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [settingActive, setSettingActive] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
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

  const fetchAllUsersAndKeys = useCallback(async (name = "", email = "") => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const params = new URLSearchParams();
      if (name) params.append('name', name);
      if (email) params.append('email', email);
      const queryString = params.toString();

      const url = queryString 
        ? `https://aithor-be.vercel.app/api/api-keys/admin/all?${queryString}`
        : "https://aithor-be.vercel.app/api/api-keys/admin/all";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isAdmin) {
        fetchAllUsersAndKeys(searchName, searchEmail);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchName, searchEmail, isAdmin, fetchAllUsersAndKeys]);

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
          <UsersTab
            usersWithKeys={usersWithKeys}
            loading={loading}
            setSelectedUser={setSelectedUser}
            handleOpenAddDialog={handleOpenAddDialog}
            setTabValue={setTabValue}
            searchName={searchName}
            setSearchName={setSearchName}
            searchEmail={searchEmail}
            setSearchEmail={setSearchEmail}
          />
        )}

        {tabValue === 1 && (
          <UserKeysTabs
            usersWithKeys={usersWithKeys}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
            handleOpenAddDialog={handleOpenAddDialog}
            handleOpenEditDialog={handleOpenEditDialog}
            handleDeleteKey={handleDeleteKey}
            handleSetActive={handleSetActive}
            deleting={deleting}
            settingActive={settingActive}
          />
        )}

        {tabValue === 2 && (
          <AdminAccessTab
            handleToggleAdminAccess={handleToggleAdminAccess}
            usersWithKeys={usersWithKeys}
          />
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
