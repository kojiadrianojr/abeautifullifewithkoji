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
	// After `optimize-images` runs, only the WebP exists (original is deleted).
	// Use WebP as the primary src; fall back to the original path via onError
	// for local dev where optimization hasn't been run yet.
	const webpPath = bgImagePath.replace(/\.(jpg|jpeg|png)$/i, ".webp");

	return (
		<>
			<Box position="absolute" inset={0} zIndex={0} overflow="hidden">
				{/* eslint-disable-next-line @next/next/no-img-element -- static export uses unoptimized images; WebP src with JPEG onError fallback for dev */}
				<img
					src={webpPath}
					alt=""
					fetchPriority="high"
					onError={(e) => {
						if (e.currentTarget.src !== bgImagePath) {
							e.currentTarget.src = bgImagePath;
						}
					}}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						objectPosition: "center",
					}}
				/>
			</Box>

			{/* Decorative gradients */}
			<DecorativeGradients />
		</>
	);
}
