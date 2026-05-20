import { Box, Container, Skeleton, SkeletonText, VStack } from "@chakra-ui/react";

export function HeroSkeleton() {
	return (
		<Box
			as="section"
			minH="100vh"
			display="flex"
			alignItems="center"
			justifyContent="center"
			bg="gray.50"
		>
			<Container maxW="7xl" px={4} py={20}>
				<Box
					display="flex"
					flexDirection={{ base: "column", lg: "row" }}
					gap={{ base: 12, lg: 16 }}
					alignItems="center"
					justifyContent="center"
				>
					{/* Text side */}
					<VStack spacing={6} align={{ base: "center", lg: "flex-start" }} flex={1}>
						<Skeleton h={4} w="120px" borderRadius="full" />
						<Skeleton h={14} w={{ base: "80%", lg: "70%" }} borderRadius="lg" />
						<Skeleton h={10} w={{ base: "60%", lg: "50%" }} borderRadius="lg" />
						<SkeletonText noOfLines={2} spacing={3} w={{ base: "100%", lg: "80%" }} />
						<Skeleton h={16} w="280px" borderRadius="xl" />
					</VStack>

					{/* Image side */}
					<Box flex="0 0 45%" maxW={{ base: "100%", md: "500px" }} w="100%">
						<Skeleton
							h={{ base: "400px", md: "550px" }}
							borderRadius="2xl"
							w="90%"
							mx="auto"
						/>
					</Box>
				</Box>
			</Container>
		</Box>
	);
}
