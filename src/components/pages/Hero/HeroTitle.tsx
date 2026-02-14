"use client";

import { VStack, Heading, Text } from "@chakra-ui/react";
import { FadeIn, ScaleIn } from "@/components/ui/animations";

interface HeroTitleProps {
	tagline: string;
	coupleNames: string;
	mounted: boolean;
}

export function HeroTitle({ tagline, coupleNames, mounted }: HeroTitleProps) {
	return (
		<VStack spacing={6}>
			<FadeIn delay={0} duration={2} direction="down" mounted={mounted}>
				<Text
					fontSize={{ base: "lg", md: "xl" }}
					fontWeight={500}
					letterSpacing="wider"
					color="primary.600"
					textTransform="uppercase"
				>
					{tagline}
				</Text>
			</FadeIn>

			<ScaleIn delay={0} duration={1.2} mounted={mounted}>
				<Heading
					as="h1"
					fontSize={{ base: "5xl", sm: "6xl", md: "7xl", lg: "8xl" }}
					fontWeight="bold"
					letterSpacing="tight"
					color="gray.800"
				>
					{coupleNames}
				</Heading>
			</ScaleIn>
		</VStack>
	);
}
