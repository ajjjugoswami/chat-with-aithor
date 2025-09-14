import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Fade, Slide } from "@mui/material";
import { styled } from "@mui/material/styles";
import CookieIcon from "@mui/icons-material/Cookie";

const BannerContainer = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1300,
  padding: theme.spacing(3, 4),
  backgroundColor: theme.palette.background.paper,
  borderTop: `2px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[12],
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: theme.spacing(3),
  borderRadius: "16px 16px 0 0",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
    textAlign: "center",
    padding: theme.spacing(2.5, 2),
    gap: theme.spacing(2),
    borderRadius: "16px 16px 0 0",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  [theme.breakpoints.down("xs")]: {
    padding: theme.spacing(2, 1.5),
    gap: theme.spacing(1.5),
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
  flex: 1,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    textAlign: "center",
    gap: theme.spacing(2),
    alignItems: "center",
  },
  [theme.breakpoints.down("xs")]: {
    gap: theme.spacing(1.5),
  },
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
    flexDirection: "row",
    gap: theme.spacing(1.5),
    flexWrap: "wrap",
  },
  [theme.breakpoints.down("xs")]: {
    gap: theme.spacing(1),
    "& > button": {
      flex: "1 1 auto",
      minWidth: "80px",
    },
  },
}));

const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
    // Here you can add analytics initialization or other cookie-dependent code
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  return (
    <Slide
      direction="up"
      in={isVisible}
      mountOnEnter
      unmountOnExit
      timeout={600}
    >
      <BannerContainer elevation={8}>
        <ContentContainer>
          <Fade in={isVisible} timeout={800}>
            <CookieIcon
              color="primary"
              fontSize="large"
              sx={{ fontSize: { xs: 36, sm: 48 } }}
            />
          </Fade>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              component="div"
              gutterBottom
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
              }}
            >
              We Value Your Privacy
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
                fontSize: { xs: "0.875rem", sm: "0.875rem" },
              }}
            >
              We use cookies to enhance your experience, analyze site traffic,
              and personalize content. By continuing, you agree to our use of
              cookies. You can manage your preferences anytime.
            </Typography>
          </Box>
        </ContentContainer>

        <ButtonContainer>
          <Button
            variant="outlined"
            size="medium"
            onClick={handleDecline}
            sx={{
              minWidth: { xs: 80, sm: 100 },
              borderRadius: 2,
              fontWeight: 500,
              fontSize: { xs: "0.875rem", sm: "0.875rem" },
              padding: { xs: "8px 16px", sm: "8px 16px" },
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: (theme) => theme.shadows[4],
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            Decline
          </Button>
          <Button
            variant="contained"
            size="medium"
            onClick={handleAccept}
            sx={{
              minWidth: { xs: 80, sm: 100 },
              borderRadius: 2,
              fontWeight: 500,
              fontSize: { xs: "0.875rem", sm: "0.875rem" },
              padding: { xs: "8px 16px", sm: "8px 16px" },
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: (theme) => theme.shadows[6],
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            Accept
          </Button>
        </ButtonContainer>
      </BannerContainer>
    </Slide>
  );
};

export default CookieConsentBanner;
