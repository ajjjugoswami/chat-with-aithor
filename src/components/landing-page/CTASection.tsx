import { Box, Container, Typography, Button } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const StyledCTASection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)",
  backgroundSize: "200% 200%",
  animation: `${gradientShift} 8s ease infinite`,
  color: "white",
  padding: theme.spacing(16, 0),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(20, 0),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(24, 0),
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
    pointerEvents: "none",
  },
}));

const CtaButton = styled(Button)(() => ({
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  color: "#059669",
  padding: "16px 32px",
  borderRadius: "16px",
  fontSize: "1.25rem",
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease",
  position: "relative",
  zIndex: 1,
  "&:hover": {
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
  },
}));

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <StyledCTASection>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            fontWeight: "800",
            mb: { xs: 3, sm: 4 },
            letterSpacing: "-0.02em",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          Ready to Experience AI with Your Own Keys?
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.375rem" },
            color: "rgba(255, 255, 255, 0.95)",
            mb: { xs: 4, sm: 6 },
            maxWidth: "2xl",
            mx: "auto",
            lineHeight: 1.7,
            fontWeight: 400,
          }}
        >
          Join thousands of users who use Aithor with their own API keys for
          maximum privacy and control. Get your API keys from our guides above!
        </Typography>
        <CtaButton
          onClick={() => navigate("/sign-up")}
          endIcon={<ArrowForward />}
        >
          Start Chatting Now
        </CtaButton>
      </Container>
    </StyledCTASection>
  );
}
