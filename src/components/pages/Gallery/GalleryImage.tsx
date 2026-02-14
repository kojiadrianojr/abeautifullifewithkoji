"use client";

import { Box } from "@chakra-ui/react";

interface GalleryImageProps {
	index: number;
	onClick: () => void;
}

export function GalleryImage({ index, onClick }: GalleryImageProps) {
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
			<Box
				w="full"
				h="full"
				bg="gray.300"
				display="flex"
				alignItems="center"
				justifyContent="center"
				color="gray.600"
				fontSize="lg"
			>
				Photo {index + 1}
			</Box>
		</Box>
	);
}
