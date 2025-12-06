import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  InputLabel,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import type { Dayjs } from 'dayjs';
import { authenticatedFetch } from '@src/helpers/api';
import { isAuthenticated } from '@src/store/authUser';
import type { Task } from '@src/types/task';
import { PRIMARY_COLOR, PRIMARY_COLOR_HOVER } from '@src/constants/colors';

interface TaskFormData {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  deadline: Dayjs | null;
}

function TaskCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

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
      navigate('/signin');
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

    setLoading(true);
    setError(null);

    try {
      const payload: Partial<Task> = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        priority: formData.priority,
        deadline: formData.deadline ? formData.deadline.format('YYYY-MM-DD') : null,
      };

      const response = await authenticatedFetch('/api/tasks/', {
        method: 'POST',
        body: JSON.stringify(payload),
      }, navigate);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Failed to create task');
      }

      // Redirect to tasks list on success
      navigate('/tasks');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while creating the task');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: '800px', mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
        <Button
          startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
          onClick={() => navigate('/tasks')}
          sx={{
            mb: 3,
            color: '#666',
            textTransform: 'none',
            fontSize: '0.875rem',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              color: PRIMARY_COLOR,
            },
          }}
        >
          Back to Tasks
        </Button>

        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: '#1a1a1a',
              mb: 0.5,
              fontSize: { xs: '1.75rem', sm: '2rem' }
            }}
          >
            New Task
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontSize: '0.875rem',
              mb: 4
            }}
          >
            Create a new task to track your work
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }} 
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
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
                  backgroundColor: '#fafafa',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  },
                  '&:hover fieldset': {
                    borderColor: PRIMARY_COLOR,
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: PRIMARY_COLOR,
                    borderWidth: '2px',
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
                  backgroundColor: '#fafafa',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  },
                  '&:hover fieldset': {
                    borderColor: PRIMARY_COLOR,
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: PRIMARY_COLOR,
                    borderWidth: '2px',
                  },
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl 
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fafafa',
                  },
                }}
              >
                <InputLabel sx={{ fontSize: '0.875rem' }}>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: PRIMARY_COLOR,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: PRIMARY_COLOR,
                      borderWidth: '2px',
                    },
                  }}
                >
                  <MenuItem value="TODO">Todo</MenuItem>
                  <MenuItem value="DOING">Doing</MenuItem>
                  <MenuItem value="DONE">Done</MenuItem>
                </Select>
              </FormControl>

              <FormControl 
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fafafa',
                  },
                }}
              >
                <InputLabel sx={{ fontSize: '0.875rem' }}>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: PRIMARY_COLOR,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: PRIMARY_COLOR,
                      borderWidth: '2px',
                    },
                  }}
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                </Select>
              </FormControl>
            </Box>

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
                      backgroundColor: '#fafafa',
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                      },
                      '&:hover fieldset': {
                        borderColor: PRIMARY_COLOR,
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#ffffff',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: PRIMARY_COLOR,
                        borderWidth: '2px',
                      },
                    },
                  },
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/tasks')}
                disabled={loading}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.9375rem',
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  color: '#666',
                  '&:hover': {
                    borderColor: PRIMARY_COLOR,
                    color: PRIMARY_COLOR,
                    backgroundColor: 'rgba(100, 108, 255, 0.04)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: PRIMARY_COLOR,
                  color: '#ffffff',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.9375rem',
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(100, 108, 255, 0.3)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: PRIMARY_COLOR_HOVER,
                    boxShadow: '0 4px 12px rgba(100, 108, 255, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    backgroundColor: PRIMARY_COLOR,
                    opacity: 0.6,
                  },
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : 'Create Task'}
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
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}

export default TaskCreate;
