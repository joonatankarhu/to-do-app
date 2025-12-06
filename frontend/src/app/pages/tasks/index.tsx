import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TasksList from '@src/components/TasksList';
import type { Task } from '@src/types/task';
import {
  CircularProgress,
  Alert,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { authenticatedFetch } from '@src/helpers/api';
import { isAuthenticated } from '@src/store/authUser';
import { PRIMARY_COLOR, PRIMARY_COLOR_HOVER } from '@src/constants/colors';

function TasksIndex() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'ALL'>('ALL');
  const [deadlineSortAsc, setDeadlineSortAsc] = useState(true);
  const [prioritySortAsc, setPrioritySortAsc] = useState(false); // false = descending (HIGH first)
  const [statusSortAsc, setStatusSortAsc] = useState(true); // true = ascending (TODO -> DOING -> DONE)

  useEffect(() => {
    const fetchTasks = async () => {
      if (!isAuthenticated()) {
        navigate('/');
        return;
      }

      try {
        const response = await authenticatedFetch('/api/tasks/', {}, navigate);

        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }

        const data = await response.json();
        setTasks(data);
        setError(null);
      } catch (err) {
        // Only set error for non-auth related errors
        if (err instanceof Error && !err.message.includes('Unauthorized')) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  // Sort tasks by status first, then priority, then deadline
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Status sorting
    const statusOrder: Record<Task['status'], number> = { TODO: 1, DOING: 2, DONE: 3 };
    const statusA = statusOrder[a.status];
    const statusB = statusOrder[b.status];
    const statusDiff = statusSortAsc ? statusA - statusB : statusB - statusA;
    
    if (statusDiff !== 0) {
      return statusDiff;
    }

    // If statuses are equal, sort by priority
    const priorityOrder: Record<Task['priority'], number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };
    const priorityA = priorityOrder[a.priority];
    const priorityB = priorityOrder[b.priority];
    const priorityDiff = prioritySortAsc ? priorityA - priorityB : priorityB - priorityA;
    
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    // If priorities are equal, sort by deadline
    // Tasks without deadlines go to the end
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;

    // Compare deadlines
    const dateA = new Date(a.deadline).getTime();
    const dateB = new Date(b.deadline).getTime();
    return deadlineSortAsc ? dateA - dateB : dateB - dateA;
  });

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
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      {/* Header Section */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4 
        }}
      >
        <Box>
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
            Tasks
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontSize: '0.875rem'
            }}
          >
            {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'}
            {statusFilter !== 'ALL' || priorityFilter !== 'ALL' ? ' (filtered)' : ''}
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          onClick={() => navigate('/tasks/create')}
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          sx={{
            backgroundColor: PRIMARY_COLOR,
            color: '#ffffff',
            fontWeight: 600,
            px: 3,
            py: 1.25,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.9375rem',
            boxShadow: '0 2px 8px rgba(100, 108, 255, 0.3)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: PRIMARY_COLOR_HOVER,
              boxShadow: '0 4px 12px rgba(100, 108, 255, 0.4)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          New Task
        </Button>
      </Box>

      {/* Tasks List with integrated filters */}
      <TasksList
        tasks={sortedTasks}
        deadlineSortAsc={deadlineSortAsc}
        onDeadlineSortToggle={() => setDeadlineSortAsc(!deadlineSortAsc)}
        prioritySortAsc={prioritySortAsc}
        onPrioritySortToggle={() => setPrioritySortAsc(!prioritySortAsc)}
        statusSortAsc={statusSortAsc}
        onStatusSortToggle={() => setStatusSortAsc(!statusSortAsc)}
        statusFilter={statusFilter}
        onStatusFilterChange={(value) => setStatusFilter(value)}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={(value) => setPriorityFilter(value)}
      />
    </Box>
  );
}

export default TasksIndex;