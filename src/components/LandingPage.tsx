import { useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Header,
  HeroSection,
  FeaturesSection,
  AIModelsSection,
//   DeveloperSection,
  APIKeysSection,
  CTASection,
  Footer,
} from "./landing-page";

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated, redirect to chat
    if (!loading && isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, loading, navigate]);

  // Don't render landing page if user is authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "white",
        "& .MuiCard-root": { backgroundColor: "#fff" },
        "& .MuiAccordionSummary-root": { backgroundColor: "#fff" },
        "& .MuiAccordionDetails-root": { backgroundColor: "#fff" },
      }}
    >
      <Header />
      <HeroSection />
      <FeaturesSection />
      <AIModelsSection />
      {/* <DeveloperSection /> */}
      <APIKeysSection />
      <CTASection />
      <Footer />
    </Box>
  );
}
