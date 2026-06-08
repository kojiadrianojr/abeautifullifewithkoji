"use client";

import { VStack, Box, Text } from "@chakra-ui/react";
import { FadeIn } from "@/components/ui/animations";

interface HeroDetailsProps {
	weddingDate: string;
	weddingTime: string;
	venueName: string;
	mounted: boolean;
}

export function HeroDetails({
	weddingDate,
	weddingTime,
	venueName,
	mounted,
}: HeroDetailsProps) {
	return (
		<FadeIn delay={0.2} duration={1.5} direction="up" mounted={mounted}>
			<VStack spacing={0} align="center">
				<Text
					fontFamily="display"
					fontSize={{ base: "md", md: "lg" }}
					color="whiteAlpha.900"
					fontWeight={500}
					letterSpacing="0.05em"
					textShadow="0 1px 6px rgba(0,0,0,0.5)"
				>
					{weddingDate}
				</Text>

				<Box w="32px" h="1px" bg="primary.400" my={2} opacity={0.8} />

				<Text
					fontFamily="display"
					fontSize={{ base: "sm", md: "md" }}
					color="whiteAlpha.800"
					fontWeight={400}
					letterSpacing="0.03em"
					textShadow="0 1px 4px rgba(0,0,0,0.4)"
					textAlign="center"
				>
					{weddingTime} &bull; {venueName}
				</Text>
			</VStack>
		</FadeIn>
	);
}
