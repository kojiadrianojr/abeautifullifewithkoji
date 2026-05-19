"use client";

import { useState } from "react";
import { Box, Button, Container } from "@chakra-ui/react";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PinterestMasonryGrid } from "./PinterestMasonryGrid";
import { GalleryAllPhotosModal } from "./GalleryAllPhotosModal";

interface GallerySectionProps {
	images: string[];
}

export function GallerySection({ images }: GallerySectionProps) {
	const config = ConfigService.getConfig();
	const { gallery } = config.content;
	const [modalOpen, setModalOpen] = useState(false);

	if (images.length === 0) return null;

	return (
		<Box id="gallery" as="section" py={{ base: 16, md: 24 }} bg="gray.100">
			<Container maxW="7xl">
				<SectionTitle color="primary.500" mb={10}>
					{gallery.title}
				</SectionTitle>

				{/* Auto-rotating Pinterest collage preview */}
				<PinterestMasonryGrid
					images={images}
					onImageClick={() => setModalOpen(true)}
				/>

				{/* See all CTA */}
				<Box mt={8} textAlign="center">
					<Button
						size="lg"
						variant="outline"
						colorScheme="primary"
						borderRadius="full"
						px={10}
						fontWeight="semibold"
						onClick={() => setModalOpen(true)}
						_hover={{ bg: "primary.50" }}
					>
						See All Photos ({images.length})
					</Button>
				</Box>
			</Container>

			<GalleryAllPhotosModal
				images={images}
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
			/>
		</Box>
	);
}



