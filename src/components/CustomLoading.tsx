import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useTheme } from '../hooks/useTheme';
// import { getTheme } from '../theme';

interface CustomLoadingProps {
  size?: number;
  sx?: SxProps<Theme>;
  color?: string;
}

export default function CustomLoading({ size = 48, sx, color }: CustomLoadingProps) {
  const { mode } = useTheme();
//   const theme = getTheme(mode);

  const shadowColor = color || (mode === 'light' ? 'rgba(19, 52, 135, 0.3)' : 'rgba(59, 130, 246, 0.3)');
  const shadowColor50 = color || (mode === 'light' ? 'rgba(19, 52, 135, 0.6)' : 'rgba(59, 130, 246, 0.6)');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        borderRadius: '50%',
        // bgcolor: theme.palette.background.paper,
        animation: 'breathe 2s ease-in-out infinite',
        '@keyframes breathe': {
          '0%, 100%': { 
            transform: 'scale(1)', 
            boxShadow: `0 0 20px ${shadowColor}` 
          },
          '50%': { 
            transform: 'scale(1.1)', 
            boxShadow: `0 0 40px ${shadowColor50}` 
          },
        },
        ...sx,
      }}
    >
      <Box
        component="img"
        src="/favicon.png"
        alt="AIthor Logo"
        sx={{
          width: size,
          height: size,
          animation: 'rotate 2s linear infinite',
          '@keyframes rotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      />
    </Box>
  );
}