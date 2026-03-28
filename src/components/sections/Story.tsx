"use client";

import {
	Box,
	Container,
	Text,
	Divider,
	Grid,
	Image,
	SimpleGrid,
	Heading,
	Button,
} from "@chakra-ui/react";
import { getWeddingConfig } from "@/lib/config";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TimelineCard } from "@/components/ui/TimelineCard";
import { useState } from "react";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";

interface PhotoAlbumProps {
	title: string;
	photos: string[];
	gradientColors: string;
	onOpenLightbox: (index: number, album: string[]) => void;
}

function PhotoAlbum({
	title,
	photos,
	gradientColors,
	onOpenLightbox,
}: PhotoAlbumProps) {
	const MIN_PHOTOS = 4;
	const displayPhotos = photos.slice(0, MIN_PHOTOS);
	const hasMore = photos.length > MIN_PHOTOS;

	const openAllPhotos = () => {
		onOpenLightbox(0, photos);
	};

	if (photos.length === 0) return null;

	return (
		<Box>
			<Heading
				as="h3"
				size="lg"
				mb={6}
				textAlign="center"
				bgGradient={gradientColors}
				bgClip="text"
				fontWeight="bold"
			>
				{title}
			</Heading>
			<SimpleGrid columns={{ base: 2, md: 2 }} gap={4} mb={hasMore ? 4 : 0}>
				{displayPhotos.map((photo, index) => (
					<Box
						key={index}
						position="relative"
						overflow="hidden"
						borderRadius="xl"
						cursor="pointer"
						transition="all 0.3s"
						_hover={{
							transform: "scale(1.05)",
							boxShadow: "xl",
						}}
						onClick={() => onOpenLightbox(index, photos)}
						aspectRatio={1}
					>
						<Image
							src={photo}
							alt={`${title} ${index + 1}`}
							objectFit="cover"
							w="100%"
							h="100%"
							loading="lazy"
						/>
						{/* Overlay for last photo if there are more */}
						{hasMore && index === MIN_PHOTOS - 1 && (
							<Box
								position="absolute"
								top={0}
								left={0}
								right={0}
								bottom={0}
								bg="blackAlpha.600"
								display="flex"
								alignItems="center"
								justifyContent="center"
								onClick={(e) => {
									e.stopPropagation();
									openAllPhotos();
								}}
							>
								<Text
									color="white"
									fontSize="2xl"
									fontWeight="bold"
									textAlign="center"
								>
									+{photos.length - MIN_PHOTOS} more
								</Text>
							</Box>
						)}
					</Box>
				))}
			</SimpleGrid>
			{hasMore && (
				<Button
					onClick={openAllPhotos}
					w="full"
					bgGradient={gradientColors}
					color="white"
					_hover={{
						transform: "translateY(-2px)",
						boxShadow: "lg",
					}}
					transition="all 0.3s"
					size="lg"
				>
					View All {photos.length} Photos
				</Button>
			)}
		</Box>
	);
}

export default function Story() {
	const config = getWeddingConfig();
	const { story } = config.content;
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [currentAlbum, setCurrentAlbum] = useState<string[]>([]);

	const openLightbox = (index: number, album: string[]) => {
		setSelectedImageIndex(index);
		setCurrentAlbum(album);
		setLightboxOpen(true);
	};

	type StoryWithPhotos = typeof story & { throwbackPhotos?: string[] };
	const throwbackPhotos = (story as StoryWithPhotos).throwbackPhotos || [];

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
			<Box position="absolute" top={10} right={10} fontSize="6xl" opacity={0.1}>
				🌸
			</Box>
			<Box
				position="absolute"
				bottom={10}
				left={10}
				fontSize="6xl"
				opacity={0.1}
			>
				🌺
			</Box>

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
					<Box>
						<Text
							fontSize={{ base: "lg", md: "xl" }}
							textAlign={{ base: "center", lg: "left" }}
							mb={12}
							lineHeight={1.8}
							color="gray.600"
						>
							{story.content}
						</Text>

						{/* Timeline */}
						<Box>
							{story.timeline.map((item, index) => (
								<Box key={index} mb={8}>
									<TimelineCard
										year={item.year}
										title={item.title}
										description={item.description}
									/>
								</Box>
							))}
						</Box>
					</Box>

					{/* Right Column - Photo Albums */}
					<Box>
						{/* Throwback Photos */}
						<PhotoAlbum
							title="Throwback Memories"
							photos={throwbackPhotos}
							gradientColors="linear(to-r, purple.500, orange.400)"
							onOpenLightbox={openLightbox}
						/>
					</Box>
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
