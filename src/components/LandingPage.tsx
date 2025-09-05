import { Box } from "@mui/material";
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
