"use client";

import { SimpleGrid } from "@chakra-ui/react";
import { GalleryImage } from "./GalleryImage";

interface GalleryGridProps {
	images: string[];
	onImageClick: (index: number) => void;
}

export function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
	return (
		<SimpleGrid columns={{ base: 2, md: 3 }} spacing={6}>
			{images.map((image, index) => (
				<GalleryImage
					key={index}
					src={image}
					index={index}
					onClick={() => onImageClick(index)}
				/>
			))}
		</SimpleGrid>
	);
}
