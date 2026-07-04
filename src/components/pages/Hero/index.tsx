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
import { HeroVideo } from "./HeroVideo";
import { ScrollIndicator } from "./ScrollIndicator";
import { FiEye, FiEyeOff } from "react-icons/fi";

export function HeroSection() {
	const mounted = useMounted();
	const config = ConfigService.getConfig();
	const { hero } = config.content;
	const { time, venue } = config.wedding;

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

			{/* Content — centered single column */}
			<Container
				maxW="3xl"
				position="relative"
				zIndex={10}
				px={4}
				py={{ base: 20, md: 24 }}
				opacity={contentHidden ? 0 : 1}
				pointerEvents={contentHidden ? "none" : "auto"}
				transition="opacity 0.5s ease"
			>
				<VStack spacing={{ base: 10, md: 12 }} align="center" w="100%">
					<FadeIn delay={0} duration={1.2} direction="down" mounted={mounted}>
						<HeroContent
							tagline={hero.tagline}
							coupleNames={ConfigService.getCoupleNames()}
							weddingDate={ConfigService.formatWeddingDate()}
							weddingTime={time}
							venueName={venue.ceremony.name}
							mounted={mounted}
						/>
					</FadeIn>

					{/* Thin gold divider */}
					<FadeIn delay={0.3} duration={1} direction="none" mounted={mounted}>
						<Box
							mx="auto"
							w="72px"
							h="1px"
							bgGradient="linear(to-r, transparent, primary.400, transparent)"
							opacity={0.8}
						/>
					</FadeIn>

					{/* Video — framed feature */}
					<FadeIn delay={0.45} duration={1.1} direction="up" mounted={mounted}>
						<Box w="100%" maxW="680px" mx="auto">
							<HeroVideo />
						</Box>
					</FadeIn>

					{/* Countdown */}
					<FadeIn delay={0.6} duration={1} direction="up" mounted={mounted}>
						<Box w="100%">
							<CountdownBox mounted={mounted} />
						</Box>
					</FadeIn>
				</VStack>
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
