import { Box, Container, Skeleton, SkeletonText, SimpleGrid } from "@chakra-ui/react";

export function EntourageSkeleton() {
	return (
		<Box as="section" py={{ base: 16, md: 24 }} bg="white">
			<Container maxW="7xl">
				<Skeleton h={10} w="200px" mx="auto" mb={10} borderRadius="lg" />

				<SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} gap={6}>
					{Array.from({ length: 8 }).map((_, i) => (
						<Box key={i} textAlign="center">
							<Skeleton boxSize="100px" borderRadius="full" mx="auto" mb={3} />
							<Skeleton h={4} w="70%" mx="auto" mb={2} borderRadius="md" />
							<SkeletonText noOfLines={1} mx="auto" w="50%" />
						</Box>
					))}
				</SimpleGrid>
			</Container>
		</Box>
	);
}
