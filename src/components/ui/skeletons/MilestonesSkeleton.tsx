import { Box, Container, Divider, Skeleton, SkeletonText, VStack, HStack } from "@chakra-ui/react";

export function MilestonesSkeleton() {
	return (
		<Box as="section" py={{ base: 16, md: 24 }} bg="gray.50">
			<Container maxW="7xl">
				<Skeleton h={10} w="280px" mx="auto" mb={4} borderRadius="lg" />
				<Divider w={100} h={1} mx="auto" mb={16} border="none" bg="gray.200" />

				<VStack gap={16} align="stretch">
					{/* Timeline placeholder */}
					<Box>
						<Skeleton h={8} w="200px" mx="auto" mb={8} borderRadius="lg" />
						<VStack spacing={8} align="stretch">
							{Array.from({ length: 3 }).map((_, i) => (
								<HStack key={i} spacing={6} align="flex-start">
									<Skeleton boxSize={12} borderRadius="full" flexShrink={0} />
									<Box flex={1}>
										<Skeleton h={5} w="40%" mb={2} borderRadius="md" />
										<SkeletonText noOfLines={2} spacing={2} />
									</Box>
								</HStack>
							))}
						</VStack>
					</Box>

					{/* Photo grid placeholder */}
					<Box>
						<Skeleton h={8} w="220px" mx="auto" mb={8} borderRadius="lg" />
						<Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
							{Array.from({ length: 6 }).map((_, i) => (
								<Skeleton key={i} h="200px" borderRadius="xl" />
							))}
						</Box>
					</Box>
				</VStack>
			</Container>
		</Box>
	);
}
