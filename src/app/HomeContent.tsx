"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/pages";
import Footer from "@/components/sections/Footer";
import Navigation from "@/components/Navigation";
import SplashScreen from "@/components/SplashScreen";
import { ConfigService } from "@/services";
import { MilestonesSkeleton } from "@/components/ui/skeletons/MilestonesSkeleton";
import { GallerySkeleton } from "@/components/ui/skeletons/GallerySkeleton";
import { ScheduleSkeleton } from "@/components/ui/skeletons/ScheduleSkeleton";
import { DetailsSkeleton } from "@/components/ui/skeletons/DetailsSkeleton";
import { DressCodeSkeleton } from "@/components/ui/skeletons/DressCodeSkeleton";
import { EntourageSkeleton } from "@/components/ui/skeletons/EntourageSkeleton";
import { FAQSkeleton } from "@/components/ui/skeletons/FAQSkeleton";
import { RSVPSkeleton } from "@/components/ui/skeletons/RSVPSkeleton";

import type { ImageMetadata } from "@/types/imageProvider";

const MilestonesSection = dynamic(
	() => import("@/components/pages/Milestones").then((m) => ({ default: m.MilestonesSection })),
	{ loading: () => <MilestonesSkeleton /> }
);
const GallerySection = dynamic(
	() => import("@/components/pages/Gallery").then((m) => ({ default: m.GallerySection })),
	{ loading: () => <GallerySkeleton /> }
);
const ScheduleSection = dynamic(
	() => import("@/components/pages/Schedule").then((m) => ({ default: m.ScheduleSection })),
	{ loading: () => <ScheduleSkeleton /> }
);
const DetailsSection = dynamic(
	() => import("@/components/pages/Details").then((m) => ({ default: m.DetailsSection })),
	{ loading: () => <DetailsSkeleton /> }
);
const DressCodeSection = dynamic(
	() => import("@/components/pages/DressCode").then((m) => ({ default: m.DressCodeSection })),
	{ loading: () => <DressCodeSkeleton /> }
);
const EntourageSection = dynamic(
	() => import("@/components/pages/Entourage").then((m) => ({ default: m.EntourageSection })),
	{ loading: () => <EntourageSkeleton /> }
);
const FAQSection = dynamic(
	() => import("@/components/pages/FAQ").then((m) => ({ default: m.FAQSection })),
	{ loading: () => <FAQSkeleton /> }
);
const RSVPSection = dynamic(
	() => import("@/components/pages/RSVP").then((m) => ({ default: m.RSVPSection })),
	{ loading: () => <RSVPSkeleton /> }
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
