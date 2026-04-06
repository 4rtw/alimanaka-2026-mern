'use client';

import { useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

export default function MUIThemeProvider({ children }) {
  const theme = useMemo(() => createTheme({
    palette: {
      primary: { main: '#e26f5a' },
      secondary: { main: '#ddcb6e' },
    },
    typography: {
      fontFamily: '"Lora", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  }), []);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
