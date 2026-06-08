import { Box, Container, Skeleton, SkeletonText, VStack, HStack } from "@chakra-ui/react";

export function DetailsSkeleton() {
	return (
		<Box as="section" py={{ base: 12, md: 20 }} bg="gray.50">
			<Container maxW="7xl">
				<Skeleton h={10} w="220px" mx="auto" mb={10} borderRadius="lg" />

				<VStack spacing={8} align="stretch">
					{Array.from({ length: 2 }).map((_, i) => (
						<Box key={i} p={8} bg="gray.50" borderRadius="2xl">
							<HStack spacing={4} mb={4}>
								<Skeleton boxSize={10} borderRadius="lg" />
								<Skeleton h={6} w="200px" borderRadius="md" />
							</HStack>
							<SkeletonText noOfLines={3} spacing={3} />
						</Box>
					))}
				</VStack>
			</Container>
		</Box>
	);
}
