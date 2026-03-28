"use client";

import { Box, Image } from "@chakra-ui/react";

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
		>
			<Image
				src={src}
				alt={`Gallery image ${index + 1}`}
				w="full"
				h="full"
				objectFit="cover"
				loading="lazy"
			/>
		</Box>
	);
}
