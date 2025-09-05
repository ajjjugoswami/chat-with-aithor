import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext.tsx';
import ThemedApp from './components/ThemedApp.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomThemeProvider>
      <ThemedApp />
    </CustomThemeProvider>
  </StrictMode>,
)
