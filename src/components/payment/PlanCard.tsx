import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import type { Plan } from "./types";

interface PlanCardProps {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
  mode: "light" | "dark";
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  selected,
  onSelect,
  mode,
}) => {
  return (
    <Card
      onClick={onSelect}
      sx={{
        cursor: "pointer",
        border: selected ? "3px solid #667eea" : "2px solid #e0e0e0",
        background: selected
          ? mode === "light"
            ? "linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)"
            : "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
          : mode === "light"
          ? "#fff"
          : "#1e1e1e",
        transition: "all 0.3s ease",
        minHeight: "180px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          borderColor: "#667eea",
          boxShadow: "0 8px 25px rgba(102, 126, 234, 0.25)",
        },
        "&::before": selected
          ? {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            }
          : {},
      }}
    >
      <CardContent
        sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: mode === "light" ? "#333" : "#fff",
                mb: 0.5,
              }}
            >
              {plan.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: mode === "light" ? "#666" : "#ccc" }}
            >
              {plan.description}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: "#667eea", lineHeight: 1 }}
            >
              ₹{plan.price}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: "auto" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#10a37f",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: mode === "light" ? "#555" : "#ddd",
                  fontWeight: 500,
                }}
              >
                OpenAI: {plan.credits.openai} credit
                {plan.credits.openai !== 1 ? "s" : ""}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#4285f4",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: mode === "light" ? "#555" : "#ddd",
                  fontWeight: 500,
                }}
              >
                Gemini: {plan.credits.gemini} credit
                {plan.credits.gemini !== 1 ? "s" : ""}
              </Typography>
            </Box>
          </Box>
        </Box>

        {selected && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#667eea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "white", fontWeight: "bold", fontSize: "14px" }}
            >
              ✓
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanCard;
