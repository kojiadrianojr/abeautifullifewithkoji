"use client";

import { Box, HStack } from "@chakra-ui/react";

interface ImageNavigatorProps {
	totalImages: number;
	currentIndex: number;
	onSelectImage: (index: number) => void;
}

export function ImageNavigator({
	totalImages,
	currentIndex,
	onSelectImage,
}: ImageNavigatorProps) {
	if (totalImages <= 1) return null;

	return (
		<HStack
			position="absolute"
			bottom={-16}
			left="50%"
			transform="translateX(-50%)"
			spacing={2}
			bg="white"
			px={4}
			py={2}
			borderRadius="full"
			boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
			border="2px solid"
			borderColor="primary.100"
		>
			{Array.from({ length: totalImages }).map((_, index) => (
				<Box
					key={index}
					as="button"
					w={currentIndex === index ? "32px" : "10px"}
					h="10px"
					borderRadius="full"
					bg={currentIndex === index ? "primary.500" : "gray.300"}
					transition="all 0.3s ease"
					onClick={() => onSelectImage(index)}
					aria-label={`Go to image ${index + 1}`}
					cursor="pointer"
					_hover={{
						bg: currentIndex === index ? "primary.600" : "gray.400",
						transform: "scale(1.2)",
					}}
				/>
			))}
		</HStack>
	);
}
