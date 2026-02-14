"use client";

import { Box, Container, Heading, Text, Button } from "@chakra-ui/react";
import { FiAlertCircle } from "react-icons/fi";

interface ErrorMessageProps {
	title?: string;
	message: string;
	onRetry?: () => void;
}

export function ErrorMessage({
	title = "Something went wrong",
	message,
	onRetry,
}: ErrorMessageProps) {
	return (
		<Container maxW="2xl" py={16}>
			<Box textAlign="center">
				<Box
					as={FiAlertCircle}
					fontSize="6xl"
					color="red.500"
					mb={4}
					mx="auto"
				/>
				<Heading as="h2" size="lg" mb={4} color="gray.800">
					{title}
				</Heading>
				<Text color="gray.600" mb={6}>
					{message}
				</Text>
				{onRetry && (
					<Button colorScheme="primary" onClick={onRetry}>
						Try Again
					</Button>
				)}
			</Box>
		</Container>
	);
}
