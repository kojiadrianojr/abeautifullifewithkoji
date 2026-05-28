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

// Progressive loading: how many images to render on first mount and per scroll batch.
// Keeps initial memory low on mobile Safari (prevents the "A problem repeatedly occurred" crash).
const INITIAL_BATCH_SIZE = 12;
const LOAD_MORE_BATCH_SIZE = 12;

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
}

// Extracted as a module-level memoized component so React can reuse the
// existing fiber tree instead of unmounting/remounting on every parent render.
const Column = memo(function Column({
	indices,
	colIndex,
	totalCols,
	images,
	altPrefix,
}: ColumnProps) {
	return (
		<Box display="flex" flexDirection="column" gap={3} flex="1" minW={0}>
			{indices.map((imageIndex) => {
				const globalSlot = colIndex * totalCols + (imageIndex % ASPECT_RATIO_PATTERN.length);
				const paddingBottom = ASPECT_RATIO_PATTERN[globalSlot % ASPECT_RATIO_PATTERN.length];
				// Prioritise the first two rows of images for faster initial paint
				const isAboveFold = imageIndex < totalCols * 2;

				return (
					<Box
						key={imageIndex}
						position="relative"
						w="100%"
						overflow="hidden"
						borderRadius="xl"
						boxShadow="md"
						style={{ paddingBottom }}
						_hover={{ boxShadow: "lg" }}
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
	// Deferred flag — stays false until after the modal open animation completes,
	// so the first render only mounts the lightweight skeleton.
	const [isContentReady, setIsContentReady] = useState(false);
	// Progressive loading: only render a batch of images at a time to prevent
	// mobile Safari memory crashes when there are many photos.
	const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE);
	const deferTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const sentinelRef = useRef<HTMLDivElement | null>(null);

	// Render only the column count matching the current breakpoint — avoids
	// mounting all three responsive layouts simultaneously (was 3× all images).
	const colCount = useBreakpointValue({ base: 2, sm: 3, md: 4 }) ?? 2;

	// Compute columns only for the currently-visible slice of images.
	const columns = useMemo<number[][]>(() => {
		const count = Math.min(visibleCount, images.length);
		const itemsPerCol = Math.ceil(count / colCount);
		return Array.from({ length: colCount }, (_, colIndex) => {
			const start = colIndex * itemsPerCol;
			const end = Math.min(start + itemsPerCol, count);
			return Array.from({ length: end - start }, (_, i) => start + i);
		});
	}, [visibleCount, images.length, colCount]);

	const hasMore = visibleCount < images.length;

	// When the modal opens, show skeleton first and defer mounting images.
	// When it closes, reset so the next open starts with a skeleton again.
	useEffect(() => {
		if (isOpen) {
			setVisibleCount(INITIAL_BATCH_SIZE);
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
		}

		return () => {
			if (deferTimerRef.current) {
				clearTimeout(deferTimerRef.current);
				deferTimerRef.current = null;
			}
		};
	}, [isOpen]);

	// IntersectionObserver: load the next batch when the sentinel scrolls into view.
	useEffect(() => {
		if (!isContentReady || !hasMore || !sentinelRef.current) return;

		const sentinel = sentinelRef.current;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setVisibleCount((prev) => Math.min(prev + LOAD_MORE_BATCH_SIZE, images.length));
				}
			},
			{ threshold: 0 }
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [isContentReady, hasMore, images.length]);


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
							<Box display="flex" gap={4} alignItems="flex-start">
								{columns.map((indices, colIndex) => (
									<Column
										key={colIndex}
										indices={indices}
										colIndex={colIndex}
										totalCols={colCount}
										images={images}
										altPrefix={altPrefix}
									/>
								))}
							</Box>

							{/* Sentinel: when scrolled into view, the next batch of images is appended */}
							{hasMore && (
								<Box ref={sentinelRef} mt={6} display="flex" justifyContent="center">
									<SimpleGrid columns={colCount} gap={3} w="100%">
										{Array.from({ length: Math.min(LOAD_MORE_BATCH_SIZE, images.length - visibleCount) }).map((_, i) => (
											<Skeleton
												key={i}
												borderRadius="xl"
												startColor="gray.200"
												endColor="gray.300"
												style={{ paddingBottom: ASPECT_RATIO_PATTERN[i % ASPECT_RATIO_PATTERN.length] }}
											/>
										))}
									</SimpleGrid>
								</Box>
							)}
						</>
					) : (
						<ModalSkeleton colCount={colCount} />
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
