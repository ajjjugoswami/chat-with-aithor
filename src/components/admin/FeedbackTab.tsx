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
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Card,
  CardContent,
  useMediaQuery,
  useTheme as useMuiTheme,
  Chip,
} from "@mui/material";
import {
  Visibility,
  Delete,
} from '@mui/icons-material';
import { useTheme } from "../../hooks/useTheme";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchFeedbacks, deleteFeedback, type FeedbackItem } from "../../store/slices/feedbackSlice";

export default function FeedbackTab() {
  const { mode } = useTheme();
  const dispatch = useAppDispatch();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  // Get data from Redux store instead of local state
  const {
    feedbacks,
    loading,
    error,
    currentPage,
    totalPages,
    totalFeedbacks,
  } = useAppSelector((state) => state.feedback);

  // View feedback dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(
    null
  );

  // Delete confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<FeedbackItem | null>(null);
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
      console.error('Error deleting feedback:', err);
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
    <Card sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
              {feedback.name || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {feedback.email}
            </Typography>
            <Chip 
              label={formatDate(feedback.createdAt)} 
              size="small" 
              variant="outlined" 
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={() => handleViewFeedback(feedback)}
                color="primary"
              >
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Feedback">
              <IconButton
                size="small"
                onClick={() => handleDeleteFeedback(feedback)}
                color="error"
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Typography variant="body2" sx={{ 
          bgcolor: mode === 'light' ? 'grey.50' : 'grey.900',
          p: 1.5,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          lineHeight: 1.4,
        }}>
          {feedback.feedback.length > 150 
            ? `${feedback.feedback.substring(0, 150)}...` 
            : feedback.feedback
          }
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
            backgroundColor: "background.paper",
            "& .MuiTableCell-root": {
              borderColor: "divider",
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
              {feedbacks.map((item: FeedbackItem) => (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.name || 'N/A'}
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
      ) : (
        /* Mobile Card View */
        <Box sx={{ position: 'relative' }}>
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
          flexDirection: { xs: 'column', sm: 'row' },
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
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1 
        }}>
          <Typography variant="h6">Feedback Details</Typography>
          {isMobile && (
            <IconButton 
              onClick={() => setViewDialogOpen(false)} 
              size="small"
              sx={{ ml: 1 }}
            >
              ✕
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          {selectedFeedback && (
            <Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  From
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedFeedback.name || 'N/A'} ({selectedFeedback.email})
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
                <Paper
                  sx={{
                    mt: 1,
                    p: 2,
                    bgcolor: mode === 'light' ? 'grey.50' : 'grey.900',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                  >
                    {selectedFeedback.feedback}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: 1 }}>
          <Button 
            onClick={() => setViewDialogOpen(false)}
            fullWidth={isMobile}
            variant={isMobile ? "contained" : "text"}
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
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography>
            Are you sure you want to delete feedback from {feedbackToDelete?.name || 'N/A'}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 }, 
          pt: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Button 
            onClick={() => setConfirmDialogOpen(false)}
            fullWidth={isMobile}
            sx={{ order: { xs: 2, sm: 1 } }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            fullWidth={isMobile}
            sx={{ order: { xs: 1, sm: 2 } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
