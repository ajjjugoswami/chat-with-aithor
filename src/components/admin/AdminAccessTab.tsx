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
  const isMediumScreen = useMediaQuery("(max-width: 768px)");
  
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
            p: { xs: 2, sm: 3 },
            boxShadow: (theme) => theme.shadows[3],
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 2, sm: 1 },
              mb: 3,
            }}
          >
            <AdminPanelSettings 
              sx={{ 
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
                color: "primary.main" 
              }} 
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                lineHeight: { xs: 1.2, sm: 1.5 },
              }}
            >
              Admin Access Management
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: "text.secondary", 
              mb: 3,
              fontSize: { xs: "0.875rem", sm: "1rem" },
              lineHeight: { xs: 1.4, sm: 1.6 },
            }}
          >
            Grant or revoke admin access for users. Admin users can access this
            admin panel and manage API keys for all users.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}>
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
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: (theme) => theme.shadows[2],
                    borderColor: "primary.light",
                  },
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 0 },
                  minHeight: { xs: "auto", sm: 80 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 2, sm: 3 },
                    flex: 1,
                    minWidth: 0,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Avatar
                    src={u.picture}
                    sx={{
                      width: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      bgcolor: u.isAdmin ? "primary.main" : "grey.400",
                      fontSize: { xs: "1.2rem", sm: "1.5rem" },
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {(u.name || u.email || "").charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "1rem", sm: "1.1rem" },
                          color: "text.primary",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: { xs: "200px", sm: "300px" },
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
                            px: { xs: 0.75, sm: 1 },
                            py: 0.25,
                            bgcolor: "success.main",
                            color: "success.contrastText",
                            borderRadius: 1,
                            fontSize: { xs: "0.65rem", sm: "0.7rem" },
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          <AdminPanelSettings sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }} />
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: "0.6rem", sm: "0.65rem" },
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
                        fontSize: { xs: "0.8rem", sm: "0.85rem" },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: { xs: "250px", sm: "350px" },
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
                    width: { xs: "100%", sm: "auto" },
                    justifyContent: { xs: "stretch", sm: "flex-end" },
                  }}
                >
                  {u.isAdmin ? (
                    <Button
                      variant="outlined"
                      size={isMediumScreen ? "small" : "medium"}
                      startIcon={<PersonRemove sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />}
                      onClick={() => handleToggleAdminAccess(u)}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        px: { xs: 2, sm: 3 },
                        py: { xs: 0.75, sm: 1 },
                        borderColor: "error.main",
                        color: "error.main",
                        minWidth: { xs: "100px", sm: 140 },
                        width: { xs: "100%", sm: "auto" },
                        "&:hover": {
                          borderColor: "error.dark",
                          bgcolor: "error.light",
                          color: "error.dark",
                        },
                      }}
                    >
                      {isSmallScreen ? "Remove" : "Remove Admin"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size={isMediumScreen ? "small" : "medium"}
                      startIcon={<PersonAdd sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />}
                      onClick={() => handleToggleAdminAccess(u)}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        px: { xs: 2, sm: 3 },
                        py: { xs: 0.75, sm: 1 },
                        bgcolor: "success.main",
                        minWidth: { xs: "100px", sm: 140 },
                        width: { xs: "100%", sm: "auto" },
                        "&:hover": {
                          bgcolor: "success.dark",
                        },
                      }}
                    >
                      {isSmallScreen ? "Grant" : "Grant Admin"}
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
