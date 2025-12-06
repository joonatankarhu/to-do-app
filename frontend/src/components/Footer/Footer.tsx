import { Link } from 'react-router-dom';
import { Box, Container, Typography, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { PRIMARY_COLOR } from '@src/constants/colors';
import { useAppSelector } from '@src/store/hooks';
import type { RootState } from '@src/store/store';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { user, loading } = useAppSelector((state: RootState) => state.authUser);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        mt: 'auto',
        pt: { xs: 3, md: 4 },
        pb: { xs: 2, md: 3 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: { xs: 2.5, md: 3 },
          }}
        >
          {/* Company Info */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: PRIMARY_COLOR,
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              Task Tracker
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#b0b0b0',
                lineHeight: 1.6,
                fontSize: '0.8125rem',
              }}
            >
              Stay organized and productive with our intuitive task management system.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: '0.9375rem', md: '1rem' },
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Link
                to="/"
                style={{
                  color: '#b0b0b0',
                  textDecoration: 'none',
                  fontSize: '0.8125rem',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = PRIMARY_COLOR;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#b0b0b0';
                }}
              >
                Dashboard
              </Link>
              {!loading && user && (
                <>
                  <Link
                    to="/tasks"
                    style={{
                      color: '#b0b0b0',
                      textDecoration: 'none',
                      fontSize: '0.8125rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = PRIMARY_COLOR;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#b0b0b0';
                    }}
                  >
                    My Tasks
                  </Link>
                  <Link
                    to="/tasks/create"
                    style={{
                      color: '#b0b0b0',
                      textDecoration: 'none',
                      fontSize: '0.8125rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = PRIMARY_COLOR;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#b0b0b0';
                    }}
                  >
                    New Task
                  </Link>
                  <Link
                    to="/profile"
                    style={{
                      color: '#b0b0b0',
                      textDecoration: 'none',
                      fontSize: '0.8125rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = PRIMARY_COLOR;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#b0b0b0';
                    }}
                  >
                    Profile
                  </Link>
                </>
              )}
              {!loading && !user && (
                <Link
                  to="/signin"
                  style={{
                    color: '#b0b0b0',
                    textDecoration: 'none',
                    fontSize: '0.8125rem',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = PRIMARY_COLOR;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#b0b0b0';
                  }}
                >
                  Sign In
                </Link>
              )}
            </Box>
          </Box>

          {/* Contact Info */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: '0.9375rem', md: '1rem' },
              }}
            >
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ color: PRIMARY_COLOR, fontSize: '14px' }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#b0b0b0',
                    fontSize: '0.8125rem',
                  }}
                >
                  support@fakemail.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FontAwesomeIcon
                  icon={faPhone}
                  style={{ color: PRIMARY_COLOR, fontSize: '14px' }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#b0b0b0',
                    fontSize: '0.8125rem',
                  }}
                >
                  +1 (000) 000-0000
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  style={{ color: PRIMARY_COLOR, fontSize: '14px', marginTop: '2px' }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#b0b0b0',
                    fontSize: '0.8125rem',
                    lineHeight: 1.5,
                  }}
                >
                  123 Test address<br />
                  Test City, Test Country
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: { xs: 2, md: 2.5 }, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: { xs: 1.5, md: 1.5 },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#888',
              fontSize: { xs: '0.7rem', md: '0.75rem' },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            © {currentYear} Task Tracker. All rights reserved.
          </Typography>
          <Box
            sx={{
              backgroundColor: 'rgba(100, 108, 255, 0.1)',
              border: `1px solid ${PRIMARY_COLOR}`,
              borderRadius: 2,
              px: { xs: 1, md: 1.5 },
              py: { xs: 0.5, md: 0.75 },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: PRIMARY_COLOR,
                fontSize: { xs: '0.65rem', md: '0.7rem' },
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              ⚠️ This is a demo application for portfolio purposes
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;

