import type { Metadata } from "next";
import "./globals.css";
import { ConfigService } from "@/services";
import ThemeProvider from "@/components/ThemeProvider";
import MaintenanceGate from "@/components/MaintenanceGate";
import { buildGoogleFontsUrl } from "@/lib/fonts";

const config = ConfigService.getConfig();

export const metadata: Metadata = {
	title: `${ConfigService.getCoupleNames()} - Wedding`,
	description: `Join us for the wedding celebration of ${ConfigService.getCoupleNames()}`,
	icons: {
		icon: "/images/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { heading, body, display } = config.theme.fonts;
	const googleFontsUrl = buildGoogleFontsUrl(heading, body, display);

	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href={googleFontsUrl} rel="stylesheet" />
				<style>{`
					:root {
						--font-heading: '${heading}', cursive;
						--font-display: '${display ?? body}', Georgia, serif;
						--font-body: '${body}', sans-serif;
					}
				`}</style>
			</head>
			<body>
				<ThemeProvider theme={config.theme}>
					<MaintenanceGate>{children}</MaintenanceGate>
				</ThemeProvider>
			</body>
		</html>
	);
}
