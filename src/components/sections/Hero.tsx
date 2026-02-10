"use client";

import { Box, Container, Grid, VStack } from "@chakra-ui/react";
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

const MotionBox = motion(Box);

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

			<Container maxW="7xl" position="relative" zIndex={10} px={4} py={20}>
				<Grid
					templateColumns={{ base: "1fr", lg: hasImages ? "1fr 1fr" : "1fr" }}
					gap={{ base: 8, lg: 12 }}
					alignItems="center"
					justifyItems={!hasImages ? "center" : "initial"}
				>
					{/* Left Column - Content */}
					<MotionBox
						initial={{ opacity: 0, x: -30 }}
						animate={mounted ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 1 }}
						maxW={!hasImages ? "800px" : "initial"}
					>
						<VStack
							spacing={8}
							align={{
								base: "center",
								lg: hasImages ? "flex-start" : "center",
							}}
						>
							<Box
								textAlign={{
									base: "center",
									lg: hasImages ? "left" : "center",
								}}
							>
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

					{/* Right Column - Hero Image (only if images exist) */}
					{hasImages && <HeroImage images={heroImages} mounted={mounted} />}
				</Grid>
			</Container>

			<ScrollIndicator />
		</Box>
	);
}
