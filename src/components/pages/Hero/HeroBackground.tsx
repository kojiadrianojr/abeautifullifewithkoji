"use client";

import { Box } from "@chakra-ui/react";
import { DecorativeGradients } from "./DecorativeGradients";

interface HeroBackgroundProps {
	backgroundImage?: string;
}

export function HeroBackground({
	backgroundImage = "/images/hero-bg.jpg",
}: HeroBackgroundProps) {
	return (
		<>
			{/* Background image */}
			<Box
				position="absolute"
				inset={0}
				bgImage={`url(${backgroundImage})`}
				bgSize="cover"
				bgPosition="center"
				bgRepeat="no-repeat"
				zIndex={0}
			/>

			{/* Decorative gradients */}
			<DecorativeGradients />
		</>
	);
}
