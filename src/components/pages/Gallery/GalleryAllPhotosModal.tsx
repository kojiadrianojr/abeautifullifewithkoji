"use client";

import { memo, useMemo, useState, useEffect, useRef } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	ModalHeader,
	Box,
	Text,
	Skeleton,
	SimpleGrid,
	useBreakpointValue,
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

// Number of skeleton tiles to show while content is deferred
const SKELETON_TILE_COUNT = 12;

// Delay (ms) before rendering real images — yields the main thread so the
// modal open animation completes before the expensive image tree is mounted.
const CONTENT_DEFER_MS = 120;

interface GalleryAllPhotosModalProps {
	images: string[];
	isOpen: boolean;
	onClose: () => void;
	/** Modal header title. Defaults to "All Photos". */
	title?: string;
	/** Alt text prefix for each image. Defaults to "Prenup photo". */
	altPrefix?: string;
}

interface ColumnProps {
	indices: number[];
	colIndex: number;
	totalCols: number;
	images: string[];
	altPrefix: string;
	expandedIndex: number | null;
	onTileClick: (index: number) => void;
}

// Extracted as a module-level memoized component so React can reuse the
// existing fiber tree instead of unmounting/remounting on every parent render.
const Column = memo(function Column({
	indices,
	colIndex,
	totalCols,
	images,
	altPrefix,
	expandedIndex,
	onTileClick,
}: ColumnProps) {
	const hasExpanded = expandedIndex !== null;

	return (
		<Box display="flex" flexDirection="column" gap={3} flex="1" minW={0}>
			{indices.map((imageIndex) => {
				const globalSlot = colIndex * totalCols + (imageIndex % ASPECT_RATIO_PATTERN.length);
				const paddingBottom = ASPECT_RATIO_PATTERN[globalSlot % ASPECT_RATIO_PATTERN.length];
				const isExpanded = expandedIndex === imageIndex;
				// Prioritise the first two rows of images for faster initial paint
				const isAboveFold = imageIndex < totalCols * 2;

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
						onClick={() => onTileClick(imageIndex)}
					>
						<Box position="absolute" inset={0}>
							<Image
								src={images[imageIndex]}
								alt={`${altPrefix} ${imageIndex + 1}`}
								fill
								style={{ objectFit: "cover" }}
								sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
								loading={isAboveFold ? "eager" : "lazy"}
								fetchPriority={isAboveFold ? "high" : "low"}
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
});

/** Skeleton grid shown while the real image grid is being deferred. */
function ModalSkeleton({ colCount }: { colCount: number }) {
	return (
		<SimpleGrid columns={colCount} gap={3}>
			{Array.from({ length: SKELETON_TILE_COUNT }).map((_, i) => (
				<Skeleton
					key={i}
					borderRadius="xl"
					startColor="gray.200"
					endColor="gray.300"
					style={{ paddingBottom: ASPECT_RATIO_PATTERN[i % ASPECT_RATIO_PATTERN.length] }}
				/>
			))}
		</SimpleGrid>
	);
}

export function GalleryAllPhotosModal({
	images,
	isOpen,
	onClose,
	title = "All Photos",
	altPrefix = "Prenup photo",
}: GalleryAllPhotosModalProps) {
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
	// Deferred flag — stays false until after the modal open animation completes,
	// so the first render only mounts the lightweight skeleton.
	const [isContentReady, setIsContentReady] = useState(false);
	const deferTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Render only the column count matching the current breakpoint — avoids
	// mounting all three responsive layouts simultaneously (was 3× all images).
	const colCount = useBreakpointValue({ base: 2, sm: 3, md: 4 }) ?? 2;

	// Fill each column top-to-bottom before moving to the next column.
	// Recomputed only when the image list or column count changes.
	const columns = useMemo<number[][]>(() => {
		const itemsPerCol = Math.ceil(images.length / colCount);
		return Array.from({ length: colCount }, (_, colIndex) => {
			const start = colIndex * itemsPerCol;
			const end = Math.min(start + itemsPerCol, images.length);
			return Array.from({ length: end - start }, (_, i) => start + i);
		});
	}, [images.length, colCount]);

	// When the modal opens, show skeleton first and defer mounting images.
	// When it closes, reset so the next open starts with a skeleton again.
	useEffect(() => {
		if (isOpen) {
			setIsContentReady(false);
			deferTimerRef.current = setTimeout(() => {
				setIsContentReady(true);
			}, CONTENT_DEFER_MS);
		} else {
			if (deferTimerRef.current) {
				clearTimeout(deferTimerRef.current);
				deferTimerRef.current = null;
			}
			setIsContentReady(false);
			setExpandedIndex(null);
		}

		return () => {
			if (deferTimerRef.current) {
				clearTimeout(deferTimerRef.current);
				deferTimerRef.current = null;
			}
		};
	}, [isOpen]);

	function handleTileClick(index: number) {
		setExpandedIndex((prev) => (prev === index ? null : index));
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
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
					{title}
					<Text as="span" color="gray.400" fontWeight="normal" fontSize="sm" ml={2}>
						({images.length} photos)
					</Text>
				</ModalHeader>
				<ModalCloseButton size="lg" top={3} right={4} />

				<ModalBody px={{ base: 4, md: 8 }} py={6}>
					{isContentReady ? (
						<>
							<Text fontSize="sm" color="gray.500" mb={6} textAlign="center">
								Click any photo to enlarge it
							</Text>

							<Box display="flex" gap={4} alignItems="flex-start">
								{columns.map((indices, colIndex) => (
									<Column
										key={colIndex}
										indices={indices}
										colIndex={colIndex}
										totalCols={colCount}
										images={images}
										altPrefix={altPrefix}
										expandedIndex={expandedIndex}
										onTileClick={handleTileClick}
									/>
								))}
							</Box>
						</>
					) : (
						<ModalSkeleton colCount={colCount} />
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
