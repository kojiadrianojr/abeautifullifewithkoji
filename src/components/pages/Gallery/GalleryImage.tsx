"use client";

import { Box } from "@chakra-ui/react";
import { SkeletonImage } from "@/components/ui/SkeletonImage";

interface GalleryImageProps {
	src: string;
	index: number;
	onClick: () => void;
}

export function GalleryImage({ src, index, onClick }: GalleryImageProps) {
	return (
		<Box
			aspectRatio={1}
			cursor="pointer"
			overflow="hidden"
			borderRadius="2xl"
			boxShadow="md"
			transition="all 0.3s ease"
			_hover={{
				boxShadow: "xl",
				transform: "scale(1.05)",
			}}
			onClick={onClick}
			position="relative"
		>
			<SkeletonImage
				src={src}
				alt={`Gallery image ${index + 1}`}
				fill
				sizes="(max-width: 640px) 50vw, 25vw"
				loading="lazy"
				unoptimized
				borderRadius="2xl"
			/>
		</Box>
	);
}
