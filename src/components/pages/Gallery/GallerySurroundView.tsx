"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

// Pinterest-style varying aspect ratios for surrounding tiles
const ASPECT_RATIOS = [
	"125%", // portrait 4:5
	"75%",  // landscape 4:3
	"133%", // tall portrait 3:4
	"100%", // square
	"150%", // tall 2:3
	"80%",  // slight landscape
	"120%", // portrait
	"90%",  // near-square
];

const COLS_PER_SIDE = 2;
const TILES_PER_COL = 4;
const SLOT_COUNT = COLS_PER_SIDE * 2 * TILES_PER_COL; // 16
const SWAP_INTERVAL_MS = 3200;
const CROSSFADE_MS = 600;

// Two-layer crossfade: `current` stays visible, `next` fades in on top.
// No blank flash between images.
interface SlotState {
	current: number;
	next: number | null;
}

function getRandomExcluding(length: number, exclude: number): number {
	if (length <= 1) return 0;
	let n: number;
	do { n = Math.floor(Math.random() * length); } while (n === exclude);
	return n;
}

interface GallerySurroundViewProps {
	images: string[];
	selectedIndex: number;
	onSelectImage: (index: number) => void;
	onOpenFullscreen: () => void;
	onPrev: () => void;
	onNext: () => void;
}

export function GallerySurroundView({
	images,
	selectedIndex,
	onSelectImage,
	onOpenFullscreen,
	onPrev,
	onNext,
}: GallerySurroundViewProps) {
	const initSlots = useCallback((): SlotState[] =>
		Array.from({ length: SLOT_COUNT }, (_, i) => ({
			current: i % images.length,
			next: null,
		})), [images.length]);

	const [slots, setSlots] = useState<SlotState[]>(initSlots);
	const [direction, setDirection] = useState<number>(0); // -1 = prev, +1 = next, 0 = auto
	const transitionTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

	// Auto-rotate surrounding tiles
	useEffect(() => {
		if (images.length < 2) return;
		const timers = transitionTimers.current;
		const interval = setInterval(() => {
			const slotIndex = Math.floor(Math.random() * SLOT_COUNT);

			// Abort any in-progress transition for this slot
			const existing = timers.get(slotIndex);
			if (existing) clearTimeout(existing);

			setSlots((prev) => {
				const incoming = getRandomExcluding(images.length, prev[slotIndex].current);
				return prev.map((slot, i) =>
					i === slotIndex ? { current: slot.current, next: incoming } : slot
				);
			});

			// After crossfade completes, promote next → current, clear next
			const t = setTimeout(() => {
				setSlots((prev) =>
					prev.map((slot, i) =>
						i === slotIndex && slot.next !== null
							? { current: slot.next, next: null }
							: slot
					)
				);
				timers.delete(slotIndex);
			}, CROSSFADE_MS + 50);

			timers.set(slotIndex, t);
		}, SWAP_INTERVAL_MS);

		return () => {
			clearInterval(interval);
			timers.forEach(clearTimeout);
			timers.clear();
		};
	}, [images.length]);

	if (images.length === 0) return null;

	const leftCols = [slots.slice(0, 4), slots.slice(4, 8)];
	const rightCols = [slots.slice(8, 12), slots.slice(12, 16)];

	function MasonryColumn({ colSlots, colOffset }: { colSlots: SlotState[]; colOffset: number }) {
		return (
			<Flex direction="column" gap={1.5} flex="1" minW={0}>
				{colSlots.map((slot, rowIndex) => {
					const globalIndex = colOffset + rowIndex;
					const paddingBottom = ASPECT_RATIOS[globalIndex % ASPECT_RATIOS.length];
					const isSelected =
						slot.current === selectedIndex ||
						(slot.next !== null && slot.next === selectedIndex);

					return (
						<Box
							key={rowIndex}
							position="relative"
							w="100%"
							overflow="hidden"
							borderRadius="lg"
							boxShadow={isSelected ? "0 0 0 2.5px var(--chakra-colors-primary-400)" : "sm"}
							cursor="pointer"
							transition="transform 0.2s ease, box-shadow 0.2s ease"
							_hover={{ transform: "scale(1.04)", boxShadow: "lg", zIndex: 1 }}
							onClick={() => onSelectImage(slot.next ?? slot.current)}
							style={{ paddingBottom }}
						>
							{/* Bottom layer — current image, always visible */}
							<Box position="absolute" inset={0}>
								<Image
									src={images[slot.current]}
									alt={`Prenup photo ${slot.current + 1}`}
									fill
									style={{ objectFit: "cover" }}
									sizes="(max-width: 768px) 20vw, 12vw"
									loading="lazy"
									unoptimized
								/>
							</Box>

							{/* Top layer — incoming image, fades in via CSS animation */}
							{slot.next !== null && (
								<Box
									position="absolute"
									inset={0}
									sx={{
										animation: `galleryFadeIn ${CROSSFADE_MS}ms ease forwards`,
										"@keyframes galleryFadeIn": {
											from: { opacity: 0 },
											to: { opacity: 1 },
										},
									}}
								>
									<Image
										src={images[slot.next]}
										alt={`Prenup photo ${slot.next + 1}`}
										fill
										style={{ objectFit: "cover" }}
										sizes="(max-width: 768px) 20vw, 12vw"
										loading="lazy"
										unoptimized
									/>
								</Box>
							)}
						</Box>
					);
				})}
			</Flex>
		);
	}

	return (
		<Flex gap={2} align="flex-start" justify="center" w="100%">
			{/* LEFT masonry collage */}
			<Flex
				gap={1.5}
				display={{ base: "none", md: "flex" }}
				w={{ md: "19%", lg: "21%" }}
				flexShrink={0}
			>
				<MasonryColumn colSlots={leftCols[0]} colOffset={0} />
				<MasonryColumn colSlots={leftCols[1]} colOffset={4} />
			</Flex>

			{/* CENTER — main featured image */}
			<Box
				position="relative"
				flex="1"
				maxW={{ base: "100%", md: "520px", lg: "600px" }}
				minW={0}
				borderRadius="2xl"
				overflow="hidden"
				boxShadow="0 20px 56px rgba(0,0,0,0.25)"
				bg="gray.900"
				cursor="pointer"
				onClick={onOpenFullscreen}
				sx={{ aspectRatio: "4/3" }}
			>
				{/* Animated image layer — direction-aware slide + fade */}
				<AnimatePresence initial={false} custom={direction} mode="popLayout">
					<motion.div
						key={selectedIndex}
						custom={direction}
						variants={{
							enter: (dir: number) => ({
								x: dir === 0 ? 0 : dir > 0 ? 40 : -40,
								opacity: 0,
								scale: 0.97,
							}),
							center: { x: 0, opacity: 1, scale: 1 },
							exit: (dir: number) => ({
								x: dir === 0 ? 0 : dir > 0 ? -40 : 40,
								opacity: 0,
								scale: 0.97,
							}),
						}}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{ duration: CROSSFADE_MS / 1000, ease: "easeInOut" }}
						style={{ position: "absolute", inset: 0 }}
					>
						<Image
							src={images[selectedIndex]}
							alt={`Featured photo ${selectedIndex + 1}`}
							fill
							style={{ objectFit: "cover" }}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 52vw, 600px"
							priority
							unoptimized
						/>
					</motion.div>
				</AnimatePresence>

				{/* Bottom gradient overlay */}
				<Box
					position="absolute"
					bottom={0} left={0} right={0} h="80px"
					background="linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)"
					pointerEvents="none"
					zIndex={1}
				/>

				{/* Counter */}
				<Box
					position="absolute" top={3} left={3} zIndex={2}
					bg="blackAlpha.600" backdropFilter="blur(8px)"
					px={3} py={1} borderRadius="full" pointerEvents="none"
				>
					<Text color="white" fontSize="sm" fontWeight="semibold">
						{selectedIndex + 1} / {images.length}
					</Text>
				</Box>

				{/* Fullscreen hint */}
				<Box
					position="absolute" top={3} right={3} zIndex={2}
					bg="blackAlpha.600" backdropFilter="blur(8px)"
					px={2.5} py={1} borderRadius="full" pointerEvents="none"
				>
					<Text color="white" fontSize="sm">⛶</Text>
				</Box>

				{/* Prev / Next */}
				{images.length > 1 && (
					<>
						<IconButton
							aria-label="Previous"
							icon={<Text fontSize="2xl" lineHeight={1} fontWeight="bold">‹</Text>}
							position="absolute" left={2} top="50%" transform="translateY(-50%)" zIndex={2}
							size="md" borderRadius="full"
							bg="blackAlpha.500" backdropFilter="blur(6px)" color="white"
							_hover={{ bg: "blackAlpha.700" }}
							onClick={(e) => { e.stopPropagation(); setDirection(-1); onPrev(); }}
						/>
						<IconButton
							aria-label="Next"
							icon={<Text fontSize="2xl" lineHeight={1} fontWeight="bold">›</Text>}
							position="absolute" right={2} top="50%" transform="translateY(-50%)" zIndex={2}
							size="md" borderRadius="full"
							bg="blackAlpha.500" backdropFilter="blur(6px)" color="white"
							_hover={{ bg: "blackAlpha.700" }}
							onClick={(e) => { e.stopPropagation(); setDirection(1); onNext(); }}
						/>
					</>
				)}
			</Box>

			{/* RIGHT masonry collage */}
			<Flex
				gap={1.5}
				display={{ base: "none", md: "flex" }}
				w={{ md: "19%", lg: "21%" }}
				flexShrink={0}
			>
				<MasonryColumn colSlots={rightCols[0]} colOffset={8} />
				<MasonryColumn colSlots={rightCols[1]} colOffset={12} />
			</Flex>
		</Flex>
	);
}
