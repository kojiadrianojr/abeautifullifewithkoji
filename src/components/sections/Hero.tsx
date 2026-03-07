"use client";

import { Box, Container, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
	getCoupleNames,
	formatWeddingDate,
	getWeddingConfig,
} from "@/lib/config";
import { useMounted } from "@/hooks/useMounted";
import { HeroContent } from "./Hero/HeroContent";
import { ScrollIndicator } from "./Hero/ScrollIndicator";
import { HeroBackground } from "./Hero/HeroBackground";
import { HeroImage } from "./Hero/HeroImage";
import { CountdownSection } from "./Hero/CountdownSection";

const MotionBox = motion.create(Box);

interface HeroProps {
	heroImages: string[];
}

export default function Hero({ heroImages }: HeroProps) {
	const config = getWeddingConfig();
	const { hero } = config.content;
	const { time, venue } = config.wedding;
	const mounted = useMounted();

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
					{/* Hero Image - Stacked Cards */}
					{hasImages && (
						<MotionBox
							initial={{ opacity: 0, x: -30 }}
							animate={mounted ? { opacity: 1, x: 0 } : {}}
							transition={{ duration: 1 }}
							flex={{ base: "0 0 auto", lg: "0 0 45%" }}
							maxW={{ base: "100%", md: "500px", lg: "none" }}
							w="100%"
							position="relative"
						>
							<HeroImage images={heroImages} mounted={mounted} />
						</MotionBox>
					)}

					{/* Text Content */}
					<MotionBox
						initial={{ opacity: 0, x: 30 }}
						animate={mounted ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 1, delay: 0.2 }}
						flex={{ base: "0 0 auto", lg: "1" }}
						maxW={{ base: "100%", lg: "none" }}
					>
						<VStack spacing={8} align={{ base: "center", lg: "flex-start" }}>
							<Box textAlign={{ base: "center", lg: "left" }}>
								<HeroContent
									tagline={hero.tagline}
									coupleNames={getCoupleNames()}
									weddingDate={formatWeddingDate()}
									weddingTime={time}
									venueName={venue.ceremony.name}
									mounted={mounted}
								/>
							</Box>

							<CountdownSection mounted={mounted} />
						</VStack>
					</MotionBox>
				</Box>
			</Container>

			<ScrollIndicator />
		</Box>
	);
}
