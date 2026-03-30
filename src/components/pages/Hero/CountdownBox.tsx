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
				<Countdown />
			</Box>
		</FadeIn>
	);
}
