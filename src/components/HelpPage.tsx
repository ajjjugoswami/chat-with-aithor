import { Box, Typography, IconButton } from "@mui/material";
import SettingsResourcesSection from "./SettingsResourcesSection";
import { useTheme } from "../hooks/useTheme";
import { ArrowLeft } from "lucide-react";

interface HelpPageProps {
  onBack: () => void;
}

export default function HelpPage({ onBack }: HelpPageProps) {
  const { mode } = useTheme();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        pt: "24px",
        pb: "24px",
        pr: "24px",
        pl: "24px",
        bgcolor: mode === "light" ? "#ffffff" : "#121212",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
        {onBack && (
          <IconButton
            onClick={onBack}
            sx={{
              color: mode === "light" ? "#1a1a1a" : "white",
              mr: 2,
              "&:hover": { bgcolor: mode === "light" ? "#f3f4f6" : "#1a1a1a" },
              p: 1,
            }}
          >
            <ArrowLeft size={20} />
          </IconButton>
        )}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: mode === "light" ? "#1a1a1a" : "white",
          }}
        >
          Help
        </Typography>
      </Box>
      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <SettingsResourcesSection />
      </Box>
    </Box>
  );
}
