"use client";

import { Box, useBreakpointValue } from "@chakra-ui/react";
import { SkeletonImage } from "@/components/ui/SkeletonImage";

export const HERO_BG_MOBILE = "/images/assets/hero-bg-mobile.webp";
export const HERO_BG_DESKTOP = "/images/assets/hero-bg-desktop.webp";

export function useHeroBgSrc() {
	return useBreakpointValue(
		{ base: HERO_BG_MOBILE, lg: HERO_BG_DESKTOP },
		{ fallback: "lg" },
	) ?? HERO_BG_DESKTOP;
}

export function HeroBackground() {
	const src = useHeroBgSrc();

	return (
		<>
			{/* Full-bleed hero background — mobile or desktop asset */}
			<Box
				position="absolute"
				inset={0}
				zIndex={0}
				overflow="hidden"
			>
				<SkeletonImage
					src={src}
					alt="Hero background"
					fill
					sizes="100vw"
					priority
					unoptimized
					style={{ objectFit: "cover", objectPosition: "center", filter: "blur(1px) brightness(0.75)" }}
				/>
			</Box>

			{/* Gradient overlay: stronger on left for text readability on desktop */}
			<Box
				position="absolute"
				inset={0}
				zIndex={1}
				bgGradient={{
					base: "linear(to-b, blackAlpha.500 0%, blackAlpha.400 50%, blackAlpha.600 100%)",
					lg: "linear(to-r, blackAlpha.700 0%, blackAlpha.500 45%, blackAlpha.300 100%)",
				}}
			/>
		</>
	);
}
