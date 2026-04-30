"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import {
	HeroSection,
	MilestonesSection,
	GallerySection,
	ScheduleSection,
	DetailsSection,
	DressCodeSection,
	RSVPSection,
	FAQSection,
} from "@/components/pages";
import Footer from "@/components/sections/Footer";
import Navigation from "@/components/Navigation";
import SplashScreen from "@/components/SplashScreen";
import { ConfigService } from "@/services";

import type { ImageMetadata } from "@/types/imageProvider";

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
					{content.faq.enabled && <FAQSection />}
					{content.rsvp.enabled && <RSVPSection />}
					<Footer />
				</Box>
			)}
		</Box>
	);
}
