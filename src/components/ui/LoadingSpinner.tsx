"use client";

import { Box, Text, Flex } from "@chakra-ui/react";

interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg";
	message?: string;
}

export function LoadingSpinner({ size = "md", message }: LoadingSpinnerProps) {
	const sizeMap = {
		sm: "30px",
		md: "50px",
		lg: "70px",
	};

	return (
		<Flex
			direction="column"
			align="center"
			justify="center"
			minH="200px"
			gap={4}
		>
			<Box
				w={sizeMap[size]}
				h={sizeMap[size]}
				border="4px solid"
				borderColor="primary.200"
				borderTopColor="primary.500"
				borderRadius="full"
				animation="spin 1s linear infinite"
				sx={{
					"@keyframes spin": {
						"0%": { transform: "rotate(0deg)" },
						"100%": { transform: "rotate(360deg)" },
					},
				}}
			/>
			{message && (
				<Text color="gray.600" fontSize="sm">
					{message}
				</Text>
			)}
		</Flex>
	);
}
