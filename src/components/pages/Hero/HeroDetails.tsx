"use client";

import { VStack, Text } from "@chakra-ui/react";
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
			<VStack spacing={2}>
				<Text
					fontSize={{ base: "lg", md: "xl" }}
					color="whiteAlpha.900"
					fontWeight={500}
					textShadow="0 1px 6px rgba(0,0,0,0.5)"
				>
					{weddingDate} • {weddingTime}
				</Text>
				<Text
					fontSize={{ base: "md", md: "lg" }}
					color="whiteAlpha.800"
					fontWeight={400}
					textShadow="0 1px 4px rgba(0,0,0,0.4)"
				>
					{venueName}
				</Text>
			</VStack>
		</FadeIn>
	);
}
