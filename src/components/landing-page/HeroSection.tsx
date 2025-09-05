import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FlashOn as Zap } from "@mui/icons-material";

const StyledHeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#ecfdf5",
  padding: theme.spacing(12, 0),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(20, 0),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(32, 0),
  },
}));

export default function HeroSection() {
  return (
    <StyledHeroSection>
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
            Experience ChatGPT, Gemini, Claude, DeepSeek, Perplexity, and more using your
            own API keys. Get detailed setup guides and direct links to obtain your API keys
            from each provider below.
          </Typography>
        </Box>
      </Container>
    </StyledHeroSection>
  );
}
