'use client';

import { useMemo } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

interface ThemeProviderProps {
  children: React.ReactNode;
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      gold?: string;
      background: string;
      foreground: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
}

export default function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const chakraTheme = useMemo(
    () =>
      extendTheme({
        colors: {
          primary: {
            50: adjustColor(theme.colors.primary, 95),
            100: adjustColor(theme.colors.primary, 85),
            200: adjustColor(theme.colors.primary, 70),
            300: adjustColor(theme.colors.primary, 55),
            400: adjustColor(theme.colors.primary, 40),
            500: theme.colors.primary,
            600: adjustColor(theme.colors.primary, -15),
            700: adjustColor(theme.colors.primary, -30),
            800: adjustColor(theme.colors.primary, -45),
            900: adjustColor(theme.colors.primary, -60),
          },
          secondary: {
            50: adjustColor(theme.colors.secondary, 95),
            100: adjustColor(theme.colors.secondary, 85),
            200: adjustColor(theme.colors.secondary, 70),
            300: adjustColor(theme.colors.secondary, 55),
            400: adjustColor(theme.colors.secondary, 40),
            500: theme.colors.secondary,
            600: adjustColor(theme.colors.secondary, -15),
            700: adjustColor(theme.colors.secondary, -30),
            800: adjustColor(theme.colors.secondary, -45),
            900: adjustColor(theme.colors.secondary, -60),
          },
          accent: {
            50: adjustColor(theme.colors.accent, 95),
            100: adjustColor(theme.colors.accent, 85),
            200: adjustColor(theme.colors.accent, 70),
            300: adjustColor(theme.colors.accent, 55),
            400: adjustColor(theme.colors.accent, 40),
            500: theme.colors.accent,
            600: adjustColor(theme.colors.accent, -15),
            700: adjustColor(theme.colors.accent, -30),
            800: adjustColor(theme.colors.accent, -45),
            900: adjustColor(theme.colors.accent, -60),
          },
        },
        fonts: {
          heading: `var(--font-heading), ${theme.fonts.heading}, Georgia, serif`,
          body: `var(--font-body), ${theme.fonts.body}, Arial, sans-serif`,
        },
        styles: {
          global: {
            body: {
              bg: theme.colors.background,
              color: theme.colors.foreground,
            },
          },
        },
        components: {
          Button: {
            baseStyle: {
              fontWeight: 600,
              borderRadius: 'xl',
            },
            sizes: {
              lg: {
                px: 8,
                py: 6,
                fontSize: 'lg',
              },
            },
          },
          Card: {
            baseStyle: {
              container: {
                borderRadius: '2xl',
              },
            },
          },
        },
      }),
    [theme]
  );

  return <ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>;
}

// Helper function to adjust color brightness
function adjustColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 0 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
