"use client";

import { useState } from "react";
import { Box, Image, HStack } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

interface HeroImageProps {
	images: string[];
	mounted: boolean;
}

export function HeroImage({ images, mounted }: HeroImageProps) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const selectImage = (index: number) => {
		setCurrentImageIndex(index);
	};

	const getCardTransform = (index: number) => {
		const position = index - currentImageIndex;
		const totalImages = images.length;

		// Calculate rotation and offset for stacked effect with more space
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
			// Cards to the right - more spacing
			rotation = Math.min(position * 4, 20);
			yOffset = position * 12;
			xOffset = position * 35;
			scale = Math.max(0.85, 1 - position * 0.03);
			opacity = Math.max(0.5, 1 - position * 0.15);
			zIndex = totalImages - position;
		} else {
			// Cards to the left - more spacing
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

	return (
		<MotionBox
			initial={{ opacity: 0 }}
			animate={mounted ? { opacity: 1 } : {}}
			transition={{ duration: 1.2 }}
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
				<AnimatePresence mode="sync">
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
								onClick={() => selectImage(index)}
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
								<Box
									position="relative"
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
									pointerEvents="none"
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
									<Image
										src={image}
										alt={`Wedding photo ${index + 1}`}
										w="100%"
										h="100%"
										objectFit="cover"
										borderRadius="xl"
										userSelect="none"
										draggable={false}
									/>

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
									>
										{index + 1} / {images.length}
									</Box>
								</Box>
							</MotionBox>
						);
					})}
				</AnimatePresence>
			</Box>

			{/* Navigation Controls */}
			{images.length > 1 && (
				<>
					{/* Dot Indicators */}
					<HStack
						position="absolute"
						bottom={-16}
						left="50%"
						transform="translateX(-50%)"
						spacing={2}
						bg="white"
						px={4}
						py={2}
						borderRadius="full"
						boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
						border="2px solid"
						borderColor="primary.100"
					>
						{images.map((_, index) => (
							<Box
								key={index}
								as="button"
								w={currentImageIndex === index ? "32px" : "10px"}
								h="10px"
								borderRadius="full"
								bg={currentImageIndex === index ? "primary.500" : "gray.300"}
								transition="all 0.3s ease"
								onClick={() => selectImage(index)}
								aria-label={`Go to image ${index + 1}`}
								cursor="pointer"
								_hover={{
									bg: currentImageIndex === index ? "primary.600" : "gray.400",
									transform: "scale(1.2)",
								}}
							/>
						))}
					</HStack>
				</>
			)}
		</MotionBox>
	);
}
