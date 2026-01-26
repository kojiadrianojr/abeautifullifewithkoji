'use client';

import { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeProviderProps {
  children: React.ReactNode;
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      foreground: string;
    };
    fonts: {
      serif: string;
      sans: string;
    };
  };
}

export default function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: theme.colors.primary,
          },
          secondary: {
            main: theme.colors.secondary,
          },
          background: {
            default: theme.colors.background,
            paper: '#ffffff',
          },
          text: {
            primary: theme.colors.foreground,
            secondary: theme.colors.secondary,
          },
        },
        typography: {
          fontFamily: `var(${theme.fonts.sans}), Arial, sans-serif`,
          h1: {
            fontFamily: `var(${theme.fonts.serif}), Georgia, serif`,
            fontWeight: 700,
          },
          h2: {
            fontFamily: `var(${theme.fonts.serif}), Georgia, serif`,
            fontWeight: 700,
          },
          h3: {
            fontFamily: `var(${theme.fonts.serif}), Georgia, serif`,
            fontWeight: 600,
          },
          h4: {
            fontFamily: `var(${theme.fonts.serif}), Georgia, serif`,
            fontWeight: 600,
          },
          h5: {
            fontFamily: `var(${theme.fonts.serif}), Georgia, serif`,
            fontWeight: 600,
          },
          h6: {
            fontFamily: `var(${theme.fonts.serif}), Georgia, serif`,
            fontWeight: 600,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                textTransform: 'none',
                fontWeight: 600,
                padding: '12px 32px',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [theme]
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
