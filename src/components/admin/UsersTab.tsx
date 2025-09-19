/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Add,
  Person,
  Search,
  Email,
  Clear,
  Delete,
  Visibility,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import CustomLoading from '../CustomLoading';

const UsersTab = ({
  usersWithKeys,
  loading,
  handleOpenAddDialog,
  setSelectedUser,
  setTabValue,
  searchName,
  setSearchName,
  searchEmail,
  setSearchEmail,
  currentPage,
  totalPages,
  totalUsers,
  onPageChange,
  handleDeleteUser,
}: any) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isSmallScreen = useMediaQuery("(max-width: 480px)");

  // Local state for debounced inputs
  const [nameInput, setNameInput] = useState(searchName);
  const [emailInput, setEmailInput] = useState(searchEmail);
  const [nameTimer, setNameTimer] = useState<NodeJS.Timeout | null>(null);
  const [emailTimer, setEmailTimer] = useState<NodeJS.Timeout | null>(null);

  // Delete confirmation dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  // Email validation function
  const isValidEmail = useCallback((email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, []);

  // Sync local state with props
  useEffect(() => {
    setNameInput(searchName);
  }, [searchName]);

  useEffect(() => {
    setEmailInput(searchEmail);
  }, [searchEmail]);

  // Debounced handlers
  const handleNameChange = useCallback(
    (value: string) => {
      setNameInput(value);
      if (nameTimer) clearTimeout(nameTimer);
      const timer = setTimeout(() => {
        setSearchName(value);
      }, 500);
      setNameTimer(timer);
    },
    [nameTimer, setSearchName]
  );

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmailInput(value);
      if (emailTimer) clearTimeout(emailTimer);
      const timer = setTimeout(() => {
        if (value === "" || isValidEmail(value)) {
          setSearchEmail(value);
        }
      }, 500);
      setEmailTimer(timer);
    },
    [emailTimer, setSearchEmail, isValidEmail]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (nameTimer) clearTimeout(nameTimer);
      if (emailTimer) clearTimeout(emailTimer);
    };
  }, [nameTimer, emailTimer]);

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (userToDelete && handleDeleteUser) {
      await handleDeleteUser(userToDelete);
      setConfirmDialogOpen(false);
      setUserToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
        <CustomLoading size={48} />
      </Box>
    );
  }

  return (
    <>
      <Box>
        {/* Search Filters */}
        <Box
          sx={{
            mb: 3,
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: (theme) => theme.shadows[1],
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Search sx={{ fontSize: 20 }} />
            Filter Users
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: isSmallScreen ? "column" : "row",
              alignItems: isSmallScreen ? "stretch" : "center",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name..."
              value={nameInput}
              onChange={(e) => handleNameChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Person
                    sx={{ mr: 1, color: "text.secondary", fontSize: 18 }}
                  />
                ),
                endAdornment: nameInput && (
                  <Clear
                    sx={{
                      cursor: "pointer",
                      color: "text.secondary",
                      fontSize: 18,
                    }}
                    onClick={() => handleNameChange("")}
                  />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              size="small"
              placeholder="Search by email..."
              value={emailInput}
              onChange={(e) => handleEmailChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Email
                    sx={{ mr: 1, color: "text.secondary", fontSize: 18 }}
                  />
                ),
                endAdornment: emailInput && (
                  <Clear
                    sx={{
                      cursor: "pointer",
                      color: "text.secondary",
                      fontSize: 18,
                    }}
                    onClick={() => handleEmailChange("")}
                  />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {(searchName || searchEmail) && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                gap: 1,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Filtering by:
              </Typography>
              {searchName && (
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    borderRadius: 1,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  Name: "{searchName}"
                  <Clear
                    sx={{
                      fontSize: 14,
                      cursor: "pointer",
                      "&:hover": { opacity: 0.7 },
                    }}
                    onClick={() => handleNameChange("")}
                  />
                </Box>
              )}
              {searchEmail && (
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: "secondary.light",
                    color: "secondary.contrastText",
                    borderRadius: 1,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  Email: "{searchEmail}"
                  <Clear
                    sx={{
                      fontSize: 14,
                      cursor: "pointer",
                      "&:hover": { opacity: 0.7 },
                    }}
                    onClick={() => handleEmailChange("")}
                  />
                </Box>
              )}
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  handleNameChange("");
                  handleEmailChange("");
                }}
                sx={{
                  ml: "auto",
                  fontSize: "0.75rem",
                  py: 0.5,
                  px: 1.5,
                  borderRadius: 1,
                  textTransform: "none",
                }}
              >
                Clear All
              </Button>
            </Box>
          )}
        </Box>

      
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
            {usersWithKeys.map((u: any) => (
              <Box
                key={u._id}
                sx={{
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}08 100%)`,
                  borderRadius: 3,
                  p: 3,
                  boxShadow: (theme) => theme.shadows[3],
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minHeight: isSmallScreen ? 200 : 240,
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

                {/* Bottom Section - Badge on Left, Icons on Right */}
                <Box
                  sx={{
                    mt: "auto",
                    pt: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexDirection: "row",
                      gap: isSmallScreen ? 1 : 2,
                      flexWrap: isSmallScreen ? "wrap" : "nowrap",
                    }}
                  >
                    {/* User Type Badge - Left Side */}
                    <Box
                      sx={{
                        flexShrink: 0,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: u.isAdmin ? "warning.main" : "success.main",
                          color: "white",
                          px: isSmallScreen ? 1 : 1.5,
                          py: isSmallScreen ? 0.4 : 0.6,
                          borderRadius: 2,
                          fontSize: isSmallScreen ? "0.65rem" : "0.7rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          boxShadow: 1,
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {u.isAdmin ? "Admin" : "Standard"}
                      </Box>
                    </Box>

                    {/* Action Buttons - Right Side */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: isSmallScreen ? 0.5 : 1,
                        alignItems: "center",
                        justifyContent: "flex-end",
                        flexWrap: "wrap",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {/* Admin Actions - Only for Admin Users */}
                      {u.isAdmin && (
                        <>
                          <Tooltip title="Add API Key">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenAddDialog(u)}
                              sx={{
                                bgcolor: "primary.main",
                                color: "white",
                                width: isSmallScreen ? 32 : 36,
                                height: isSmallScreen ? 32 : 36,
                                borderRadius: 2,
                                boxShadow: 2,
                                "&:hover": {
                                  bgcolor: "primary.dark",
                                  transform: "scale(1.1)",
                                  boxShadow: 3,
                                },
                                transition: "all 0.2s ease-in-out",
                              }}
                            >
                              <Add sx={{ fontSize: isSmallScreen ? 16 : 18 }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="View API Keys">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedUser(u);
                                setTabValue(1);
                              }}
                              sx={{
                                bgcolor: "info.main",
                                color: "white",
                                width: isSmallScreen ? 32 : 36,
                                height: isSmallScreen ? 32 : 36,
                                borderRadius: 2,
                                boxShadow: 2,
                                "&:hover": {
                                  bgcolor: "info.dark",
                                  transform: "scale(1.1)",
                                  boxShadow: 3,
                                },
                                transition: "all 0.2s ease-in-out",
                              }}
                            >
                              <Visibility sx={{ fontSize: isSmallScreen ? 16 : 18 }} />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}

                      {/* Delete Action - Only for Standard Users */}
                      {!u.isAdmin && (
                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setUserToDelete(u);
                              setConfirmDialogOpen(true);
                            }}
                            sx={{
                              bgcolor: "error.main",
                              color: "white",
                              width: isSmallScreen ? 32 : 36,
                              height: isSmallScreen ? 32 : 36,
                              borderRadius: 2,
                              boxShadow: 2,
                              "&:hover": {
                                bgcolor: "error.dark",
                                transform: "scale(1.1)",
                                boxShadow: 3,
                              },
                              transition: "all 0.2s ease-in-out",
                            }}
                          >
                            <Delete sx={{ fontSize: isSmallScreen ? 16 : 18 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
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
                <Person sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography
                  variant="h6"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  No users found
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Users will appear here once they register
                </Typography>
              </Box>
            )}
          </Box>
       

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 3,
            mb: 2,
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {usersWithKeys.length} of {totalUsers} users
          </Typography>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size={isSmallScreen ? "small" : "medium"}
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user "
            {userToDelete?.name || userToDelete?.email}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone. All user data and API keys will be
            permanently removed.
          </Typography>
          {userToDelete?.isAdmin && (
            <Typography
              variant="body2"
              color="error.main"
              sx={{ mt: 1, fontWeight: 500 }}
            >
              ⚠️ Warning: This user is an administrator. Deleting an admin user
              may affect system functionality.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersTab;
