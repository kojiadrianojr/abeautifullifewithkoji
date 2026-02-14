"use client";

import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ImageNavigator } from "@/components/ui/ImageNavigator";

const MotionBox = motion(Box);

interface StackedImageGalleryProps {
	images: string[];
	mounted: boolean;
}

export function StackedImageGallery({
	images,
	mounted,
}: StackedImageGalleryProps) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const getCardTransform = (index: number) => {
		const position = index - currentImageIndex;
		const totalImages = images.length;

		let zIndex = totalImages - Math.abs(position);
		let rotation = 0;
		let yOffset = 0;
		let xOffset = 0;
		let scale = 1;
		let opacity = 1;

		if (position === 0) {
			// Current card - front and center
			zIndex = totalImages + 10;
			rotation = 0;
			yOffset = 0;
			xOffset = 0;
			scale = 1;
			opacity = 1;
		} else if (position > 0) {
			// Cards to the right
			rotation = Math.min(position * 4, 20);
			yOffset = position * 12;
			xOffset = position * 35;
			scale = Math.max(0.85, 1 - position * 0.03);
			opacity = Math.max(0.5, 1 - position * 0.15);
			zIndex = totalImages - position;
		} else {
			// Cards to the left
			rotation = Math.max(position * 4, -20);
			yOffset = Math.abs(position) * 12;
			xOffset = position * 35;
			scale = Math.max(0.85, 1 - Math.abs(position) * 0.03);
			opacity = Math.max(0.5, 1 - Math.abs(position) * 0.15);
			zIndex = totalImages + position;
		}

		return {
			zIndex,
			rotation,
			yOffset,
			xOffset,
			scale,
			opacity,
		};
	};

	if (images.length === 0) return null;

	return (
		<Box
			w="100%"
			position="relative"
			minH={{ base: "450px", sm: "550px", md: "600px", lg: "650px" }}
			display="flex"
			alignItems="center"
			justifyContent="center"
			pb={20}
		>
			{/* Card Stack Container */}
			<Box
				position="relative"
				w="100%"
				maxW="600px"
				h={{ base: "400px", sm: "500px", md: "550px" }}
				style={{ perspective: "1500px" }}
			>
				{images.map((image, index) => {
					const cardTransform = getCardTransform(index);
					const isActive = currentImageIndex === index;

					return (
						<MotionBox
							key={index}
							position="absolute"
							top="50%"
							left="50%"
							w="90%"
							h="90%"
							cursor="pointer"
							onClick={() => setCurrentImageIndex(index)}
							initial={{
								x: "-50%",
								y: "-50%",
								rotate: 0,
								scale: 0.8,
							}}
							animate={{
								x: `calc(-50% + ${cardTransform.xOffset}px)`,
								y: `calc(-50% + ${cardTransform.yOffset}px)`,
								rotate: cardTransform.rotation,
								scale: cardTransform.scale,
								zIndex: cardTransform.zIndex,
								opacity: cardTransform.opacity,
							}}
							style={{
								transformOrigin: "center center",
							}}
							transition={{
								type: "spring",
								stiffness: 260,
								damping: 25,
							}}
							whileHover={{
								scale: cardTransform.scale * 1.03,
								y: `calc(-50% + ${cardTransform.yOffset - 5}px)`,
								transition: { duration: 0.2 },
							}}
						>
							{/* White Card with Padding */}
							<Box
								w="100%"
								h="100%"
								bg="white"
								borderRadius="2xl"
								p={4}
								boxShadow={
									isActive
										? "0 25px 70px rgba(0, 0, 0, 0.35), 0 15px 40px rgba(195, 177, 225, 0.3)"
										: "0 15px 40px rgba(0, 0, 0, 0.25)"
								}
								transition="all 0.3s ease"
								border={isActive ? "3px solid" : "2px solid"}
								borderColor={isActive ? "primary.400" : "white"}
								_before={
									isActive
										? {
												content: '""',
												position: "absolute",
												inset: -3,
												borderRadius: "2xl",
												padding: "3px",
												background:
													"linear-gradient(135deg, rgba(195, 177, 225, 0.6), rgba(168, 216, 234, 0.6))",
												WebkitMask:
													"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
												WebkitMaskComposite: "xor",
												maskComposite: "exclude",
												zIndex: -1,
											}
										: {}
								}
							>
								{/* Image Container - Direct parent for Next.js Image with fill */}
								<Box
									position="relative"
									w="100%"
									h="100%"
									borderRadius="xl"
									overflow="hidden"
								>
									<Image
										src={image}
										alt={`Wedding photo ${index + 1}`}
										fill
										style={{
											objectFit: "cover",
										}}
										sizes="(max-width: 768px) 90vw, (max-width: 1200px) 500px, 600px"
										priority={index === 0}
										unoptimized
									/>
								</Box>

								{/* Card number indicator */}
								<Box
									position="absolute"
									bottom={6}
									right={6}
									bg="whiteAlpha.900"
									backdropFilter="blur(10px)"
									px={3}
									py={1.5}
									borderRadius="full"
									fontSize="sm"
									fontWeight="bold"
									color="primary.600"
									boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
									pointerEvents="none"
									zIndex={2}
								>
									{index + 1} / {images.length}
								</Box>
							</Box>
						</MotionBox>
					);
				})}
			</Box>

			{/* Navigation Controls */}
			<ImageNavigator
				totalImages={images.length}
				currentIndex={currentImageIndex}
				onSelectImage={setCurrentImageIndex}
			/>
		</Box>
	);
}
