"use client";

import { useState } from "react";
import { Box, Image, HStack, IconButton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { DateBadge } from "./DateBadge";

const MotionImage = motion(Image);
const MotionBox = motion(Box);

interface HeroImageProps {
	images: string[];
	mounted: boolean;
}

export function HeroImage({ images, mounted }: HeroImageProps) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [imageKey, setImageKey] = useState(0);

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % images.length);
		setImageKey((prev) => prev + 1);
	};

	const prevImage = () => {
		setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
		setImageKey((prev) => prev + 1);
	};

	const goToImage = (index: number) => {
		setCurrentImageIndex(index);
		setImageKey((prev) => prev + 1);
	};

	return (
		<MotionBox
			initial={{ opacity: 0, x: 30 }}
			animate={mounted ? { opacity: 1, x: 0 } : {}}
			transition={{ duration: 1, delay: 0.2 }}
		>
			<Box
				position="relative"
				bg="white"
				p={{ base: 4, md: 6 }}
				borderRadius="3xl"
				boxShadow="0 15px 40px rgba(195, 177, 225, 0.3), 0 5px 15px rgba(168, 216, 234, 0.2)"
				transform="rotate(1deg)"
				transition="all 0.5s ease"
				border="3px solid"
				borderColor="white"
				_hover={{
					transform: "rotate(0deg) translateY(-8px)",
					boxShadow:
						"0 20px 50px rgba(195, 177, 225, 0.4), 0 10px 20px rgba(168, 216, 234, 0.3)",
				}}
				_before={{
					content: '""',
					position: "absolute",
					inset: -2,
					borderRadius: "3xl",
					padding: "2px",
					background:
						"linear-gradient(135deg, rgba(195, 177, 225, 0.5), rgba(168, 216, 234, 0.5), rgba(245, 202, 195, 0.5))",
					WebkitMask:
						"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
					WebkitMaskComposite: "xor",
					maskComposite: "exclude",
					zIndex: -1,
				}}
			>
				{/* Watercolor splashes decoration */}
				<Box
					position="absolute"
					top={-4}
					left={-4}
					w="60px"
					h="60px"
					borderRadius="full"
					bg="radial-gradient(circle, rgba(195, 177, 225, 0.4), transparent 70%)"
					filter="blur(8px)"
					zIndex={-1}
				/>
				<Box
					position="absolute"
					bottom={-6}
					right={-6}
					w="80px"
					h="80px"
					borderRadius="full"
					bg="radial-gradient(circle, rgba(168, 216, 234, 0.4), transparent 70%)"
					filter="blur(10px)"
					zIndex={-1}
				/>

				{/* Inner border */}
				<Box
					position="absolute"
					inset={4}
					border="1px solid"
					borderColor="primary.100"
					borderRadius="2xl"
					pointerEvents="none"
				/>

				{/* Main image container */}
				<Box
					position="relative"
					overflow="hidden"
					borderRadius="2xl"
					cursor={images.length > 1 ? "pointer" : "default"}
					onClick={images.length > 1 ? nextImage : undefined}
					role={images.length > 1 ? "button" : undefined}
					aria-label={
						images.length > 1 ? "Click to view next image" : undefined
					}
				>
					<MotionImage
						key={imageKey}
						src={images[currentImageIndex]}
						alt={`Wedding couple photo ${currentImageIndex + 1}`}
						w="100%"
						h={{ base: "400px", md: "500px", lg: "600px" }}
						objectFit="cover"
						borderRadius="2xl"
						initial={{ scale: 1.1, opacity: 0 }}
						animate={mounted ? { scale: 1, opacity: 1 } : {}}
						transition={{ duration: 0.6 }}
					/>

					{/* Navigation arrows (only show if multiple images) */}
					{images.length > 1 && (
						<>
							<IconButton
								aria-label="Previous image"
								icon={<ChevronLeftIcon boxSize={6} />}
								position="absolute"
								left={4}
								top="50%"
								transform="translateY(-50%)"
								onClick={(e) => {
									e.stopPropagation();
									prevImage();
								}}
								bg="whiteAlpha.800"
								_hover={{ bg: "white" }}
								backdropFilter="blur(10px)"
								borderRadius="full"
								size="md"
								zIndex={2}
							/>
							<IconButton
								aria-label="Next image"
								icon={<ChevronRightIcon boxSize={6} />}
								position="absolute"
								right={4}
								top="50%"
								transform="translateY(-50%)"
								onClick={(e) => {
									e.stopPropagation();
									nextImage();
								}}
								bg="whiteAlpha.800"
								_hover={{ bg: "white" }}
								backdropFilter="blur(10px)"
								borderRadius="full"
								size="md"
								zIndex={2}
							/>
						</>
					)}
				</Box>

				{/* Image indicators (only show if multiple images) */}
				{images.length > 1 && (
					<HStack
						position="absolute"
						bottom={8}
						left="50%"
						transform="translateX(-50%)"
						spacing={2}
						bg="whiteAlpha.800"
						backdropFilter="blur(10px)"
						px={3}
						py={2}
						borderRadius="full"
						zIndex={3}
					>
						{images.map((_, index) => (
							<Box
								key={index}
								as="button"
								w={currentImageIndex === index ? "24px" : "8px"}
								h="8px"
								borderRadius="full"
								bg={currentImageIndex === index ? "primary.500" : "gray.300"}
								transition="all 0.3s ease"
								onClick={(e: React.MouseEvent) => {
									e.stopPropagation();
									goToImage(index);
								}}
								aria-label={`Go to image ${index + 1}`}
								_hover={{
									bg: currentImageIndex === index ? "primary.600" : "gray.400",
								}}
							/>
						))}
					</HStack>
				)}

				<DateBadge />
			</Box>
		</MotionBox>
	);
}
