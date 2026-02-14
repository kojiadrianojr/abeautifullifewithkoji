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
			</VStack>
		</FadeIn>
	);
}
