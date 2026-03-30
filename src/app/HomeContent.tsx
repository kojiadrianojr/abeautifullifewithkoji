"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import {
	HeroSection,
	MilestonesSection,
	GallerySection,
	ScheduleSection,
	RegistrySection,
	RSVPSection,
	FAQSection,
} from "@/components/pages";
import Footer from "@/components/sections/Footer";
import Navigation from "@/components/Navigation";
import SplashScreen from "@/components/SplashScreen";
import { ConfigService } from "@/services";

interface HomeContentProps {
	heroImages: string[];
	throwbackPhotos: string[];
	prenupPhotos: string[];
}

export default function HomeContent({
	heroImages,
	throwbackPhotos,
	prenupPhotos,
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
					<MilestonesSection
						throwbackPhotos={throwbackPhotos}
					/>
				)}
				{content.gallery.enabled && <GallerySection images={prenupPhotos} />}
					{content.schedule.enabled && <ScheduleSection />}
					{content.registry.enabled && <RegistrySection />}
					{content.rsvp.enabled && <RSVPSection />}
					{content.faq.enabled && <FAQSection />}
					<Footer />
				</Box>
			)}
		</Box>
	);
}
