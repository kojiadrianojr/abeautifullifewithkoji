"use client";

import { VStack, Heading, Text, Box } from "@chakra-ui/react";
import { FadeIn, ScaleIn } from "@/components/ui/animations";

interface HeroTitleProps {
	tagline: string;
	coupleNames: string;
	mounted: boolean;
}

export function HeroTitle({ tagline, coupleNames, mounted }: HeroTitleProps) {
	const [name1, name2] = coupleNames.split(" & ");

	return (
		<VStack spacing={6}>
			<FadeIn delay={0} duration={2} direction="down" mounted={mounted}>
				<Text
					fontSize={{ base: "lg", md: "xl" }}
					fontWeight={500}
					letterSpacing="wider"
				color="secondary.600"
					textTransform="uppercase"
				>
					{tagline}
				</Text>
			</FadeIn>

			<ScaleIn delay={0} duration={1.2} mounted={mounted}>
				<VStack spacing={0} textAlign="center">
					<Heading
						as="h1"
						fontSize={{ base: "5xl", sm: "6xl", md: "7xl", lg: "8xl" }}
						fontFamily="heading"
						fontWeight="normal"
						letterSpacing="wide"
						color="gray.800"
						lineHeight={1.1}
					>
						{name1}
					</Heading>

					<Box
						fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
						fontFamily="heading"
						fontWeight="normal"
						color="primary.500"
						lineHeight={1}
						py={1}
					>
						&amp;
					</Box>

					<Heading
						as="h1"
						fontSize={{ base: "5xl", sm: "6xl", md: "7xl", lg: "8xl" }}
						fontFamily="heading"
						fontWeight="normal"
						letterSpacing="wide"
						color="gray.800"
						lineHeight={1.1}
					>
						{name2}
					</Heading>
				</VStack>
			</ScaleIn>
		</VStack>
	);
}
