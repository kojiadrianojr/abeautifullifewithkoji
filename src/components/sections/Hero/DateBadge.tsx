import { Box } from "@chakra-ui/react";
import { formatWeddingDate } from "@/lib/config";

export function DateBadge() {
	return (
		<Box
			position="absolute"
			top={8}
			right={8}
			bg="linear-gradient(135deg, primary.400, secondary.300)"
			color="white"
			px={5}
			py={2.5}
			borderRadius="full"
			fontSize="sm"
			fontWeight="bold"
			letterSpacing="wide"
			boxShadow="0 4px 15px rgba(195, 177, 225, 0.4)"
			textTransform="uppercase"
			border="2px solid"
			borderColor="whiteAlpha.400"
		>
			{formatWeddingDate()}
		</Box>
	);
}
