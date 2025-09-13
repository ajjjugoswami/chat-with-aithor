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

        bgcolor: mode === "light" ? "#ffffff" : "#121212",
      }}
    >
      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          pt: "24px",
          pb: "24px",
          pr: "24px",
          pl: "24px",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
          {onBack && (
            <IconButton
              onClick={onBack}
              sx={{
                color: mode === "light" ? "#1a1a1a" : "white",
                mr: 2,
                "&:hover": {
                  bgcolor: mode === "light" ? "#f3f4f6" : "#1a1a1a",
                },
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
        <SettingsResourcesSection />
      </Box>
    </Box>
  );
}
