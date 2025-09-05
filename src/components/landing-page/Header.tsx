import { 
  AppBar, 
  Container, 
  Toolbar, 
  Box, 
  Typography, 
  Button, 
  IconButton,
  useTheme,
  useMediaQuery 
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Menu } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const StyledAppBar = styled(AppBar)(() => ({
  background: "#ffffff",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  color: "#1f2937",
  borderBottom: "1px solid #e5e7eb",
}));

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar
          sx={{ height: { xs: 56, sm: 64 }, justifyContent: "space-between" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: "-2px",
                  borderRadius: "50%",
                  background: "linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
                  zIndex: -1,
                },
              }}
            >
              <img 
                src="/logo.png" 
                alt="Logo" 
                style={{ 
                  height: 32, 
                 }} 
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                fontWeight: "700",
                color: "#1f2937",
                letterSpacing: "0.5px",
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
                  href="#models"
                  sx={{
                    color: "#4b5563",
                    textDecoration: "none",
                    fontWeight: 500,
                    transition: "all 0.3s ease",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    "&:hover": { 
                      color: "#1f2937",
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  AI Models
                </Typography>
                <Typography
                  component="a"
                  href="#features"
                  sx={{
                    color: "#4b5563",
                    textDecoration: "none",
                    fontWeight: 500,
                    transition: "all 0.3s ease",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    "&:hover": { 
                      color: "#1f2937",
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  Features
                </Typography>
                <Typography
                  component="a"
                  href="#api-keys"
                  sx={{
                    color: "#4b5563",
                    textDecoration: "none",
                    fontWeight: 500,
                    transition: "all 0.3s ease",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    "&:hover": { 
                      color: "#1f2937",
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  API Keys
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => navigate("/sign-up")}
                sx={{
                  backgroundColor: "#059669",
                  color: "white",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#047857",
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}

          {isMobile && (
            <IconButton sx={{ color: "#4b5563" }}>
              <Menu />
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}
