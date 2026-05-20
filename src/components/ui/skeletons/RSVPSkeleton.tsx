import { Box, Container, Skeleton, SkeletonText, VStack } from "@chakra-ui/react";

export function RSVPSkeleton() {
	return (
		<Box as="section" py={{ base: 16, md: 24 }} bg="white">
			<Container maxW="2xl">
				<Skeleton h={10} w="160px" mx="auto" mb={4} borderRadius="lg" />
				<SkeletonText noOfLines={2} spacing={3} mx="auto" w="70%" mb={10} />

				<VStack spacing={5} align="stretch">
					{Array.from({ length: 4 }).map((_, i) => (
						<Box key={i}>
							<Skeleton h={4} w="100px" mb={2} borderRadius="md" />
							<Skeleton h={10} borderRadius="lg" />
						</Box>
					))}
					<Skeleton h={12} borderRadius="full" mt={4} />
				</VStack>
			</Container>
		</Box>
	);
}
