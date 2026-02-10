"use client";

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	Box,
	IconButton,
	Image,
	Text,
	Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

interface GalleryLightboxProps {
	isOpen: boolean;
	onClose: () => void;
	images: string[];
	initialIndex?: number;
}

export function GalleryLightbox({
	isOpen,
	onClose,
	images,
	initialIndex = 0,
}: GalleryLightboxProps) {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const [loadedImages, setLoadedImages] = useState<Set<number>>(
		new Set([initialIndex]),
	);

	// Reset to initial index when modal opens
	useEffect(() => {
		if (isOpen) {
			setCurrentIndex(initialIndex);
			setLoadedImages(new Set([initialIndex]));
		}
	}, [isOpen, initialIndex]);

	// Preload adjacent images
	useEffect(() => {
		if (isOpen && images.length > 0) {
			const toLoad = new Set(loadedImages);

			// Load current, previous, and next images
			toLoad.add(currentIndex);
			if (currentIndex > 0) toLoad.add(currentIndex - 1);
			if (currentIndex < images.length - 1) toLoad.add(currentIndex + 1);

			setLoadedImages(toLoad);
		}
	}, [currentIndex, isOpen, images.length]);

	if (!images || images.length === 0) return null;

	const goToNext = () => {
		setCurrentIndex((prev) => (prev + 1) % images.length);
	};

	const goToPrevious = () => {
		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowRight") goToNext();
		if (e.key === "ArrowLeft") goToPrevious();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="6xl"
			isCentered
			onKeyDown={handleKeyDown}
		>
			<ModalOverlay bg="blackAlpha.900" />
			<ModalContent bg="transparent" boxShadow="none" maxW="90vw">
				<ModalCloseButton
					color="white"
					fontSize="xl"
					top={-12}
					right={0}
					_hover={{ bg: "whiteAlpha.200" }}
					zIndex={2}
				/>
				<ModalBody p={0} position="relative">
					{/* Image Counter */}
					<Text
						position="absolute"
						top={-12}
						left={0}
						color="white"
						fontSize="md"
						fontWeight="medium"
						zIndex={2}
					>
						{currentIndex + 1} / {images.length}
					</Text>

					{/* Main Image */}
					<Box
						w="full"
						h={{ base: "60vh", md: "70vh" }}
						display="flex"
						alignItems="center"
						justifyContent="center"
						borderRadius="lg"
						overflow="hidden"
						bg="blackAlpha.300"
					>
						{loadedImages.has(currentIndex) && (
							<Image
								src={images[currentIndex]}
								alt={`Photo ${currentIndex + 1}`}
								objectFit="contain"
								w="100%"
								h="100%"
								fallback={
									<Flex
										w="100%"
										h="100%"
										align="center"
										justify="center"
										bg="gray.800"
									>
										<Text color="white">Loading...</Text>
									</Flex>
								}
							/>
						)}
					</Box>

					{/* Navigation Buttons */}
					{images.length > 1 && (
						<>
							<IconButton
								aria-label="Previous image"
								icon={
									<Box fontSize="2xl" fontWeight="bold">
										‹
									</Box>
								}
								position="absolute"
								left={{ base: 2, md: 4 }}
								top="50%"
								transform="translateY(-50%)"
								onClick={goToPrevious}
								bg="whiteAlpha.200"
								color="white"
								_hover={{ bg: "whiteAlpha.400" }}
								size="lg"
								borderRadius="full"
							/>
							<IconButton
								aria-label="Next image"
								icon={
									<Box fontSize="2xl" fontWeight="bold">
										›
									</Box>
								}
								position="absolute"
								right={{ base: 2, md: 4 }}
								top="50%"
								transform="translateY(-50%)"
								onClick={goToNext}
								bg="whiteAlpha.200"
								color="white"
								_hover={{ bg: "whiteAlpha.400" }}
								size="lg"
								borderRadius="full"
							/>
						</>
					)}

					{/* Preload hidden images */}
					<Box display="none">
						{Array.from(loadedImages).map(
							(index) =>
								index !== currentIndex && (
									<Image
										key={index}
										src={images[index]}
										alt={`Preload ${index}`}
									/>
								),
						)}
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
