import { Box, Container, Skeleton, VStack } from "@chakra-ui/react";

export function EntourageSkeleton() {
	return (
		<Box as="section" py={{ base: 14, md: 20 }} bg="gray.50">
			<Container maxW="5xl">
				<Skeleton h={10} w="240px" mx="auto" mb={4} borderRadius="md" />
				<Skeleton h={4} w="120px" mx="auto" mb={10} borderRadius="md" />

				<VStack spacing={10} align="stretch">
					{Array.from({ length: 4 }).map((_, i) => (
						<Box key={i}>
							<Skeleton h={5} w="180px" mx="auto" mb={5} borderRadius="md" />
							<Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={8}>
								<VStack spacing={2}>
									<Skeleton h={3} w="90px" borderRadius="md" />
									<Skeleton h={4} w="160px" borderRadius="md" />
									<Skeleton h={4} w="140px" borderRadius="md" />
								</VStack>
								<VStack spacing={2}>
									<Skeleton h={3} w="90px" borderRadius="md" />
									<Skeleton h={4} w="160px" borderRadius="md" />
									<Skeleton h={4} w="140px" borderRadius="md" />
								</VStack>
							</Box>
						</Box>
					))}
				</VStack>
			</Container>
		</Box>
	);
}
