import {
  AppBar,
  Container,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Menu, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const logoFloat = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
`;

const StyledAppBar = styled(AppBar)(() => ({
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 4px 32px rgba(0, 0, 0, 0.12)",
  color: "#1f2937",
  borderBottom: "1px solid rgba(5, 150, 105, 0.1)",
  position: "sticky",
}));

const LogoContainer = styled(Box)(() => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-8px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(16, 185, 129, 0.05))",
    zIndex: -1,
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover::before": {
    opacity: 1,
  },
  "& img": {
    animation: `${logoFloat} 3s ease-in-out infinite`,
  },
}));

const NavLink = styled("a")(() => ({
  color: "#4b5563",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: "1rem",
  transition: "all 0.3s ease",
  padding: "12px 20px",
  borderRadius: "12px",
  position: "relative",
  cursor: "pointer",
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: "8px",
    left: "50%",
    width: "0",
    height: "2px",
    background: "linear-gradient(90deg, #059669, #10b981)",
    borderRadius: "1px",
    transition: "all 0.3s ease",
    transform: "translateX(-50%)",
  },
  "&:hover": {
    color: "#059669",
    backgroundColor: "rgba(5, 150, 105, 0.05)",
    transform: "translateY(-2px)",
    "&::before": {
      width: "80%",
    },
  },
}));

const SignUpButton = styled(Button)(() => ({
  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
  color: "white",
  padding: "12px 24px",
  borderRadius: "14px",
  fontSize: "1rem",
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "0 4px 16px rgba(5, 150, 105, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #047857 0%, #059669 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(5, 150, 105, 0.4)",
  },
  "&:active": {
    transform: "translateY(0px)",
  },
}));

const BurgerButton = styled(IconButton)(() => ({
  color: "#4b5563",
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(5, 150, 105, 0.1)",
    color: "#059669",
  },
}));

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <StyledAppBar>
      <Container maxWidth="xl">
        <Toolbar
          sx={{ height: { xs: 64, sm: 72 }, justifyContent: "space-between" }}
        >
          <LogoContainer>
            <img src="/logo.png" alt="Logo" style={{ height: 36 }} />
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.375rem", sm: "1.5rem" },
                fontWeight: "800",
                background: "linear-gradient(135deg, #1f2937 0%, #059669 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              Aithor
            </Typography>
          </LogoContainer>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <NavLink href="#models">AI Models</NavLink>
                <NavLink href="#features">Features</NavLink>
                <NavLink href="#api-keys">API Keys</NavLink>
              </Box>
              <SignUpButton onClick={() => navigate("/sign-up")}>
                Sign Up
              </SignUpButton>
            </Box>
          )}

          {isMobile && (
            <BurgerButton
              onClick={handleMobileMenuToggle}
              aria-label="Open menu"
            >
              <Menu />
            </BurgerButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 320,
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            color: "#1f2937",
            borderRadius: "24px 0 0 24px",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #1f2937 0%, #059669 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Menu
            </Typography>
            <IconButton
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              sx={{
                color: "#4b5563",
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "rgba(5, 150, 105, 0.1)",
                  color: "#059669",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "rgba(5, 150, 105, 0.1)" }} />

          <List sx={{ p: 0, gap: 1, display: "flex", flexDirection: "column" }}>
            <ListItem
              onClick={() => handleNavClick("#models")}
              sx={{
                cursor: "pointer",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(5, 150, 105, 0.05)",
                  transform: "translateX(8px)",
                },
              }}
            >
              <ListItemText
                primary="AI Models"
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: 600,
                    color: "#374151",
                  },
                }}
              />
            </ListItem>

            <ListItem
              onClick={() => handleNavClick("#features")}
              sx={{
                cursor: "pointer",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(5, 150, 105, 0.05)",
                  transform: "translateX(8px)",
                },
              }}
            >
              <ListItemText
                primary="Features"
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: 600,
                    color: "#374151",
                  },
                }}
              />
            </ListItem>

            <ListItem
              onClick={() => handleNavClick("#api-keys")}
              sx={{
                cursor: "pointer",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(5, 150, 105, 0.05)",
                  transform: "translateX(8px)",
                },
              }}
            >
              <ListItemText
                primary="API Keys"
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: 600,
                    color: "#374151",
                  },
                }}
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 3, borderColor: "rgba(5, 150, 105, 0.1)" }} />

          <SignUpButton
            fullWidth
            onClick={() => {
              navigate("/sign-up");
              setMobileMenuOpen(false);
            }}
            sx={{
              py: 2,
            }}
          >
            Sign Up
          </SignUpButton>
        </Box>
      </Drawer>
    </StyledAppBar>
  );
}
