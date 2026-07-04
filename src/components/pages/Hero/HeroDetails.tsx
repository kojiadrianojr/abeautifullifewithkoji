"use client";

import { VStack, HStack, Box, Text } from "@chakra-ui/react";
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
			<VStack spacing={3} align="center">
				<Text
					fontFamily="display"
					fontSize={{ base: "2xl", sm: "3xl" }}
					color="whiteAlpha.900"
					fontWeight={500}
					letterSpacing="0.06em"
					lineHeight={1.1}
					textShadow="0 1px 6px rgba(0,0,0,0.5)"
					whiteSpace="nowrap"
				>
					{weddingDate}
				</Text>

				<HStack
					spacing={{ base: 2.5, md: 3 }}
					px={{ base: 4, md: 5 }}
					py={{ base: 2, md: 2.5 }}
					borderRadius="full"
					bg="blackAlpha.400"
					backdropFilter="blur(6px)"
					boxShadow="0 0 18px rgba(245,184,0,0.28)"
					whiteSpace="nowrap"
					maxW="100%"
				>
					<Text
						fontFamily="display"
						fontSize={{ base: "md", md: "lg" }}
						color="primary.300"
						fontWeight={700}
						letterSpacing="0.1em"
						textTransform="uppercase"
						textShadow="0 1px 6px rgba(0,0,0,0.6)"
						whiteSpace="nowrap"
					>
						{weddingTime}
					</Text>

					<Box w="1px" h={{ base: 4, md: 5 }} bg="whiteAlpha.400" />

					<Text
					fontFamily="display"
					fontSize={{ base: "sm", md: "md" }}
					color="whiteAlpha.900"
					fontWeight={600}
					letterSpacing="0.08em"
					textTransform="uppercase"
					textShadow="0 1px 4px rgba(0,0,0,0.5)"
					textAlign="center"
					whiteSpace="nowrap"
				>
					{venueName}
				</Text>
				</HStack>
			</VStack>
		</FadeIn>
	);
}
