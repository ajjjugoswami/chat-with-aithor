import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Psychology as Brain } from "@mui/icons-material";

const FooterSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#111827",
  borderTop: "1px solid #374151",
  color: "white",
  padding: theme.spacing(8, 0),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(12, 0),
  },
}));

export default function Footer() {
  return (
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
              own API keys. Chat with ChatGPT, Gemini, Claude, Perplexity, and more while
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
              {["Features", "AI Models", "API Keys"].map((item, idx) => (
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
  );
}
