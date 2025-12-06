import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Fade,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { PRIMARY_COLOR, PRIMARY_COLOR_HOVER } from '@src/constants/colors';

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

function Pricing() {
  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Fade in timeout={800}>
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
              Simple, Transparent Pricing
            </Typography>
          </Fade>
          <Fade in timeout={1000}>
            <Typography
              variant="h6"
              sx={{
                color: '#666',
                fontSize: { xs: '1rem', md: '1.25rem' },
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Choose the plan that works best for you. All plans include our core
              features with no hidden fees.
            </Typography>
          </Fade>
        </Box>
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
          gap: { xs: 2, md: 3 },
          maxWidth: '1200px',
          mx: { xs: 2, md: 'auto' },
          px: { xs: 0, md: 0 },
          position: 'relative',
          overflow: 'visible',
          width: { xs: 'calc(100% - 32px)', md: 'auto' },
        }}
      >
        {pricingPlans.map((plan, index) => (
          <Fade key={plan.name} in timeout={1200 + index * 200}>
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
                <Box sx={{ flexGrow: 1, mb: 3 }}>
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
                    py: { xs: 1.25, md: 1.5 },
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    ...(plan.popular
                      ? {
                          backgroundColor: PRIMARY_COLOR,
                          color: '#ffffff',
                          boxShadow: '0 4px 14px 0 rgba(100, 108, 255, 0.39)',
                          '&:hover': {
                            backgroundColor: PRIMARY_COLOR_HOVER,
                            color: '#ffffff',
                            boxShadow: '0 6px 20px 0 rgba(100, 108, 255, 0.5)',
                            transform: 'translateY(-2px)',
                          },
                        }
                      : {
                          borderColor: PRIMARY_COLOR,
                          color: PRIMARY_COLOR,
                          '&:hover': {
                            borderColor: PRIMARY_COLOR_HOVER,
                            backgroundColor: 'rgba(100, 108, 255, 0.08)',
                            color: PRIMARY_COLOR_HOVER,
                          },
                        }),
                  }}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Fade>
        ))}
      </Box>

      <Container maxWidth="lg">
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            textAlign: 'center',
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            backgroundColor: '#f8f9fa',
            border: '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: '#1a1a1a',
          }}
        >
          Need help choosing a plan?
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            mb: 3,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          All plans include a 14-day free trial. No credit card required. Cancel
          anytime.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="outlined"
          sx={{
            borderColor: PRIMARY_COLOR,
            color: PRIMARY_COLOR,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              borderColor: PRIMARY_COLOR_HOVER,
              backgroundColor: 'rgba(100, 108, 255, 0.08)',
              color: PRIMARY_COLOR_HOVER,
            },
          }}
        >
          Back to Home
        </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Pricing;

