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
	Spinner,
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
	const [imageLoading, setImageLoading] = useState(true);
	const [imageError, setImageError] = useState(false);

	const goToNext = () => {
		setCurrentIndex((prev) => (prev + 1) % images.length);
		setImageLoading(true);
		setImageError(false);
	};

	const goToPrevious = () => {
		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
		setImageLoading(true);
		setImageError(false);
	};

	// Reset to initial index when modal opens
	useEffect(() => {
		if (isOpen) {
			setCurrentIndex(initialIndex);
			setLoadedImages(new Set([initialIndex]));
			setImageLoading(true);
			setImageError(false);
		}
	}, [isOpen, initialIndex]);

	// Reset loading state when current index changes
	useEffect(() => {
		setImageLoading(true);
		setImageError(false);
	}, [currentIndex]);

	// Preload adjacent images
	useEffect(() => {
		if (isOpen && images.length > 0) {
			setLoadedImages((prev) => {
				const toLoad = new Set(prev);

				// Load current, previous, and next images
				toLoad.add(currentIndex);
				if (currentIndex > 0) toLoad.add(currentIndex - 1);
				if (currentIndex < images.length - 1) toLoad.add(currentIndex + 1);

				return toLoad;
			});
		}
	}, [currentIndex, isOpen, images.length]);

	// Add keyboard listener
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;
			if (e.key === "ArrowRight") goToNext();
			if (e.key === "ArrowLeft") goToPrevious();
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			window.addEventListener("keydown", handleKeyDown);
			return () => window.removeEventListener("keydown", handleKeyDown);
		}
	}, [isOpen, currentIndex, images.length, onClose]); // eslint-disable-line react-hooks/exhaustive-deps

	if (!images || images.length === 0) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
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
							<>
								{imageLoading && !imageError && (
									<Flex
										w="100%"
										h="100%"
										align="center"
										justify="center"
										bg="gray.800"
										position="absolute"
									>
										<Flex direction="column" align="center" gap={4}>
											<Spinner size="xl" color="white" thickness="4px" />
											<Text color="white">Loading image...</Text>
										</Flex>
									</Flex>
								)}
								{imageError && (
									<Flex
										w="100%"
										h="100%"
										align="center"
										justify="center"
										bg="gray.800"
										position="absolute"
									>
										<Flex direction="column" align="center" gap={2}>
											<Text color="white" fontSize="3xl">
												⚠️
											</Text>
											<Text color="white" fontSize="lg">
												Failed to load image
											</Text>
											<Text color="gray.400" fontSize="sm">
												{images[currentIndex]}
											</Text>
										</Flex>
									</Flex>
								)}
								<Image
									src={images[currentIndex]}
									alt={`Photo ${currentIndex + 1}`}
									objectFit="contain"
									w="100%"
									h="100%"
									opacity={imageLoading || imageError ? 0 : 1}
									transition="opacity 0.3s"
									onLoad={() => {
										setImageLoading(false);
										setImageError(false);
									}}
									onError={() => {
										setImageLoading(false);
										setImageError(true);
									}}
								/>
							</>
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
