"use client";

import { Box, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface ImageCardProps {
	src: string;
	alt: string;
	index: number;
	isActive: boolean;
	onClick: () => void;
	transform: {
		zIndex: number;
		rotation: number;
		yOffset: number;
		xOffset: number;
		scale: number;
		opacity: number;
	};
}

export function ImageCard({
	src,
	alt,
	index,
	isActive,
	onClick,
	transform,
}: ImageCardProps) {
	const totalImages = 1; // This would come from parent context if needed

	return (
		<MotionBox
			position="absolute"
			top="50%"
			left="50%"
			w="90%"
			h="90%"
			onClick={onClick}
			initial={{
				x: "-50%",
				y: "-50%",
				rotate: 0,
				scale: 0.8,
			}}
			animate={{
				x: `calc(-50% + ${transform.xOffset}px)`,
				y: `calc(-50% + ${transform.yOffset}px)`,
				rotate: transform.rotation,
				scale: transform.scale,
				zIndex: transform.zIndex,
				opacity: transform.opacity,
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
				scale: transform.scale * 1.03,
				y: `calc(-50% + ${transform.yOffset - 5}px)`,
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
					src={src}
					alt={alt}
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
					{index + 1} / {totalImages}
				</Box>
			</Box>
		</MotionBox>
	);
}
