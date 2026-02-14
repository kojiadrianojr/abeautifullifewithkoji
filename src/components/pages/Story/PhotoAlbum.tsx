"use client";

import {
	Box,
	SimpleGrid,
	Image,
	Button,
	Heading,
	Text,
} from "@chakra-ui/react";

interface PhotoAlbumProps {
	title: string;
	photos: string[];
	gradientColors: string;
	onOpenLightbox: (index: number, album: string[]) => void;
}

const MIN_PHOTOS = 4;

export function PhotoAlbum({
	title,
	photos,
	gradientColors,
	onOpenLightbox,
}: PhotoAlbumProps) {
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
