import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@src/store/hooks';
import type { RootState } from '@src/store/store';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Fade,
  Slide,
} from '@mui/material';
import {
  CheckCircleOutline,
  TrendingUp,
  AddTask,
  ListAlt,
  Person,
} from '@mui/icons-material';
import { PRIMARY_COLOR, PRIMARY_COLOR_HOVER } from '@src/constants/colors';

function Home() {
  const { user, loading } = useAppSelector((state: RootState) => state.authUser);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const featuresObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShowFeatures(true);
        }
      });
    }, observerOptions);

    const pricingObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShowPricing(true);
        }
      });
    }, observerOptions);

    const checkElements = () => {
      if (featuresRef.current) {
        featuresObserver.observe(featuresRef.current);
      }
      if (pricingRef.current) {
        pricingObserver.observe(pricingRef.current);
      }
    };

    // Check after a short delay to ensure DOM is ready
    const timer = setTimeout(checkElements, 100);

    return () => {
      clearTimeout(timer);
      featuresObserver.disconnect();
      pricingObserver.disconnect();
    };
  }, []);

  const features = [
    {
      icon: <AddTask sx={{ fontSize: 40, color: PRIMARY_COLOR }} />,
      title: 'Create Tasks',
      description: 'Easily create and manage your tasks with a simple, intuitive interface.',
    },
    {
      icon: <ListAlt sx={{ fontSize: 40, color: PRIMARY_COLOR }} />,
      title: 'Organize',
      description: 'Organize tasks by status, priority, and deadline to stay on top of everything.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: PRIMARY_COLOR }} />,
      title: 'Stay Productive',
      description: 'Boost your productivity with smart filtering and sorting capabilities.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Unlimited tasks',
        'Basic filtering',
        'Priority levels',
        'Deadline tracking',
        'Mobile responsive',
      ],
      popular: false,
    },
    {
      name: 'Pro',
      price: '$9',
      period: 'per month',
      features: [
        'Everything in Free',
        'Advanced analytics',
        'Team collaboration',
        'Custom categories',
        'Priority support',
        'Export & backup',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$29',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'Advanced security',
      ],
      popular: false,
    },
  ];

  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username;
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        pt: { xs: 4, md: 8 },
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 10 },
            mt: { xs: 2, md: 4 },
          }}
        >
          {!loading && user ? (
            <>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  color: '#1a1a1a',
                }}
              >
                Welcome back, {getUserDisplayName()}!
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: '#666',
                  fontSize: { xs: '1.1rem', md: '1.5rem' },
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                Ready to tackle your tasks? Let's get things done.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/tasks"
                  variant="contained"
                  size="large"
                  startIcon={<ListAlt />}
                  sx={{
                    backgroundColor: PRIMARY_COLOR,
                    color: '#ffffff',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: '0 4px 14px 0 rgba(100, 108, 255, 0.39)',
                    '&:hover': {
                      backgroundColor: PRIMARY_COLOR_HOVER,
                      color: '#ffffff',
                      boxShadow: '0 6px 20px 0 rgba(100, 108, 255, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  View Tasks
                </Button>
                <Button
                  component={Link}
                  to="/tasks/create"
                  variant="outlined"
                  size="large"
                  startIcon={<AddTask />}
                  sx={{
                    borderColor: PRIMARY_COLOR,
                    color: PRIMARY_COLOR,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: PRIMARY_COLOR_HOVER,
                      backgroundColor: 'rgba(100, 108, 255, 0.08)',
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  New Task
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  color: '#1a1a1a',
                  lineHeight: 1.2,
                }}
              >
                Your Task Tracker
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: '#666',
                  fontSize: { xs: '1.1rem', md: '1.5rem' },
                  maxWidth: '700px',
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Stay organized, stay productive. Manage your tasks effortlessly with our intuitive
                task management system.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  size="large"
                  startIcon={<Person />}
                  sx={{
                    backgroundColor: PRIMARY_COLOR,
                    color: '#ffffff',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: '0 4px 14px 0 rgba(100, 108, 255, 0.39)',
                    '&:hover': {
                      backgroundColor: PRIMARY_COLOR_HOVER,
                      color: '#ffffff',
                      boxShadow: '0 6px 20px 0 rgba(100, 108, 255, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Get Started
                </Button>
                <Button
                  component={Link}
                  to="/signin"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: PRIMARY_COLOR,
                    color: PRIMARY_COLOR,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: PRIMARY_COLOR_HOVER,
                      backgroundColor: 'rgba(100, 108, 255, 0.08)',
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </>
          )}
        </Box>

        {/* Features Section */}
        <Box ref={featuresRef} id="features-section" sx={{ mt: { xs: 4, md: 8 } }}>
          <Slide direction="up" in={showFeatures} timeout={1500} mountOnEnter unmountOnExit>
            <Box>
              <Fade in={showFeatures} timeout={1800}>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    textAlign: 'center',
                    fontWeight: 600,
                    mb: 4,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    color: '#1a1a1a',
                  }}
                >
                  Why Choose Our Task Tracker?
                </Typography>
              </Fade>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                '@media (min-width: 758px)': {
                  gridTemplateColumns: 'repeat(2, 1fr)',
                },
                '@media (min-width: 900px)': {
                  gridTemplateColumns: 'repeat(3, 1fr)',
                },
                gap: 3,
                maxWidth: { md: '900px' },
                mx: 'auto',
              }}
            >
              {features.map((feature, index) => (
                <Fade
                  key={index}
                  in={showFeatures}
                  timeout={1800 + index * 300}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: 3,
                      }}
                    >
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          mb: 1.5,
                          color: '#1a1a1a',
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              ))}
            </Box>
            </Box>
          </Slide>
        </Box>
      </Container>

        {/* Pricing Section */}
        {!loading && !user && (
          <Box ref={pricingRef} id="pricing-section" sx={{ mt: { xs: 8, md: 12 } }}>
            <Container maxWidth="lg">
              <Slide direction="up" in={showPricing} timeout={1000} mountOnEnter unmountOnExit>
                <Box>
                  <Fade in={showPricing} timeout={1200}>
                    <Typography
                      variant="h3"
                      component="h2"
                      sx={{
                        textAlign: 'center',
                        fontWeight: 600,
                        mb: 2,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        color: '#1a1a1a',
                        px: { xs: 2, md: 0 },
                      }}
                    >
                      Simple, Transparent Pricing
                    </Typography>
                  </Fade>
                  <Fade in={showPricing} timeout={1400}>
                    <Box sx={{ textAlign: 'center', mb: 6, px: { xs: 2, md: 0 } }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#666',
                          fontSize: { xs: '1rem', md: '1.1rem' },
                          maxWidth: '600px',
                          mx: 'auto',
                        }}
                      >
                        Choose the plan that works best for you. All plans include our core features.
                      </Typography>
                    </Box>
                  </Fade>
                </Box>
              </Slide>
            </Container>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                '@media (min-width: 768px)': {
                  gridTemplateColumns: 'repeat(2, 1fr)',
                },
                '@media (min-width: 900px)': {
                  gridTemplateColumns: 'repeat(3, 1fr)',
                },
                gap: { xs: 3, md: 3 },
                maxWidth: { md: '1100px' },
                mx: { xs: 2, md: 'auto' },
                px: { xs: 0, md: 0 },
                position: 'relative',
                overflow: 'visible',
                width: { xs: 'calc(100% - 32px)', md: 'auto' },
              }}
            >
                  {pricingPlans.map((plan, index) => (
                    <Fade
                      key={plan.name}
                      in={showPricing}
                      timeout={1400 + index * 200}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 3,
                            boxShadow: plan.popular
                              ? { xs: '0 4px 20px rgba(100, 108, 255, 0.15)', md: '0 8px 30px rgba(100, 108, 255, 0.2)' }
                              : { xs: '0 2px 12px rgba(0, 0, 0, 0.08)', md: '0 4px 20px rgba(0, 0, 0, 0.1)' },
                            border: plan.popular
                              ? `2px solid ${PRIMARY_COLOR}`
                              : '1px solid rgba(0, 0, 0, 0.12)',
                            position: 'relative',
                            overflow: 'visible',
                            width: '100%',
                            backgroundColor: '#ffffff',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              '@media (min-width: 768px)': {
                                transform: 'translateY(-8px)',
                                boxShadow: plan.popular
                                  ? '0 12px 40px rgba(100, 108, 255, 0.3)'
                                  : '0 8px 30px rgba(0, 0, 0, 0.15)',
                              },
                            },
                          }}
                        >
                        {plan.popular && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: { xs: -10, md: -12 },
                              left: '50%',
                              transform: 'translateX(-50%)',
                              backgroundColor: PRIMARY_COLOR,
                              color: '#ffffff',
                              px: { xs: 1.5, md: 2 },
                              py: { xs: 0.4, md: 0.5 },
                              borderRadius: 2,
                              fontSize: { xs: '0.65rem', md: '0.75rem' },
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              zIndex: 10,
                            }}
                          >
                            Most Popular
                          </Box>
                        )}
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            p: { xs: 2.5, sm: 3, md: 4 },
                          }}
                        >
                          <Typography
                            variant="h5"
                            component="h3"
                            sx={{
                              fontWeight: 700,
                              mb: { xs: 0.75, md: 1 },
                              color: '#1a1a1a',
                              textAlign: 'center',
                              fontSize: { xs: '1.25rem', md: '1.5rem' },
                            }}
                          >
                            {plan.name}
                          </Typography>
                          <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 3 } }}>
                            <Typography
                              variant="h3"
                              component="span"
                              sx={{
                                fontWeight: 700,
                                color: PRIMARY_COLOR,
                                fontSize: { xs: '2rem', sm: '2.25rem', md: '3rem' },
                              }}
                            >
                              {plan.price}
                            </Typography>
                            <Typography
                              variant="body2"
                              component="span"
                              sx={{
                                color: '#666',
                                ml: 0.5,
                                fontSize: { xs: '0.75rem', md: '0.875rem' },
                              }}
                            >
                              /{plan.period}
                            </Typography>
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            {plan.features.map((feature, featureIndex) => (
                              <Box
                                key={featureIndex}
                                sx={{
                                  display: 'flex',
                                  alignItems: { xs: 'center', md: 'flex-start' },
                                  justifyContent: { xs: 'center', md: 'flex-start' },
                                  mb: { xs: 1.5, md: 2 },
                                }}
                              >
                                <CheckCircleOutline
                                  sx={{
                                    color: PRIMARY_COLOR,
                                    fontSize: { xs: 18, md: 20 },
                                    mr: { xs: 1, md: 1.5 },
                                    mt: { xs: 0, md: 0.25 },
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#666',
                                    lineHeight: 1.6,
                                    fontSize: { xs: '0.8125rem', md: '0.875rem' },
                                    textAlign: { xs: 'center', md: 'left' },
                                  }}
                                >
                                  {feature}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                          <Button
                            component={Link}
                            to="/signup"
                            variant={plan.popular ? 'contained' : 'outlined'}
                            fullWidth
                            sx={{
                              mt: { xs: 2, md: 3 },
                              py: { xs: 1.25, md: 1.5 },
                              fontSize: { xs: '0.875rem', md: '1rem' },
                              fontWeight: 600,
                              borderRadius: 2,
                              ...(plan.popular
                                ? {
                                    backgroundColor: PRIMARY_COLOR,
                                    color: '#ffffff',
                                    '&:hover': {
                                      backgroundColor: PRIMARY_COLOR_HOVER,
                                      color: '#ffffff',
                                    },
                                  }
                                : {
                                    borderColor: PRIMARY_COLOR,
                                    color: PRIMARY_COLOR,
                                    '&:hover': {
                                      borderColor: PRIMARY_COLOR_HOVER,
                                      backgroundColor: 'rgba(100, 108, 255, 0.08)',
                                    },
                                  }),
                            }}
                          >
                            Get Started
                          </Button>
                        </CardContent>
                        </Card>
                      </Box>
                    </Fade>
                  ))}
                </Box>
          </Box>
        )}

        {/* CTA Section for unauthenticated users */}
        {!loading && !user && (
          <Container maxWidth="lg">
            <Box
              sx={{
                mt: { xs: 6, md: 10 },
                textAlign: 'center',
                p: { xs: 3, md: 6 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, rgba(100, 108, 255, 0.1) 0%, rgba(100, 108, 255, 0.05) 100%)',
                border: `2px solid ${PRIMARY_COLOR}`,
              }}
            >
            <CheckCircleOutline
              sx={{
                fontSize: 60,
                color: PRIMARY_COLOR,
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#1a1a1a',
                fontSize: { xs: '1.75rem', md: '2rem' },
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: '#666',
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              Join thousands of users who are already managing their tasks more efficiently.
            </Typography>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: PRIMARY_COLOR,
                color: '#ffffff',
                px: 5,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: '0 4px 14px 0 rgba(100, 108, 255, 0.39)',
                '&:hover': {
                  backgroundColor: PRIMARY_COLOR_HOVER,
                  color: '#ffffff',
                  boxShadow: '0 6px 20px 0 rgba(100, 108, 255, 0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Create Your Account
            </Button>
          </Box>
          </Container>
        )}
    </Box>
  );
}

export default Home;

