import { Box, Container, Skeleton, SkeletonText, SimpleGrid } from "@chakra-ui/react";

export function ScheduleSkeleton() {
	return (
		<Box as="section" py={{ base: 16, md: 24 }}>
			<Container maxW="7xl">
				<Skeleton h={10} w="200px" mx="auto" mb={10} borderRadius="lg" />

				<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
					{Array.from({ length: 4 }).map((_, i) => (
						<Box key={i} p={6} bg="white" borderRadius="2xl" boxShadow="sm">
							<Skeleton h={5} w="60%" mb={3} borderRadius="md" />
							<SkeletonText noOfLines={3} spacing={2} />
						</Box>
					))}
				</SimpleGrid>
			</Container>
		</Box>
	);
}
