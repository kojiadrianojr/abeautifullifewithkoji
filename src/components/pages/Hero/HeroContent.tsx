"use client";

import { VStack } from "@chakra-ui/react";
import { HeroTitle } from "./HeroTitle";
import { HeroDetails } from "./HeroDetails";

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
			<HeroTitle
				tagline={tagline}
				coupleNames={coupleNames}
				mounted={mounted}
			/>
			<HeroDetails
				weddingDate={weddingDate}
				weddingTime={weddingTime}
				venueName={venueName}
				mounted={mounted}
			/>
		</VStack>
	);
}
