import { Box, Container, Typography, Button } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { FlashOn as Zap, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(5, 150, 105, 0.3); }
  50% { box-shadow: 0 0 30px rgba(5, 150, 105, 0.5); }
`;

const StyledHeroSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 50%, #ecfdf5 100%)",
  position: "relative",
  overflow: "hidden",
  padding: theme.spacing(12, 0),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(20, 0),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(32, 0),
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: "radial-gradient(circle, rgba(5, 150, 105, 0.1) 0%, transparent 70%)",
    animation: `${float} 6s ease-in-out infinite`,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-30%",
    right: "-30%",
    width: "150%",
    height: "150%",
    background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 60%)",
    animation: `${float} 8s ease-in-out infinite reverse`,
  },
}));

const GlowingBadge = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
  color: "#374151",
  padding: theme.spacing(1, 2.5),
  borderRadius: "9999px",
  marginBottom: theme.spacing(3),
  fontSize: "0.875rem",
  fontWeight: 500,
  border: "1px solid rgba(5, 150, 105, 0.2)",
  backdropFilter: "blur(10px)",
  animation: `${glow} 3s ease-in-out infinite`,
  position: "relative",
  zIndex: 1,
  [theme.breakpoints.up("sm")]: {
    marginBottom: theme.spacing(4),
  },
}));

const AnimatedTitle = styled(Typography)(() => ({
  background: "linear-gradient(135deg, #111827 0%, #374151 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  position: "relative",
  zIndex: 1,
}));

const GradientText = styled("span")({
  background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: "bold",
});

const CtaButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
  color: "white",
  padding: theme.spacing(1.5, 4),
  borderRadius: "12px",
  fontSize: "1.125rem",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 10px 25px rgba(5, 150, 105, 0.3)",
  transition: "all 0.3s ease",
  position: "relative",
  zIndex: 1,
  "&:hover": {
    background: "linear-gradient(135deg, #047857 0%, #059669 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 15px 35px rgba(5, 150, 105, 0.4)",
  },
  "&:active": {
    transform: "translateY(0px)",
  },
}));

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <StyledHeroSection>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", maxWidth: "4xl", mx: "auto", position: "relative", zIndex: 1 }}>
          <GlowingBadge>
            <Zap sx={{ fontSize: 18, mr: 1, color: "#059669" }} />
            Bring Your Own API Keys - Multiple AI Models
          </GlowingBadge>

          <AnimatedTitle
            variant="h1"
            sx={{
              fontSize: {
                xs: "2.5rem",
                sm: "3rem",
                md: "3.5rem",
                lg: "4.5rem",
                xl: "5.5rem",
              },
              fontWeight: "800",
              mb: { xs: 3, sm: 4 },
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Chat with the World's Most{" "}
            <GradientText>Advanced AI Models</GradientText>
          </AnimatedTitle>

          <Typography
            variant="h6"
            sx={{
              fontSize: {
                xs: "1.125rem",
                sm: "1.25rem",
                md: "1.375rem",
                lg: "1.5rem",
              },
              color: "#6b7280",
              mb: { xs: 4, sm: 6 },
              maxWidth: "3xl",
              mx: "auto",
              lineHeight: 1.7,
              fontWeight: 400,
              position: "relative",
              zIndex: 1,
            }}
          >
            Experience ChatGPT, Gemini, Claude, DeepSeek, Perplexity, and more using your
            own API keys. Get detailed setup guides and direct links to obtain your API keys
            from each provider below.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
            <CtaButton
              onClick={() => navigate("/sign-up")}
              endIcon={<ArrowForward />}
            >
              Get Started Free
            </CtaButton>
          </Box>
        </Box>
      </Container>
    </StyledHeroSection>
  );
}
