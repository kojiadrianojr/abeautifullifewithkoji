"use client";

import { useState } from "react";
import { Box, Container, Divider, Grid } from "@chakra-ui/react";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";
import { StoryText } from "./StoryText";
import { PhotoAlbums } from "./PhotoAlbums";
import { DecorativeFlowers } from "./DecorativeFlowers";

interface StorySectionProps {
	throwbackPhotos: string[];
	prenupPhotos: string[];
}

export function StorySection({
	throwbackPhotos,
	prenupPhotos,
}: StorySectionProps) {
	const config = ConfigService.getConfig();
	const { story } = config.content;
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [currentAlbum, setCurrentAlbum] = useState<string[]>([]);

	const openLightbox = (index: number, album: string[]) => {
		setSelectedImageIndex(index);
		setCurrentAlbum(album);
		setLightboxOpen(true);
	};

	// Use props instead of config
	// const throwbackPhotos = story.throwbackPhotos || [];
	// const prenupPhotos = story.prenupPhotos || [];

	return (
		<Box
			id="story"
			as="section"
			py={{ base: 16, md: 24 }}
			bg="gray.50"
			position="relative"
			overflow="hidden"
		>
			{/* Decorative elements */}
			<DecorativeFlowers />

			<Container maxW="7xl">
				<SectionTitle
					bgGradient="linear(to-r, purple.500, orange.400)"
					bgClip="text"
					mb={2}
				>
					{story.title}
				</SectionTitle>

				<Divider
					w={100}
					h={1}
					mx="auto"
					mb={16}
					borderRadius="md"
					bgGradient="linear(to-r, pink.500, orange.400, pink.500)"
					border="none"
				/>

				{/* Two Column Layout */}
				<Grid
					templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
					gap={12}
					mb={20}
				>
					{/* Left Column - Story Text & Timeline */}
					<StoryText content={story.content} timeline={story.timeline} />

					{/* Right Column - Photo Albums */}
					<PhotoAlbums
						throwbackPhotos={throwbackPhotos}
						prenupPhotos={prenupPhotos}
						onOpenLightbox={openLightbox}
					/>
				</Grid>
			</Container>

			{/* Lightbox */}
			<GalleryLightbox
				images={currentAlbum}
				isOpen={lightboxOpen}
				onClose={() => setLightboxOpen(false)}
				initialIndex={selectedImageIndex}
			/>
		</Box>
	);
}
