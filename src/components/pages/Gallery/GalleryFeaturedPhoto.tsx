"use client";

import { useState, useEffect } from "react";
import { Box, IconButton, Text, Flex } from "@chakra-ui/react";
import Image from "next/image";

interface GalleryFeaturedPhotoProps {
	images: string[];
	selectedIndex: number;
	onPrev: () => void;
	onNext: () => void;
	onOpenFullscreen: () => void;
}

export function GalleryFeaturedPhoto({
	images,
	selectedIndex,
	onPrev,
	onNext,
	onOpenFullscreen,
}: GalleryFeaturedPhotoProps) {
	const [displayedIndex, setDisplayedIndex] = useState(selectedIndex);
	const [isFading, setIsFading] = useState(false);

	// Crossfade when selectedIndex changes
	useEffect(() => {
		if (selectedIndex === displayedIndex) return;
		setIsFading(true);
		const t = setTimeout(() => {
			setDisplayedIndex(selectedIndex);
			setIsFading(false);
		}, 300);
		return () => clearTimeout(t);
	}, [selectedIndex]); // eslint-disable-line react-hooks/exhaustive-deps

	if (images.length === 0) return null;

	const src = images[displayedIndex];

	return (
		<Box
			position="relative"
			mx="auto"
			w="100%"
			maxW="680px"
			borderRadius="2xl"
			overflow="hidden"
			boxShadow="0 8px 30px rgba(0,0,0,0.15)"
			bg="gray.900"
			cursor="pointer"
			onClick={onOpenFullscreen}
			role="button"
			aria-label="View fullscreen"
			sx={{ aspectRatio: "4/3" }}
		>
			{/* Main image with crossfade */}
			<Box
				position="absolute"
				inset={0}
				opacity={isFading ? 0 : 1}
				transition="opacity 0.3s ease"
			>
				<Image
					src={src}
					alt={`Featured prenup photo ${displayedIndex + 1}`}
					fill
					style={{ objectFit: "cover" }}
					sizes="(max-width: 768px) 100vw, 55vw"
					priority
					unoptimized
				/>
			</Box>

			{/* Gradient overlay at bottom */}
			<Box
				position="absolute"
				bottom={0}
				left={0}
				right={0}
				h="90px"
				background="linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)"
				pointerEvents="none"
			/>

			{/* Image counter */}
			<Box
				position="absolute"
				top={3}
				left={3}
				bg="blackAlpha.600"
				backdropFilter="blur(8px)"
				px={2.5}
				py={1}
				borderRadius="full"
				pointerEvents="none"
			>
				<Text color="white" fontSize="xs" fontWeight="semibold">
					{displayedIndex + 1} / {images.length}
				</Text>
			</Box>

			{/* Fullscreen hint */}
			<Box
				position="absolute"
				top={3}
				right={3}
				bg="blackAlpha.600"
				backdropFilter="blur(8px)"
				px={2.5}
				py={1}
				borderRadius="full"
				pointerEvents="none"
			>
				<Text color="white" fontSize="xs">
					⛶ Enlarge
				</Text>
			</Box>

			{/* Prev / Next navigation */}
			{images.length > 1 && (
				<>
					<IconButton
						aria-label="Previous photo"
						icon={<Text fontSize="xl" fontWeight="bold" lineHeight={1}>‹</Text>}
						position="absolute"
						left={2}
						top="50%"
						transform="translateY(-50%)"
						bg="blackAlpha.500"
						backdropFilter="blur(6px)"
						color="white"
						borderRadius="full"
						size="sm"
						_hover={{ bg: "blackAlpha.700" }}
						onClick={(e) => {
							e.stopPropagation();
							onPrev();
						}}
					/>
					<IconButton
						aria-label="Next photo"
						icon={<Text fontSize="xl" fontWeight="bold" lineHeight={1}>›</Text>}
						position="absolute"
						right={2}
						top="50%"
						transform="translateY(-50%)"
						bg="blackAlpha.500"
						backdropFilter="blur(6px)"
						color="white"
						borderRadius="full"
						size="sm"
						_hover={{ bg: "blackAlpha.700" }}
						onClick={(e) => {
							e.stopPropagation();
							onNext();
						}}
					/>
				</>
			)}

			{/* Dot indicators */}
			{images.length <= 12 && images.length > 1 && (
				<Flex
					position="absolute"
					bottom={3}
					left="50%"
					transform="translateX(-50%)"
					gap={1}
					pointerEvents="none"
				>
					{images.map((_, i) => (
						<Box
							key={i}
							w={i === displayedIndex ? 3.5 : 1.5}
							h={1.5}
							borderRadius="full"
							bg={i === displayedIndex ? "white" : "whiteAlpha.600"}
							transition="all 0.3s ease"
						/>
					))}
				</Flex>
			)}
		</Box>
	);
}
