import type { Metadata } from "next";
import "./globals.css";
import { ConfigService } from "@/services";
import ThemeProvider from "@/components/ThemeProvider";

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
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link
					href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body>
				<ThemeProvider theme={config.theme}>{children}</ThemeProvider>
			</body>
		</html>
	);
}
