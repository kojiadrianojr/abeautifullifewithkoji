"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/pages";
import Footer from "@/components/sections/Footer";
import Navigation from "@/components/Navigation";
import SplashScreen from "@/components/SplashScreen";
import { ConfigService } from "@/services";

import type { ImageMetadata } from "@/types/imageProvider";

const MilestonesSection = dynamic(() =>
	import("@/components/pages/Milestones").then((m) => ({ default: m.MilestonesSection }))
);
const GallerySection = dynamic(() =>
	import("@/components/pages/Gallery").then((m) => ({ default: m.GallerySection }))
);
const ScheduleSection = dynamic(() =>
	import("@/components/pages/Schedule").then((m) => ({ default: m.ScheduleSection }))
);
const DetailsSection = dynamic(() =>
	import("@/components/pages/Details").then((m) => ({ default: m.DetailsSection }))
);
const DressCodeSection = dynamic(() =>
	import("@/components/pages/DressCode").then((m) => ({ default: m.DressCodeSection }))
);
const EntourageSection = dynamic(() =>
	import("@/components/pages/Entourage").then((m) => ({ default: m.EntourageSection }))
);
const FAQSection = dynamic(() =>
	import("@/components/pages/FAQ").then((m) => ({ default: m.FAQSection }))
);
const RSVPSection = dynamic(() =>
	import("@/components/pages/RSVP").then((m) => ({ default: m.RSVPSection }))
);

interface HomeContentProps {
	heroImages: string[];
	throwbackPhotos: string[];
	prenupPhotos: string[];
	dressCodePhotos: ImageMetadata[];
}

export default function HomeContent({
	heroImages,
	throwbackPhotos,
	prenupPhotos,
	dressCodePhotos,
}: HomeContentProps) {
	const config = ConfigService.getConfig();
	const { content } = config;
	const [showSplash, setShowSplash] = useState(
		content.splashScreen?.enabled !== false,
	);

	const handleEnterSite = () => {
		setShowSplash(false);
	};

	return (
		<Box minH="100vh">
			{showSplash ? (
				<SplashScreen onEnter={handleEnterSite} />
			) : (
				<Box as="main" minH="100vh">
					<Navigation />
					{content.hero.enabled && <HeroSection heroImages={heroImages} />}
					{content.milestones.enabled && (
						<MilestonesSection throwbackPhotos={throwbackPhotos} />
					)}
					{content.gallery.enabled && <GallerySection images={prenupPhotos} />}
					{content.schedule.enabled && <ScheduleSection />}
					{content.details?.enabled && <DetailsSection />}
					{content.dressCode?.enabled && (
						<DressCodeSection images={dressCodePhotos} />
					)}
					{content.entourage?.enabled && <EntourageSection />}
					{content.faq.enabled && <FAQSection />}
					{content.rsvp.enabled && <RSVPSection />}
					<Footer />
				</Box>
			)}
		</Box>
	);
}
