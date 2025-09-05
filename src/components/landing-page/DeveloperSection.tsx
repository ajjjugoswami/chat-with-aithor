import { Box, Container, Typography, Card, CardContent, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Psychology as Brain,
  People as Users,
  Code,
  GitHub,
  Twitter,
  LinkedIn,
  Mail,
  FlashOn as Zap,
  Security as Shield,
  ChatBubbleOutline as MessageSquare,
} from "@mui/icons-material";

const DeveloperCard = styled(Card)(() => ({
  overflow: "hidden",
  height: "100%",
  border: "1px solid #e5e7eb",
}));

const DeveloperHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(8),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(10),
  },
}));

const DeveloperAvatar = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    width: 96,
    height: 96,
  },
  [theme.breakpoints.up("lg")]: {
    width: 112,
    height: 112,
  },
}));

const developers = [
  {
    name: "Deepak Gupta",
    role: "Backend Developer",
    avatar: <Brain sx={{ fontSize: { xs: 32, sm: 40, lg: 48 }, color: "white" }} />,
    bgColor: "#059669",
    headerBg: "#ecfdf5",
    description: "AI researcher with 7+ years experience in machine learning. Specialized in LLM integration and conversational AI systems. Led the core architecture of Aithor's multi-model platform.",
    skills: [
      { icon: <Code />, text: "7+ years in AI & ML" },
      { icon: <Brain />, text: "LLM Integration Expert" },
      { icon: <Zap />, text: "System Architecture" },
    ],
    connectText: "Connect with Deepak",
  },
  {
    name: "Ajay Goswami",
    role: "Frontend Developer",
    avatar: <Users sx={{ fontSize: { xs: 32, sm: 40, lg: 48 }, color: "white" }} />,
    bgColor: "#1f2937",
    headerBg: "#f3f4f6",
    description: "Frontend specialist focused on creating intuitive AI interfaces. 5+ years in React and modern web technologies. Designed Aithor's seamless user experience and responsive design.",
    skills: [
      { icon: <MessageSquare />, text: "5+ years Frontend Dev" },
      { icon: <Users />, text: "UX/UI Design Expert" },
      { icon: <Shield />, text: "React & TypeScript" },
    ],
    connectText: "Connect with Ajay",
  },
];

export default function DeveloperSection() {
  return (
    <Box
      id="developer"
      sx={{ py: { xs: 6, sm: 8, lg: 10 }, backgroundColor: "#f9fafb" }}
    >
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
            Meet the Developers
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
            Built with passion by dedicated AI enthusiasts
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(2, 1fr)",
            },
            gap: { xs: 3, lg: 4 },
            maxWidth: "6xl",
            mx: "auto",
          }}
        >
          {developers.map((developer, index) => (
            <DeveloperCard key={index}>
              <DeveloperHeader sx={{ backgroundColor: developer.headerBg }}>
                <Box sx={{ textAlign: "center" }}>
                  <DeveloperAvatar sx={{ backgroundColor: developer.bgColor }}>
                    {developer.avatar}
                  </DeveloperAvatar>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: "1.125rem", sm: "1.25rem", lg: "1.5rem" },
                      fontWeight: "bold",
                      color: "#111827",
                      mb: 1,
                    }}
                  >
                    {developer.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      color: "#6b7280",
                      mb: 1.5,
                    }}
                  >
                    {developer.role}
                  </Typography>
                </Box>
              </DeveloperHeader>
              <CardContent sx={{ p: { xs: 2, sm: 3, lg: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.125rem", lg: "1.25rem" },
                    fontWeight: 600,
                    color: "#111827",
                    mb: 2,
                  }}
                >
                  About {developer.name.split(" ")[0]}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    color: "#6b7280",
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  {developer.description}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {developer.skills.map((skill, skillIdx) => (
                    <Box
                      key={skillIdx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      <Box sx={{ color: index === 0 ? "#059669" : "#2563eb", fontSize: 20 }}>
                        {skill.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.875rem",
                            lg: "1rem",
                          },
                          color: "#111827",
                        }}
                      >
                        {skill.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "#111827", mb: 1.5 }}
                  >
                    {developer.connectText}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {[GitHub, Twitter, LinkedIn, Mail].map((Icon, socialIdx) => (
                      <Button
                        key={socialIdx}
                        variant="outlined"
                        size="small"
                        startIcon={<Icon />}
                        sx={{
                          borderColor: "#d1d5db",
                          color: "#374151",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          "&:hover": { backgroundColor: "#f9fafb" },
                        }}
                      >
                        {["GitHub", "Twitter", "LinkedIn", "Email"][socialIdx]}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </DeveloperCard>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
