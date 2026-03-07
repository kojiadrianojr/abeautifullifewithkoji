"use client";

import { VStack, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionVStack = motion.create(VStack);
const MotionHeading = motion.create(Heading);
const MotionText = motion.create(Text);

interface HeroContentProps {
	tagline: string;
	coupleNames: string;
	weddingDate: string;
	weddingTime: string;
	venueName: string;
	mounted: boolean;
}

export function HeroContent({
	tagline,
	coupleNames,
	weddingDate,
	weddingTime,
	venueName,
	mounted,
}: HeroContentProps) {
	return (
		<VStack spacing={6}>
			<MotionText
				fontSize={{ base: "lg", md: "xl" }}
				fontWeight={500}
				letterSpacing="wider"
				color="primary.600"
				textTransform="uppercase"
				initial={{ y: -20, opacity: 0 }}
				animate={mounted ? { y: 0, opacity: 1 } : {}}
				transition={{ duration: 2 }}
			>
				{tagline}
			</MotionText>

			<MotionHeading
				as="h1"
				fontSize={{ base: "5xl", sm: "6xl", md: "7xl", lg: "8xl" }}
				fontWeight="bold"
				letterSpacing="tight"
				color="gray.800"
				initial={{ scale: 0.8, opacity: 0 }}
				animate={mounted ? { scale: 1, opacity: 1 } : {}}
				transition={{ duration: 1.2 }}
			>
				{coupleNames}
			</MotionHeading>

			<MotionVStack
				spacing={2}
				initial={{ y: 20, opacity: 0 }}
				animate={mounted ? { y: 0, opacity: 1 } : {}}
				transition={{ duration: 1.5 }}
			>
				<Text
					fontSize={{ base: "lg", md: "xl" }}
					color="gray.700"
					fontWeight={500}
				>
					{weddingDate} • {weddingTime}
				</Text>
				<Text
					fontSize={{ base: "md", md: "lg" }}
					color="gray.600"
					fontWeight={400}
				>
					{venueName}
				</Text>
			</MotionVStack>
		</VStack>
	);
}
