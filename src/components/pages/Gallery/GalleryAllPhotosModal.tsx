"use client";

import { useState } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	ModalHeader,
	Box,
	Text,
} from "@chakra-ui/react";
import Image from "next/image";

// Same aspect ratio pattern as the masonry grid for visual consistency
const ASPECT_RATIO_PATTERN = [
	"125%", // portrait 4:5
	"75%",  // landscape 4:3
	"133%", // tall portrait 3:4
	"100%", // square 1:1
	"150%", // tall 2:3
	"80%",  // slight landscape
	"120%", // portrait
	"90%",  // near-square
];

const COLUMN_COUNTS = { base: 2, sm: 3, md: 4 };

interface GalleryAllPhotosModalProps {
	images: string[];
	isOpen: boolean;
	onClose: () => void;
}

export function GalleryAllPhotosModal({
	images,
	isOpen,
	onClose,
}: GalleryAllPhotosModalProps) {
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

	function handleTileClick(index: number) {
		setExpandedIndex((prev) => (prev === index ? null : index));
	}

	// Fill each column top-to-bottom before moving to the next column
	function buildColumns(count: number): number[][] {
		const itemsPerCol = Math.ceil(images.length / count);
		return Array.from({ length: count }, (_, colIndex) => {
			const start = colIndex * itemsPerCol;
			const end = Math.min(start + itemsPerCol, images.length);
			return Array.from({ length: end - start }, (_, i) => start + i);
		});
	}

	// We render 3 column layouts at different breakpoints; CSS handles visibility
	const cols2 = buildColumns(2);
	const cols3 = buildColumns(3);
	const cols4 = buildColumns(4);

	function Column({
		indices,
		colIndex,
		display,
	}: {
		indices: number[];
		colIndex: number;
		display: string | object;
	}) {
		return (
			<Box display={display} flexDirection="column" gap={3} flex="1" minW={0}>
				{indices.map((imageIndex) => {
					const globalSlot = colIndex * 4 + (imageIndex % 4);
					const paddingBottom = ASPECT_RATIO_PATTERN[globalSlot % ASPECT_RATIO_PATTERN.length];
					const isExpanded = expandedIndex === imageIndex;
					const hasExpanded = expandedIndex !== null;

					return (
						<Box
							key={imageIndex}
							position="relative"
							w="100%"
							overflow="hidden"
							borderRadius="xl"
							boxShadow={isExpanded ? "0 20px 60px rgba(0,0,0,0.45)" : "md"}
							cursor="pointer"
							zIndex={isExpanded ? 10 : 1}
							style={{
								paddingBottom,
								transform: isExpanded
									? "scale(1.45)"
									: hasExpanded
									? "scale(0.88)"
									: "scale(1)",
								transition: "transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease",
								opacity: hasExpanded && !isExpanded ? 0.65 : 1,
							}}
							_hover={{ boxShadow: "lg" }}
							onClick={() => handleTileClick(imageIndex)}
						>
							<Box position="absolute" inset={0}>
								<Image
									src={images[imageIndex]}
									alt={`Prenup photo ${imageIndex + 1}`}
									fill
									style={{ objectFit: "cover" }}
									sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
									loading={imageIndex < 8 ? "eager" : "lazy"}
									unoptimized
								/>
							</Box>

							{/* Expanded indicator badge */}
							{isExpanded && (
								<Box
									position="absolute"
									top={2}
									right={2}
									bg="blackAlpha.600"
									backdropFilter="blur(6px)"
									px={2}
									py={0.5}
									borderRadius="full"
									pointerEvents="none"
								>
									<Text color="white" fontSize="xs" fontWeight="semibold">
										{imageIndex + 1} / {images.length}
									</Text>
								</Box>
							)}
						</Box>
					);
				})}
			</Box>
		);
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				setExpandedIndex(null);
				onClose();
			}}
			size="full"
			scrollBehavior="inside"
		>
			<ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
			<ModalContent bg="gray.50" borderRadius={0} m={0}>
				<ModalHeader
					fontSize="xl"
					fontWeight="semibold"
					borderBottom="1px solid"
					borderColor="gray.200"
					py={4}
					px={6}
				>
					All Photos
					<Text as="span" color="gray.400" fontWeight="normal" fontSize="sm" ml={2}>
						({images.length} photos)
					</Text>
				</ModalHeader>
				<ModalCloseButton size="lg" top={3} right={4} />

				<ModalBody px={{ base: 4, md: 8 }} py={6}>
					<Text fontSize="sm" color="gray.500" mb={6} textAlign="center">
						Click any photo to enlarge it
					</Text>

					{/* Mobile: 2 columns */}
					<Box
						display={{ base: "flex", sm: "none" }}
						gap={4}
						alignItems="flex-start"
					>
						{cols2.map((indices, colIndex) => (
							<Column key={colIndex} indices={indices} colIndex={colIndex} display="flex" />
						))}
					</Box>

					{/* Tablet: 3 columns */}
					<Box
						display={{ base: "none", sm: "flex", md: "none" }}
						gap={4}
						alignItems="flex-start"
					>
						{cols3.map((indices, colIndex) => (
							<Column key={colIndex} indices={indices} colIndex={colIndex} display="flex" />
						))}
					</Box>

					{/* Desktop: 4 columns */}
					<Box
						display={{ base: "none", md: "flex" }}
						gap={4}
						alignItems="flex-start"
					>
						{cols4.map((indices, colIndex) => (
							<Column key={colIndex} indices={indices} colIndex={colIndex} display="flex" />
						))}
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
