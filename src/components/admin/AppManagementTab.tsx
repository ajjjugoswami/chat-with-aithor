import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  CircularProgress,
  Stack,
  useTheme,
} from "@mui/material";
import { Settings, Refresh, Key } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchAppManagementData,
  clearError,
  resetInitialized,
  type UserQuota,
} from "../../store/slices/appManagementSlice";

interface UserQuotaGroup {
  user: {
    _id: string;
    email: string;
    name?: string;
  } | null;
  openai: UserQuota | null;
  gemini: UserQuota | null;
}

const API_BASE_URL = "https://aithor-be.vercel.app/api";

const AppManagementTab = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { appKeys, userQuotas, loading, error } = useAppSelector(
    (state) => state.appManagement
  );

  // Component local state for form handling
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");

  // App key form state
  const [selectedProvider, setSelectedProvider] = useState<"openai" | "gemini">(
    "openai"
  );
  const [apiKey, setApiKey] = useState("");
  const [savingKey, setSavingKey] = useState(false);
  // Edit key dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editKeyId, setEditKeyId] = useState<string | null>(null);
  const [editKeyValue, setEditKeyValue] = useState("");

  // Reset quota dialog
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<UserQuota | null>(null);

  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Theme-aware colors
  const cardBgColor =
    theme.palette.mode === "light" ? "background.paper" : "grey.900";
  const sectionBgColor =
    theme.palette.mode === "light" ? "grey.50" : "grey.800";
  const borderColor = theme.palette.mode === "light" ? "divider" : "grey.700";

  // Remove initialization logic from AppManagementTab - handled by AppManagementPage
  // const isInitializedRef = useRef(false);
  // useEffect(() => { ... }, [dispatch, initialized]);

  const handleRefresh = () => {
    dispatch(clearError());
    dispatch(resetInitialized());
    dispatch(fetchAppManagementData());
  };

  const handleSaveAppKey = async () => {
    if (!apiKey.trim()) {
      setLocalError("API key is required");
      return;
    }

    setSavingKey(true);
    setLocalError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/admin/app-key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          provider: selectedProvider,
          key: apiKey.trim(),
        }),
      });

      if (response.ok) {
        setSuccess(
          `${
            selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)
          } API key updated successfully`
        );
        setApiKey("");
        // Refresh data after successful save
        dispatch(fetchAppManagementData());
      } else {
        const errorData = await response.json();
        setLocalError(errorData.error || "Failed to save API key");
      }
    } catch (error) {
      setLocalError("Network error occurred");
      console.error("Error saving app key:", error);
    } finally {
      setSavingKey(false);
    }
  };

  const handleResetQuota = async () => {
    if (!selectedQuota || !selectedQuota.userId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/admin/reset-quota/${selectedQuota.userId._id}/${selectedQuota.provider}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSuccess("Quota reset successfully");
        // Refresh data after successful reset
        dispatch(fetchAppManagementData());
        setResetDialogOpen(false);
        setSelectedQuota(null);
      } else {
        const errorData = await response.json();
        setLocalError(errorData.error || "Failed to reset quota");
      }
    } catch (error) {
      setLocalError("Network error occurred");
      console.error("Error resetting quota:", error);
    }
  };

  const getProviderDisplayName = (provider: string) => {
    return provider === "openai" ? "OpenAI" : "Gemini";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading...</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button
            size="small"
            onClick={() => {
              dispatch(clearError());
              handleRefresh();
            }}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      )}
      {/* App Keys Management */}
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1, sm: 2 },
              mb: 3,
            }}
          >
            <Key
              sx={{
                color: "primary.main",
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                fontWeight: 600,
              }}
            >
              App API Keys Management
            </Typography>
          </Box>

          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || localError}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Form Layout */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: { xs: 2, sm: 3 },
              alignItems: "end",
            }}
          >
            <TextField
              select
              fullWidth
              label="Provider"
              value={selectedProvider}
              onChange={(e) =>
                setSelectedProvider(e.target.value as "openai" | "gemini")
              }
              SelectProps={{ native: true }}
              size={isMobile ? "small" : "medium"}
            >
              <option value="openai">OpenAI (Free Access)</option>
              <option value="gemini">Gemini (Free Access)</option>
            </TextField>

            <TextField
              fullWidth
              label="API Key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key"
              size={isMobile ? "small" : "medium"}
            />

            <Button
              variant="contained"
              onClick={handleSaveAppKey}
              disabled={savingKey || !apiKey.trim()}
              startIcon={savingKey ? <CircularProgress size={16} /> : <Key />}
              size={isMobile ? "small" : "medium"}
              sx={{
                height: "fit-content",
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              {savingKey ? "Saving..." : "Save API Key"}
            </Button>
          </Box>

          {/* Current App Keys */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                fontWeight: 600,
                fontSize: { xs: "1rem", sm: "1.125rem" },
              }}
            >
              Current App Keys
            </Typography>

            {isMobile ? (
              // Mobile Card Layout
              <Stack spacing={2}>
                {appKeys.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      No app keys configured
                    </Typography>
                  </Paper>
                ) : (
                  appKeys.map((key) => (
                    <Card
                      key={key._id}
                      variant="outlined"
                      sx={{
                        bgcolor: cardBgColor,
                        borderColor: borderColor,
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                            {getProviderDisplayName(key.provider)}
                          </Typography>
                          <Chip
                            label={key.isActive ? "Active" : "Inactive"}
                            color={key.isActive ? "success" : "error"}
                            size="small"
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Usage Count
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {key.usageCount}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Last Used
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {key.lastUsed
                                ? new Date(key.lastUsed).toLocaleDateString()
                                : "Never"}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          fullWidth
                          onClick={() => {
                            setEditKeyId(key._id);
                            setEditKeyValue("");
                            setEditDialogOpen(true);
                          }}
                        >
                          Edit Key
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Stack>
            ) : (
              // Desktop Table Layout
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Provider</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Usage Count</TableCell>
                      <TableCell>Last Used</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appKeys.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No app keys configured
                        </TableCell>
                      </TableRow>
                    ) : (
                      appKeys.map((key) => (
                        <TableRow key={key._id}>
                          <TableCell>
                            {getProviderDisplayName(key.provider)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={key.isActive ? "Active" : "Inactive"}
                              color={key.isActive ? "success" : "error"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{key.usageCount}</TableCell>
                          <TableCell>
                            {key.lastUsed
                              ? new Date(key.lastUsed).toLocaleDateString()
                              : "Never"}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setEditKeyId(key._id);
                                setEditKeyValue("");
                                setEditDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
          {/* Edit Key Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
          >
            <DialogTitle>Edit App Key</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="New API Key"
                type="password"
                value={editKeyValue}
                onChange={(e) => setEditKeyValue(e.target.value)}
                placeholder="Enter new API key"
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={async () => {
                  if (!editKeyId || !editKeyValue.trim()) return;
                  setSavingKey(true);
                  setLocalError("");
                  setSuccess("");
                  try {
                    const token = localStorage.getItem("token");
                    const response = await fetch(
                      `${API_BASE_URL}/admin/app-key/${editKeyId}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ key: editKeyValue.trim() }),
                      }
                    );
                    if (response.ok) {
                      setSuccess("API key updated successfully");
                      setEditDialogOpen(false);
                      setEditKeyId(null);
                      setEditKeyValue("");
                      // Refresh data after successful update
                      dispatch(fetchAppManagementData());
                    } else {
                      const errorData = await response.json();
                      setLocalError(
                        errorData.error || "Failed to update API key"
                      );
                    }
                  } catch (error) {
                    setLocalError("Network error occurred");
                    console.error("Error updating app key:", error);
                  } finally {
                    setSavingKey(false);
                  }
                }}
                variant="contained"
                color="primary"
                disabled={savingKey || !editKeyValue.trim()}
              >
                {savingKey ? "Saving..." : "Update Key"}
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>

      {/* User Quotas */}
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 2, sm: 0 },
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Settings
                sx={{
                  color: "primary.main",
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  fontWeight: 600,
                }}
              >
                User Quota Usage
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
              size={isMobile ? "small" : "medium"}
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 2, sm: 3 },
                alignSelf: { xs: "flex-start", sm: "auto" },
              }}
            >
              {isMobile ? "Refresh" : "Refresh Data"}
            </Button>
          </Box>

          {isMobile ? (
            // Mobile Card Layout for User Quotas
            <Stack spacing={2}>
              {userQuotas.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No quota data available
                  </Typography>
                </Paper>
              ) : (
                Object.values(
                  userQuotas
                    .filter(
                      (quota) =>
                        quota.provider === "openai" ||
                        quota.provider === "gemini"
                    )
                    .reduce((acc, quota) => {
                      const userId = quota.userId?._id || "unknown";
                      if (!acc[userId]) {
                        acc[userId] = {
                          user: quota.userId,
                          openai: null,
                          gemini: null,
                        };
                      }
                      if (quota.provider === "openai") {
                        acc[userId].openai = quota;
                      } else if (quota.provider === "gemini") {
                        acc[userId].gemini = quota;
                      }
                      return acc;
                    }, {} as Record<string, UserQuotaGroup>)
                ).map((userGroup: UserQuotaGroup) => (
                  <Card
                    key={userGroup.user?._id || "unknown"}
                    variant="outlined"
                    sx={{
                      bgcolor: cardBgColor,
                      borderColor: borderColor,
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontSize: "1rem", fontWeight: 600 }}
                        >
                          {userGroup.user?.name ||
                            userGroup.user?.email ||
                            "Unknown User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {userGroup.user?.email || "No email"}
                        </Typography>
                      </Box>

                      {/* OpenAI Section */}
                      <Box
                        sx={{
                          mb: 2,
                          p: 1.5,
                          bgcolor: sectionBgColor,
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            OpenAI
                          </Typography>
                          {userGroup.openai ? (
                            <Chip
                              label={
                                userGroup.openai.usedCalls >=
                                userGroup.openai.maxFreeCalls
                                  ? "Exceeded"
                                  : "Active"
                              }
                              color={
                                userGroup.openai.usedCalls >=
                                userGroup.openai.maxFreeCalls
                                  ? "error"
                                  : "success"
                              }
                              size="small"
                            />
                          ) : (
                            <Chip
                              label="No Data"
                              color="default"
                              size="small"
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Used:{" "}
                          {userGroup.openai
                            ? `${userGroup.openai.usedCalls}/${userGroup.openai.maxFreeCalls}`
                            : "N/A"}
                        </Typography>
                        {userGroup.openai && (
                          <Button
                            size="small"
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 1 }}
                            onClick={() => {
                              setSelectedQuota(userGroup.openai);
                              setResetDialogOpen(true);
                            }}
                          >
                            Reset OpenAI Quota
                          </Button>
                        )}
                      </Box>

                      {/* Gemini Section */}
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: sectionBgColor,
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Gemini
                          </Typography>
                          {userGroup.gemini ? (
                            <Chip
                              label={
                                userGroup.gemini.usedCalls >=
                                userGroup.gemini.maxFreeCalls
                                  ? "Exceeded"
                                  : "Active"
                              }
                              color={
                                userGroup.gemini.usedCalls >=
                                userGroup.gemini.maxFreeCalls
                                  ? "error"
                                  : "success"
                              }
                              size="small"
                            />
                          ) : (
                            <Chip
                              label="No Data"
                              color="default"
                              size="small"
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Used:{" "}
                          {userGroup.gemini
                            ? `${userGroup.gemini.usedCalls}/${userGroup.gemini.maxFreeCalls}`
                            : "N/A"}
                        </Typography>
                        {userGroup.gemini && (
                          <Button
                            size="small"
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 1 }}
                            onClick={() => {
                              setSelectedQuota(userGroup.gemini);
                              setResetDialogOpen(true);
                            }}
                          >
                            Reset Gemini Quota
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          ) : (
            // Desktop Table Layout
            <TableContainer component={Paper} variant="outlined">
              <Table size={isSmallScreen ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>OpenAI Used/Free</TableCell>
                    <TableCell>OpenAI Status</TableCell>
                    <TableCell>Gemini Used/Free</TableCell>
                    <TableCell>Gemini Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userQuotas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No quota data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Group quotas by user
                    Object.values(
                      userQuotas
                        .filter(
                          (quota) =>
                            quota.provider === "openai" ||
                            quota.provider === "gemini"
                        )
                        .reduce((acc, quota) => {
                          const userId = quota.userId?._id || "unknown";
                          if (!acc[userId]) {
                            acc[userId] = {
                              user: quota.userId,
                              openai: null,
                              gemini: null,
                            };
                          }
                          if (quota.provider === "openai") {
                            acc[userId].openai = quota;
                          } else if (quota.provider === "gemini") {
                            acc[userId].gemini = quota;
                          }
                          return acc;
                        }, {} as Record<string, UserQuotaGroup>)
                    ).map((userGroup: UserQuotaGroup) => (
                      <TableRow key={userGroup.user?._id || "unknown"}>
                        <TableCell>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {userGroup.user?.name ||
                                userGroup.user?.email ||
                                "Unknown User"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {userGroup.user?.email || "No email"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {userGroup.openai
                            ? `${userGroup.openai.usedCalls}/${userGroup.openai.maxFreeCalls}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {userGroup.openai ? (
                            <Chip
                              label={
                                userGroup.openai.usedCalls >=
                                userGroup.openai.maxFreeCalls
                                  ? "Exceeded"
                                  : "Active"
                              }
                              color={
                                userGroup.openai.usedCalls >=
                                userGroup.openai.maxFreeCalls
                                  ? "error"
                                  : "success"
                              }
                              size="small"
                            />
                          ) : (
                            <Chip
                              label="No Data"
                              color="default"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {userGroup.gemini
                            ? `${userGroup.gemini.usedCalls}/${userGroup.gemini.maxFreeCalls}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {userGroup.gemini ? (
                            <Chip
                              label={
                                userGroup.gemini.usedCalls >=
                                userGroup.gemini.maxFreeCalls
                                  ? "Exceeded"
                                  : "Active"
                              }
                              color={
                                userGroup.gemini.usedCalls >=
                                userGroup.gemini.maxFreeCalls
                                  ? "error"
                                  : "success"
                              }
                              size="small"
                            />
                          ) : (
                            <Chip
                              label="No Data"
                              color="default"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                          >
                            {userGroup.openai && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setSelectedQuota(userGroup.openai);
                                  setResetDialogOpen(true);
                                }}
                              >
                                Reset OpenAI
                              </Button>
                            )}
                            {userGroup.gemini && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setSelectedQuota(userGroup.gemini);
                                  setResetDialogOpen(true);
                                }}
                              >
                                Reset Gemini
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Reset Quota Dialog */}
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>Reset User Quota</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset the quota for{" "}
            {selectedQuota?.userId?.name ||
              selectedQuota?.userId?.email ||
              "Unknown User"}
            ? This will reset their{" "}
            {getProviderDisplayName(selectedQuota?.provider || "")} usage to 0.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleResetQuota}
            variant="contained"
            color="primary"
          >
            Reset Quota
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppManagementTab;
