"use client";

import { Box, Divider } from "@chakra-ui/react";

interface SectionDividerProps {
	variant?: "subtle" | "gradient" | "none";
}

export function SectionDivider({ variant = "subtle" }: SectionDividerProps) {
	if (variant === "none") return null;

	if (variant === "gradient") {
		return (
			<Divider
				w={100}
				h={1}
				mx="auto"
				my={8}
				borderRadius="md"
				bgGradient="linear(to-r, pink.500, orange.400, pink.500)"
				border="none"
			/>
		);
	}

	return <Box h={4} />;
}
