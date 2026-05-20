"use client";

import { useState } from "react";
import { Box, Image } from "@chakra-ui/react";

interface GalleryImageProps {
	src: string;
	index: number;
	onClick: () => void;
}

export function GalleryImage({ src, index, onClick }: GalleryImageProps) {
	const [imgSrc, setImgSrc] = useState(src);
	const [errored, setErrored] = useState(false);

	const handleError = () => {
		if (!errored) {
			// Retry once with the thumbnail-size variant as fallback
			const fallback = src.includes("drive.google.com/thumbnail")
				? src.replace(/sz=w\d+/, "sz=w800")
				: src;
			setImgSrc(fallback);
			setErrored(true);
		}
	};

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
				src={imgSrc}
				alt={`Gallery image ${index + 1}`}
				w="full"
				h="full"
				objectFit="cover"
				loading="lazy"
				onError={handleError}
				fallback={
					<Box
						w="full"
						h="full"
						bg="gray.100"
						display="flex"
						alignItems="center"
						justifyContent="center"
						color="gray.400"
						fontSize="xs"
					>
						📷
					</Box>
				}
			/>
		</Box>
	);
}
