import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLoaderData } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { type Dayjs } from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { authenticatedFetch } from '@src/helpers/api';
import { isAuthenticated } from '@src/store/authUser';
import type { Task } from '@src/types/task';
import { PRIMARY_COLOR } from '@src/constants/colors';

interface TaskFormData {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  deadline: Dayjs | null;
}

function TaskEdit() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const loaderData = useLoaderData() as Task | undefined;
  const [loading, setLoading] = useState(!loaderData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    deadline: null,
  });
  const [touched, setTouched] = useState<{
    title: boolean;
    deadline: boolean;
  }>({
    title: false,
    deadline: false,
  });

  useEffect(() => {
    // Use loader data if available
    if (loaderData) {
      setFormData({
        title: loaderData.title,
        description: loaderData.description || '',
        status: loaderData.status,
        priority: loaderData.priority,
        deadline: loaderData.deadline ? dayjs(loaderData.deadline) : null,
      });
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

          const task: Task = await response.json();
          setFormData({
            title: task.title,
            description: task.description || '',
            status: task.status,
            priority: task.priority,
            deadline: task.deadline ? dayjs(task.deadline) : null,
          });
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

  const handleChange = (field: keyof TaskFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    if (field === 'title') {
      setTouched({ ...touched, title: true });
    }
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setFormData({
      ...formData,
      deadline: newValue,
    });
    setTouched({ ...touched, deadline: true });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }

    if (!params.id) {
      setToastMessage('Task ID is missing');
      setToastOpen(true);
      return;
    }

    // Mark all required fields as touched
    setTouched({ title: true, deadline: true });

    if (!formData.title.trim()) {
      setToastMessage('Title is required');
      setToastOpen(true);
      return;
    }

    if (!formData.deadline) {
      setToastMessage('Deadline is required');
      setToastOpen(true);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload: Partial<Task> = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        priority: formData.priority,
        deadline: formData.deadline ? formData.deadline.format('YYYY-MM-DD') : null,
      };

      const response = await authenticatedFetch(`/api/tasks/${params.id}/`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }, navigate);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Failed to update task');
      }

      // Redirect to task detail page on success
      navigate(`/tasks/${params.id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while updating the task');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !formData.title) {
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
          onClick={() => navigate(`/tasks/${params.id}`)}
          sx={{ mb: 2 }}
        >
          Back to Task
        </Button>

        <Paper sx={{ 
          p: 4, 
          maxWidth: 600, 
          mx: 'auto',
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Task
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Title"
            required
            fullWidth
            value={formData.title}
            onChange={handleChange('title')}
            onBlur={() => setTouched({ ...touched, title: true })}
            error={touched.title && !formData.title.trim()}
            helperText={touched.title && !formData.title.trim() ? 'Title is required' : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                },
                '&:hover fieldset': {
                  borderColor: PRIMARY_COLOR,
                },
                '&.Mui-focused fieldset': {
                  borderColor: PRIMARY_COLOR,
                },
              },
            }}
          />

          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            value={formData.description}
            onChange={handleChange('description')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                },
                '&:hover fieldset': {
                  borderColor: PRIMARY_COLOR,
                },
                '&.Mui-focused fieldset': {
                  borderColor: PRIMARY_COLOR,
                },
              },
            }}
          />

          <FormControl fullWidth>
            <FormLabel>Status</FormLabel>
            <TextField
              select
              value={formData.status}
              onChange={handleChange('status')}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  },
                  '&:hover fieldset': {
                    borderColor: PRIMARY_COLOR,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: PRIMARY_COLOR,
                  },
                },
              }}
            >
              <MenuItem value="TODO">Todo</MenuItem>
              <MenuItem value="DOING">Doing</MenuItem>
              <MenuItem value="DONE">Done</MenuItem>
            </TextField>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel>Priority</FormLabel>
            <TextField
              select
              value={formData.priority}
              onChange={handleChange('priority')}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  },
                  '&:hover fieldset': {
                    borderColor: PRIMARY_COLOR,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: PRIMARY_COLOR,
                  },
                },
              }}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </TextField>
          </FormControl>

          <DatePicker
            label="Deadline"
            value={formData.deadline}
            onChange={handleDateChange}
            onOpen={() => setTouched({ ...touched, deadline: true })}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                onBlur: () => setTouched({ ...touched, deadline: true }),
                error: touched.deadline && !formData.deadline,
                helperText: touched.deadline && !formData.deadline ? 'Deadline is required' : '',
                sx: {
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                    },
                    '&:hover fieldset': {
                      borderColor: PRIMARY_COLOR,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: PRIMARY_COLOR,
                    },
                  },
                },
              },
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="text"
              onClick={() => navigate(`/tasks/${params.id}`)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'Update Task'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
    </LocalizationProvider>
  );
}

export default TaskEdit;

