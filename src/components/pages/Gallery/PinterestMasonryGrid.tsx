"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Box } from "@chakra-ui/react";
import Image from "next/image";

interface PinterestMasonryGridProps {
	images: string[];
	onImageClick: (index: number) => void;
	/** Override max columns (default: 4 desktop / 3 tablet / 2 mobile) */
	maxColumns?: 2 | 3 | 4;
	/** Alt text prefix for each tile image. Defaults to "Photo". */
	altText?: string;
	/** aria-label for the grid wrapper. */
	ariaLabel?: string;
}

// Aspect ratio patterns that cycle across tiles — creates the organic Pinterest look
const ASPECT_RATIO_PATTERN = [
	{ paddingBottom: "125%" }, // portrait 4:5
	{ paddingBottom: "75%" },  // landscape 4:3
	{ paddingBottom: "133%" }, // tall portrait 3:4
	{ paddingBottom: "100%" }, // square 1:1
	{ paddingBottom: "150%" }, // tall portrait 2:3
	{ paddingBottom: "80%" },  // slight landscape
	{ paddingBottom: "120%" }, // portrait
	{ paddingBottom: "90%" },  // near-square
];

const COLUMN_COUNTS = { base: 2, sm: 3, md: 4 };
const SWAP_INTERVAL_MS = 3500;

interface TileState {
	imageIndex: number;
	isFading: boolean;
}

/** Pick a random index from `candidates`. Returns -1 if the array is empty. */
function pickFromCandidates(candidates: number[]): number {
	if (candidates.length === 0) return -1;
	return candidates[Math.floor(Math.random() * candidates.length)];
}

export function PinterestMasonryGrid({
	images,
	onImageClick,
	maxColumns,
	altText = "Photo",
	ariaLabel = "Photo collage",
}: PinterestMasonryGridProps) {
	const effectiveCols = {
		base: Math.min(COLUMN_COUNTS.base, maxColumns ?? COLUMN_COUNTS.base),
		sm: Math.min(COLUMN_COUNTS.sm, maxColumns ?? COLUMN_COUNTS.sm),
		md: Math.min(COLUMN_COUNTS.md, maxColumns ?? COLUMN_COUNTS.md),
	};

	// Cap tile count so we never repeat images on initial render
	const MAX_TILE_COUNT = effectiveCols.md * 4;
	const TILE_COUNT = Math.min(images.length, MAX_TILE_COUNT);

	// Distribute tiles as evenly as possible across columns
	const basePerCol = Math.floor(TILE_COUNT / effectiveCols.md);
	const remainder = TILE_COUNT % effectiveCols.md;
	const tilesPerColumn = Array.from(
		{ length: effectiveCols.md },
		(_, i) => (i < remainder ? basePerCol + 1 : basePerCol)
	);

	const initialTiles = useCallback((): TileState[] => {
		return Array.from({ length: TILE_COUNT }, (_, i) => ({
			imageIndex: i, // unique index — TILE_COUNT is always ≤ images.length
			isFading: false,
		}));
	}, [TILE_COUNT]);

	const [tiles, setTiles] = useState<TileState[]>(initialTiles);
	const pendingImageRef = useRef<Map<number, number>>(new Map());

	// Auto-rotate: every interval, pick a random tile to swap.
	// Only enabled when there are more images than tiles (otherwise every swap
	// would duplicate an image that's already visible).
	useEffect(() => {
		if (images.length <= TILE_COUNT) return;

		const interval = setInterval(() => {
			const tileIndex = Math.floor(Math.random() * TILE_COUNT);

			setTiles((prev) => {
				// Build the set of image indices currently visible in other tiles
				const occupied = new Set(
					prev.filter((_, i) => i !== tileIndex).map((t) => t.imageIndex)
				);
				// Pick only from images that are NOT already on screen
				const available = Array.from(
					{ length: images.length },
					(_, i) => i
				).filter((i) => !occupied.has(i));

				const newImageIndex = pickFromCandidates(available);
				if (newImageIndex === -1) return prev; // no spare image, skip

				pendingImageRef.current.set(tileIndex, newImageIndex);
				return prev.map((tile, i) =>
					i === tileIndex ? { ...tile, isFading: true } : tile
				);
			});
		}, SWAP_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [images.length, TILE_COUNT]);

	// After fade-out, swap the image and fade back in
	useEffect(() => {
		const fadingTiles = tiles
			.map((tile, i) => ({ tile, i }))
			.filter(({ tile }) => tile.isFading);

		if (fadingTiles.length === 0) return;

		const timeout = setTimeout(() => {
			setTiles((prev) =>
				prev.map((tile, i) => {
					if (!tile.isFading) return tile;
					const nextImage = pendingImageRef.current.get(i);
					if (nextImage === undefined) return { ...tile, isFading: false };
					pendingImageRef.current.delete(i);
					return { imageIndex: nextImage, isFading: false };
				})
			);
		}, 400); // matches the CSS transition duration

		return () => clearTimeout(timeout);
	}, [tiles]);

	if (images.length === 0) return null;

	// Build columns array dynamically based on actual column count
	const columns = tilesPerColumn.map((count, colIndex) => {
		const start = tilesPerColumn.slice(0, colIndex).reduce((a: number, b: number) => a + b, 0);
		return tiles.slice(start, start + count);
	});

	return (
		<Box
			display="grid"
			gridTemplateColumns={{
				base: `repeat(${effectiveCols.base}, 1fr)`,
				sm: `repeat(${effectiveCols.sm}, 1fr)`,
				md: `repeat(${effectiveCols.md}, 1fr)`,
			}}
			gap={3}
			aria-label={ariaLabel}
		>
			{columns.map((columnTiles, colIndex) => {
				// Hide columns beyond the responsive breakpoint
				const displayValue = {
					base: colIndex < effectiveCols.base ? "flex" : "none",
					sm: colIndex < effectiveCols.sm ? "flex" : "none",
					md: colIndex < effectiveCols.md ? "flex" : "none",
				};

				return (
					<Box
						key={colIndex}
						display={displayValue}
						flexDirection="column"
						gap={3}
					>
						{columnTiles.map((tile, rowIndex) => {
							const globalTileIndex = colIndex * tilesPerColumn[colIndex] + rowIndex;
							const aspectStyle =
								ASPECT_RATIO_PATTERN[globalTileIndex % ASPECT_RATIO_PATTERN.length];
							const src = images[tile.imageIndex];

							return (
								<Box
									key={`${colIndex}-${rowIndex}`}
									position="relative"
									w="100%"
									overflow="hidden"
									borderRadius="xl"
									boxShadow="md"
									cursor="pointer"
									transition="transform 0.25s ease, box-shadow 0.25s ease"
									_hover={{
										transform: "scale(1.03)",
										boxShadow: "xl",
									}}
									onClick={() => onImageClick(tile.imageIndex)}
									style={{ paddingBottom: aspectStyle.paddingBottom }}
								>
									<Box
										position="absolute"
										inset={0}
										opacity={tile.isFading ? 0 : 1}
										transition="opacity 0.4s ease"
									>
										<Image
											src={src}
											alt={`${altText} ${tile.imageIndex + 1}`}
											fill
											style={{ objectFit: "cover" }}
											sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
											loading={globalTileIndex < 4 ? "eager" : "lazy"}
											unoptimized
										/>
									</Box>
								</Box>
							);
						})}
					</Box>
				);
			})}
		</Box>
	);
}
