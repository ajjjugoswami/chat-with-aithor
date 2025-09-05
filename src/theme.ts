import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#133487' : '#667eea',
    },
    secondary: {
      main: mode === 'light' ? '#115293' : '#764ba2',
    },
    background: {
      default: mode === 'light' ? '#ffffff' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1a1a1a',
    },
    text: {
      primary: mode === 'light' ? '#000000' : '#ffffff',
      secondary: mode === 'light' ? '#666666' : '#bbbbbb',
    },
  },
  typography: {
    fontFamily: `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`,
    // Mobile-specific typography
    h1: {
      fontSize: '1.75rem',
      '@media (max-width:640px)': {
        fontSize: '1.5rem',
      },
    },
    h2: {
      fontSize: '1.5rem',
      '@media (max-width:640px)': {
        fontSize: '1.25rem',
      },
    },
    h3: {
      fontSize: '1.25rem',
      '@media (max-width:640px)': {
        fontSize: '1.125rem',
      },
    },
    h4: {
      fontSize: '1.125rem',
      '@media (max-width:640px)': {
        fontSize: '1rem',
      },
    },
    h5: {
      fontSize: '1rem',
      '@media (max-width:640px)': {
        fontSize: '0.875rem',
      },
    },
    h6: {
      fontSize: '0.875rem',
      '@media (max-width:640px)': {
        fontSize: '0.75rem',
      },
    },
    body1: {
      fontSize: '1rem',
      '@media (max-width:640px)': {
        fontSize: '0.875rem',
      },
    },
    body2: {
      fontSize: '0.875rem',
      '@media (max-width:640px)': {
        fontSize: '0.75rem',
      },
    },
    subtitle1: {
      fontSize: '1rem',
      '@media (max-width:640px)': {
        fontSize: '0.875rem',
      },
    },
    subtitle2: {
      fontSize: '0.875rem',
      '@media (max-width:640px)': {
        fontSize: '0.75rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderColor: mode === 'light' ? '#133487' : '#667eea',
          color: mode === 'light' ? '#133487' : '#667eea',
          borderWidth: "2px",
          borderStyle: "solid",
          "&:hover": {
            borderColor: mode === 'light' ? '#115293' : '#764ba2',
            backgroundColor: mode === 'light' ? "rgba(25, 118, 210, 0.04)" : "rgba(102, 126, 234, 0.04)",
          },
          "&:active": {
            borderColor: mode === 'light' ? '#133487' : '#667eea',
            backgroundColor: mode === 'light' ? "rgba(25, 118, 210, 0.08)" : "rgba(102, 126, 234, 0.08)",
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
            borderColor: mode === 'light' ? '#3B87C8' : '#667eea',
            borderWidth: "2px",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: mode === 'light' ? '#3B87C8' : '#667eea',
            borderWidth: "2px",
          },
          "&.Mui-disabled": {
            backgroundColor: mode === 'light' ? '#f5f5f5' : '#2a2a2a',
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === 'light' ? '#e0e0e0' : '#404040',
            },
            "& .MuiSelect-select": {
              color: mode === 'light' ? '#666' : '#888',
            },
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            backgroundColor: mode === 'light' ? '#f5f5f5' : '#2a2a2a',
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === 'light' ? '#e0e0e0' : '#404040',
            },
            "& .MuiSelect-select": {
              color: mode === 'light' ? '#666' : '#888',
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
          backgroundColor: mode === 'light' ? '#fff' : '#2a2a2a',
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: mode === 'light' ? '#f1f1f1' : '#404040',
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: mode === 'light' ? '#888' : '#666',
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: mode === 'light' ? '#555' : '#888',
          },
          scrollbarWidth: "thin",
          scrollbarColor: mode === 'light' ? '#888 #f1f1f1' : '#666 #404040',
          fontSize: "10px",
          maxHeight: "200px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          color: mode === 'light' ? '#000' : '#fff',
          "&:hover": {
            backgroundColor: mode === 'light' ? '#f5f5f5' : '#333',
          },
        },
      },
    },
  },
});

// Default theme for backwards compatibility
const defaultTheme = getTheme('dark');
export default defaultTheme;
