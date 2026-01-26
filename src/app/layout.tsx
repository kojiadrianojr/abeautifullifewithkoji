import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { getCoupleNames, getWeddingConfig } from '@/lib/config';
import ThemeProvider from '@/components/ThemeProvider';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const config = getWeddingConfig();

export const metadata: Metadata = {
  title: `${getCoupleNames()} - Wedding`,
  description: `Join us for the wedding celebration of ${getCoupleNames()}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <ThemeProvider theme={config.theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
