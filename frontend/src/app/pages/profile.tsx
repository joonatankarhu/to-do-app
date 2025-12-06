import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@src/store/hooks';
import type { RootState } from '@src/store/store';
import { setUser, clearUser } from '@src/store/authUser';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Snackbar,
  Divider,
  Avatar,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import { authenticatedFetch } from '@src/helpers/api';
import { isAuthenticated } from '@src/store/authUser';
import { PRIMARY_COLOR, PRIMARY_COLOR_HOVER } from '@src/constants/colors';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state: RootState) => state.authUser);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      navigate('/');
    }
  }, [loading, navigate]);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user && !isEditing) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
    }
  }, [user, isEditing]);

  const handleEdit = () => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
    }
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!isAuthenticated()) {
      setError('Not authenticated');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await authenticatedFetch('/api/user/update/', {
        method: 'PUT',
        body: JSON.stringify({
          first_name: firstName.trim() || '',
          last_name: lastName.trim() || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.detail || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      dispatch(setUser(updatedUser));
      setIsEditing(false);
      setToastMessage('Profile updated successfully');
      setToastOpen(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while updating the profile');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/signin');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">User not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Header Section with Avatar */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: PRIMARY_COLOR,
              fontSize: '2.5rem',
              fontWeight: 600,
              mb: 2,
            }}
          >
            {user.first_name ? user.first_name.charAt(0).toUpperCase() : (
              <FontAwesomeIcon icon={faUser} style={{ fontSize: '48px' }} />
            )}
          </Avatar>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 700,
              color: '#1a1a1a',
              mb: 0.5,
              textTransform: 'capitalize',
            }}
          >
            {user.first_name} {user.last_name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontSize: '0.875rem',
            }}
          >
            {user.email}
          </Typography>
        </Box>

        {/* Edit Button */}
        {!isEditing && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
              startIcon={<FontAwesomeIcon icon={faEdit} />}
              onClick={handleEdit}
              variant="outlined"
              sx={{
                textTransform: 'none',
                fontSize: '0.9375rem',
                px: 2.5,
                py: 1,
                borderRadius: 2,
                borderColor: PRIMARY_COLOR,
                color: PRIMARY_COLOR,
                fontWeight: 600,
                '&:hover': {
                  borderColor: PRIMARY_COLOR_HOVER,
                  backgroundColor: 'rgba(100, 108, 255, 0.04)',
                },
              }}
            >
              Edit Profile
            </Button>
          </Box>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }} 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Profile Information */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: '#fafafa',
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.06)',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                fontSize: '0.8125rem',
                fontWeight: 600,
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              First Name
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
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
            ) : (
              <Typography 
                variant="body1" 
                sx={{ 
                  textTransform: 'capitalize',
                  color: '#1a1a1a',
                  fontWeight: 500,
                  fontSize: '1rem',
                }}
              >
                {user.first_name || '-'}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: '#fafafa',
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.06)',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                fontSize: '0.8125rem',
                fontWeight: 600,
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Last Name
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
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
            ) : (
              <Typography 
                variant="body1" 
                sx={{ 
                  textTransform: 'capitalize',
                  color: '#1a1a1a',
                  fontWeight: 500,
                  fontSize: '1rem',
                }}
              >
                {user.last_name || '-'}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: '#fafafa',
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.06)',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                fontSize: '0.8125rem',
                fontWeight: 600,
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Username
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#1a1a1a',
                fontWeight: 500,
                fontSize: '1rem',
              }}
            >
              {user.username}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: '#fafafa',
              border: '1px solid',
              borderColor: 'rgba(0, 0, 0, 0.06)',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                fontSize: '0.8125rem',
                fontWeight: 600,
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Email
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#1a1a1a',
                fontWeight: 500,
                fontSize: '1rem',
              }}
            >
              {user.email}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        {isEditing && (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
            <Button
              startIcon={<FontAwesomeIcon icon={faTimes} />}
              onClick={handleCancel}
              disabled={saving}
              variant="outlined"
              sx={{
                textTransform: 'none',
                fontSize: '0.9375rem',
                px: 3,
                py: 1.25,
                borderRadius: 2,
                borderColor: 'rgba(0, 0, 0, 0.23)',
                color: '#666',
                fontWeight: 600,
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
              startIcon={saving ? <CircularProgress size={16} sx={{ color: '#ffffff' }} /> : <FontAwesomeIcon icon={faSave} />}
              onClick={handleSave}
              disabled={saving}
              variant="contained"
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
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 4, borderColor: 'rgba(0, 0, 0, 0.08)' }} />

        {/* Logout Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<FontAwesomeIcon icon={faSignOut} />}
            onClick={handleLogout}
            sx={{
              textTransform: 'none',
              fontSize: '0.9375rem',
              px: 3,
              py: 1.25,
              borderRadius: 2,
              borderColor: '#d32f2f',
              color: '#d32f2f',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#b71c1c',
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
              },
            }}
          >
            Logout
          </Button>
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
          severity="success"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

