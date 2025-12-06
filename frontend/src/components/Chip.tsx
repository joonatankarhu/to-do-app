import { Chip } from '@mui/material';
import type { Task } from '@src/types/task';
import { formatTitleCase } from '@src/helpers/formatTitleCase';

interface StatusBadgeProps {
  status: Task['status'];
}

interface PriorityBadgeProps {
  priority: Task['priority'];
}

const getStatusColor = (status: Task['status']): string => {
  switch (status) {
    case 'DONE':
      return '#2e7d32'; // green
    case 'DOING':
      return '#ed6c02'; // orange
    case 'TODO':
      return '#757575'; // neutral gray
    default:
      return '#757575';
  }
};

const getStatusBgColor = (status: Task['status']): string => {
  switch (status) {
    case 'DONE':
      return '#e8f5e9'; // light green
    case 'DOING':
      return '#fff3e0'; // light orange
    case 'TODO':
      return '#f5f5f5'; // light gray
    default:
      return '#f5f5f5';
  }
};

const getPriorityColor = (priority: Task['priority']): string => {
  switch (priority) {
    case 'HIGH':
      return '#d32f2f'; // red
    case 'MEDIUM':
    case 'LOW':
    default:
      return '#757575'; // neutral gray
  }
};

const getPriorityBgColor = (priority: Task['priority']): string => {
  switch (priority) {
    case 'HIGH':
      return '#ffebee'; // light red
    case 'MEDIUM':
    case 'LOW':
    default:
      return '#f5f5f5'; // light gray
  }
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Chip
      label={formatTitleCase(status)}
      size="small"
      sx={{
        color: getStatusColor(status),
        backgroundColor: getStatusBgColor(status),
        fontWeight: 600,
        fontSize: '0.8125rem',
        height: '28px',
        '& .MuiChip-label': {
          padding: '0 12px',
        },
      }}
    />
  );
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Chip
      label={formatTitleCase(priority)}
      size="small"
      sx={{
        color: getPriorityColor(priority),
        backgroundColor: getPriorityBgColor(priority),
        fontWeight: 600,
        fontSize: '0.8125rem',
        height: '28px',
        '& .MuiChip-label': {
          padding: '0 12px',
        },
      }}
    />
  );
}

