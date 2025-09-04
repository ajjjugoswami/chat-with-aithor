import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif`,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderColor: "#133487",
          color: "#133487",
          borderWidth: "2px",
          borderStyle: "solid",
          "&:hover": {
            borderColor: "#115293",
            backgroundColor: "rgba(25, 118, 210, 0.04)",
          },
          "&:active": {
            borderColor: "#133487",
            backgroundColor: "rgba(25, 118, 210, 0.08)",
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
            borderColor: "#3B87C8",
            borderWidth: "2px",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3B87C8",
            borderWidth: "2px",
          },
          "&.Mui-disabled": {
            backgroundColor: "#f5f5f5",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e0e0e0",
            },
            "& .MuiSelect-select": {
              color: "#666",
            },
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            backgroundColor: "#f5f5f5",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e0e0e0",
            },
            "& .MuiSelect-select": {
              color: "#666",
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
          backgroundColor: "#fff",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
          scrollbarWidth: "thin",
          scrollbarColor: "#888 #f1f1f1",
          fontSize: "10px",
          maxHeight: "200px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
  },
});

export default theme;
