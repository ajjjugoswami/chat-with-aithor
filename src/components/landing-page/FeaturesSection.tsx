import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  ChatBubbleOutline as MessageSquare,
  FlashOn as Zap,
  People as Users,
  Code,
  Security as Shield,
  Star,
} from "@mui/icons-material";

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FeatureCard = styled(Card)(() => ({
  height: "100%",
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #059669, #10b981, #047857)",
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "&::before": {
      transform: "scaleX(1)",
    },
  },
  animation: `${slideUp} 0.6s ease-out`,
}));

const FeatureIcon = styled(Box)(() => ({
  width: "64px",
  height: "64px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "24px",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "2px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
    zIndex: 1,
  },
  "& > svg": {
    fontSize: "32px",
    color: "#059669",
    position: "relative",
    zIndex: 2,
  },
}));

const FeatureTitle = styled(Typography)(() => ({
  fontWeight: 700,
  color: "#111827",
  marginBottom: "12px",
  fontSize: "1.25rem",
}));

const FeatureDescription = styled(Typography)(() => ({
  color: "#6b7280",
  lineHeight: 1.6,
  fontSize: "1rem",
}));

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

export default function FeaturesSection() {
  return (
    <Box 
      id="features" 
      sx={{ 
        py: { xs: 8, sm: 12, lg: 16 }, 
        background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #f9fafb 100%)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 80%, rgba(5, 150, 105, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", mb: { xs: 8, lg: 12 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              fontWeight: "800",
              background: "linear-gradient(135deg, #111827 0%, #374151 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 3,
              letterSpacing: "-0.02em",
            }}
          >
            Why Choose Aithor?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.375rem" },
              color: "#6b7280",
              maxWidth: "2xl",
              mx: "auto",
              lineHeight: 1.7,
              fontWeight: 400,
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
            gap: { xs: 3, sm: 4, lg: 6 },
          }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} sx={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent sx={{ p: 4 }}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>
                  {feature.title}
                </FeatureTitle>
                <FeatureDescription>
                  {feature.description}
                </FeatureDescription>
              </CardContent>
            </FeatureCard>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
