"use client";

import { Box } from "@chakra-ui/react";
import { PhotoAlbum } from "./PhotoAlbum";

interface PhotoAlbumsProps {
	throwbackPhotos: string[];
	prenupPhotos: string[];
	onOpenLightbox: (index: number, album: string[]) => void;
}

export function PhotoAlbums({
	throwbackPhotos,
	prenupPhotos,
	onOpenLightbox,
}: PhotoAlbumsProps) {
	return (
		<Box>
			{/* Throwback Photos */}
			<Box mb={12}>
				<PhotoAlbum
					title="Throwback Memories"
					photos={throwbackPhotos}
					gradientColors="linear(to-r, purple.500, orange.400)"
					onOpenLightbox={onOpenLightbox}
				/>
			</Box>

			{/* Prenup Photos */}
			<PhotoAlbum
				title="Prenup Photos"
				photos={prenupPhotos}
				gradientColors="linear(to-r, pink.500, orange.400)"
				onOpenLightbox={onOpenLightbox}
			/>
		</Box>
	);
}
