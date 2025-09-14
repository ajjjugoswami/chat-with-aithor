/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, Person } from "@mui/icons-material";
import { Avatar, Box, Button, Typography, useMediaQuery } from "@mui/material";
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
}) => {
  const isTablet = useMediaQuery("(max-width: 960px)");
  const isSmallScreen = useMediaQuery("(max-width: 480px)");
  return (
    <>
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
                Choose a user from the left to view and manage their API keys.
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
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
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
