import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#133487" : "#667eea",
      },
      secondary: {
        main: mode === "light" ? "#115293" : "#764ba2",
      },
      background: {
        default: mode === "light" ? "#ffffff" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1a1a1a",
      },
      text: {
        primary: mode === "light" ? "#000000" : "#ffffff",
        secondary: mode === "light" ? "#666666" : "#bbbbbb",
      },
    },

    typography: {
      fontFamily: `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`,
      // Mobile-specific typography
      h1: {
        fontSize: "1.75rem",
        "@media (max-width:640px)": {
          fontSize: "1.5rem",
        },
      },
      h2: {
        fontSize: "1.5rem",
        "@media (max-width:640px)": {
          fontSize: "1.25rem",
        },
      },
      h3: {
        fontSize: "1.25rem",
        "@media (max-width:640px)": {
          fontSize: "1.125rem",
        },
      },
      h4: {
        fontSize: "1.125rem",
        "@media (max-width:640px)": {
          fontSize: "1rem",
        },
      },
      h5: {
        fontSize: "1rem",
        "@media (max-width:640px)": {
          fontSize: "0.875rem",
        },
      },
      h6: {
        fontSize: "0.875rem",
        "@media (max-width:640px)": {
          fontSize: "0.75rem",
        },
      },
      body1: {
        fontSize: "1rem",
        "@media (max-width:640px)": {
          fontSize: "0.875rem",
        },
      },
      body2: {
        fontSize: "0.875rem",
        "@media (max-width:640px)": {
          fontSize: "0.75rem",
        },
      },
      subtitle1: {
        fontSize: "1rem",
        "@media (max-width:640px)": {
          fontSize: "0.875rem",
        },
      },
      subtitle2: {
        fontSize: "0.875rem",
        "@media (max-width:640px)": {
          fontSize: "0.75rem",
        },
      },
    },
    components: {
      // Global scrollbar styling
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background:
                mode === "light"
                  ? "rgba(0, 0, 0, 0.05)"
                  : "rgba(255, 255, 255, 0.05)",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background:
                mode === "light"
                  ? "linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)"
                  : "linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)",
              borderRadius: "10px",
              border:
                mode === "light"
                  ? "1px solid rgba(255, 255, 255, 0.2)"
                  : "1px solid rgba(0, 0, 0, 0.2)",
              "&:hover": {
                background:
                  mode === "light"
                    ? "linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)"
                    : "linear-gradient(135deg, rgba(102, 126, 234, 1) 0%, rgba(118, 75, 162, 1) 100%)",
              },
            },
            "&::-webkit-scrollbar-corner": {
              background:
                mode === "light"
                  ? "rgba(0, 0, 0, 0.05)"
                  : "rgba(255, 255, 255, 0.05)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          outlined: {
            borderColor: mode === "light" ? "#133487" : "#667eea",
            color: mode === "light" ? "#133487" : "#667eea",
            borderWidth: "2px",
            borderStyle: "solid",
            "&:hover": {
              borderColor: mode === "light" ? "#115293" : "#764ba2",
              backgroundColor:
                mode === "light"
                  ? "rgba(25, 118, 210, 0.04)"
                  : "rgba(102, 126, 234, 0.04)",
            },
            "&:active": {
              borderColor: mode === "light" ? "#133487" : "#667eea",
              backgroundColor:
                mode === "light"
                  ? "rgba(25, 118, 210, 0.08)"
                  : "rgba(102, 126, 234, 0.08)",
            },
            "&.Mui-focusVisible": {
              borderColor: "transparent",
            },
          },
          contained: {
            color: "#fff",
            borderColor: "transparent",
            borderWidth: "2px",
            borderStyle: "solid",
            boxShadow: "none",
            outline: "none",
            "&:hover": {
              borderColor: "transparent",
            },
            "&:active": {
              borderColor: "transparent",
              outline: "none",
            },
            "&.Mui-focusVisible": {
              backgroundColor: "transparent",
              borderColor: "transparent",
              outline: "none",
            },
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === "light" ? "#3B87C8" : "#667eea",
              borderWidth: "2px",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === "light" ? "#3B87C8" : "#667eea",
              borderWidth: "2px",
            },
            "&.Mui-disabled": {
              backgroundColor: mode === "light" ? "#f5f5f5" : "#2a2a2a",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: mode === "light" ? "#e0e0e0" : "#404040",
              },
              "& .MuiSelect-select": {
                color: mode === "light" ? "#666" : "#888",
              },
            },
          },
        },
      },

      MuiSelect: {
        styleOverrides: {
          root: {
            "&.Mui-disabled": {
              backgroundColor: mode === "light" ? "#f5f5f5" : "#2a2a2a",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: mode === "light" ? "#e0e0e0" : "#404040",
              },
              "& .MuiSelect-select": {
                color: mode === "light" ? "#666" : "#888",
              },
            },
            "& .MuiOutlinedInput-input": {
              "& .MuiSelect-select": {
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
              },
            },
            "& .MuiFormHelperText-root": {
              marginLeft: "0px",
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "light" ? "#fff" : "#2a2a2a",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: mode === "light" ? "#f1f1f1" : "#404040",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: mode === "light" ? "#888" : "#666",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: mode === "light" ? "#555" : "#888",
            },
            scrollbarWidth: "thin",
            scrollbarColor: mode === "light" ? "#888 #f1f1f1" : "#666 #404040",
            fontSize: "10px",
            maxHeight: "200px",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: "14px",
            color: mode === "light" ? "#000" : "#fff",
            "&:hover": {
              backgroundColor: mode === "light" ? "#f5f5f5" : "#333",
            },
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 42,
            height: 24,
            padding: 0,
            "& .MuiSwitch-switchBase": {
              padding: 0,
              margin: "2px",
              transitionDuration: "300ms",
              "&.Mui-checked": {
                transform: "translateX(18px)",
                color: "#fff",
                "& + .MuiSwitch-track": {
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  opacity: 1,
                  border: 0,
                },
                "&.Mui-disabled + .MuiSwitch-track": {
                  opacity: 0.5,
                },
              },
              "&.Mui-focusVisible .MuiSwitch-thumb": {
                color: "#33cf4d",
                border: "6px solid #fff",
              },
              "&.Mui-disabled .MuiSwitch-thumb": {
                color: mode === "light" ? "#f3f4f6" : "#374151",
              },
              "&.Mui-disabled + .MuiSwitch-track": {
                opacity: mode === "light" ? 0.7 : 0.3,
              },
            },
            "& .MuiSwitch-thumb": {
              boxSizing: "border-box",
              width: 20,
              height: 20,
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px 0 rgba(0,35,11,0.2)",
            },
            "& .MuiSwitch-track": {
              borderRadius: 12,
              backgroundColor: mode === "light" ? "#e5e7eb" : "#4b5563",
              opacity: 1,
              transition:
                "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            },
          },
        },
      },
    },
  });

// Default theme for backwards compatibility
const defaultTheme = getTheme("dark");
export default defaultTheme;
