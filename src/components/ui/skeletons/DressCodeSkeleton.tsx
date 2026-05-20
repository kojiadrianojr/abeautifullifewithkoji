import { Box, Container, Skeleton, SimpleGrid } from "@chakra-ui/react";

export function DressCodeSkeleton() {
	return (
		<Box as="section" py={{ base: 16, md: 24 }} bg="gray.50">
			<Container maxW="7xl">
				<Skeleton h={10} w="220px" mx="auto" mb={10} borderRadius="lg" />

				<SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} gap={4}>
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} aspectRatio={3 / 4} borderRadius="2xl" h="280px" />
					))}
				</SimpleGrid>
			</Container>
		</Box>
	);
}
