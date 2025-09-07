import { Box, Container, Typography, Card, CardContent, Button, Chip } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { 
  ChatGptIcon, 
  GeminiAi, 
  ClaudeIcon, 
  DeepseekIcon, 
  PerplexicityIcon 
} from "../shared/Icons";
import { 
  OpenInNew as ExternalLink,
  Key as KeyIcon,
  Speed as FastIcon,
  Security as SecurityIcon,
  Article as ArticleIcon,
  MenuBook as GuideIcon,
  YouTube as VideoIcon,
  School as TutorialIcon
} from "@mui/icons-material";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const APICard = styled(Card)(() => ({
  height: "100%",
  border: "none",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  animation: `${fadeInUp} 0.6s ease-out`,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "6px",
    background: "linear-gradient(90deg, #059669, #10b981, #047857)",
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-12px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    "&::before": {
      transform: "scaleX(1)",
    },
  },
}));

const ProviderIcon = styled(Box)(() => ({
  width: "72px",
  height: "72px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 24px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "3px",
    borderRadius: "17px",
    background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
    zIndex: 1,
  },
  "& > svg": {
    position: "relative",
    zIndex: 2,
  },
}));

const StepCard = styled(Card)(() => ({
  border: "none",
  borderRadius: "20px",
  padding: "32px",
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  position: "relative",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
  },
}));

const StepNumber = styled(Box)(() => ({
  width: "48px",
  height: "48px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "1.25rem",
  marginBottom: "24px",
  boxShadow: "0 4px 16px rgba(5, 150, 105, 0.3)",
}));

const ResourceCard = styled(Card)(() => ({
  border: "none",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #059669, #10b981)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.12)",
    "&::before": {
      opacity: 1,
    },
  },
}));

const apiProviders = [
  {
    name: "OpenAI",
    model: "ChatGPT",
    description: "Get API access for GPT-3.5 and GPT-4 models",
    icon: (
      <ChatGptIcon
        style={{ color: "#333" }}
        sx={{ fontSize: { xs: 28, sm: 32 } }}
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
    description: "Access Google's powerful multimodal AI through their API",
    icon: <GeminiAi sx={{ fontSize: { xs: 28, sm: 32 } }} />,
    url: "https://aistudio.google.com/app/apikey",
    difficulty: "Easy",
    difficultyColor: "#10b981",
    pricing: "Free tier + Pay-per-use",
  },
  {
    name: "Anthropic",
    model: "Claude",
    description: "Get access to Claude's advanced reasoning capabilities",
    icon: <ClaudeIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />,
    url: "https://console.anthropic.com/",
    difficulty: "Medium",
    difficultyColor: "#f59e0b",
    pricing: "Pay-per-use",
  },
  {
    name: "DeepSeek",
    model: "DeepSeek",
    description: "Access DeepSeek's coding and reasoning AI models",
    icon: <DeepseekIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />,
    url: "https://platform.deepseek.com/api_keys",
    difficulty: "Easy",
    difficultyColor: "#10b981",
    pricing: "Very affordable",
  },
  {
    name: "Perplexity",
    model: "Perplexity",
    description: "Get API access to Perplexity's search-enhanced AI",
    icon: <PerplexicityIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />,
    url: "https://www.perplexity.ai/settings/api",
    difficulty: "Easy",
    difficultyColor: "#10b981",
    pricing: "Free tier + Pay-per-use",
  },
];

const steps = [
  {
    number: 1,
    title: "Choose Your Provider",
    description: "Select the AI model provider you want to use from the cards below",
    icon: <KeyIcon />,
  },
  {
    number: 2,
    title: "Create Account",
    description: "Sign up on the provider's platform using the provided links",
    icon: <FastIcon />,
  },
  {
    number: 3,
    title: "Generate API Key",
    description: "Navigate to API settings and generate your unique API key",
    icon: <SecurityIcon />,
  },
  {
    number: 4,
    title: "Add to Aithor",
    description: "Paste your API key in Aithor's settings and start chatting!",
    icon: <ExternalLink />,
  },
];

const helpfulResources = [
  {
    title: "OpenAI API Documentation",
    description: "Complete guide to OpenAI's API, including authentication and best practices",
    url: "https://platform.openai.com/docs/introduction",
    category: "Documentation",
    icon: <GuideIcon />,
    provider: "OpenAI",
  },
  {
    title: "Google AI Studio Tutorial",
    description: "Step-by-step tutorial for getting started with Google Gemini API",
    url: "https://ai.google.dev/gemini-api/docs/get-started/tutorial",
    category: "Tutorial",
    icon: <TutorialIcon />,
    provider: "Google",
  },
  {
    title: "Anthropic API Quickstart",
    description: "Quick start guide for Claude API with code examples",
    url: "https://docs.anthropic.com/claude/docs/getting-started",
    category: "Guide",
    icon: <ArticleIcon />,
    provider: "Anthropic",
  },
  {
    title: "API Keys Best Practices",
    description: "Security best practices for managing and storing API keys safely",
    url: "https://blog.gitguardian.com/secrets-api-management/",
    category: "Security",
    icon: <SecurityIcon />,
    provider: "General",
  },
  {
    title: "API Rate Limits Guide",
    description: "Understanding and managing API rate limits across different providers",
    url: "https://nordicapis.com/everything-you-need-to-know-about-api-rate-limiting/",
    category: "Guide",
    icon: <ArticleIcon />,
    provider: "General",
  },
  {
    title: "AI API Comparison Video",
    description: "YouTube comparison of different AI APIs and their features",
    url: "https://www.youtube.com/results?search_query=ai+api+comparison+2024",
    category: "Video",
    icon: <VideoIcon />,
    provider: "General",
  },
  {
    title: "DeepSeek API Guide",
    description: "Getting started with DeepSeek's powerful coding models",
    url: "https://platform.deepseek.com/docs",
    category: "Documentation",
    icon: <GuideIcon />,
    provider: "DeepSeek",
  },
  {
    title: "API Cost Calculator",
    description: "Calculate and compare costs across different AI API providers",
    url: "https://artificialanalysis.ai/",
    category: "Tool",
    icon: <ArticleIcon />,
    provider: "General",
  },
  {
    title: "API Testing with Postman",
    description: "Learn how to test AI APIs using Postman before integrating",
    url: "https://learning.postman.com/docs/getting-started/introduction/",
    category: "Tutorial",
    icon: <TutorialIcon />,
    provider: "General",
  },
];

export default function APIKeysSection() {
  return (
    <Box id="api-keys" sx={{ py: { xs: 6, sm: 8, lg: 10 }, backgroundColor: "#f9fafb", scrollMarginTop: "80px" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, lg: 8 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              fontWeight: "bold",
              color: "#111827",
              mb: 2,
            }}
          >
            How to Get Your API Keys
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1.125rem", sm: "1.25rem" },
              color: "#6b7280",
              maxWidth: "2xl",
              mx: "auto",
              mb: 4,
            }}
          >
            Get started with your favorite AI models in just a few simple steps
          </Typography>
        </Box>

        {/* Steps Section */}
        <Box sx={{ mb: { xs: 6, lg: 8 } }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              fontWeight: "bold",
              color: "#111827",
              mb: 4,
              textAlign: "center",
            }}
          >
            Quick Setup Guide
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: { xs: 2, sm: 3, lg: 4 },
              mb: 6,
            }}
          >
            {steps.map((step, index) => (
              <StepCard key={index}>
                <StepNumber>{step.number}</StepNumber>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ color: "#059669", mr: 1 }}>{step.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    {step.title}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    lineHeight: 1.5,
                  }}
                >
                  {step.description}
                </Typography>
              </StepCard>
            ))}
          </Box>
        </Box>

        {/* API Providers Section */}
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              fontWeight: "bold",
              color: "#111827",
              mb: 4,
              textAlign: "center",
            }}
          >
            Available API Providers
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: { xs: 3, sm: 4, lg: 6 },
            }}
          >
            {apiProviders.map((provider, index) => (
              <APICard key={index}>
                <CardContent sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
                  <ProviderIcon>{provider.icon}</ProviderIcon>
                  
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: "1.125rem", sm: "1.25rem" },
                      fontWeight: "bold",
                      color: "#111827",
                      mb: 1,
                    }}
                  >
                    {provider.name}
                  </Typography>
                  
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: "#059669",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {provider.model}
                  </Typography>
                  
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
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
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label={provider.pricing}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: "#d1d5db",
                        color: "#374151",
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={<ExternalLink />}
                    onClick={() => window.open(provider.url, '_blank')}
                    sx={{
                      backgroundColor: "#059669",
                      color: "white",
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#047857",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Get API Key
                  </Button>
                </CardContent>
              </APICard>
            ))}
          </Box>
        </Box>

        {/* Helpful Resources Section */}
        <Box 
          sx={{ 
            mt: { xs: 8, lg: 12 },
            background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
            borderRadius: "32px",
            p: { xs: 3, sm: 4, lg: 6 },
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at 20% 80%, rgba(5, 150, 105, 0.05) 0%, transparent 50%)",
              borderRadius: "32px",
              pointerEvents: "none",
            }
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
              fontWeight: "800",
              background: "linear-gradient(135deg, #111827 0%, #374151 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: { xs: 3, sm: 4 },
              textAlign: "center",
              letterSpacing: "-0.02em",
              position: "relative",
              zIndex: 1,
            }}
          >
            Helpful Resources & Guides
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: { xs: 2, sm: 3, lg: 4 },
              position: "relative",
              zIndex: 1,
            }}
          >
            {helpfulResources.map((resource, index) => (
              <ResourceCard key={index} sx={{ animationDelay: `${index * 0.1}s`, height: "100%" }}>
                <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                    <Box
                      sx={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#059669",
                        mr: 2,
                        fontSize: 20,
                        boxShadow: "0 4px 12px rgba(5, 150, 105, 0.15)",
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
                            background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                            color: "white",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            height: "20px",
                            boxShadow: "0 2px 8px rgba(5, 150, 105, 0.25)",
                          }}
                        />
                        <Chip
                          label={resource.provider}
                          size="small"
                          sx={{
                            backgroundColor: "#f3f4f6",
                            color: "#6b7280",
                            fontSize: "0.7rem",
                            fontWeight: 500,
                            height: "20px",
                            border: "1px solid #e5e7eb",
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#111827",
                      mb: 1.5,
                      lineHeight: 1.3,
                    }}
                  >
                    {resource.title}
                  </Typography>
                  
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
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
                    endIcon={<ExternalLink sx={{ fontSize: 16 }} />}
                    onClick={() => window.open(resource.url, '_blank')}
                    sx={{
                      background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                      color: "white",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: "10px",
                      px: 2.5,
                      py: 1,
                      alignSelf: "flex-start",
                      boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #047857 0%, #059669 100%)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 6px 16px rgba(5, 150, 105, 0.4)",
                      },
                    }}
                  >
                    Read Guide
                  </Button>
                </CardContent>
              </ResourceCard>
            ))}
          </Box>
        </Box>

        {/* Help Section */}
        <Box
          sx={{
            mt: { xs: 6, lg: 8 },
            p: 4,
            backgroundColor: "#ecfdf5",
            borderRadius: 3,
            border: "1px solid #d1fae5",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", sm: "1.125rem" },
              fontWeight: 600,
              color: "#065f46",
              mb: 2,
            }}
          >
            Need Help?
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: "#047857",
              mb: 3,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Each provider has different setup processes. Check out our helpful resources above 
            for detailed guides, or click the "Get API Key" button to go directly to their API generation pages.
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "#065f46",
              fontWeight: 500,
            }}
          >
            💡 Tip: Most providers offer free tiers to get you started!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
