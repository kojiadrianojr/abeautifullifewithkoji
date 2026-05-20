"use client";

import { Box } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

const MotionBox = motion.create(Box);

interface FadeInProps {
	children: ReactNode;
	delay?: number;
	duration?: number;
	direction?: "up" | "down" | "left" | "right" | "none";
	mounted?: boolean;
}

export function FadeIn({
	children,
	delay = 0,
	duration = 1,
	direction = "up",
	mounted = true,
}: FadeInProps) {
	const prefersReducedMotion = useReducedMotion();

	const getInitialPosition = () => {
		if (prefersReducedMotion) return { opacity: 0 };
		switch (direction) {
			case "up":
				return { y: 20, opacity: 0 };
			case "down":
				return { y: -20, opacity: 0 };
			case "left":
				return { x: 30, opacity: 0 };
			case "right":
				return { x: -30, opacity: 0 };
			case "none":
			default:
				return { opacity: 0 };
		}
	};

	const getAnimatePosition = () => {
		if (prefersReducedMotion) return { opacity: 1 };
		switch (direction) {
			case "up":
			case "down":
				return { y: 0, opacity: 1 };
			case "left":
			case "right":
				return { x: 0, opacity: 1 };
			case "none":
			default:
				return { opacity: 1 };
		}
	};

	return (
		<MotionBox
			w="100%"
			h="100%"
			initial={getInitialPosition()}
			animate={mounted ? getAnimatePosition() : getInitialPosition()}
			transition={{ duration: prefersReducedMotion ? 0 : duration, delay: prefersReducedMotion ? 0 : delay }}
		>
			{children}
		</MotionBox>
	);
}
