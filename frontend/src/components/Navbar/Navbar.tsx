import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@src/store/hooks';
import { clearUser } from '@src/store/authUser';
import type { RootState } from '@src/store/store';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  useMediaQuery,
  Button,
  Avatar,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { PRIMARY_COLOR, PRIMARY_COLOR_HOVER } from '@src/constants/colors';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobileCustom = useMediaQuery('(max-width: 768px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isHomePage = location.pathname === '/';
  const isTasksPage = location.pathname === '/tasks';
  const isCreateTaskPage = location.pathname === '/tasks/create';
  const { user, loading } = useAppSelector((state: RootState) => state.authUser);

  useEffect(() => {
    if (!isMobileCustom) {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up or at the top
      if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
        setIsNavbarVisible(true);
      } else {
        // Hide navbar when scrolling down
        setIsNavbarVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileCustom]);

  // Always show navbar on desktop
  const shouldShowNavbar = !isMobileCustom || isNavbarVisible;

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/signin');
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ pt: 2, px: 2 }}>
        {!loading && !user && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
            <Button
              component={Link}
              to="/signin"
              variant="contained"
              fullWidth
              onClick={handleNavClick}
              sx={{
                backgroundColor: PRIMARY_COLOR,
                color: '#ffffff',
                fontWeight: 600,
                py: 1.25,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: PRIMARY_COLOR_HOVER,
                  color: '#ffffff',
                },
              }}
            >
              Sign In
            </Button>
            <Button
              component={Link}
              to="/signup"
              variant="outlined"
              fullWidth
              onClick={handleNavClick}
              sx={{
                borderColor: PRIMARY_COLOR,
                color: PRIMARY_COLOR,
                fontWeight: 600,
                py: 1.25,
                borderRadius: 2,
                '&:hover': {
                  borderColor: PRIMARY_COLOR_HOVER,
                  backgroundColor: 'rgba(100, 108, 255, 0.08)',
                  color: PRIMARY_COLOR_HOVER,
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        )}
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/"
              onClick={handleNavClick}
              selected={isHomePage}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'transparent',
                  fontWeight: 500,
                },
              }}
            >
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          {user && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/tasks"
                  onClick={handleNavClick}
                  selected={isTasksPage}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'transparent',
                      fontWeight: 500,
                    },
                  }}
                >
                  <ListItemText primary="My tasks" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/tasks/create"
                  onClick={handleNavClick}
                  selected={isCreateTaskPage}
                  sx={{
                    backgroundColor: isCreateTaskPage ? PRIMARY_COLOR : PRIMARY_COLOR,
                    color: '#ffffff',
                    fontWeight: 600,
                    borderRadius: 2,
                    mx: 1,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: PRIMARY_COLOR_HOVER,
                      color: '#ffffff',
                    },
                    '&.Mui-selected': {
                      backgroundColor: PRIMARY_COLOR_HOVER,
                      fontWeight: 600,
                    },
                    '& .MuiListItemText-primary': {
                      color: '#ffffff',
                    },
                  }}
                >
                  <ListItemText primary="New Task" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Box>
      {!loading && user && (
        <>
          <Box sx={{ mt: 'auto', px: 2, pt: 2, pb: 1 }}>
            <ListItemButton
              component={Link}
              to="/profile"
              onClick={handleNavClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                borderRadius: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: 'rgba(100, 108, 255, 0.08)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: PRIMARY_COLOR,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {user.first_name ? user.first_name.charAt(0).toUpperCase() : (
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: '18px' }} />
                )}
              </Avatar>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={{
                      textTransform: 'capitalize',
                      color: '#000000',
                      fontWeight: 600,
                    }}
                  >
                    {user.first_name}
                  </Typography>
                }
              />
            </ListItemButton>
          </Box>
          <Box sx={{ px: 2, pb: 2 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                backgroundColor: '#d32f2f',
                borderRadius: 2,
                color: '#ffffff',
                py: 1,
                justifyContent: 'center',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                },
                '& .MuiListItemText-primary': {
                  color: '#ffffff',
                  fontWeight: 600,
                  textAlign: 'center',
                },
              }}
            >
              <ListItemText primary="Logout" />
            </ListItemButton>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <div className="navbar">
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          ...(isMobileCustom && {
            transform: !shouldShowNavbar ? 'translateY(-100%)' : 'translateY(0)',
            transition: 'transform 0.3s ease-in-out',
          }),
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: '1200px', width: '100%', mx: 'auto' }}>
          {isMobileCustom ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  sx={{ p: 0.5 }}
                  disabled
                >
                  <img
                    src="/favicon.svg"
                    alt="Todo App"
                    style={{ width: 28, height: 28 }}
                  />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{
                    color: PRIMARY_COLOR,
                    fontWeight: 600,
                  }}
                >
                  Task Tracker
                </Typography>
                </Box>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{
                    color: '#000000',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&:focus': {
                      backgroundColor: 'transparent',
                    },
                    '&:active': {
                      backgroundColor: 'transparent',
                    },
                    '&.Mui-focusVisible': {
                      backgroundColor: 'transparent',
                    },
                  }}
                  size="large"
                >
                  <FontAwesomeIcon icon={faBars} size="lg" />
                </IconButton>
              </Box>
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: 'block' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  sx={{ p: 0.5 }}
                  disabled
                >
                  <img
                    src="/favicon.svg"
                    alt="Todo App"
                    style={{ width: 32, height: 32 }}
                  />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{
                    color: PRIMARY_COLOR,
                    fontWeight: 600,
                  }}
                >
                  Task tracker
                </Typography>
                <Link 
                  to="/" 
                  style={{ 
                    textDecoration: 'none', 
                    color: isHomePage ? PRIMARY_COLOR : '#000000', 
                    marginLeft: '12px',
                    transition: 'color 0.2s',
                    fontWeight: isHomePage ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isHomePage) e.currentTarget.style.color = PRIMARY_COLOR;
                  }}
                  onMouseLeave={(e) => {
                    if (!isHomePage) e.currentTarget.style.color = '#000000';
                  }}
                >
                  Dashboard
                </Link>
                {user && (
                  <Link 
                    to="/tasks" 
                    style={{ 
                      textDecoration: 'none', 
                      color: isTasksPage ? PRIMARY_COLOR : '#000000', 
                      marginLeft: '12px',
                      transition: 'color 0.2s',
                      fontWeight: isTasksPage ? 600 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (!isTasksPage) e.currentTarget.style.color = PRIMARY_COLOR;
                    }}
                    onMouseLeave={(e) => {
                      if (!isTasksPage) e.currentTarget.style.color = '#000000';
                    }}
                  >
                    My tasks
                  </Link>
                )}
              </Box>
              {!loading && (
                <>
                  {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Button
                        component={Link}
                        to="/tasks/create"
                        variant="contained"
                        sx={{
                          backgroundColor: isCreateTaskPage ? PRIMARY_COLOR_HOVER : PRIMARY_COLOR,
                          color: '#ffffff',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '0.9375rem',
                          px: 2,
                          py: 0.75,
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(100, 108, 255, 0.3)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: PRIMARY_COLOR_HOVER,
                            color: '#ffffff',
                            boxShadow: '0 4px 12px rgba(100, 108, 255, 0.4)',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        New Task
                      </Button>
                      <Button
                        component={Link}
                        to="/profile"
                        variant="text"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          textTransform: 'none',
                          textDecoration: 'none',
                          padding: '6px 12px',
                          borderRadius: 2,
                          minWidth: 'auto',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: 'rgba(100, 108, 255, 0.08)',
                          },
                        }}
                      >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: PRIMARY_COLOR,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {user.first_name ? user.first_name.charAt(0).toUpperCase() : (
                          <FontAwesomeIcon icon={faUser} style={{ fontSize: '18px' }} />
                        )}
                      </Avatar>
                      <Typography
                        variant="body1"
                        sx={{
                          textTransform: 'capitalize',
                          color: '#000000',
                          fontWeight: 600,
                          transition: 'color 0.2s',
                        }}
                      >
                        {user.first_name}
                      </Typography>
                    </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Button
                        component={Link}
                        to="/signin"
                        variant="contained"
                        sx={{
                          backgroundColor: PRIMARY_COLOR,
                          color: '#ffffff',
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: PRIMARY_COLOR_HOVER,
                            color: '#ffffff',
                          },
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        component={Link}
                        to="/signup"
                        variant="outlined"
                        sx={{
                          borderColor: PRIMARY_COLOR,
                          color: PRIMARY_COLOR,
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: PRIMARY_COLOR_HOVER,
                            backgroundColor: 'rgba(100, 108, 255, 0.08)',
                          },
                        }}
                      >
                        Sign Up
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

