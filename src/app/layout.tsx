import type { Metadata } from "next";
import "./globals.css";
import { ConfigService } from "@/services";
import ThemeProvider from "@/components/ThemeProvider";
import MaintenanceGate from "@/components/MaintenanceGate";
import { buildGoogleFontsUrl } from "@/lib/fonts";

const config = ConfigService.getConfig();
const coupleNames = ConfigService.getCoupleNames();
const weddingDate = ConfigService.formatWeddingDate();
const siteUrl =
	process.env.NEXT_PUBLIC_BASE_URL || "https://abeautifullifewithkoji.arkea.tech";
const description = `Join us for the wedding celebration of ${coupleNames} on ${weddingDate} at ${config.wedding.venue.ceremony.name}.`;

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "Event",
	name: `${coupleNames} Wedding Celebration`,
	startDate: `${config.wedding.datetime}+08:00`,
	eventStatus: "https://schema.org/EventScheduled",
	eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
	location: [
		{
			"@type": "Place",
			name: config.wedding.venue.ceremony.name,
			address: {
				"@type": "PostalAddress",
				streetAddress: config.wedding.venue.ceremony.address,
				addressCountry: "PH",
			},
		},
		{
			"@type": "Place",
			name: config.wedding.venue.reception.name,
			address: {
				"@type": "PostalAddress",
				streetAddress: config.wedding.venue.reception.address,
				addressCountry: "PH",
			},
		},
	],
	image: `${siteUrl}/images/hero-bg.jpg`,
	url: siteUrl,
	organizer: {
		"@type": "Person",
		name: coupleNames,
	},
};

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: `${coupleNames} - Wedding`,
	description,
	icons: {
		icon: "/images/favicon.ico",
	},
	openGraph: {
		type: "website",
		url: "/",
		title: `${coupleNames} - Wedding`,
		description,
		images: [
			{
				url: "/images/hero-bg.jpg",
				width: 1200,
				height: 630,
				alt: `${coupleNames} Wedding`,
			},
		],
		siteName: `${coupleNames} Wedding`,
	},
	twitter: {
		card: "summary_large_image",
		title: `${coupleNames} - Wedding`,
		description,
		images: ["/images/hero-bg.jpg"],
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
				<link rel="preload" href={googleFontsUrl} as="style" />
				<link href={googleFontsUrl} rel="stylesheet" />
				{/* Preload hero background as WebP for LCP (after optimize-images).
				    Browsers without WebP support ignore this and use the <picture> JPEG fallback. */}
				<link rel="preload" href="/images/hero-bg.webp" as="image" type="image/webp" />
				<style>{`
					:root {
						--font-heading: '${heading}', cursive;
						--font-display: '${display ?? body}', Georgia, serif;
						--font-body: '${body}', sans-serif;
					}
				`}</style>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			</head>
			<body>
				<ThemeProvider theme={config.theme}>
					<MaintenanceGate>{children}</MaintenanceGate>
				</ThemeProvider>
			</body>
		</html>
	);
}
