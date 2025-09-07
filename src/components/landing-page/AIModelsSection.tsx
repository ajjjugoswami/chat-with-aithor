import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ChatGptIcon,
  GeminiAi,
  ClaudeIcon,
  DeepseekIcon,
  PerplexicityIcon,
} from "../shared/Icons";

const ModelCard = styled(Card)(() => ({
  textAlign: "center",
  border: "none",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
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
      "linear-gradient(135deg, rgba(5, 150, 105, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)",
    opacity: 0,
    transition: "opacity 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-12px) scale(1.02)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    "&::before": {
      opacity: 1,
    },
  },
}));

const ModelIcon = styled(Box)(() => ({
  width: "80px",
  height: "80px",
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

const ModelName = styled(Typography)(() => ({
  fontWeight: 700,
  color: "#111827",
  marginBottom: "8px",
  fontSize: "1.375rem",
}));

const ModelDescription = styled(Typography)(() => ({
  color: "#6b7280",
  fontSize: "1rem",
  lineHeight: 1.6,
}));

const models = [
  {
    name: "ChatGPT",
    description: "OpenAI's flagship conversational AI",
    icon: (
      <ChatGptIcon
        style={{ color: "#333" }}
        sx={{ fontSize: { xs: 32, sm: 40 } }}
      />
    ),
  },
  {
    name: "Gemini",
    description: "Google's multimodal AI model",
    icon: <GeminiAi sx={{ fontSize: { xs: 32, sm: 40 } }} />,
  },
  {
    name: "Claude",
    description: "Anthropic's helpful AI assistant",
    icon: <ClaudeIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
  },
  {
    name: "DeepSeek",
    description: "Advanced reasoning and coding AI",
    icon: <DeepseekIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
  },
  {
    name: "Perplexity",
    description: "AI-powered search and research assistant",
    icon: <PerplexicityIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
  },
];

export default function AIModelsSection() {
  return (
    <Box
      id="models"
      sx={{
        py: { xs: 8, sm: 12, lg: 16 },
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        position: "relative",
        scrollMarginTop: "80px",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", mb: { xs: 8, lg: 12 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              fontWeight: "800",
              background: "linear-gradient(135deg, #111827 0%, #374151 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 3,
              letterSpacing: "-0.02em",
            }}
          >
            Supported AI Models
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.375rem" },
              color: "#6b7280",
              maxWidth: "2xl",
              mx: "auto",
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            Choose from the most advanced AI models available today
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(5, 1fr)",
            },
            gap: { xs: 4, sm: 5, lg: 6 },
            maxWidth: "6xl",
            mx: "auto",
          }}
        >
          {models.map((model, index) => (
            <ModelCard key={index}>
              <CardContent sx={{ p: 4 }}>
                <ModelIcon>{model.icon}</ModelIcon>
                <ModelName>{model.name}</ModelName>
                <ModelDescription>{model.description}</ModelDescription>
              </CardContent>
            </ModelCard>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
