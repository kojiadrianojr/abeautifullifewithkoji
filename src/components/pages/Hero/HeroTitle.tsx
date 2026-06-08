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
					fontFamily="display"
					fontStyle="italic"
					fontSize={{ base: "md", md: "lg" }}
					fontWeight={400}
					letterSpacing="0.08em"
					color="whiteAlpha.900"
					textShadow="0 1px 4px rgba(0,0,0,0.5)"
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
						color="white"
						lineHeight={1.1}
						textShadow="0 2px 12px rgba(0,0,0,0.55)"
					>
						{name1}
					</Heading>

					<Box
						fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
						fontFamily="heading"
						fontWeight="normal"
						color="primary.300"
						lineHeight={1}
						py={1}
						textShadow="0 2px 8px rgba(0,0,0,0.4)"
					>
						&amp;
					</Box>

					<Heading
						as="h1"
						fontSize={{ base: "5xl", sm: "6xl", md: "7xl", lg: "8xl" }}
						fontFamily="heading"
						fontWeight="normal"
						letterSpacing="wide"
						color="white"
						lineHeight={1.1}
						textShadow="0 2px 12px rgba(0,0,0,0.55)"
					>
						{name2}
					</Heading>
				</VStack>
			</ScaleIn>
		</VStack>
	);
}
