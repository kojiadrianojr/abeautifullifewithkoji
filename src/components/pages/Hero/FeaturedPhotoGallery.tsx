"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { SkeletonImage } from "@/components/ui/SkeletonImage";
import { ConfigService } from "@/services";

const MotionBox = motion.create(Box);

const AUTO_ADVANCE_INTERVAL = 4000;

interface FeaturedPhotoGalleryProps {
	images: string[];
}

export function FeaturedPhotoGallery({ images }: FeaturedPhotoGalleryProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState(1);
	const [isPaused, setIsPaused] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const coupleNames = ConfigService.getCoupleNames();

	const goTo = useCallback(
		(index: number, dir?: number) => {
			const newDir = dir ?? (index > currentIndex ? 1 : -1);
			setDirection(newDir);
			setCurrentIndex(index);
		},
		[currentIndex]
	);

	const goNext = useCallback(() => {
		goTo((currentIndex + 1) % images.length, 1);
	}, [currentIndex, images.length, goTo]);

	// Auto-advance
	useEffect(() => {
		if (images.length <= 1 || isPaused) return;
		timerRef.current = setTimeout(goNext, AUTO_ADVANCE_INTERVAL);
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [currentIndex, isPaused, goNext, images.length]);

	const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		const threshold = 40;
		if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > 300) {
			if (info.offset.x > 0) {
				goTo((currentIndex - 1 + images.length) % images.length, -1);
			} else {
				goTo((currentIndex + 1) % images.length, 1);
			}
		}
	};

	if (images.length === 0) return null;

	const variants = {
		enter: (dir: number) => ({
			x: dir > 0 ? "60%" : "-60%",
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
		},
		exit: (dir: number) => ({
			x: dir > 0 ? "-60%" : "60%",
			opacity: 0,
		}),
	};

	return (
		<Box
			w="100%"
			display="flex"
			flexDirection="column"
			alignItems="center"
			gap={4}
		>
			{/* Photo frame */}
			<Box
				w="100%"
				maxW="600px"
				position="relative"
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
				onTouchStart={() => setIsPaused(true)}
				onTouchEnd={() => setIsPaused(false)}
			>
				{/* Outer white photo-print frame */}
				<Box
					bg="white"
					borderRadius="2xl"
					p={4}
					pb={6}
					boxShadow="0 25px 70px rgba(0, 0, 0, 0.35), 0 10px 30px rgba(0,0,0,0.2)"
					position="relative"
					overflow="hidden"
				>
					{/* Image area */}
					<Box
						position="relative"
						w="100%"
						h={{ base: "340px", sm: "420px", md: "480px", lg: "440px" }}
						borderRadius="xl"
						overflow="hidden"
						bg="gray.100"
					>
						<AnimatePresence initial={false} custom={direction} mode="wait">
							<MotionBox
								key={currentIndex}
								custom={direction}
								variants={variants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{ duration: 0.4, ease: "easeInOut" }}
								position="absolute"
								inset={0}
								drag="x"
								dragConstraints={{ left: 0, right: 0 }}
								dragElastic={0.3}
								onDragEnd={handleDragEnd}
								cursor="grab"
								_active={{ cursor: "grabbing" }}
							>
								<SkeletonImage
									src={images[currentIndex]}
									alt={`${coupleNames} – photo ${currentIndex + 1} of ${images.length}`}
									fill
									sizes="(max-width: 768px) 90vw, 600px"
									priority={currentIndex === 0}
									unoptimized
									style={{ objectFit: "cover" }}
									borderRadius="xl"
								/>
							</MotionBox>
						</AnimatePresence>
					</Box>

					{/* Counter badge */}
					<Box
						position="absolute"
						bottom={8}
						right={8}
						bg="whiteAlpha.900"
						backdropFilter="blur(10px)"
						px={3}
						py={1}
						borderRadius="full"
						fontSize="xs"
						fontWeight="bold"
						color="primary.700"
						boxShadow="0 2px 8px rgba(0,0,0,0.12)"
						zIndex={2}
						pointerEvents="none"
					>
						{currentIndex + 1} / {images.length}
					</Box>
				</Box>
			</Box>

			{/* Navigation dots */}
			<HStack spacing={2} justify="center">
				{images.map((_, i) => (
					<Box
						key={i}
						as="button"
						aria-label={`View photo ${i + 1}`}
						onClick={() => goTo(i)}
						w={i === currentIndex ? 5 : 2.5}
						h={2.5}
						borderRadius="full"
						bg={i === currentIndex ? "primary.400" : "whiteAlpha.500"}
						border="1.5px solid"
						borderColor={i === currentIndex ? "primary.400" : "whiteAlpha.600"}
						transition="all 0.25s ease"
						cursor="pointer"
						_hover={{ bg: "primary.300", borderColor: "primary.300" }}
					/>
				))}
			</HStack>

			{/* Swipe hint — mobile only */}
			<Box
				display={{ base: "flex", md: "none" }}
				alignItems="center"
				gap={1.5}
				fontSize="xs"
				color="whiteAlpha.600"
				pointerEvents="none"
			>
				<Box as="span">← Swipe to navigate →</Box>
			</Box>
		</Box>
	);
}
