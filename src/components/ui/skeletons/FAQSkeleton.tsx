import { Box, Container, Skeleton, SkeletonText, VStack } from "@chakra-ui/react";

export function FAQSkeleton() {
	return (
		<Box as="section" py={{ base: 16, md: 24 }} bg="gray.50">
			<Container maxW="3xl">
				<Skeleton h={10} w="160px" mx="auto" mb={10} borderRadius="lg" />

				<VStack spacing={4} align="stretch">
					{Array.from({ length: 5 }).map((_, i) => (
						<Box key={i} p={5} bg="white" borderRadius="xl" boxShadow="sm">
							<Skeleton h={5} w="80%" mb={3} borderRadius="md" />
							<SkeletonText noOfLines={2} spacing={2} />
						</Box>
					))}
				</VStack>
			</Container>
		</Box>
	);
}
