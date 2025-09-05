import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChatGptIcon, GeminiAi, ClaudeIcon, DeepseekIcon, PerplexicityIcon } from "../shared/Icons";

const ModelCard = styled(Card)(() => ({
  textAlign: "center",
  border: "1px solid #e5e7eb",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  borderRadius: "8px 32px 8px 32px",
}));

const ModelIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    width: 64,
    height: 64,
  },
}));

const models = [
  {
    name: "ChatGPT",
    description: "OpenAI's flagship conversational AI",
    icon: <ChatGptIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
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
    <Box id="models" sx={{ py: { xs: 6, sm: 8, lg: 10 } }}>
      <Container maxWidth="lg">
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
            Supported AI Models
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1.125rem", sm: "1.25rem" },
              color: "#6b7280",
              maxWidth: "2xl",
              mx: "auto",
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
            gap: { xs: 2, sm: 3, lg: 4 },
            maxWidth: "6xl",
            mx: "auto",
          }}
        >
          {models.map((model, index) => (
            <ModelCard key={index}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <ModelIcon>
                  {model.icon}
                </ModelIcon>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1.125rem", sm: "1.25rem" },
                    fontWeight: 600,
                    color: "#111827",
                    mb: 1,
                  }}
                >
                  {model.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    color: "#6b7280",
                  }}
                >
                  {model.description}
                </Typography>
              </CardContent>
            </ModelCard>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
