"use client";

import { Box, Image } from "@chakra-ui/react";

interface VenueImageSlotProps {
	label: string;
	src?: string;
	alt?: string;
}

const detailsBg = "#f7fafc";

export function VenueImageSlot({ label, src, alt }: VenueImageSlotProps) {
	const hasImage = Boolean(src);

	return (
		<Box
			w="full"
			h={{ base: "340px", md: "400px", lg: "420px" }}
			display="flex"
			alignItems="center"
			justifyContent="center"
			overflow="hidden"
			bg={hasImage ? detailsBg : "gray.50"}
			role={hasImage ? undefined : "img"}
			aria-label={hasImage ? undefined : `${label} illustration placeholder`}
			border={hasImage ? "none" : "1px dashed"}
			borderColor="gray.200"
		>
			{hasImage && (
				<Image
					src={src}
					alt={alt ?? `${label} venue`}
					maxW="100%"
					maxH="100%"
					w="auto"
					h="auto"
					objectFit="contain"
					display="block"
					draggable={false}
					sx={{
						backgroundColor: `${detailsBg} !important`,
						border: "none",
						outline: "none",
						boxShadow: "none",
						mixBlendMode: "multiply",
					}}
				/>
			)}
		</Box>
	);
}
