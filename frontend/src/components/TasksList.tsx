import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import type { Task } from '@src/types/task';
import { formatLocalDate } from '@src/helpers/dateFormatter';
import { PRIMARY_COLOR_LIGHT, PRIMARY_COLOR } from '@src/constants/colors';
import { StatusBadge, PriorityBadge } from '@src/components/Chip';

interface TasksListProps {
  tasks: Task[];
  deadlineSortAsc?: boolean;
  onDeadlineSortToggle?: () => void;
  prioritySortAsc?: boolean;
  onPrioritySortToggle?: () => void;
  statusSortAsc?: boolean;
  onStatusSortToggle?: () => void;
  statusFilter?: Task['status'] | 'ALL';
  onStatusFilterChange?: (value: Task['status'] | 'ALL') => void;
  priorityFilter?: Task['priority'] | 'ALL';
  onPriorityFilterChange?: (value: Task['priority'] | 'ALL') => void;
}

export default function TasksList({
  tasks,
  deadlineSortAsc,
  onDeadlineSortToggle,
  prioritySortAsc,
  onPrioritySortToggle,
  statusSortAsc,
  onStatusSortToggle,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
}: TasksListProps) {
  const navigate = useNavigate();

  const handleTaskClick = (taskId: number) => {
    navigate(`/tasks/${taskId}`);
  };

  const hasFilters = statusFilter !== undefined && priorityFilter !== undefined;
  const hasActiveFilters = hasFilters && (statusFilter !== 'ALL' || priorityFilter !== 'ALL');

  return (
    <TableContainer 
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        overflowX: 'auto',
        overflowY: 'visible',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#a8a8a8',
          },
        },
      }}
    >
      <Table sx={{ minWidth: 650, width: '100%' }} aria-label="tasks table">
        {hasFilters && (
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <TableCell 
                colSpan={5}
                sx={{ 
                  py: 1.5,
                  px: 2.5,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#666',
                      mr: 1,
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    Filters:
                  </Typography>
                  <FormControl 
                    sx={{ 
                      minWidth: { xs: '100%', sm: 160 },
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                      }
                    }}
                  >
                    <InputLabel sx={{ fontSize: '0.875rem' }}>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => onStatusFilterChange?.(e.target.value as Task['status'] | 'ALL')}
                      sx={{
                        fontSize: '0.875rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: PRIMARY_COLOR,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: PRIMARY_COLOR,
                        },
                      }}
                    >
                      <MenuItem value="ALL">All</MenuItem>
                      <MenuItem value="TODO">Todo</MenuItem>
                      <MenuItem value="DOING">Doing</MenuItem>
                      <MenuItem value="DONE">Done</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl 
                    sx={{ 
                      minWidth: { xs: '100%', sm: 160 },
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                      }
                    }}
                  >
                    <InputLabel sx={{ fontSize: '0.875rem' }}>Priority</InputLabel>
                    <Select
                      value={priorityFilter}
                      label="Priority"
                      onChange={(e) => onPriorityFilterChange?.(e.target.value as Task['priority'] | 'ALL')}
                      sx={{
                        fontSize: '0.875rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: PRIMARY_COLOR,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: PRIMARY_COLOR,
                        },
                      }}
                    >
                      <MenuItem value="ALL">All</MenuItem>
                      <MenuItem value="LOW">Low</MenuItem>
                      <MenuItem value="MEDIUM">Medium</MenuItem>
                      <MenuItem value="HIGH">High</MenuItem>
                    </Select>
                  </FormControl>

                  {hasActiveFilters && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        onStatusFilterChange?.('ALL');
                        onPriorityFilterChange?.('ALL');
                      }}
                      sx={{
                        ml: { xs: 0, sm: 'auto' },
                        mt: { xs: 1, sm: 0 },
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                        color: '#666',
                        '&:hover': {
                          borderColor: PRIMARY_COLOR,
                          color: PRIMARY_COLOR,
                          backgroundColor: 'rgba(100, 108, 255, 0.04)',
                        },
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
        )}
        <TableHead>
          <TableRow sx={{ backgroundColor: '#fafafa' }}>
            <TableCell 
              sx={{ 
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#666',
                py: 2,
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              }}
            >
              Title
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#666',
                py: 2,
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              }}
            >
              Description
            </TableCell>
            <TableCell 
              align="center"
              sx={{ 
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#666',
                py: 2,
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              }}
            >
              {onStatusSortToggle ? (
                <IconButton
                  size="small"
                  onClick={onStatusSortToggle}
                  sx={{
                    padding: '6px 8px',
                    borderRadius: 1,
                    color: '#666',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(100, 108, 255, 0.08)',
                      color: PRIMARY_COLOR,
                    },
                    '&:active': {
                      backgroundColor: 'rgba(100, 108, 255, 0.12)',
                    },
                  }}
                >
                  Status
                  <FontAwesomeIcon 
                    icon={statusSortAsc ? faArrowUp : faArrowDown} 
                    style={{ marginLeft: '6px', fontSize: '0.7rem' }} 
                  />
                </IconButton>
              ) : (
                'Status'
              )}
            </TableCell>
            <TableCell 
              align="center"
              sx={{ 
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#666',
                py: 2,
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              }}
            >
              {onPrioritySortToggle ? (
                <IconButton
                  size="small"
                  onClick={onPrioritySortToggle}
                  sx={{
                    padding: '6px 8px',
                    borderRadius: 1,
                    color: '#666',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(100, 108, 255, 0.08)',
                      color: PRIMARY_COLOR,
                    },
                    '&:active': {
                      backgroundColor: 'rgba(100, 108, 255, 0.12)',
                    },
                  }}
                >
                  Priority
                  <FontAwesomeIcon 
                    icon={prioritySortAsc ? faArrowUp : faArrowDown} 
                    style={{ marginLeft: '6px', fontSize: '0.7rem' }} 
                  />
                </IconButton>
              ) : (
                'Priority'
              )}
            </TableCell>
            <TableCell 
              align="right"
              sx={{ 
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#666',
                py: 2,
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              }}
            >
              {onDeadlineSortToggle ? (
                <IconButton
                  size="small"
                  onClick={onDeadlineSortToggle}
                  sx={{
                    padding: '6px 8px',
                    borderRadius: 1,
                    color: '#666',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(100, 108, 255, 0.08)',
                      color: PRIMARY_COLOR,
                    },
                    '&:active': {
                      backgroundColor: 'rgba(100, 108, 255, 0.12)',
                    },
                  }}
                >
                  Deadline
                  <FontAwesomeIcon 
                    icon={deadlineSortAsc ? faArrowUp : faArrowDown} 
                    style={{ marginLeft: '6px', fontSize: '0.7rem' }} 
                  />
                </IconButton>
              ) : (
                'Deadline'
              )}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" sx={{ color: '#999', fontWeight: 500 }}>
                    No tasks found
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#bbb', fontSize: '0.875rem' }}>
                    Create your first task to get started
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task, index) => (
              <TableRow
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: PRIMARY_COLOR_LIGHT,
                  },
                  '&:last-child td': { border: 0 },
                  borderBottom: index < tasks.length - 1 ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
                }}
              >
                <TableCell 
                  component="th" 
                  scope="row"
                  sx={{
                    py: 2.5,
                    fontWeight: 500,
                    fontSize: '0.9375rem',
                    color: '#1a1a1a',
                  }}
                >
                  {task.title}
                </TableCell>
                <TableCell
                  sx={{
                    py: 2.5,
                    fontSize: '0.875rem',
                    color: '#666',
                    maxWidth: '400px',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: task.description ? '#666' : '#bbb',
                    }}
                  >
                    {task.description || '-'}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ py: 2.5 }}>
                  <StatusBadge status={task.status} />
                </TableCell>
                <TableCell align="center" sx={{ py: 2.5 }}>
                  <PriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{
                    py: 2.5,
                    fontSize: '0.875rem',
                    color: '#666',
                    fontWeight: 500,
                  }}
                >
                  {formatLocalDate(task.deadline)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
