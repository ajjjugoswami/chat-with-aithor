/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AdminPanelSettings,
  PersonAdd,
  PersonRemove,
} from "@mui/icons-material";
import { Avatar, Box, Button, CircularProgress, Typography, useMediaQuery } from "@mui/material";
import type { UserWithKeys } from "./types";

const AdminAccessTab = ({
  handleToggleAdminAccess,
  usersWithKeys,
  loading,
}: {
  handleToggleAdminAccess: any;
  usersWithKeys: UserWithKeys[];
  loading?: boolean;
}) => {
  const isSmallScreen = useMediaQuery("(max-width: 480px)");
  return (
    <>
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
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Grant or revoke admin access for users. Admin users can access this
            admin panel and manage API keys for all users.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress size={32} />
              </Box>
            ) : usersWithKeys.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No users found
                </Typography>
              </Box>
            ) : (
              usersWithKeys.map((u) => (
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
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
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
            ))
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AdminAccessTab;
