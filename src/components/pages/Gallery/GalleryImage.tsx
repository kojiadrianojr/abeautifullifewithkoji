"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { SkeletonImage } from "@/components/ui/SkeletonImage";

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
			position="relative"
		>
			<SkeletonImage
				src={imgSrc}
				alt={`Gallery image ${index + 1}`}
				fill
				sizes="(max-width: 640px) 50vw, 25vw"
				loading="lazy"
				unoptimized
				onError={handleError}
				borderRadius="2xl"
			/>
		</Box>
	);
}
