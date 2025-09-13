import { Box, Typography, Card, CardContent, Button, Chip } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import {
  ChatGptIcon,
  GeminiAi,
  ClaudeIcon,
  DeepseekIcon,
  PerplexicityIcon
} from "./shared/Icons";
import {
  ExternalLink,
  Key,
  Zap,
  Shield,
  FileText,
  GraduationCap,
  Settings,
  HelpCircle,
  Headphones
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
  }
`;

const SettingsCard = styled(Card)<{ mode: string }>(({ mode }) => {
  const isDark = mode === 'dark';
  return {
    height: "100%",
    borderRadius: "20px",
    background: isDark ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)" : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.1)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    animation: `${slideInLeft} 0.8s ease-out`,
    border: isDark ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid rgba(59, 130, 246, 0.1)",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "4px",
      background: "linear-gradient(90deg, #3b82f6, #1d4ed8, #1e40af)",
      transform: "scaleX(0)",
      transformOrigin: "left",
      transition: "transform 0.4s ease",
    },
    "&:hover": {
      transform: "translateY(-8px) scale(1.02)",
      boxShadow: isDark ? "0 20px 40px rgba(0, 0, 0, 0.4)" : "0 20px 40px rgba(0, 0, 0, 0.2)",
      border: isDark ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid rgba(59, 130, 246, 0.2)",
      "&::before": {
        transform: "scaleX(1)",
      },
    },
  };
});

const ModelIcon = styled(Box)<{ mode: string }>(({ mode }) => {
  const isDark = mode === 'dark';
  return {
    width: "64px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    borderRadius: "16px",
    background: isDark ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
    position: "relative",
    border: "2px solid rgba(59, 130, 246, 0.3)",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: "2px",
      borderRadius: "14px",
      background: isDark ? "linear-gradient(135deg, #334155 0%, #475569 100%)" : "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
      zIndex: 1,
    },
    "& > svg": {
      position: "relative",
      zIndex: 2,
    },
  };
});

const ConfigCard = styled(Card)<{ mode: string }>(({ mode }) => {
  const isDark = mode === 'dark';
  return {
    borderRadius: "16px",
    padding: "24px",
    background: isDark ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    boxShadow: isDark ? "0 4px 20px rgba(0, 0, 0, 0.2)" : "0 4px 20px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    position: "relative",
    border: isDark ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid rgba(59, 130, 246, 0.1)",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: isDark ? "0 12px 32px rgba(0, 0, 0, 0.3)" : "0 12px 32px rgba(0, 0, 0, 0.2)",
      border: isDark ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid rgba(59, 130, 246, 0.2)",
    },
  };
});

const ConfigNumber = styled(Box)(() => ({
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "1.1rem",
  marginBottom: "20px",
  boxShadow: "0 4px 16px rgba(59, 130, 246, 0.4)",
  animation: `${pulseGlow} 2s infinite`,
}));

const ResourceCard = styled(Card)<{ mode: string }>(({ mode }) => {
  const isDark = mode === 'dark';
  return {
    borderRadius: "16px",
    background: isDark ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    boxShadow: isDark ? "0 4px 20px rgba(0, 0, 0, 0.2)" : "0 4px 20px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    border: isDark ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid rgba(59, 130, 246, 0.1)",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: isDark ? "0 16px 40px rgba(0, 0, 0, 0.3)" : "0 16px 40px rgba(0, 0, 0, 0.2)",
      border: isDark ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid rgba(59, 130, 246, 0.2)",
      "&::before": {
        opacity: 1,
      },
    },
  };
});

const apiProviders = [
  {
    name: "OpenAI",
    model: "ChatGPT",
    description: "Configure GPT-3.5 and GPT-4 models with custom settings",
    icon: (
      <ChatGptIcon
        style={{ color: "#3b82f6" }}
        sx={{ fontSize: { xs: 24, sm: 28 } }}
      />
    ),
    url: "https://platform.openai.com/api-keys",
    difficulty: "Easy",
    difficultyColor: "#10b981",
    pricing: "Pay-per-use",
  },
  {
    name: "Google",
    model: "Gemini",
    description: "Set up Google's multimodal AI with advanced configurations",
    icon: <GeminiAi sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    url: "https://aistudio.google.com/app/apikey",
    difficulty: "Easy",
    difficultyColor: "#10b981",
    pricing: "Free tier + Pay-per-use",
  },
  {
    name: "Anthropic",
    model: "Claude",
    description: "Configure Claude's advanced reasoning with custom parameters",
    icon: <ClaudeIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    url: "https://console.anthropic.com/",
    difficulty: "Medium",
    difficultyColor: "#f59e0b",
    pricing: "Pay-per-use",
  },
  {
    name: "DeepSeek",
    model: "DeepSeek",
    description: "Configure DeepSeek's coding and reasoning models",
    icon: <DeepseekIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    url: "https://platform.deepseek.com/api_keys",
    difficulty: "Easy",
    difficultyColor: "#10b981",
    pricing: "Very affordable",
  },
  {
    name: "Perplexity",
    model: "Perplexity",
    description: "Configure Perplexity's search-enhanced AI settings",
    icon: <PerplexicityIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />,
    url: "https://www.perplexity.ai/settings/api",
    difficulty: "Easy",
    difficultyColor: "#10b981",
    pricing: "Free tier + Pay-per-use",
  },
];

const configSteps = [
  {
    number: 1,
    title: "Select Provider",
    description: "Choose the AI model provider you want to configure",
    icon: <Settings style={{ fontSize: 20 }} />,
  },
  {
    number: 2,
    title: "Add API Key",
    description: "Enter your API key securely in the settings panel",
    icon: <Key style={{ fontSize: 20 }} />,
  },
  {
    number: 3,
    title: "Configure Model",
    description: "Set up model parameters and preferences",
    icon: <Zap style={{ fontSize: 20 }} />,
  },
  {
    number: 4,
    title: "Test Connection",
    description: "Verify your setup and start chatting with AI",
    icon: <Shield style={{ fontSize: 20 }} />,
  },
];

const settingsResources = [
  {
    title: "Model Configuration Guide",
    description: "Learn how to optimize AI model settings for best performance",
    url: "https://platform.openai.com/docs/guides/gpt-best-practices",
    category: "Configuration",
    icon: <Settings style={{ fontSize: 18 }} />,
    provider: "General",
  },
  {
    title: "API Rate Limiting",
    description: "Understanding and managing API rate limits effectively",
    url: "https://nordicapis.com/everything-you-need-to-know-about-api-rate-limiting/",
    category: "Performance",
    icon: <Zap style={{ fontSize: 18 }} />,
    provider: "General",
  },
  {
    title: "Security Best Practices",
    description: "Keep your API keys secure and protect your applications",
    url: "https://blog.gitguardian.com/secrets-api-management/",
    category: "Security",
    icon: <Shield style={{ fontSize: 18 }} />,
    provider: "General",
  },
  {
    title: "Troubleshooting Guide",
    description: "Common issues and solutions for AI API integrations",
    url: "https://docs.anthropic.com/claude/docs/troubleshooting",
    category: "Support",
    icon: <Headphones style={{ fontSize: 18 }} />,
    provider: "General",
  },
  {
    title: "Cost Optimization",
    description: "Strategies to reduce API costs while maintaining performance",
    url: "https://artificialanalysis.ai/cost-calculator",
    category: "Finance",
    icon: <FileText style={{ fontSize: 18 }} />,
    provider: "General",
  },
  {
    title: "Advanced Features",
    description: "Explore advanced AI capabilities and integrations",
    url: "https://ai.google.dev/gemini-api/docs",
    category: "Features",
    icon: <GraduationCap style={{ fontSize: 18 }} />,
    provider: "Google",
  },
  {
    title: "Community Forums",
    description: "Connect with other developers and share experiences",
    url: "https://community.openai.com/",
    category: "Community",
    icon: <HelpCircle style={{ fontSize: 18 }} />,
    provider: "OpenAI",
  },
  {
    title: "API Status Dashboard",
    description: "Monitor API availability and performance in real-time",
    url: "https://status.openai.com/",
    category: "Monitoring",
    icon: <FileText style={{ fontSize: 18 }} />,
    provider: "OpenAI",
  },
];

export default function SettingsResourcesSection() {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  return (
    <Box sx={{ py: { xs: 4, sm: 6, lg: 8 } }}>
      <div>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, lg: 6 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.25rem" },
              fontWeight: "bold",
              color: isDark ? "#f1f5f9" : "#1e293b",
              mb: 2,
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI Model Configuration & Resources
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", sm: "1.125rem" },
              color: isDark ? "#94a3b8" : "#64748b",
              maxWidth: "2xl",
              mx: "auto",
              mb: 3,
            }}
          >
            Configure your AI models and access helpful resources for optimal performance
          </Typography>
        </Box>

        {/* Configuration Steps */}
        <Box sx={{ mb: { xs: 4, lg: 6 } }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.125rem", sm: "1.375rem" },
              fontWeight: "bold",
              color: isDark ? "#f1f5f9" : "#1e293b",
              mb: 3,
              textAlign: "center",
            }}
          >
            Setup Configuration Steps
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: { xs: 2, sm: 3, lg: 3 },
              mb: 4,
            }}
          >
            {configSteps.map((step, index) => (
              <ConfigCard key={index} mode={mode}>
                <ConfigNumber>{step.number}</ConfigNumber>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ color: "#3b82f6", mr: 1.5, fontSize: 20 }}>{step.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: isDark ? "#f1f5f9" : "#1e293b",
                    }}
                  >
                    {step.title}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: isDark ? "#94a3b8" : "#64748b",
                    lineHeight: 1.5,
                  }}
                >
                  {step.description}
                </Typography>
              </ConfigCard>
            ))}
          </Box>
        </Box>

        {/* AI Models Section */}
        <Box sx={{ mb: { xs: 4, lg: 6 } }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.125rem", sm: "1.375rem" },
              fontWeight: "bold",
              color: isDark ? "#f1f5f9" : "#1e293b",
              mb: 3,
              textAlign: "center",
            }}
          >
            Available AI Models
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: { xs: 3, sm: 3, lg: 4 },
            }}
          >
            {apiProviders.map((provider, index) => (
              <SettingsCard key={index} mode={mode}>
                <CardContent sx={{ p: { xs: 3, sm: 3.5 }, textAlign: "center" }}>
                  <ModelIcon mode={mode}>{provider.icon}</ModelIcon>

                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      fontWeight: "bold",
                      color: isDark ? "#f1f5f9" : "#1e293b",
                      mb: 1,
                    }}
                  >
                    {provider.name}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#3b82f6",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {provider.model}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: isDark ? "#94a3b8" : "#64748b",
                      mb: 3,
                      lineHeight: 1.5,
                    }}
                  >
                    {provider.description}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
                    <Chip
                      label={provider.difficulty}
                      size="small"
                      sx={{
                        backgroundColor: provider.difficultyColor,
                        color: "white",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label={provider.pricing}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: isDark ? "#475569" : "#cbd5e1",
                        color: isDark ? "#cbd5e1" : "#64748b",
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={<ExternalLink size={20} />}
                    onClick={() => window.open(provider.url, '_blank')}
                    sx={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      py: 1.25,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#2563eb",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Configure
                  </Button>
                </CardContent>
              </SettingsCard>
            ))}
          </Box>
        </Box>

        {/* Resources Section */}
        <Box
          sx={{
            background: isDark ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)" : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            borderRadius: "24px",
            p: { xs: 3, sm: 4, lg: 5 },
            position: "relative",
            border: `1px solid ${isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)"}`,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isDark ? "radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)" : "radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
              borderRadius: "24px",
              pointerEvents: "none",
            }
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              fontWeight: "800",
              color: isDark ? "#f1f5f9" : "#1e293b",
              mb: { xs: 3, sm: 4 },
              textAlign: "center",
              letterSpacing: "-0.02em",
              position: "relative",
              zIndex: 1,
            }}
          >
            Configuration Resources & Guides
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: { xs: 2, sm: 3, lg: 3 },
              position: "relative",
              zIndex: 1,
            }}
          >
            {settingsResources.map((resource, index) => (
              <ResourceCard key={index} mode={mode} sx={{ animationDelay: `${index * 0.1}s`, height: "100%" }}>
                <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                    <Box
                      sx={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: isDark ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)" : "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#3b82f6",
                        mr: 2,
                        fontSize: 18,
                        boxShadow: isDark ? "0 4px 12px rgba(59, 130, 246, 0.2)" : "0 4px 12px rgba(59, 130, 246, 0.1)",
                        flexShrink: 0,
                      }}
                    >
                      {resource.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, gap: 1, flexWrap: "wrap" }}>
                        <Chip
                          label={resource.category}
                          size="small"
                          sx={{
                            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                            color: "white",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            height: "18px",
                            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                          }}
                        />
                        <Chip
                          label={resource.provider}
                          size="small"
                          sx={{
                            backgroundColor: isDark ? "#334155" : "#e2e8f0",
                            color: isDark ? "#cbd5e1" : "#475569",
                            fontSize: "0.65rem",
                            fontWeight: 500,
                            height: "18px",
                            border: `1px solid ${isDark ? "#475569" : "#cbd5e1"}`,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: isDark ? "#f1f5f9" : "#1e293b",
                      mb: 1.5,
                      lineHeight: 1.3,
                    }}
                  >
                    {resource.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: isDark ? "#94a3b8" : "#64748b",
                      mb: 2.5,
                      lineHeight: 1.5,
                      flex: 1,
                    }}
                  >
                    {resource.description}
                  </Typography>

                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<ExternalLink size={14} />}
                    onClick={() => window.open(resource.url, '_blank')}
                    sx={{
                      background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      color: "white",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: "8px",
                      px: 2,
                      py: 0.75,
                      alignSelf: "flex-start",
                      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 6px 16px rgba(59, 130, 246, 0.5)",
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </ResourceCard>
            ))}
          </Box>
        </Box>

        {/* Support Section */}
        <Box
          sx={{
            mt: { xs: 4, lg: 6 },
            p: 4,
            backgroundColor: isDark ? "#1e293b" : "#f8fafc",
            borderRadius: 3,
            border: `1px solid ${isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.1)"}`,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", sm: "1.125rem" },
              fontWeight: 600,
              color: isDark ? "#f1f5f9" : "#1e293b",
              mb: 2,
            }}
          >
            Need Configuration Help?
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: isDark ? "#cbd5e1" : "#64748b",
              mb: 3,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Having trouble configuring your AI models? Check out our comprehensive resources above
            or explore the provider documentation for detailed setup instructions.
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "#3b82f6",
              fontWeight: 500,
            }}
          >
            💡 Pro Tip: Start with the free tiers to test your configurations!
          </Typography>
        </Box>
      </div>
    </Box>
  );
}