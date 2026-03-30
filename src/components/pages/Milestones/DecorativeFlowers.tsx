"use client";

import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export function DecorativeFlowers() {
	return (
		<>
			{/* Top Left Flower */}
			<MotionBox
				position="absolute"
				top="10%"
				left="-5%"
				fontSize="8xl"
				opacity={0.1}
				initial={{ rotate: 0 }}
				animate={{ rotate: 360 }}
				transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
			>
				🌸
			</MotionBox>

			{/* Top Right Flower */}
			<MotionBox
				position="absolute"
				top="20%"
				right="-3%"
				fontSize="6xl"
				opacity={0.1}
				initial={{ rotate: 0 }}
				animate={{ rotate: -360 }}
				transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
			>
				🌺
			</MotionBox>

			{/* Bottom Left Flower */}
			<MotionBox
				position="absolute"
				bottom="15%"
				left="5%"
				fontSize="7xl"
				opacity={0.1}
				initial={{ rotate: 0 }}
				animate={{ rotate: 360 }}
				transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
			>
				🌼
			</MotionBox>

			{/* Bottom Right Flower */}
			<MotionBox
				position="absolute"
				bottom="10%"
				right="3%"
				fontSize="5xl"
				opacity={0.1}
				initial={{ rotate: 0 }}
				animate={{ rotate: -360 }}
				transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
			>
				🌷
			</MotionBox>
		</>
	);
}
