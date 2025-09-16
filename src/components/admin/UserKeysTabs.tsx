/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, Person } from "@mui/icons-material";
import { Avatar, Box, Button, CircularProgress, Typography, useMediaQuery } from "@mui/material";
import APIKeyCard from "./APIKeyCard";
import type { UserWithKeys } from "./types";

const UserKeysTabs = ({
  usersWithKeys,
  setSelectedUser,
  selectedUser,
  handleOpenAddDialog,
  handleOpenEditDialog,
  handleDeleteKey,
  handleSetActive,
  deleting,
  settingActive,
  loading,
}: {
  usersWithKeys: UserWithKeys[];
  setSelectedUser: (user: UserWithKeys) => void;
  selectedUser: UserWithKeys | null;
  handleOpenAddDialog: (user: UserWithKeys) => void;
  handleOpenEditDialog: (user: UserWithKeys, key: any) => void;
  handleDeleteKey: (userId: string, keyId: string) => void;
  handleSetActive: (userId: string, keyId: string) => void;
  deleting: boolean;
  settingActive: boolean;
  loading?: boolean;
}) => {
  const isTablet = useMediaQuery("(max-width: 960px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 480px)");
  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: isVerySmallScreen ? 1.5 : (isSmallScreen ? 2 : 3),
          alignItems: "flex-start",
          flexDirection: isTablet ? "column" : "row",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: 320 },
            bgcolor: "background.paper",
            borderRadius: isVerySmallScreen ? 2 : 3,
            p: isVerySmallScreen ? 2 : 3,
            boxShadow: (theme) => theme.shadows[3],
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              mb: isVerySmallScreen ? 1.5 : 2,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: isVerySmallScreen ? "0.9rem" : "1rem",
            }}
          >
            <Person /> Users
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : usersWithKeys.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No admin users found
                </Typography>
              </Box>
            ) : (
              usersWithKeys.map((u) => (
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
                      width: isVerySmallScreen ? 32 : 40,
                      height: isVerySmallScreen ? 32 : 40,
                      bgcolor: "primary.main",
                      fontSize: isVerySmallScreen ? "0.8rem" : "0.95rem",
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
                        fontSize: isVerySmallScreen ? "0.8rem" : "0.95rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {u.name || u.email}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ 
                        color: "text.secondary",
                        fontSize: isVerySmallScreen ? "0.7rem" : "0.75rem",
                      }}
                    >
                      {u.email}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>

        <Box sx={{ flex: 1, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: isVerySmallScreen ? "flex-start" : "center",
              mb: isVerySmallScreen ? 1.5 : 2,
              flexDirection: isVerySmallScreen ? "column" : "row",
              gap: isVerySmallScreen ? 1 : 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: isVerySmallScreen ? 1 : 2 }}>
              {selectedUser && (
                <Avatar
                  src={selectedUser.picture}
                  sx={{ 
                    width: isVerySmallScreen ? 36 : 48, 
                    height: isVerySmallScreen ? 36 : 48 
                  }}
                >
                  {(selectedUser.name || selectedUser.email || "")
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>
              )}
              <Typography 
                variant={isVerySmallScreen ? "subtitle1" : "h6"} 
                sx={{ 
                  fontWeight: 700,
                  fontSize: isVerySmallScreen ? "0.9rem" : "1.25rem",
                }}
              >
                {selectedUser
                  ? selectedUser.name || selectedUser.email
                  : "Select a user"}
              </Typography>
            </Box>
            {selectedUser && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size={isVerySmallScreen ? "small" : "small"}
                  startIcon={!isVerySmallScreen ? <Add /> : undefined}
                  onClick={() => handleOpenAddDialog(selectedUser)}
                  sx={{ 
                    textTransform: "none", 
                    borderRadius: 2,
                    fontSize: isVerySmallScreen ? "0.75rem" : "0.875rem",
                    px: isVerySmallScreen ? 1.5 : 2,
                  }}
                >
                  {isVerySmallScreen ? (
                    <Add sx={{ fontSize: 16 }} />
                  ) : (
                    "Add Key"
                  )}
                </Button>
              </Box>
            )}
          </Box>{" "}
          {!selectedUser ? (
            <Box
              sx={{
                p: isVerySmallScreen ? 4 : 6,
                bgcolor: "background.paper",
                borderRadius: isVerySmallScreen ? 2 : 2,
                border: "1px dashed",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "text.secondary",
                  fontSize: isVerySmallScreen ? "0.8rem" : "0.875rem",
                }}
              >
                Choose a user from the {isTablet ? "above" : "left"} to view and manage their API keys.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isVerySmallScreen 
                  ? "1fr" 
                  : isSmallScreen 
                    ? "repeat(auto-fit, minmax(280px, 1fr))" 
                    : "repeat(auto-fit, minmax(340px, 1fr))",
                gap: isVerySmallScreen ? 2 : 3,
              }}
            >
              {selectedUser.apiKeys.length === 0 && (
                <Box
                  sx={{
                    gridColumn: "1 / -1",
                    p: isVerySmallScreen ? 3 : 4,
                    bgcolor: "background.paper",
                    borderRadius: isVerySmallScreen ? 2 : 2,
                    border: "1px dashed",
                    borderColor: "divider",
                    textAlign: "center",
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "text.secondary",
                      fontSize: isVerySmallScreen ? "0.8rem" : "0.875rem",
                    }}
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
                  onDelete={(keyId) => handleDeleteKey(selectedUser._id, keyId)}
                  deleting={deleting}
                  settingActive={settingActive}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default UserKeysTabs;
