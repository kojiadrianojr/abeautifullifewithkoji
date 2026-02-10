"use client";

import { useState } from "react";
import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { getWeddingConfig } from "@/lib/config";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";

export default function Gallery() {
	const config = getWeddingConfig();
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

				<SimpleGrid columns={{ base: 2, md: 3 }} spacing={6}>
					{gallery.images.map((image, index) => (
						<Box
							key={index}
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
							onClick={() => handleImageClick(index)}
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
					))}
				</SimpleGrid>
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
