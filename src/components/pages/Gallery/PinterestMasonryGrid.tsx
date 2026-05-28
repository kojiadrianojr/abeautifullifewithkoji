"use client";

import { useState, useEffect, useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { SkeletonImage } from "@/components/ui/SkeletonImage";

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
const FADE_DURATION_MS = 500;

// Two-layer crossfade: `current` stays visible, `next` fades in on top.
// No blank frame between images.
interface TileState {
	current: number;
	next: number | null;
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
	const effectiveCols = useMemo(() => ({
		base: Math.min(COLUMN_COUNTS.base, maxColumns ?? COLUMN_COUNTS.base),
		sm: Math.min(COLUMN_COUNTS.sm, maxColumns ?? COLUMN_COUNTS.sm),
		md: Math.min(COLUMN_COUNTS.md, maxColumns ?? COLUMN_COUNTS.md),
	}), [maxColumns]);

	// Cap tile count so we never repeat images on initial render
	const MAX_TILE_COUNT = effectiveCols.md * 4;
	const TILE_COUNT = Math.min(images.length, MAX_TILE_COUNT);

	// Distribute tiles as evenly as possible across columns
	const tilesPerColumn = useMemo(() => {
		const basePerCol = Math.floor(TILE_COUNT / effectiveCols.md);
		const remainder = TILE_COUNT % effectiveCols.md;
		return Array.from(
			{ length: effectiveCols.md },
			(_, i) => (i < remainder ? basePerCol + 1 : basePerCol)
		);
	}, [TILE_COUNT, effectiveCols.md]);

	const [tiles, setTiles] = useState<TileState[]>(() =>
		Array.from({ length: TILE_COUNT }, (_, i) => ({ current: i, next: null }))
	);

	// Auto-rotate: every interval, pick a random tile to swap using two-layer crossfade.
	// The current image stays fully visible until the next image has faded in on top.
	useEffect(() => {
		if (images.length <= TILE_COUNT) return;

		const interval = setInterval(() => {
			setTiles((prev) => {
				const tileIndex = Math.floor(Math.random() * TILE_COUNT);

				// Skip tiles that are already transitioning
				if (prev[tileIndex].next !== null) return prev;

				// Build the set of image indices currently visible in other tiles
				const occupied = new Set(
					prev.filter((_, i) => i !== tileIndex).map((t) => t.current)
				);
				const available = Array.from(
					{ length: images.length },
					(_, i) => i
				).filter((i) => !occupied.has(i));

				const newImageIndex = pickFromCandidates(available);
				if (newImageIndex === -1) return prev;

				// Schedule promote after crossfade completes
				setTimeout(() => {
					setTiles((current) =>
						current.map((tile, i) =>
							i === tileIndex && tile.next !== null
								? { current: tile.next, next: null }
								: tile
						)
					);
				}, FADE_DURATION_MS + 50);

				// Start crossfade: set next so top layer fades in
				return prev.map((tile, i) =>
					i === tileIndex ? { current: tile.current, next: newImageIndex } : tile
				);
			});
		}, SWAP_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [images.length, TILE_COUNT]);

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
									onClick={() => onImageClick(tile.next ?? tile.current)}
									style={{ paddingBottom: aspectStyle.paddingBottom }}
								>
									{/* Bottom layer — current image, always visible */}
									<Box position="absolute" inset={0}>
										<SkeletonImage
											src={images[tile.current]}
											alt={`${altText} ${tile.current + 1}`}
											fill
											sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
											loading={globalTileIndex < 4 ? "eager" : "lazy"}
											unoptimized
											borderRadius="xl"
										/>
									</Box>

									{/* Top layer — incoming image fades in, no blank frame */}
									{tile.next !== null && (
										<Box
											position="absolute"
											inset={0}
											sx={{
												animation: `pmgFadeIn ${FADE_DURATION_MS}ms ease forwards`,
												"@keyframes pmgFadeIn": {
													from: { opacity: 0 },
													to: { opacity: 1 },
												},
											}}
										>
											<SkeletonImage
												src={images[tile.next]}
												alt={`${altText} ${tile.next + 1}`}
												fill
												sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
												loading="lazy"
												unoptimized
												borderRadius="xl"
											/>
										</Box>
									)}
								</Box>
							);
						})}
					</Box>
				);
			})}
		</Box>
	);
}
