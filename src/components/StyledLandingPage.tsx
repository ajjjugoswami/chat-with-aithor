import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Psychology as Brain,
  ChatBubbleOutline as MessageSquare,
  FlashOn as Zap,
  People as Users,
  Code,
  Security as Shield,
  Star,
  GitHub,
  Twitter,
  LinkedIn,
  Mail,
  ExpandMore,
  Menu,
} from "@mui/icons-material";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Get Google Client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Styled Components
const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid #e5e7eb",
  color: "#111827",
  boxShadow: "none",
}));

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#ecfdf5",
  padding: theme.spacing(12, 0),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(20, 0),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(32, 0),
  },
}));

const FeatureCard = styled(Card)(() => ({
  height: "100%",
  border: "1px solid #e5e7eb",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  backgroundColor: "#fff",
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  color: "#059669",
  marginBottom: theme.spacing(2),
  "& > svg": {
    fontSize: "2.5rem",
    [theme.breakpoints.up("sm")]: {
      fontSize: "3rem",
    },
  },
}));

const ModelCard = styled(Card)(() => ({
  textAlign: "center",
  border: "1px solid #e5e7eb",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
}));

const ModelIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    width: 64,
    height: 64,
  },
}));

const DeveloperCard = styled(Card)(() => ({
  overflow: "hidden",
  height: "100%",
  border: "1px solid #e5e7eb",
}));

const DeveloperHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(8),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(10),
  },
}));

const DeveloperAvatar = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    width: 96,
    height: 96,
  },
  [theme.breakpoints.up("lg")]: {
    width: 112,
    height: 112,
  },
}));

const CTASection = styled(Box)(({ theme }) => ({
  backgroundColor: "#059669",
  color: "white",
  padding: theme.spacing(12, 0),
  textAlign: "center",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(16, 0),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(20, 0),
  },
}));

const FooterSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#111827",
  borderTop: "1px solid #374151",
  color: "white",
  padding: theme.spacing(8, 0),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(12, 0),
  },
}));

export default function StyledLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  // Authentication hooks
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const heroGoogleButtonRef = useRef<HTMLDivElement>(null);
  const headerGoogleButtonRef = useRef<HTMLDivElement>(null);
  const ctaGoogleButtonRef = useRef<HTMLDivElement>(null);

  // Handle Google credential response
  const handleCredentialResponse = useCallback((response: { credential: string }) => {
    signIn(response.credential);
    navigate('/');
  }, [signIn, navigate]);

  // Initialize Google Sign-In
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
      return;
    }

    const initializeGoogleSignIn = () => {
      if (window.google && GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        // Render Google buttons in different locations
        if (heroGoogleButtonRef.current) {
          window.google.accounts.id.renderButton(heroGoogleButtonRef.current, {
            theme: 'filled_blue',
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            text: 'signup_with',
            logo_alignment: 'left',
          });
        }

        if (headerGoogleButtonRef.current) {
          window.google.accounts.id.renderButton(headerGoogleButtonRef.current, {
            theme: 'outline',
            size: 'medium',
            type: 'standard',
            shape: 'rectangular',
            text: 'signin_with',
            logo_alignment: 'left',
          });
        }

        if (ctaGoogleButtonRef.current) {
          window.google.accounts.id.renderButton(ctaGoogleButtonRef.current, {
            theme: 'filled_blue',
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            text: 'signin_with',
            logo_alignment: 'left',
          });
        }
      }
    };

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isAuthenticated, navigate, handleCredentialResponse]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: <MessageSquare />,
      title: "Your API Keys",
      description:
        "Use your own API keys for ChatGPT, Gemini, Claude, DeepSeek, and more",
    },
    {
      icon: <Zap />,
      title: "Lightning Fast",
      description:
        "Optimized infrastructure for quick responses and seamless switching",
    },
    {
      icon: <Users />,
      title: "Compare Responses",
      description:
        "Get answers from multiple models simultaneously and compare results",
    },
    {
      icon: <Code />,
      title: "Full Control",
      description:
        "Your API keys, your data, your control - no third-party dependencies",
    },
    {
      icon: <Shield />,
      title: "Secure & Private",
      description:
        "Your API keys are stored securely and never shared with third parties",
    },
    {
      icon: <Star />,
      title: "Cost Effective",
      description:
        "Pay only for what you use directly to AI providers - no markup fees",
    },
  ];

  const models = [
    {
      name: "ChatGPT",
      description: "OpenAI's flagship conversational AI",
      bgColor: "#059669",
    },
    {
      name: "Gemini",
      description: "Google's multimodal AI model",
      bgColor: "#1f2937",
    },
    {
      name: "Claude",
      description: "Anthropic's helpful AI assistant",
      bgColor: "#059669",
    },
    {
      name: "DeepSeek",
      description: "Advanced reasoning and coding AI",
      bgColor: "#1f2937",
    },
  ];

  const faqs = [
    {
      question: "How do I get API keys for different AI models?",
      answer:
        "You can obtain API keys directly from each provider: OpenAI for ChatGPT, Google for Gemini, Anthropic for Claude, and DeepSeek for their models. Simply visit their respective websites, create an account, and generate your API keys from their developer dashboards.",
    },
    {
      question: "Are my API keys stored securely?",
      answer:
        "Yes, your API keys are encrypted and stored securely in our system. We use industry-standard encryption methods and never share your keys with third parties. You maintain full control over your keys and can revoke access at any time.",
    },
    {
      question: "How much does it cost to use Aithor?",
      answer:
        "Aithor itself is free to use. You only pay for the API usage directly to the AI providers (OpenAI, Google, Anthropic, etc.) based on their pricing models. There are no markup fees or hidden costs from our platform.",
    },
    {
      question: "Can I compare responses from different AI models?",
      answer:
        "One of Aithor's key features is the ability to send the same prompt to multiple AI models simultaneously and compare their responses side by side. This helps you choose the best model for specific tasks.",
    },
    {
      question: "What AI models are currently supported?",
      answer:
        "We currently support ChatGPT (GPT-3.5, GPT-4), Google Gemini, Anthropic Claude, DeepSeek, and several other popular models. We're constantly adding support for new models as they become available.",
    },
    {
      question: "Do I need separate accounts with each AI provider?",
      answer:
        "Yes, you'll need to create accounts with each AI provider whose models you want to use. This ensures you have direct access to their services and can manage your usage and billing independently.",
    },
    {
      question: "Is there a limit on API usage?",
      answer:
        "The usage limits depend on your individual API plans with each provider. Aithor doesn't impose additional limits beyond what your API keys allow. You can monitor your usage through each provider's dashboard.",
    },
    {
      question: "Can I use Aithor for commercial projects?",
      answer:
        "Yes, you can use Aithor for commercial projects as long as you comply with the terms of service of the respective AI providers whose APIs you're using. Make sure to review their commercial usage policies.",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "white",
        "& .MuiCard-root": { backgroundColor: "#fff" },
        "& .MuiAccordionSummary-root": { backgroundColor: "#fff" },
        "& .MuiAccordionDetails-root": { backgroundColor: "#fff" },
      }}
    >
      {/* Header */}
      <StyledAppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar
            sx={{ height: { xs: 56, sm: 64 }, justifyContent: "space-between" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src="/logo.png" alt="Logo" style={{ height: 32 }} />
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                Aithor
              </Typography>
            </Box>

            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Box sx={{ display: "flex", gap: 4 }}>
                  <Typography
                    component="a"
                    href="#features"
                    sx={{
                      color: "#6b7280",
                      textDecoration: "none",
                      "&:hover": { color: "#111827" },
                    }}
                  >
                    Features
                  </Typography>
                  <Typography
                    component="a"
                    href="#models"
                    sx={{
                      color: "#6b7280",
                      textDecoration: "none",
                      "&:hover": { color: "#111827" },
                    }}
                  >
                    AI Models
                  </Typography>
                  <Typography
                    component="a"
                    href="#developer"
                    sx={{
                      color: "#6b7280",
                      textDecoration: "none",
                      "&:hover": { color: "#111827" },
                    }}
                  >
                    Developer
                  </Typography>
                  <Typography
                    component="a"
                    href="#faq"
                    sx={{
                      color: "#6b7280",
                      textDecoration: "none",
                      "&:hover": { color: "#111827" },
                    }}
                  >
                    FAQ
                  </Typography>
                </Box>
                <Box ref={headerGoogleButtonRef} />
              </Box>
            )}

            {isMobile && (
              <IconButton sx={{ color: "#6b7280" }}>
                <Menu />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: "4xl", mx: "auto" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                px: 2,
                py: 0.5,
                borderRadius: "9999px",
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              <Zap sx={{ fontSize: 16, mr: 1 }} />
              Bring Your Own API Keys - Multiple AI Models
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: "2rem",
                  sm: "2.5rem",
                  md: "3rem",
                  lg: "4rem",
                  xl: "5rem",
                },
                fontWeight: "bold",
                color: "#111827",
                mb: { xs: 2, sm: 3 },
                lineHeight: 1.1,
              }}
            >
              Chat with the World's Most
              <Box component="span" sx={{ color: "#059669" }}>
                {" "}
                Advanced AI Models
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.125rem",
                  md: "1.25rem",
                  lg: "1.5rem",
                },
                color: "#6b7280",
                mb: { xs: 3, sm: 4 },
                maxWidth: "3xl",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Experience ChatGPT, Gemini, Claude, DeepSeek, and more using your
              own API keys. Switch between models seamlessly in one unified
              platform while maintaining full control of your data.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box ref={heroGoogleButtonRef} />
            </Box>
          </Box>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, sm: 8, lg: 10 }, backgroundColor: "#f9fafb" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 6, lg: 8 } }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                fontWeight: "bold",
                color: "#111827",
                mb: 2,
              }}
            >
              Why Choose Aithor?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.125rem", sm: "1.25rem" },
                color: "#6b7280",
                maxWidth: "2xl",
                mx: "auto",
              }}
            >
              Use your own API keys to access multiple AI models with complete
              privacy and control.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: { xs: 2, sm: 3, lg: 4 },
            }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <CardContent
                  sx={{ p: { xs: 2, sm: 3 }, backgroundColor: "#fff" }}
                >
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: "1.125rem", sm: "1.25rem" },
                      fontWeight: 600,
                      color: "#111827",
                      mb: 1,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      color: "#6b7280",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            ))}
          </Box>
        </Container>
      </Box>

      {/* AI Models Section */}
      <Box id="models" sx={{ py: { xs: 6, sm: 8, lg: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 6, lg: 8 } }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                fontWeight: "bold",
                color: "#111827",
                mb: 2,
              }}
            >
              Supported AI Models
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.125rem", sm: "1.25rem" },
                color: "#6b7280",
                maxWidth: "2xl",
                mx: "auto",
              }}
            >
              Choose from the most advanced AI models available today
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: { xs: 2, sm: 3, lg: 4 },
              maxWidth: "6xl",
              mx: "auto",
            }}
          >
            {models.map((model, index) => (
              <ModelCard key={index}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <ModelIcon sx={{ backgroundColor: model.bgColor }}>
                    <Brain
                      sx={{ fontSize: { xs: 24, sm: 32 }, color: "white" }}
                    />
                  </ModelIcon>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: "1.125rem", sm: "1.25rem" },
                      fontWeight: 600,
                      color: "#111827",
                      mb: 1,
                    }}
                  >
                    {model.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      color: "#6b7280",
                    }}
                  >
                    {model.description}
                  </Typography>
                </CardContent>
              </ModelCard>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Developer Section */}
      <Box
        id="developer"
        sx={{ py: { xs: 6, sm: 8, lg: 10 }, backgroundColor: "#f9fafb" }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 6, lg: 8 } }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                fontWeight: "bold",
                color: "#111827",
                mb: 2,
              }}
            >
              Meet the Developers
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.125rem", sm: "1.25rem" },
                color: "#6b7280",
                maxWidth: "2xl",
                mx: "auto",
              }}
            >
              Built with passion by dedicated AI enthusiasts
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "repeat(2, 1fr)",
              },
              gap: { xs: 3, lg: 4 },
              maxWidth: "6xl",
              mx: "auto",
            }}
          >
            {/* Developer 1 */}
            <DeveloperCard>
              <DeveloperHeader sx={{ backgroundColor: "#ecfdf5" }}>
                <Box sx={{ textAlign: "center" }}>
                  <DeveloperAvatar sx={{ backgroundColor: "#059669" }}>
                    <Brain
                      sx={{
                        fontSize: { xs: 32, sm: 40, lg: 48 },
                        color: "white",
                      }}
                    />
                  </DeveloperAvatar>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: "1.125rem", sm: "1.25rem", lg: "1.5rem" },
                      fontWeight: "bold",
                      color: "#111827",
                      mb: 1,
                    }}
                  >
                    Deepak Gupta
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      color: "#6b7280",
                      mb: 1.5,
                    }}
                  >
                    Front Developer
                  </Typography>
                  
                </Box>
              </DeveloperHeader>
              <CardContent sx={{ p: { xs: 2, sm: 3, lg: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.125rem", lg: "1.25rem" },
                    fontWeight: 600,
                    color: "#111827",
                    mb: 2,
                  }}
                >
                  About Deepak
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    color: "#6b7280",
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  AI researcher with 7+ years experience in machine learning.
                  Specialized in LLM integration and conversational AI systems.
                  Led the core architecture of Aithor's multi-model platform.
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {[
                    { icon: <Code />, text: "7+ years in AI & ML" },
                    { icon: <Brain />, text: "LLM Integration Expert" },
                    { icon: <Zap />, text: "System Architecture" },
                  ].map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      <Box sx={{ color: "#059669", fontSize: 20 }}>
                        {item.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.875rem",
                            lg: "1rem",
                          },
                          color: "#111827",
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "#111827", mb: 1.5 }}
                  >
                    Connect with Alex
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {[GitHub, Twitter, LinkedIn, Mail].map((Icon, idx) => (
                      <Button
                        key={idx}
                        variant="outlined"
                        size="small"
                        startIcon={<Icon />}
                        sx={{
                          borderColor: "#d1d5db",
                          color: "#374151",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          "&:hover": { backgroundColor: "#f9fafb" },
                        }}
                      >
                        {["GitHub", "Twitter", "LinkedIn", "Email"][idx]}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </DeveloperCard>

            {/* Developer 2 */}
            <DeveloperCard>
              <DeveloperHeader sx={{ backgroundColor: "#f3f4f6" }}>
                <Box sx={{ textAlign: "center" }}>
                  <DeveloperAvatar sx={{ backgroundColor: "#1f2937" }}>
                    <Users
                      sx={{
                        fontSize: { xs: 32, sm: 40, lg: 48 },
                        color: "white",
                      }}
                    />
                  </DeveloperAvatar>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: "1.125rem", sm: "1.25rem", lg: "1.5rem" },
                      fontWeight: "bold",
                      color: "#111827",
                      mb: 1,
                    }}
                  >
                    Ajay Goswami
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      color: "#6b7280",
                      mb: 1.5,
                    }}
                  >
                    Frontend Developer
                  </Typography>
                  
                </Box>
              </DeveloperHeader>
              <CardContent sx={{ p: { xs: 2, sm: 3, lg: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.125rem", lg: "1.25rem" },
                    fontWeight: 600,
                    color: "#111827",
                    mb: 2,
                  }}
                >
                  About Ajay
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    color: "#6b7280",
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  Frontend specialist focused on creating intuitive AI
                  interfaces. 5+ years in React and modern web technologies.
                  Designed Aithor's seamless user experience and responsive
                  design.
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {[
                    { icon: <MessageSquare />, text: "5+ years Frontend Dev" },
                    { icon: <Users />, text: "UX/UI Design Expert" },
                    { icon: <Shield />, text: "React & TypeScript" },
                  ].map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      <Box sx={{ color: "#2563eb", fontSize: 20 }}>
                        {item.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.875rem",
                            lg: "1rem",
                          },
                          color: "#111827",
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "#111827", mb: 1.5 }}
                  >
                    Connect with Sarah
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {[GitHub, Twitter, LinkedIn, Mail].map((Icon, idx) => (
                      <Button
                        key={idx}
                        variant="outlined"
                        size="small"
                        startIcon={<Icon />}
                        sx={{
                          borderColor: "#d1d5db",
                          color: "#374151",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          "&:hover": { backgroundColor: "#f9fafb" },
                        }}
                      >
                        {["GitHub", "Twitter", "LinkedIn", "Email"][idx]}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </DeveloperCard>
          </Box>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box id="faq" sx={{ py: { xs: 6, sm: 8, lg: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 6, lg: 8 } }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                fontWeight: "bold",
                color: "#111827",
                mb: 2,
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.125rem", sm: "1.25rem" },
                color: "#6b7280",
                maxWidth: "2xl",
                mx: "auto",
              }}
            >
              Everything you need to know about using Aithor with your own API
              keys
            </Typography>
          </Box>

          <Box sx={{ maxWidth: "3xl", mx: "auto" }}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                expanded={openFaq === index}
                onChange={() => toggleFaq(index)}
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 1,
                  mb: 2,
                  "&:before": { display: "none" },
                  boxShadow: "none",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    "&:hover": { backgroundColor: "#f9fafb" },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      fontWeight: 600,
                      color: "#111827",
                      pr: 2,
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      color: "#6b7280",
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <CTASection>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              fontWeight: "bold",
              mb: { xs: 2, sm: 3 },
            }}
          >
            Ready to Experience AI with Your Own Keys?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
              color: "rgba(255, 255, 255, 0.9)",
              mb: { xs: 3, sm: 4 },
              maxWidth: "2xl",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Join thousands of users who use Aithor with their own API keys for
            maximum privacy and control.
          </Typography>
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "center", 
              width: { xs: "100%", sm: "auto" },
              maxWidth: { xs: "20rem", sm: "none" },
              mx: "auto",
            }}
            ref={ctaGoogleButtonRef} 
          />
        </Container>
      </CTASection>

      {/* Footer */}
      <FooterSection>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "2fr 1fr 1fr",
              },
              gap: { xs: 3, sm: 4 },
            }}
          >
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Brain
                  sx={{ fontSize: { xs: 24, sm: 32 }, color: "#10b981" }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    fontWeight: "bold",
                  }}
                >
                  Aithor
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  color: "#d1d5db",
                  mb: 2,
                  lineHeight: 1.6,
                }}
              >
                The ultimate platform for accessing multiple AI models with your
                own API keys. Chat with ChatGPT, Gemini, Claude, and more while
                maintaining full control.
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                Product
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {["Features", "AI Models", "FAQ", "API"].map((item, idx) => (
                  <Typography
                    key={idx}
                    component="a"
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    sx={{
                      fontSize: "0.875rem",
                      color: "#d1d5db",
                      textDecoration: "none",
                      "&:hover": { color: "#10b981" },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                Company
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {["About", "Privacy", "Terms", "Contact"].map((item, idx) => (
                  <Typography
                    key={idx}
                    component="a"
                    href={idx === 0 ? "#developer" : "#"}
                    sx={{
                      fontSize: "0.875rem",
                      color: "#d1d5db",
                      textDecoration: "none",
                      "&:hover": { color: "#10b981" },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              borderTop: "1px solid #374151",
              mt: { xs: 3, sm: 4 },
              pt: { xs: 3, sm: 4 },
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                color: "#9ca3af",
              }}
            >
              &copy; 2024 Aithor. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </FooterSection>
    </Box>
  );
}
