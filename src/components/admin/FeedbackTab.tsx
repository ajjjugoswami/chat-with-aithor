import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Pagination,
  Card,
  CardContent,
  useMediaQuery,
  useTheme as useMuiTheme,
  Chip,
} from "@mui/material";
import { Visibility, Delete, Close } from "@mui/icons-material";
import { useTheme } from "../../hooks/useTheme";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchFeedbacks,
  deleteFeedback,
  type FeedbackItem,
} from "../../store/slices/feedbackSlice";

export default function FeedbackTab() {
  const { mode } = useTheme();
  const dispatch = useAppDispatch();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  // Get data from Redux store instead of local state
  const { feedbacks, loading, error, currentPage, totalPages, totalFeedbacks } =
    useAppSelector((state) => state.feedback);

  // View feedback dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(
    null
  );

  // Delete confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<FeedbackItem | null>(
    null
  );
  // Remove the deleting state since it's not needed

  // Remove the useEffect that was making direct API calls
  // Data fetching is now handled by FeedbackPage using Redux

  const handleViewFeedback = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setViewDialogOpen(true);
  };

  const handleDeleteFeedback = async (feedback: FeedbackItem) => {
    setFeedbackToDelete(feedback);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!feedbackToDelete) return;

    try {
      const result = await dispatch(deleteFeedback(feedbackToDelete._id));
      if (deleteFeedback.fulfilled.match(result)) {
        // Refresh the current page after successful deletion
        dispatch(fetchFeedbacks({ page: currentPage }));
        setConfirmDialogOpen(false);
        setFeedbackToDelete(null);
      }
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Mobile card component for feedback items
  const FeedbackCard = ({ feedback }: { feedback: FeedbackItem }) => (
    <Card
      sx={{
        mb: 2,
        borderRadius: "12px",
        border: "1px solid",
        borderColor: mode === "light" ? "#e0e0e0" : "#404040",
        backgroundColor: mode === "light" ? "#ffffff" : "#1a1a1a",
        boxShadow:
          mode === "light"
            ? "0 4px 12px rgba(0, 0, 0, 0.1)"
            : "0 4px 12px rgba(0, 0, 0, 0.3)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            mode === "light"
              ? "0 8px 25px rgba(0, 0, 0, 0.15)"
              : "0 8px 25px rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                mb: 0.5,
                color: mode === "light" ? "#1a1a1a" : "white",
              }}
            >
              {feedback.name || "N/A"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                color: mode === "light" ? "#6b7280" : "#9ca3af",
              }}
            >
              {feedback.email}
            </Typography>
            <Chip
              label={formatDate(feedback.createdAt)}
              size="small"
              variant="outlined"
              sx={{
                fontSize: "0.75rem",
                borderColor: mode === "light" ? "#d1d5db" : "#4b5563",
                color: mode === "light" ? "#374151" : "#d1d5db",
                backgroundColor: mode === "light" ? "#f9fafb" : "#374151",
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={() => handleViewFeedback(feedback)}
                sx={{
                  color: "#667eea",
                  "&:hover": {
                    backgroundColor: "#667eea15",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Feedback">
              <IconButton
                size="small"
                onClick={() => handleDeleteFeedback(feedback)}
                sx={{
                  color: "#ff6b6b",
                  "&:hover": {
                    backgroundColor: "#ff6b6b15",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            bgcolor: mode === "light" ? "#f9fafb" : "#2a2a2a",
            p: 2,
            borderRadius: "8px",
            border: "1px solid",
            borderColor: mode === "light" ? "#e5e7eb" : "#4b5563",
            lineHeight: 1.5,
            color: mode === "light" ? "#374151" : "#e5e7eb",
            fontSize: "0.875rem",
          }}
        >
          {feedback.feedback.length > 150
            ? `${feedback.feedback.substring(0, 150)}...`
            : feedback.feedback}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading && feedbacks.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight="bold">
          User Feedback
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Desktop Table View */}
      {!isMobile ? (
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: mode === "light" ? "#ffffff" : "#1a1a1a",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: mode === "light" ? "#e0e0e0" : "#404040",
            boxShadow:
              mode === "light"
                ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                : "0 4px 12px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            "& .MuiTableCell-root": {
              borderColor: mode === "light" ? "#e0e0e0" : "#404040",
              padding: "16px",
            },
            "& .MuiTableHead-root": {
              backgroundColor: mode === "light" ? "#f8f9fa" : "#2a2a2a",
              "& .MuiTableCell-head": {
                fontWeight: 700,
                color: mode === "light" ? "#1a1a1a" : "white",
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "2px solid",
                borderBottomColor: mode === "light" ? "#e0e0e0" : "#404040",
              },
            },
            "& .MuiTableBody-root": {
              "& .MuiTableRow-root": {
                "& .MuiTableCell-body": {
                  color: mode === "light" ? "#374151" : "#e5e7eb",
                  fontSize: "0.875rem",
                },
              },
            },
          }}
        >
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  mode === "light"
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(42, 42, 42, 0.8)",
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Feedback</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.map((item: FeedbackItem) => (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.name || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{item.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.feedback}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {formatDate(item.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewFeedback(item)}
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Feedback">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteFeedback(item)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        /* Mobile Card View */
        <Box sx={{ position: "relative" }}>
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  mode === "light"
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(42, 42, 42, 0.8)",
                zIndex: 1,
                borderRadius: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {feedbacks.map((item: FeedbackItem) => (
            <FeedbackCard key={item._id} feedback={item} />
          ))}
        </Box>
      )}

      {feedbacks.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">No feedback found.</Typography>
        </Box>
      )}

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          mt: 3,
          mb: 2,
          gap: 2,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ order: { xs: 2, sm: 1 } }}
        >
          Showing {feedbacks.length} of {totalFeedbacks} feedback items
        </Typography>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => {
            dispatch(fetchFeedbacks({ page }));
          }}
          color="primary"
          size={isMobile ? "small" : "medium"}
          showFirstButton={!isMobile}
          showLastButton={!isMobile}
          sx={{ order: { xs: 1, sm: 2 } }}
        />
      </Box>

      {/* View Feedback Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            bgcolor: mode === "light" ? "#ffffff" : "#1a1a1a",
            color: mode === "light" ? "#000000" : "white",
            borderRadius: isMobile ? "0px" : "20px",
            border: "none",
            boxShadow:
              mode === "light"
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
            overflow: "hidden",
            background:
              mode === "light"
                ? "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
                : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            minHeight: isMobile ? "100dvh" : "500px",
            maxHeight: isMobile ? "100dvh" : "90vh",
          },
        }}
      >
        {/* Custom Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            p: isMobile ? 2 : 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 1 : 2,
                  flex: 1,
                  minWidth: 0,
                  maxWidth: isMobile ? "calc(100% - 56px)" : "none",
                }}
              >
                <Box
                  sx={{
                    width: isMobile ? 32 : 48,
                    height: isMobile ? 32 : 48,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: isMobile ? "16px" : "24px",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                    flexShrink: 0,
                  }}
                >
                  <Visibility />
                </Box>
                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{
                      fontWeight: 700,
                      color: mode === "light" ? "#1a1a1a" : "white",
                      mb: 0.25,
                      fontSize: isMobile ? "0.95rem" : undefined,
                      lineHeight: 1.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Feedback Details
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: mode === "light" ? "#666" : "#ccc",
                      fontWeight: 500,
                      fontSize: isMobile ? "0.75rem" : undefined,
                      lineHeight: 1.3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {selectedFeedback?.name || "Anonymous"} -{" "}
                    {selectedFeedback
                      ? formatDate(selectedFeedback.createdAt)
                      : ""}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => setViewDialogOpen(false)}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                  "&:active": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                  alignSelf: "flex-start",
                  mt: isMobile ? 0 : 0,
                  ml: 1,
                  flexShrink: 0,
                  width: isMobile ? 40 : 48,
                  height: isMobile ? 40 : 48,
                }}
              >
                <Close
                  sx={{
                    color: mode === "light" ? "#666" : "white",
                    fontSize: isMobile ? "20px" : "24px",
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <DialogContent sx={{ p: isMobile ? 2 : 3, flex: 1 }}>
          {selectedFeedback && (
            <Box>
              <Box mb={3}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: mode === "light" ? "#666" : "#ccc",
                    fontWeight: 600,
                    mb: 1,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  From
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: mode === "light" ? "#1a1a1a" : "white",
                    fontSize: "1.1rem",
                  }}
                >
                  {selectedFeedback.name || "N/A"}
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 400,
                      color: mode === "light" ? "#6b7280" : "#9ca3af",
                      fontSize: "0.9rem",
                    }}
                  >
                    ({selectedFeedback.email})
                  </Typography>
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: mode === "light" ? "#666" : "#ccc",
                    fontWeight: 600,
                    mb: 1,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  Date
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: mode === "light" ? "#374151" : "#e5e7eb",
                    fontSize: "0.9rem",
                  }}
                >
                  {formatDate(selectedFeedback.createdAt)}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: mode === "light" ? "#666" : "#ccc",
                    fontWeight: 600,
                    mb: 2,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  Feedback
                </Typography>
                <Paper
                  sx={{
                    mt: 1,
                    p: 3,
                    bgcolor: mode === "light" ? "#f9fafb" : "#2a2a2a",
                    border: "1px solid",
                    borderColor: mode === "light" ? "#e5e7eb" : "#4b5563",
                    borderRadius: "12px",
                    boxShadow:
                      mode === "light"
                        ? "0 2px 8px rgba(0, 0, 0, 0.05)"
                        : "0 2px 8px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.7,
                      color: mode === "light" ? "#374151" : "#e5e7eb",
                      fontSize: "1rem",
                    }}
                  >
                    {selectedFeedback.feedback}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: isMobile ? 2 : 3,
            pt: 2,
            gap: 2,
          }}
        >
          <Button
            onClick={() => setViewDialogOpen(false)}
            fullWidth={isMobile}
            sx={{
              borderColor: "#667eea",
              color: "#667eea",
              borderWidth: "1.5px",
              borderRadius: 2,
              py: 1.25,
              px: 3,
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "none",
              letterSpacing: "0.025em",
              transition: "all 0.3s ease",
              backgroundColor: mode === "light" ? "#ffffff" : "#333333",
              "&:hover": {
                borderColor: "#667eea",
                backgroundColor: "#667eea08",
                boxShadow: "0 4px 12px #667eea20",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
                boxShadow: "0 2px 6px #667eea15",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            bgcolor: mode === "light" ? "#ffffff" : "#1a1a1a",
            color: mode === "light" ? "#000000" : "white",
            borderRadius: isMobile ? "0px" : "20px",
            border: "none",
            boxShadow:
              mode === "light"
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
            overflow: "hidden",
            background:
              mode === "light"
                ? "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
                : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            minHeight: isMobile ? "100dvh" : "300px",
            maxHeight: isMobile ? "100dvh" : "90vh",
          },
        }}
      >
        {/* Custom Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
            p: isMobile ? 2 : 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 1 : 2,
                  flex: 1,
                  minWidth: 0,
                  maxWidth: isMobile ? "calc(100% - 56px)" : "none",
                }}
              >
                <Box
                  sx={{
                    width: isMobile ? 32 : 48,
                    height: isMobile ? 32 : 48,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: isMobile ? "16px" : "24px",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                    flexShrink: 0,
                  }}
                >
                  <Delete />
                </Box>
                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{
                      fontWeight: 700,
                      color: mode === "light" ? "#1a1a1a" : "white",
                      mb: 0.25,
                      fontSize: isMobile ? "0.95rem" : undefined,
                      lineHeight: 1.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Confirm Delete
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: mode === "light" ? "#666" : "#ccc",
                      fontWeight: 500,
                      fontSize: isMobile ? "0.75rem" : undefined,
                      lineHeight: 1.3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    This action cannot be undone
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => setConfirmDialogOpen(false)}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                  "&:active": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                  alignSelf: "flex-start",
                  mt: isMobile ? 0 : 0,
                  ml: 1,
                  flexShrink: 0,
                  width: isMobile ? 40 : 48,
                  height: isMobile ? 40 : 48,
                }}
              >
                <Close
                  sx={{
                    color: mode === "light" ? "#666" : "white",
                    fontSize: isMobile ? "20px" : "24px",
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <DialogContent sx={{ p: isMobile ? 2 : 3, flex: 1 }}>
          <Typography
            sx={{
              color: mode === "light" ? "#1a1a1a" : "white",
              fontSize: "1rem",
              lineHeight: 1.6,
              mb: 2,
              textAlign: "center",
            }}
          >
            Are you sure you want to delete feedback from{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#ff6b6b" }}>
              {feedbackToDelete?.name || "N/A"}
            </Box>
            ? This action cannot be undone.
          </Typography>
          <Alert
            severity="warning"
            sx={{
              mt: 2,
              backgroundColor: mode === "light" ? "#fff3cd" : "#2d1b1b",
              color: mode === "light" ? "#856404" : "#d4a574",
              borderColor: mode === "light" ? "#ffeaa7" : "#5d4037",
            }}
          >
            <Typography variant="body2">
              <strong>Warning:</strong> This will permanently remove the
              feedback from the database.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions
          sx={{
            p: isMobile ? 2 : 3,
            pt: 2,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 2 },
          }}
        >
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            fullWidth={isMobile}
            sx={{
              borderColor: "#ff6b6b",
              color: "#ff6b6b",
              borderWidth: "1.5px",
              borderRadius: 2,
              py: 1.25,
              px: 3,
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "none",
              letterSpacing: "0.025em",
              transition: "all 0.3s ease",
              backgroundColor: mode === "light" ? "#ffffff" : "#333333",

              "&:active": {
                transform: "translateY(0)",
                boxShadow: "0 2px 6px #ff6b6b15",
              },
              order: { xs: 2, sm: 1 },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            fullWidth={isMobile}
            sx={{
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
              color: "white",
              borderRadius: 2,
              py: 1.25,
              px: 3,
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "none",
              letterSpacing: "0.025em",
              transition: "all 0.3s ease",

              "&:active": {
                transform: "translateY(0)",
                boxShadow: "0 2px 10px rgba(255, 107, 107, 0.4)",
              },
              order: { xs: 1, sm: 2 },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
