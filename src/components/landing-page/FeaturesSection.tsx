import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ChatBubbleOutline as MessageSquare,
  FlashOn as Zap,
  People as Users,
  Code,
  Security as Shield,
  Star,
} from "@mui/icons-material";

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
    <Box id="features" sx={{ py: { xs: 6, sm: 8, lg: 10 }, backgroundColor: "#f9fafb" }}>
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
  );
}
