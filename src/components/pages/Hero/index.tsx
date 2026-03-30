"use client";

import { Box, Container, VStack } from "@chakra-ui/react";
import { useMounted } from "@/hooks/useMounted";
import { ConfigService } from "@/services";
import { FadeIn } from "@/components/ui/animations";
import { HeroContent } from "./HeroContent";
import { CountdownBox } from "./CountdownBox";
import { HeroBackground } from "./HeroBackground";
import { StackedImageGallery } from "./StackedImageGallery";
import { ScrollIndicator } from "@/components/sections/Hero/ScrollIndicator";

interface HeroSectionProps {
	heroImages: string[];
}

export function HeroSection({ heroImages }: HeroSectionProps) {
	const mounted = useMounted();
	const config = ConfigService.getConfig();
	const { hero } = config.content;
	const { time, venue } = config.wedding;

	const hasImages = heroImages.length > 0;

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
			<Container maxW="7xl" position="relative" zIndex={10} px={4} py={20}>
				<Box
					display="flex"
					flexDirection={{ base: "column", lg: "row" }}
					gap={{ base: 12, lg: 16 }}
					alignItems="center"
					justifyContent="center"
				>
					{/* Text Content */}
					<FadeIn delay={0} duration={1} direction="left" mounted={mounted}>
						<Box
							flex={{ base: "0 0 auto", lg: "1" }}
							maxW={{ base: "100%", lg: "none" }}
							position="relative"
							zIndex={2}
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
					</FadeIn>

					{/* Hero Image - Stacked Cards */}
					{hasImages && (
						<FadeIn delay={0.2} duration={1} direction="right" mounted={mounted}>
							<Box
								flex={{ base: "0 0 auto", lg: "0 0 45%" }}
								maxW={{ base: "100%", md: "500px", lg: "none" }}
								w="100%"
								position="relative"
								zIndex={1}
							>
								<StackedImageGallery images={heroImages} mounted={mounted} />
							</Box>
						</FadeIn>
					)}
				</Box>
			</Container>

			<ScrollIndicator />
		</Box>
	);
}
