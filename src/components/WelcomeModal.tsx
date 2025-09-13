import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Button,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  X,
  Play,
  Key,
  Shield,
  Zap,
  Users,
  Star,
  ExternalLink,
  Youtube,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { WELCOME_MODAL_KEY } from "../hooks/useWelcomeModal";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
        : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    maxWidth: "600px",
    width: "90vw",
    maxHeight: "75vh",
    animation: `${fadeIn} 0.3s ease-out`,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 20px 40px rgba(0, 0, 0, 0.5)"
        : "0 20px 40px rgba(0, 0, 0, 0.15)",
    overflow: "hidden",
  },
  "& .MuiDialogContent-root": {
    padding: "0 !important",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: theme.palette.mode === "dark" 
        ? "linear-gradient(180deg, #374151 0%, #1f2937 100%)" 
        : "linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)",
    },
    "&::-webkit-scrollbar-thumb": {
      background: theme.palette.mode === "dark"
        ? "linear-gradient(180deg, #059669 0%, #10b981 100%)"
        : "linear-gradient(180deg, #059669 0%, #10b981 100%)",
      borderRadius: "10px",
      border: theme.palette.mode === "dark" 
        ? "1px solid #1f2937" 
        : "1px solid #e2e8f0",
      transition: "all 0.3s ease",
      "&:hover": {
        background: theme.palette.mode === "dark"
          ? "linear-gradient(180deg, #047857 0%, #059669 100%)"
          : "linear-gradient(180deg, #047857 0%, #059669 100%)",
        transform: "scaleX(1.2)",
      },
      "&:active": {
        background: theme.palette.mode === "dark"
          ? "linear-gradient(180deg, #065f46 0%, #047857 100%)"
          : "linear-gradient(180deg, #065f46 0%, #047857 100%)",
      },
    },
  },
}));

const Header = styled(Box)(() => ({
  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
  color: "white",
  padding: "16px 20px",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
    pointerEvents: "none",
  },
}));

const CloseButton = styled(IconButton)(() => ({
  position: "absolute",
  cursor: "pointer",
  top: "12px",
  right: "12px",
  zIndex: "1000",
  color: "white",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "8px",
  width: "36px",
  height: "36px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: "scale(1.05)",
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    background: "linear-gradient(90deg, #059669, #10b981)",
    height: "2px",
    borderRadius: "2px",
  },
  "& .MuiTab-root": {
    fontSize: "0.875rem",
    fontWeight: 600,
    textTransform: "none",
    color: theme.palette.mode === "dark" ? "#9ca3af" : "#6b7280",
    minHeight: "48px",
    transition: "all 0.3s ease",
    "&.Mui-selected": {
      color: "#059669",
    },
    "&:hover": {
      color: "#059669",
    },
  },
}));

const VideoContainer = styled(Box)(() => ({
  position: "relative",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
  background: "#000",
  aspectRatio: "16/9",
}));

const InfoCard = styled(Card)(({ theme }) => ({
  border: "none",
  borderRadius: "12px",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #374151 0%, #1f2937 100%)"
      : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 2px 12px rgba(0, 0, 0, 0.3)"
      : "0 2px 12px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  animation: `${slideUp} 0.4s ease-out`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 6px 20px rgba(0, 0, 0, 0.4)"
        : "0 6px 20px rgba(0, 0, 0, 0.12)",
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #064e3b 0%, #065f46 100%)"
      : "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "12px",
  color: "#059669",
}));

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const { user } = useAuth();
  const { mode } = useTheme();

  React.useEffect(() => {
    if (open) {
      setShowConfetti(true);
      // Stop confetti after 3 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = () => {
    localStorage.setItem(WELCOME_MODAL_KEY, "true");
    onClose();
  };

  const features = [
    {
      icon: <Key size={24} />,
      title: "Your Own API Keys",
      description:
        "Use your personal API keys for complete control and privacy",
    },
    {
      icon: <Shield size={24} />,
      title: "Secure & Private",
      description:
        "Your keys are stored locally and never shared with third parties",
    },
    {
      icon: <Zap size={24} />,
      title: "Lightning Fast",
      description: "Direct API connections for the fastest possible responses",
    },
    {
      icon: <Users size={24} />,
      title: "Multiple Models",
      description: "Compare responses from ChatGPT, Gemini, Claude, and more",
    },
  ];

  const apiProviders = [
    {
      name: "OpenAI (ChatGPT)",
      url: "https://platform.openai.com/api-keys",
      difficulty: "Easy",
      color: "#10b981",
    },
    {
      name: "Google (Gemini)",
      url: "https://aistudio.google.com/app/apikey",
      difficulty: "Easy",
      color: "#10b981",
    },
    {
      name: "Anthropic (Claude)",
      url: "https://console.anthropic.com/",
      difficulty: "Medium",
      color: "#f59e0b",
    },
    {
      name: "DeepSeek",
      url: "https://platform.deepseek.com/api_keys",
      difficulty: "Easy",
      color: "#10b981",
    },
    {
      name: "Perplexity",
      url: "https://www.perplexity.ai/settings/api",
      difficulty: "Easy",
      color: "#10b981",
    },
  ];

  return (
    <>
      {showConfetti && <Fireworks autorun={{ speed: 3, duration: 2000 }} />}
      <StyledDialog open={open} onClose={handleClose} maxWidth={false}>
        <DialogContent sx={{ p: 0 }}>
          <Header>
            <CloseButton onClick={handleClose}>
              <X size={20} onClick={handleClose} />
            </CloseButton>
            <Box sx={{
              position: "relative",
              zIndex: 1,
              pr: { xs: 5, sm: 6 }, // Add right padding to prevent overlap with close button
              overflow: "hidden"
            }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  fontWeight: "700",
                  mb: 1,
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                }}
                title={`Welcome to Aithor${user?.name ? `, ${user.name}` : ""}!`} // Full title for tooltip
              >
                Welcome to Aithor{user?.name ? `, ${user.name}!` : "!"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "0.875rem", sm: "0.95rem" },
                  opacity: 0.95,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                }}
              >
                🚀 Get started with multiple AI models using your own API keys
              </Typography>
            </Box>
          </Header>

          <Box sx={{ p: 3 }}>
            <StyledTabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
            >
              <Tab
                icon={<Youtube size={18} />}
                iconPosition="start"
                label="Video Guide"
              />
              <Tab
                icon={<BookOpen size={18} />}
                iconPosition="start"
                label="API Info"
              />
            </StyledTabs>

            {activeTab === 0 && (
              <Box sx={{ animation: `${slideUp} 0.4s ease-out` }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: mode === "dark" ? "#f3f4f6" : "#111827",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Play size={18} style={{ color: "#059669" }} />
                  How to Get Your API Keys
                </Typography>

                <VideoContainer sx={{ aspectRatio: "16/9", mb: 2 }}>
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube-nocookie.com/embed/OB99E7Y1cMA"
                    title="How to Get API Keys for AI Models"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      borderRadius: "12px",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </VideoContainer>

                <Typography
                  sx={{
                    mb: 3,
                    color: mode === "dark" ? "#9ca3af" : "#6b7280",
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}
                >
                  📺 Quick guide to obtain API keys from different providers
                </Typography>
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ animation: `${slideUp} 0.4s ease-out` }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: mode === "dark" ? "#f3f4f6" : "#111827",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Star size={18} style={{ color: "#059669" }} />
                  Why Use Your Own API Keys?
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                  }}
                >
                  {features.map((feature, index) => (
                    <InfoCard
                      key={index}
                      sx={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <FeatureIcon
                          sx={{ width: "32px", height: "32px", mb: 1 }}
                        >
                          {React.cloneElement(
                            feature.icon as React.ReactElement
                          )}
                        </FeatureIcon>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            color: mode === "dark" ? "#f3f4f6" : "#111827",
                            mb: 0.5,
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          sx={{
                            color: mode === "dark" ? "#9ca3af" : "#6b7280",
                            fontSize: "0.8rem",
                            lineHeight: 1.4,
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </InfoCard>
                  ))}
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: mode === "dark" ? "#f3f4f6" : "#111827",
                    mb: 2,
                  }}
                >
                  🔗 Quick Links to Get API Keys:
                </Typography>

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {apiProviders.map((provider, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        border:
                          mode === "dark"
                            ? "1px solid #374151"
                            : "1px solid #e5e7eb",
                        borderRadius: "8px",
                        backgroundColor:
                          mode === "dark" ? "#1f2937" : "#ffffff",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "#059669",
                          backgroundColor:
                            mode === "dark" ? "#065f46" : "#f0fdf4",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 500,
                            color: mode === "dark" ? "#f3f4f6" : "#111827",
                            fontSize: "0.875rem",
                          }}
                        >
                          {provider.name}
                        </Typography>
                        <Chip
                          label={provider.difficulty}
                          size="small"
                          sx={{
                            backgroundColor: provider.color,
                            color: "white",
                            fontSize: "0.7rem",
                            fontWeight: 500,
                            height: "20px",
                          }}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        endIcon={<ExternalLink size={14} />}
                        onClick={() => window.open(provider.url, "_blank")}
                        sx={{
                          borderColor: "#059669",
                          color: "#059669",
                          fontSize: "0.75rem",
                          textTransform: "none",
                          minWidth: "auto",
                          py: 0.5,
                          px: 1.5,
                          "&:hover": {
                            backgroundColor: "#ecfdf5",
                            borderColor: "#047857",
                          },
                        }}
                      >
                        Get Key
                      </Button>
                    </Box>
                  ))}
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: mode === "dark" ? "#065f46" : "#f0fdf4",
                    borderRadius: "8px",
                    border:
                      mode === "dark"
                        ? "1px solid #047857"
                        : "1px solid #bbf7d0",
                  }}
                >
                  <Typography
                    sx={{
                      color: mode === "dark" ? "#bbf7d0" : "#059669",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    💡 <strong>Pro Tip:</strong> Start with OpenAI or Google
                    Gemini as they're the easiest to set up. You can always add
                    more API keys later in Settings!
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
      </StyledDialog>
    </>
  );
}
