"use client";

import { Box, Text, HStack, Icon } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { motion, useReducedMotion } from "framer-motion";
import { RefObject } from "react";

const MotionBox = motion.create(Box);

export interface RSVPScrollHintProps {
	targetRef: RefObject<HTMLElement | null>;
	show: boolean;
}

export function RSVPScrollHint({ targetRef, show }: RSVPScrollHintProps) {
	const prefersReducedMotion = useReducedMotion();

	const scrollToResults = () => {
		targetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	if (!show) return null;

	return (
		<MotionBox
			position="fixed"
			bottom={{ base: 5, md: 8 }}
			left="50%"
			zIndex={1400}
			initial={{ opacity: 0, y: 16, x: "-50%" }}
			animate={{ opacity: 1, y: 0, x: "-50%" }}
			exit={{ opacity: 0, y: 16, x: "-50%" }}
			transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: "easeOut" }}
		>
			<Box
				as="button"
				type="button"
				onClick={scrollToResults}
				bg="rgba(255, 255, 255, 0.92)"
				backdropFilter="blur(12px)"
				border="1.5px solid"
				borderColor="purple.100"
				borderRadius="full"
				px={{ base: 5, md: 6 }}
				py={{ base: 2.5, md: 3 }}
				boxShadow="0 8px 32px rgba(195,177,225,0.35), 0 2px 8px rgba(0,0,0,0.08)"
				cursor="pointer"
				_hover={{
					bg: "white",
					boxShadow:
						"0 10px 36px rgba(195,177,225,0.45), 0 2px 10px rgba(0,0,0,0.1)",
					transform: "translateY(-2px)",
				}}
				_active={{ transform: "translateY(0)" }}
				transition="all 0.2s ease"
				aria-label="Scroll down to see your results"
			>
				<HStack spacing={2}>
					<Text
						fontFamily="body"
						fontSize={{ base: "sm", md: "md" }}
						fontWeight="semibold"
						color="secondary.600"
					>
						Scroll down to see your results
					</Text>
					<Icon
						as={ChevronDownIcon}
						boxSize={5}
						color="secondary.500"
						sx={
							prefersReducedMotion
								? undefined
								: {
										"@keyframes rsvpScrollBounce": {
											"0%, 100%": { transform: "translateY(0)" },
											"50%": { transform: "translateY(4px)" },
										},
										animation: "rsvpScrollBounce 1.6s ease-in-out infinite",
									}
						}
					/>
				</HStack>
			</Box>
		</MotionBox>
	);
}
