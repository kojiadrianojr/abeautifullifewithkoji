"use client";

import {
	Box,
	Container,
	VStack,
	IconButton,
	Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMounted } from "@/hooks/useMounted";
import { ConfigService } from "@/services";
import { FadeIn } from "@/components/ui/animations";
import { HeroContent } from "./HeroContent";
import { CountdownBox } from "./CountdownBox";
import { HeroBackground } from "./HeroBackground";
import { FeaturedPhotoGallery } from "./FeaturedPhotoGallery";
import { VideoComingSoon } from "./VideoComingSoon";
import { MediaToggle, type MediaMode } from "./MediaToggle";
import { ScrollIndicator } from "./ScrollIndicator";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface HeroSectionProps {
	heroImages: string[];
}

export function HeroSection({ heroImages }: HeroSectionProps) {
	const mounted = useMounted();
	const config = ConfigService.getConfig();
	const { hero } = config.content;
	const { time, venue } = config.wedding;

	const hasImages = heroImages.length > 0;
	const [mediaMode, setMediaMode] = useState<MediaMode>("gallery");
	const [contentHidden, setContentHidden] = useState(false);

	return (
		<Box
			id="hero"
			as="section"
			position="relative"
			minH="100vh"
			display="flex"
			alignItems="center"
			justifyContent="center"
			overflow="hidden"
		>
			<HeroBackground />

			{/* Content - Side by Side */}
			<Container
				maxW="7xl"
				position="relative"
				zIndex={10}
				px={4}
				py={20}
				opacity={contentHidden ? 0 : 1}
				pointerEvents={contentHidden ? "none" : "auto"}
				transition="opacity 0.5s ease"
				display="flex"
				flexDirection="column"
				alignItems={{ base: "center", lg: "stretch" }}
			>
				<Box
					display="flex"
					flexDirection={{ base: "column", lg: "row" }}
					gap={{ base: 10, lg: 16 }}
					alignItems="center"
					justifyContent="center"
				>
					{/* Text Content — frosted glass panel */}
					<FadeIn delay={0} duration={1} direction="left" mounted={mounted}>
						<Box
							flex={{ base: "0 0 auto", lg: "1" }}
							maxW={{ base: "100%", lg: "none" }}
							position="relative"
							zIndex={2}
						>
							<Box
							bg="rgba(255,255,255,0.07)"
							backdropFilter="blur(10px)"
							borderRadius="2xl"
							p={{ base: 6, md: 8 }}
							border="1px solid"
							borderColor="whiteAlpha.100"
							>
								<VStack spacing={8} align={{ base: "center", lg: "flex-start" }}>
									<Box textAlign={{ base: "center", lg: "left" }}>
										<HeroContent
											tagline={hero.tagline}
											coupleNames={ConfigService.getCoupleNames()}
											weddingDate={ConfigService.formatWeddingDate()}
											weddingTime={time}
											venueName={venue.ceremony.name}
											mounted={mounted}
										/>
									</Box>

									<CountdownBox mounted={mounted} />
								</VStack>
							</Box>
						</Box>
					</FadeIn>

					{/* Media Panel */}
					<FadeIn delay={0.2} duration={1} direction="right" mounted={mounted}>
						<Box
							flex={{ base: "0 0 auto", lg: "0 0 48%" }}
							maxW={{ base: "100%", md: "540px", lg: "none" }}
							w="100%"
							mx={{ base: "auto", lg: 0 }}
							alignSelf={{ base: "center", lg: "auto" }}
							position="relative"
							zIndex={1}
						>
							<VStack spacing={4} align="center" w="100%">
								{/* Media Toggle */}
								<MediaToggle mode={mediaMode} onSelect={setMediaMode} />

								{/* Media Widget */}
								<Box
									w="100%"
									minH={{ base: "400px", md: "480px", lg: "500px" }}
									display="flex"
									flexDirection="column"
									alignItems="center"
								>
									{mediaMode === "gallery" && hasImages ? (
										<Box w="100%" maxW="600px" mx="auto">
											<FeaturedPhotoGallery images={heroImages} />
										</Box>
									) : mediaMode === "video" ? (
										<Box
											w="100%"
											maxW="600px"
											mx="auto"
											h={{ base: "400px", md: "480px", lg: "500px" }}
										>
											<VideoComingSoon />
										</Box>
									) : null}
								</Box>
							</VStack>
						</Box>
					</FadeIn>
				</Box>
			</Container>

			{/* Toggle content visibility — bottom-right corner */}
			<Tooltip label={contentHidden ? "Show content" : "View background"} placement="left" hasArrow>
				<IconButton
					aria-label={contentHidden ? "Show content" : "View background photo"}
					icon={contentHidden ? <FiEyeOff /> : <FiEye />}
					position="absolute"
					bottom={{ base: 16, md: 8 }}
					right={4}
					zIndex={20}
					size="sm"
					variant="ghost"
					color="whiteAlpha.700"
					bg="whiteAlpha.100"
					backdropFilter="blur(8px)"
					border="1px solid"
					borderColor="whiteAlpha.200"
					borderRadius="full"
					_hover={{ color: "white", bg: "whiteAlpha.300", borderColor: "whiteAlpha.400" }}
					onClick={() => setContentHidden((v) => !v)}
				/>
			</Tooltip>

			<ScrollIndicator />
		</Box>
	);
}
