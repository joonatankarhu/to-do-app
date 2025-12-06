import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography variant="h1" sx={{ mb: 3, fontWeight: 700 }}>
          {error.status}
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
          {error.statusText || error.data}
        </Typography>
        <Typography
          component={Link}
          to="/"
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Go back home
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h1" sx={{ mb: 3, fontWeight: 700 }}>
        Oops!
      </Typography>
      <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
        Sorry, an unexpected error has occurred.
      </Typography>
      <Typography
        component={Link}
        to="/"
        sx={{
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        Go back home
      </Typography>
    </Box>
  );
}

export default ErrorBoundary;

