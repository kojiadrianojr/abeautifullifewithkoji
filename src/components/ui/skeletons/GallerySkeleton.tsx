import { Box, Container, Skeleton, SimpleGrid } from "@chakra-ui/react";

export function GallerySkeleton() {
	return (
		<Box as="section" py={{ base: 16, md: 24 }} bg="gray.100">
			<Container maxW="7xl">
				{/* Section title */}
				<Skeleton h={10} w="200px" mx="auto" mb={10} borderRadius="lg" />

				{/* Masonry grid placeholder */}
				<SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} gap={3}>
					{Array.from({ length: 12 }).map((_, i) => (
						<Skeleton
							key={i}
							borderRadius="xl"
							style={{
								paddingBottom: ["125%", "75%", "133%", "100%", "150%", "80%", "120%", "90%"][
									i % 8
								],
							}}
						/>
					))}
				</SimpleGrid>
			</Container>
		</Box>
	);
}
