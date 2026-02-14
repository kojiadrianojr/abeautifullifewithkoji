"use client";

import { Box } from "@chakra-ui/react";

interface DecorativeGradient {
	top?: string;
	bottom?: string;
	left?: string;
	right?: string;
	width: string;
	height: string;
	color: string;
	opacity: number;
	blur: number;
}

const gradients: DecorativeGradient[] = [
	{
		top: "10%",
		left: "5%",
		width: "300px",
		height: "300px",
		color: "primary.100",
		opacity: 0.3,
		blur: 60,
	},
	{
		bottom: "15%",
		right: "8%",
		width: "400px",
		height: "400px",
		color: "secondary.100",
		opacity: 0.25,
		blur: 80,
	},
];

export function DecorativeGradients() {
	return (
		<>
			{gradients.map((gradient, index) => (
				<Box
					key={index}
					position="absolute"
					top={gradient.top}
					bottom={gradient.bottom}
					left={gradient.left}
					right={gradient.right}
					w={gradient.width}
					h={gradient.height}
					borderRadius="full"
					bg={gradient.color}
					opacity={gradient.opacity}
					filter={`blur(${gradient.blur}px)`}
					zIndex={2}
				/>
			))}
		</>
	);
}
