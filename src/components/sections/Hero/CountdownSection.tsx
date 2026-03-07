import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Countdown from "@/components/Countdown";

const MotionBox = motion.create(Box);

interface CountdownSectionProps {
	mounted: boolean;
}

export function CountdownSection({ mounted }: CountdownSectionProps) {
	return (
		<MotionBox
			w="full"
			initial={{ opacity: 0, y: 20 }}
			animate={mounted ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 1, delay: 0.3 }}
		>
			<Box
				bg="rgba(195, 177, 225, 0.2)"
				backdropFilter="blur(10px)"
				borderRadius="3xl"
				p={{ base: 6, md: 8 }}
				border="2px solid"
				borderColor="primary.200"
				boxShadow="0 8px 32px rgba(195, 177, 225, 0.3)"
				position="relative"
				overflow="hidden"
				_before={{
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "100%",
					bgGradient: "linear(to-br, accent.100, secondary.100, primary.100)",
					opacity: 0.3,
					zIndex: -1,
				}}
			>
				<Countdown />
			</Box>
		</MotionBox>
	);
}
