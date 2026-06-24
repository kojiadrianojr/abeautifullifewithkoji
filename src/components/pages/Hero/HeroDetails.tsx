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
					fontSize={{ base: "3xl", sm: "4xl" }}
					color="whiteAlpha.900"
					fontWeight="bold"
					letterSpacing="0.05em"
					lineHeight={1.1}
					textShadow="0 1px 6px rgba(0,0,0,0.5)"
					whiteSpace="nowrap"
				>
					{weddingDate}
				</Text>

				<Box w="32px" h="1px" bg="primary.400" my={2} opacity={0.8} />

				<Text
					fontFamily="display"
					fontSize={{ base: "1.375rem", md: "1.5rem" }}
					color="whiteAlpha.800"
					fontWeight={600}
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
