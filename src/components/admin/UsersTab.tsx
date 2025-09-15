/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, AdminPanelSettings, Person, VpnKey, Search, Email, Clear } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  useMediaQuery,
  Pagination,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";

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
}: any) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isSmallScreen = useMediaQuery("(max-width: 480px)");

  // Local state for debounced inputs
  const [nameInput, setNameInput] = useState(searchName);
  const [emailInput, setEmailInput] = useState(searchEmail);
  const [nameTimer, setNameTimer] = useState<NodeJS.Timeout | null>(null);
  const [emailTimer, setEmailTimer] = useState<NodeJS.Timeout | null>(null);

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
  const handleNameChange = useCallback((value: string) => {
    setNameInput(value);
    if (nameTimer) clearTimeout(nameTimer);
    const timer = setTimeout(() => {
      setSearchName(value);
    }, 500);
    setNameTimer(timer);
  }, [nameTimer, setSearchName]);

  const handleEmailChange = useCallback((value: string) => {
    setEmailInput(value);
    if (emailTimer) clearTimeout(emailTimer);
    const timer = setTimeout(() => {
      if (value === '' || isValidEmail(value)) {
        setSearchEmail(value);
      }
    }, 500);
    setEmailTimer(timer);
  }, [emailTimer, setSearchEmail, isValidEmail]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (nameTimer) clearTimeout(nameTimer);
      if (emailTimer) clearTimeout(emailTimer);
    };
  }, [nameTimer, emailTimer]);

  console.log('UsersTab props:', { currentPage, totalPages, totalUsers, usersCount: usersWithKeys?.length }); // Debug log
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
                  <Person sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} />
                ),
                endAdornment: nameInput && (
                  <Clear
                    sx={{ cursor: "pointer", color: "text.secondary", fontSize: 18 }}
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
                  <Email sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} />
                ),
                endAdornment: emailInput && (
                  <Clear
                    sx={{ cursor: "pointer", color: "text.secondary", fontSize: 18 }}
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
            <Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
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
                    sx={{ fontSize: 14, cursor: "pointer", "&:hover": { opacity: 0.7 } }}
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
                    sx={{ fontSize: 14, cursor: "pointer", "&:hover": { opacity: 0.7 } }}
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
            {usersWithKeys.map((u: any) => (
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
        )}

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
    </>
  );
};

export default UsersTab;
