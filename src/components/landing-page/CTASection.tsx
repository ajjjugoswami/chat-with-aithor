import { Box, Container, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const StyledCTASection = styled(Box)(({ theme }) => ({
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

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <StyledCTASection>
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
          maximum privacy and control. Get your API keys from our guides above!
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/sign-up")}
          sx={{
            backgroundColor: "white",
            color: "#059669",
            px: 4,
            py: 2,
            fontSize: "1.125rem",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#f3f4f6",
            },
          }}
        >
          Start Chatting Now
        </Button>
      </Container>
    </StyledCTASection>
  );
}
