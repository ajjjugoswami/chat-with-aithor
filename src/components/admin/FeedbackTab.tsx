import { useState, useEffect } from "react";
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
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
} from "@mui/material";
import {
  Visibility,
  Delete,
} from '@mui/icons-material';
import { useTheme } from "../../hooks/useTheme";

interface Feedback {
  _id: string;
  name: string;
  email: string;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

interface FeedbackResponse {
  feedback: Feedback[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalFeedback: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function FeedbackTab() {
  const { mode } = useTheme();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [pageSize] = useState(10);

  // View feedback dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );

  // Delete confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<Feedback | null>(null);

  const fetchFeedback = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://aithor-be.vercel.app/api/feedback/admin?page=${page}&limit=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }

      const data: FeedbackResponse = await response.json();
      setFeedback(data.feedback);
      setCurrentPage(data.pagination?.currentPage || 1);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalFeedback(data.pagination?.totalFeedback || data.feedback.length);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleViewFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setViewDialogOpen(true);
  };

  const handleDeleteFeedback = async (feedback: Feedback) => {
    setFeedbackToDelete(feedback);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!feedbackToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://aithor-be.vercel.app/api/feedback/admin/${feedbackToDelete._id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete feedback');
      }

      // Refresh the feedback list
      fetchFeedback(currentPage);
      setConfirmDialogOpen(false);
      setFeedbackToDelete(null);
    } catch (err) {
      console.error('Error deleting feedback:', err);
      alert('Failed to delete feedback');
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

  if (loading && feedback.length === 0) {
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

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: mode === "light" ? "#ffffff" : "#2a2a2a",
          "& .MuiTableCell-root": {
            borderColor: mode === "light" ? "#e0e0e0" : "#404040",
          },
          position: "relative",
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
              backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(42, 42, 42, 0.8)",
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
            {feedback.map((item) => (
              <TableRow key={item._id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {item.name}
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
                  <Box sx={{ display: 'flex', gap: 1 }}>
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

      {feedback.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">No feedback found.</Typography>
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
          Showing {feedback.length} of {totalFeedback} feedback items
        </Typography>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => {
            setCurrentPage(page);
            fetchFeedback(page);
          }}
          color="primary"
          size="medium"
          showFirstButton
          showLastButton
        />
      </Box>

      {/* View Feedback Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Feedback Details</DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  From
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedFeedback.name} ({selectedFeedback.email})
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body2">
                  {formatDate(selectedFeedback.createdAt)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Feedback
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                >
                  {selectedFeedback.feedback}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete feedback from {feedbackToDelete?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
