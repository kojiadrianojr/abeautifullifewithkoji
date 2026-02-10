import { Box } from "@chakra-ui/react";

interface HeroBackgroundProps {
	backgroundImage?: string;
}

export function HeroBackground({
	backgroundImage = "/images/hero-bg.jpg",
}: HeroBackgroundProps) {
	return (
		<>
			{/* Hero background image */}
			<Box
				position="absolute"
				inset={0}
				bgImage={`url(${backgroundImage})`}
				bgSize="cover"
				bgPosition="center"
				bgRepeat="no-repeat"
				zIndex={0}
			/>

			{/* Decorative gradient accents */}
			<Box
				position="absolute"
				top="10%"
				left="5%"
				w="300px"
				h="300px"
				borderRadius="full"
				bg="primary.100"
				opacity={0.3}
				filter="blur(60px)"
				zIndex={2}
			/>
			<Box
				position="absolute"
				bottom="15%"
				right="8%"
				w="400px"
				h="400px"
				borderRadius="full"
				bg="secondary.100"
				opacity={0.25}
				filter="blur(80px)"
				zIndex={2}
			/>
		</>
	);
}
