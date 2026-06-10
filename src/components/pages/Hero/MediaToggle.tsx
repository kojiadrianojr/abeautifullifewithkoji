"use client";

import { Box, HStack, Button } from "@chakra-ui/react";

export type MediaMode = "gallery" | "video";

interface MediaToggleProps {
	mode: MediaMode;
	onSelect: (mode: MediaMode) => void;
}

export function MediaToggle({ mode, onSelect }: MediaToggleProps) {
	return (
		<Box
			display="inline-flex"
			bg="whiteAlpha.200"
			backdropFilter="blur(12px)"
			borderRadius="full"
			p={1}
			border="1px solid"
			borderColor="whiteAlpha.300"
		>
			<HStack spacing={0}>
				{(["video", "gallery"] as MediaMode[]).map((m) => {
					const isActive = mode === m;
					return (
						<Button
							key={m}
							onClick={() => onSelect(m)}
							size="sm"
							borderRadius="full"
							px={5}
							py={2}
							h="auto"
							fontFamily="body"
							fontSize={{ base: "xs", md: "sm" }}
							fontWeight={isActive ? 600 : 400}
							letterSpacing="wide"
							bg={isActive ? "primary.500" : "transparent"}
							color={isActive ? "gray.900" : "whiteAlpha.800"}
							_hover={{
								bg: isActive ? "primary.400" : "whiteAlpha.200",
								color: isActive ? "gray.900" : "white",
							}}
							_active={{
								bg: isActive ? "primary.600" : "whiteAlpha.300",
							}}
							transition="all 0.2s ease"
							aria-pressed={isActive}
						>
							{m === "gallery" ? "Our Photos" : "Watch Our Story"}
						</Button>
					);
				})}
			</HStack>
		</Box>
	);
}
