/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, AdminPanelSettings, Person, VpnKey } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";

const UsersTab = ({
  usersWithKeys,
  loading,
  handleOpenAddDialog,
  setSelectedUser,
  setTabValue,
}: any) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isSmallScreen = useMediaQuery("(max-width: 480px)");
  return (
    <>
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
      </Box>
    </>
  );
};

export default UsersTab;
