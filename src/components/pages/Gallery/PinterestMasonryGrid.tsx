"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Box } from "@chakra-ui/react";
import Image from "next/image";

interface PinterestMasonryGridProps {
	images: string[];
	onImageClick: (index: number) => void;
	/** Override max columns (default: 4 desktop / 3 tablet / 2 mobile) */
	maxColumns?: 2 | 3 | 4;
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

function getRandomIndex(length: number, exclude?: number): number {
	if (length <= 1) return 0;
	let next: number;
	do {
		next = Math.floor(Math.random() * length);
	} while (next === exclude);
	return next;
}

export function PinterestMasonryGrid({
	images,
	onImageClick,
	maxColumns,
}: PinterestMasonryGridProps) {
	const effectiveCols = {
		base: Math.min(COLUMN_COUNTS.base, maxColumns ?? COLUMN_COUNTS.base),
		sm: Math.min(COLUMN_COUNTS.sm, maxColumns ?? COLUMN_COUNTS.sm),
		md: Math.min(COLUMN_COUNTS.md, maxColumns ?? COLUMN_COUNTS.md),
	};
	const TILE_COUNT = effectiveCols.md * 4; // 4 tiles per column at max breakpoint
	const tilesPerColumn = Array(effectiveCols.md).fill(4);

	const initialTiles = useCallback((): TileState[] => {
		return Array.from({ length: TILE_COUNT }, (_, i) => ({
			imageIndex: i % images.length,
			isFading: false,
		}));
	}, [images.length]);

	const [tiles, setTiles] = useState<TileState[]>(initialTiles);
	const pendingImageRef = useRef<Map<number, number>>(new Map());

	// Auto-rotate: every interval, pick a random tile to swap
	useEffect(() => {
		if (images.length < 2) return;

		const interval = setInterval(() => {
			const tileIndex = Math.floor(Math.random() * TILE_COUNT);

			setTiles((prev) => {
				const newImageIndex = getRandomIndex(
					images.length,
					prev[tileIndex].imageIndex
				);
				pendingImageRef.current.set(tileIndex, newImageIndex);

				return prev.map((tile, i) =>
					i === tileIndex ? { ...tile, isFading: true } : tile
				);
			});
		}, SWAP_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [images.length]);

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
			aria-label="Prenup photo collage"
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
											alt={`Prenup photo ${tile.imageIndex + 1}`}
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
