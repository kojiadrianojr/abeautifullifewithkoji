"use client";

import { Box } from "@chakra-ui/react";
import { DecorativeGradients } from "./DecorativeGradients";
import { getAssetPath } from "@/lib/asset-path";

interface HeroBackgroundProps {
	backgroundImage?: string;
}

export function HeroBackground({
	backgroundImage = "/images/hero-bg.jpg",
}: HeroBackgroundProps) {
	const bgImagePath = getAssetPath(backgroundImage);
	return (
		<>
			{/* Background image */}
			<Box
				position="absolute"
				inset={0}
				bgImage={`url(${bgImagePath})`}
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
