"use client";

import { Box, Flex } from "@chakra-ui/react";

export function DecorativeDivider() {
	return (
		<Flex align="center" justify="center" w="100%" my={4}>
			<Box flex={1} height="1px" bg="gold.400" opacity={0.3} />
			<Box mx={4}>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
						fill="currentColor"
						opacity="0.6"
						style={{ color: "var(--chakra-colors-gold-500)" }}
					/>
					<circle
						cx="12"
						cy="10"
						r="2"
						fill="currentColor"
						opacity="0.8"
						style={{ color: "var(--chakra-colors-gold-500)" }}
					/>
				</svg>
			</Box>
			<Box flex={1} height="1px" bg="gold.400" opacity={0.3} />
		</Flex>
	);
}
