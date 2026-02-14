"use client";

import { Box } from "@chakra-ui/react";

const decorativeElements = [
	{ icon: "🌸", position: { top: 10, right: 10 } },
	{ icon: "🌺", position: { bottom: 10, left: 10 } },
];

export function DecorativeFlowers() {
	return (
		<>
			{decorativeElements.map((element, index) => (
				<Box
					key={index}
					position="absolute"
					top={element.position.top}
					right={element.position.right}
					bottom={element.position.bottom}
					left={element.position.left}
					fontSize="6xl"
					opacity={0.1}
				>
					{element.icon}
				</Box>
			))}
		</>
	);
}
