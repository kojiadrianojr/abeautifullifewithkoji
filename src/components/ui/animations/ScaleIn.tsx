"use client";

import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const MotionBox = motion.create(Box);

interface ScaleInProps {
	children: ReactNode;
	delay?: number;
	duration?: number;
	mounted?: boolean;
}

export function ScaleIn({
	children,
	delay = 0,
	duration = 1.2,
	mounted = true,
}: ScaleInProps) {
	return (
		<MotionBox
			initial={{ scale: 0.8, opacity: 0 }}
			animate={mounted ? { scale: 1, opacity: 1 } : {}}
			transition={{ duration, delay }}
		>
			{children}
		</MotionBox>
	);
}
