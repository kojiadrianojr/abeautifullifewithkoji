"use client";

import { Box } from "@chakra-ui/react";
import { FadeIn } from "@/components/ui/animations";
import Countdown from "@/components/Countdown";

interface CountdownBoxProps {
	mounted: boolean;
}

export function CountdownBox({ mounted }: CountdownBoxProps) {
	return (
		<FadeIn delay={0.3} duration={1} direction="up" mounted={mounted}>
			<Box w="full">
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
			</Box>
		</FadeIn>
	);
}
