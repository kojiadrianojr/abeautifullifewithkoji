"use client";

import { Box } from "@chakra-ui/react";
import { getAssetPath } from "@/lib/asset-path";

// Bump HERO_BG_VERSION whenever the wallpaper files are replaced so browsers
// re-fetch instead of serving a stale cached copy under the same filename.
const HERO_BG_VERSION = "2";
export const HERO_BG_MOBILE = `/images/assets/hero-bg-mobile-${HERO_BG_VERSION}.webp`;
export const HERO_BG_DESKTOP = `/images/assets/hero-bg-desktop-${HERO_BG_VERSION}.webp`;

export function HeroBackground() {
	return (
		<>
			{/* Full-bleed hero background — CSS media query picks mobile vs desktop
			    asset before any JS runs, eliminating the post-hydration image swap. */}
			<Box
				position="absolute"
				inset={0}
				zIndex={0}
				overflow="hidden"
			>
				<picture
					style={{
						position: "absolute",
						inset: 0,
						width: "100%",
						height: "100%",
						display: "block",
					}}
				>
					<source
						media="(min-width: 1024px)"
						srcSet={getAssetPath(HERO_BG_DESKTOP)}
						type="image/webp"
					/>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={getAssetPath(HERO_BG_MOBILE)}
						alt="Hero background"
						style={{
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
							objectPosition: "center",
							filter: "blur(1px) brightness(0.75)",
						}}
						fetchPriority="high"
					/>
				</picture>
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
