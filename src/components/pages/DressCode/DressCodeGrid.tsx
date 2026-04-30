"use client";

import { SimpleGrid } from "@chakra-ui/react";
import { DressCodeImage } from "./DressCodeImage";

interface DressCodeGridProps {
	images: string[];
	onImageClick: (index: number) => void;
}

export function DressCodeGrid({ images, onImageClick }: DressCodeGridProps) {
	return (
		<SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={5}>
			{images.map((image, index) => (
				<DressCodeImage
					key={index}
					src={image}
					index={index}
					onClick={() => onImageClick(index)}
				/>
			))}
		</SimpleGrid>
	);
}
