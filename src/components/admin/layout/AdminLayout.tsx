import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  AppBar,
  useMediaQuery,
  useTheme,
  Avatar,
  Chip,
  Divider,
  Badge,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  VpnKey as VpnKeyIcon,
  AdminPanelSettings as AdminIcon,
  Feedback as FeedbackIcon,
  ArrowBack,
  LightMode,
  DarkMode,
  Menu as MenuIcon,
  Security,
  Shield,
} from "@mui/icons-material";
import { useTheme as useCustomTheme } from "../../../hooks/useTheme";
import React from "react";

const drawerWidth = 320;

interface NavigationItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  category?: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  {
    icon: DashboardIcon,
    label: "Dashboard",
    path: "/admin",
    category: "overview",
  },
  {
    icon: PeopleIcon,
    label: "Users",
    path: "/admin/users",
    category: "management",
    badge: 12,
  },
  {
    icon: VpnKeyIcon,
    label: "User Keys",
    path: "/admin/user-keys",
    category: "management",
  },
  {
    icon: Security,
    label: "Admin Access",
    path: "/admin/admin-access",
    category: "security",
  },
  {
    icon: Shield,
    label: "App Management",
    path: "/admin/app-management",
    category: "security",
  },
  {
    icon: FeedbackIcon,
    label: "User Feedback",
    path: "/admin/feedback",
    category: "support",
    badge: 5,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useCustomTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleItemClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleBackToApp = () => navigate("/chat");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "overview":
        return mode === "light" ? "#1976d2" : "#90caf9";
      case "management":
        return mode === "light" ? "#2e7d32" : "#81c784";
      case "security":
        return mode === "light" ? "#ed6c02" : "#ff9800";
      case "support":
        return mode === "light" ? "#9c27b0" : "#ba68c8";
      default:
        return mode === "light" ? "#666" : "#aaa";
    }
  };

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.category || "other"]) {
      acc[item.category || "other"] = [];
    }
    acc[item.category || "other"].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  const drawerContent = (
    <>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          background:
            mode === "light"
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
          color: "white",
          borderRadius: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              width: 48,
              height: 48,
              backdropFilter: "blur(10px)",
            }}
          >
            <AdminIcon sx={{ fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: "1.2rem" }}
            >
              Aithor Admin
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Management Panel
            </Typography>
          </Box>
        </Box>
        <Chip
          label="Online"
          size="small"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            fontWeight: 600,
            "& .MuiChip-label": { fontSize: "0.75rem" },
          }}
        />
      </Paper>

      {/* Navigation */}
      <Box sx={{ p: 2, flexGrow: 1 }}>
        {Object.entries(groupedItems).map(([category, items]) => (
          <Box key={category} sx={{ mb: 3 }}>
            <Typography
              variant="overline"
              sx={{
                px: 2,
                py: 1,
                display: "block",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                color: getCategoryColor(category),
                textTransform: "uppercase",
              }}
            >
              {category === "overview"
                ? "📊 Overview"
                : category === "management"
                ? "👥 Management"
                : category === "security"
                ? "🔒 Security"
                : category === "support"
                ? "💬 Support"
                : "Other"}
            </Typography>
            <List sx={{ py: 0 }}>
              {items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => handleItemClick(item.path)}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        px: 2,
                        mx: 1,
                        backgroundColor: isActive
                          ? mode === "light"
                            ? "rgba(25, 118, 210, 0.08)"
                            : "rgba(144, 202, 249, 0.08)"
                          : "transparent",
                        border: isActive
                          ? `1px solid ${
                              mode === "light"
                                ? "rgba(25, 118, 210, 0.2)"
                                : "rgba(144, 202, 249, 0.2)"
                            }`
                          : "1px solid transparent",
                        "&:hover": {
                          backgroundColor: isActive
                            ? mode === "light"
                              ? "rgba(25, 118, 210, 0.12)"
                              : "rgba(144, 202, 249, 0.12)"
                            : mode === "light"
                            ? "rgba(0, 0, 0, 0.04)"
                            : "rgba(255, 255, 255, 0.04)",
                          transform: "translateX(4px)",
                          transition: "all 0.2s ease-in-out",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 40,
                          color: isActive
                            ? getCategoryColor(item.category || "")
                            : mode === "light"
                            ? "#666"
                            : "#aaa",
                        }}
                      >
                        {item.badge ? (
                          <Badge
                            badgeContent={item.badge}
                            color="error"
                            sx={{ "& .MuiBadge-badge": { fontSize: "0.6rem" } }}
                          >
                            <Icon />
                          </Badge>
                        ) : (
                          <Icon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        sx={{
                          "& .MuiListItemText-primary": {
                            fontSize: "0.95rem",
                            fontWeight: isActive ? 600 : 500,
                            color: isActive
                              ? getCategoryColor(item.category || "")
                              : "text.primary",
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
            <Divider sx={{ mx: 2, my: 1, opacity: 0.3 }} />
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: mode === "light" ? "#f8f9fa" : "#1a1a1a",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            display: "block",
          }}
        >
          © 2024 Aithor Admin Panel
        </Typography>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        sx={{
          display: { xs: "block", md: "none" },
          bgcolor:
            mode === "light"
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
          color: "white",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: "white" }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}
          >
            <Avatar
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                width: 32,
                height: 32,
              }}
            >
              <AdminIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: "1.1rem" }}
            >
              Aithor Admin
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip
              title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            >
              <IconButton onClick={toggleTheme} sx={{ color: "white" }}>
                {mode === "light" ? <DarkMode /> : <LightMode />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Back to Chat">
              <IconButton onClick={handleBackToApp} sx={{ color: "white" }}>
                <ArrowBack />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: mode === "light" ? "#ffffff" : "#1e293b",
              borderRight: `1px solid ${
                mode === "light" ? "#e2e8f0" : "#334155"
              }`,
              boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: mode === "light" ? "#ffffff" : "#1e293b",
              borderRight: `1px solid ${
                mode === "light" ? "#e2e8f0" : "#334155"
              }`,
              boxShadow: "4px 0 20px rgba(0, 0, 0, 0.08)",
              backdropFilter: "blur(10px)",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor:
            mode === "light"
              ? "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
              : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          mt: { xs: "64px", md: 0 },
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              mode === "light"
                ? "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)"
                : "radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(30, 41, 59, 0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
        {/* Desktop Header */}
        <Paper
          elevation={2}
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderRadius: 0,
            background:
              mode === "light"
                ? "linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%)"
                : "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
            borderBottom: `1px solid ${
              mode === "light" ? "#e0e7ff" : "#4a5568"
            }`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: mode === "light" ? "#1a365d" : "#e2e8f0",
              }}
            >
              Welcome back, Admin
            </Typography>
            <Chip
              label="Live"
              size="small"
              sx={{
                bgcolor: mode === "light" ? "#10b981" : "#059669",
                color: "white",
                fontWeight: 600,
                "& .MuiChip-label": { fontSize: "0.75rem" },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip
              title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            >
              <IconButton
                onClick={toggleTheme}
                sx={{
                  color: mode === "light" ? "#4a5568" : "#a0aec0",
                  "&:hover": {
                    bgcolor: mode === "light" ? "#f7fafc" : "#2d3748",
                  },
                }}
              >
                {mode === "light" ? <DarkMode /> : <LightMode />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Back to Chat">
              <IconButton
                onClick={handleBackToApp}
                sx={{
                  color: mode === "light" ? "#4a5568" : "#a0aec0",
                  "&:hover": {
                    bgcolor: mode === "light" ? "#f7fafc" : "#2d3748",
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
        <Box sx={{ p: 3, maxWidth: "100%" }}>{children}</Box>
      </Box>
    </Box>
  );
}
