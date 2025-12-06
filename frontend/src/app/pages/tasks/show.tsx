import { useLoaderData, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Task } from '@src/types/task';
import { formatLocalDate } from '@src/helpers/dateFormatter';
import { formatTitleCase } from '@src/helpers/formatTitleCase';
import {
  CircularProgress,
  Alert,
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { authenticatedFetch } from '@src/helpers/api';
import { isAuthenticated } from '@src/store/authUser';

function TaskShow() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const loaderData = useLoaderData() as Task | undefined;
  const [task, setTask] = useState<Task | null>(loaderData || null);
  const [loading, setLoading] = useState(!loaderData);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Redirect if not logged in - check immediately on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // Use loader data if available
    if (loaderData) {
      setTask(loaderData);
      setLoading(false);
      return;
    }

    // If loader data is not available, fetch the task manually
    if (!loaderData && params.id) {
      const fetchTask = async () => {
        if (!isAuthenticated()) {
          navigate('/');
          return;
        }

        try {
          const response = await authenticatedFetch(`/api/tasks/${params.id}/`, {}, navigate);

          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Task not found');
            }
            throw new Error(`Failed to fetch task: ${response.statusText}`);
          }

          const data = await response.json();
          setTask(data);
          setError(null);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchTask();
    }
  }, [loaderData, params.id, navigate]);

  const handleDelete = async () => {
    if (!params.id || !isAuthenticated()) {
      return;
    }

    setDeleting(true);
    try {
      const response = await authenticatedFetch(`/api/tasks/${params.id}/`, {
        method: 'DELETE',
      }, navigate);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || 'Failed to delete task');
      }

      // Redirect to tasks list on success
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while deleting the task');
      }
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<FontAwesomeIcon icon={faArrowLeft} />} 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Tasks
        </Button>
      </Box>
    );
  }

  if (!task) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">Task not found</Alert>
        <Button 
          startIcon={<FontAwesomeIcon icon={faArrowLeft} />} 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Tasks
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained"
            startIcon={<FontAwesomeIcon icon={faEdit} />} 
            onClick={() => navigate(`/tasks/${task.id}/edit`)}
          >
            Edit Task
          </Button>
          <Button 
            variant="contained"
            color="error"
            startIcon={<FontAwesomeIcon icon={faTrash} />} 
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 5, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {task.title}
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Description:</strong> {task.description || 'No description'}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Status:</strong> {formatTitleCase(task.status)}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Priority:</strong> {formatTitleCase(task.priority)}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Deadline:</strong> {task.deadline ? formatLocalDate(task.deadline) : 'No deadline'}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Created at:</strong> {formatLocalDate(task.created_at)}
          </Typography>
          
          <Typography variant="body1">
            <strong>Updated at:</strong> {formatLocalDate(task.updated_at)}
          </Typography>
        </Box>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>Delete Task</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <FontAwesomeIcon icon={faTrash} />}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TaskShow;
