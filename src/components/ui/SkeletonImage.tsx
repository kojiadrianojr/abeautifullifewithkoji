"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import Image, { ImageProps } from "next/image";

interface SkeletonImageProps extends Omit<ImageProps, "onLoad"> {
	/** Border radius forwarded to both the skeleton and the image wrapper */
	borderRadius?: string | number;
	/** Extra Chakra sx / style on the skeleton box */
	skeletonStyle?: React.CSSProperties;
}

/**
 * Drop-in replacement for next/image that shows a shimmer skeleton
 * while the image is loading and fades in the image on load.
 */
export function SkeletonImage({
	borderRadius,
	skeletonStyle,
	...imageProps
}: SkeletonImageProps) {
	const [loaded, setLoaded] = useState(false);

	return (
		<Box position="relative" w="full" h="full" borderRadius={borderRadius} overflow="hidden">
			{/* Shimmer overlay — hidden once image loads */}
			{!loaded && (
				<Box
					position="absolute"
					inset={0}
					borderRadius={borderRadius}
					overflow="hidden"
					zIndex={1}
					style={skeletonStyle}
					sx={{
						background: "linear-gradient(90deg, #ede9f0 25%, #f5f0f8 50%, #ede9f0 75%)",
						backgroundSize: "200% 100%",
						animation: "shimmer 1.6s infinite linear",
						"@keyframes shimmer": {
							"0%": { backgroundPosition: "200% 0" },
							"100%": { backgroundPosition: "-200% 0" },
						},
					}}
				/>
			)}

			{/* Actual image */}
			<Box
				position="absolute"
				inset={0}
				opacity={loaded ? 1 : 0}
				transition="opacity 0.4s ease"
			>
				{/* eslint-disable-next-line jsx-a11y/alt-text -- alt is forwarded via imageProps spread */}
				<Image
					{...imageProps}
					onLoad={() => setLoaded(true)}
					style={{ objectFit: "cover", ...(imageProps.style ?? {}) }}
				/>
			</Box>
		</Box>
	);
}
