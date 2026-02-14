"use client";

import { useState } from "react";
import { Box, Container } from "@chakra-ui/react";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";
import { GalleryGrid } from "./GalleryGrid";

export function GallerySection() {
	const config = ConfigService.getConfig();
	const { gallery } = config.content;
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const handleImageClick = (index: number) => {
		setSelectedImageIndex(index);
		setLightboxOpen(true);
	};

	return (
		<Box id="gallery" as="section" py={{ base: 16, md: 24 }} bg="gray.100">
			<Container maxW="7xl">
				<SectionTitle color="primary.500" mb={16}>
					{gallery.title}
				</SectionTitle>

				<GalleryGrid images={gallery.images} onImageClick={handleImageClick} />
			</Container>

			<GalleryLightbox
				images={gallery.images}
				isOpen={lightboxOpen}
				onClose={() => setLightboxOpen(false)}
				initialIndex={selectedImageIndex}
			/>
		</Box>
	);
}
