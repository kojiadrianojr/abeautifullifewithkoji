"use client";

import { Box } from "@chakra-ui/react";

export interface RoyalBorderProps {
	children: React.ReactNode;
	variant?: "primary" | "secondary";
}

export function RoyalBorder({ children, variant = "primary" }: RoyalBorderProps) {
	const borderColor = variant === "primary" ? "gold.500" : "primary.200";
	
	return (
		<Box position="relative" w="100%">
			{/* Outer ornamental border */}
			<Box
				position="absolute"
				top="-4px"
				left="-4px"
				right="-4px"
				bottom="-4px"
				border="1px solid"
				borderColor={borderColor}
				opacity={0.3}
				borderRadius="2xl"
				pointerEvents="none"
			/>
			
			{/* Inner decorative border */}
			<Box
				position="relative"
				border="2px solid"
				borderColor={borderColor}
				borderRadius="xl"
				bg="white"
				boxShadow="0 10px 40px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)"
				overflow="hidden"
				_before={{
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `linear-gradient(135deg, 
						rgba(255,255,255,0) 0%, 
						rgba(212,175,55,0.03) 25%, 
						rgba(255,255,255,0) 50%, 
						rgba(212,175,55,0.03) 75%, 
						rgba(255,255,255,0) 100%)`,
					pointerEvents: "none",
				}}
			>
				{/* Corner ornaments */}
				<Box
					position="absolute"
					top={3}
					left={3}
					w="20px"
					h="20px"
					borderTop="2px solid"
					borderLeft="2px solid"
					borderColor={borderColor}
					opacity={0.4}
				/>
				<Box
					position="absolute"
					top={3}
					right={3}
					w="20px"
					h="20px"
					borderTop="2px solid"
					borderRight="2px solid"
					borderColor={borderColor}
					opacity={0.4}
				/>
				<Box
					position="absolute"
					bottom={3}
					left={3}
					w="20px"
					h="20px"
					borderBottom="2px solid"
					borderLeft="2px solid"
					borderColor={borderColor}
					opacity={0.4}
				/>
				<Box
					position="absolute"
					bottom={3}
					right={3}
					w="20px"
					h="20px"
					borderBottom="2px solid"
					borderRight="2px solid"
					borderColor={borderColor}
					opacity={0.4}
				/>
				
				{/* Content */}
				<Box position="relative" zIndex={1}>
					{children}
				</Box>
			</Box>
		</Box>
	);
}
