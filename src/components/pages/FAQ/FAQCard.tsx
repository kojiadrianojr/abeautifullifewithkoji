"use client";

import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { linkifyText } from "@/lib/linkify";

const MotionBox = motion.create(Box);

interface FAQCardProps {
	question: string;
	answer: string;
	index: number;
}

export function FAQCard({ question, answer, index }: FAQCardProps) {
	return (
		<MotionBox
			initial={{ opacity: 0, y: 8 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-30px" }}
			transition={{
				duration: 0.4,
				delay: Math.min(index * 0.04, 0.2),
				ease: [0.22, 1, 0.36, 1],
			}}
			w="100%"
			minW={0}
			maxW="100%"
			bg="white"
			borderRadius="lg"
			border="1px solid"
			borderColor="gray.100"
			borderLeft="2px solid"
			borderLeftColor="primary.300"
			px={{ base: 4, md: 5 }}
			py={{ base: 3.5, md: 4 }}
			css={{ transition: "border-color 0.2s ease" }}
			_hover={{ borderColor: "gray.200", borderLeftColor: "primary.400" }}
		>
			<Text
				as="h3"
				fontFamily="display"
				fontSize={{ base: "sm", md: "md" }}
				fontWeight="500"
				color="secondary.600"
				lineHeight="1.4"
				letterSpacing="0.01em"
				wordBreak="break-word"
				overflowWrap="anywhere"
				mb={2}
			>
				{question}
			</Text>

			<Box w="28px" h="1px" bg="primary.400" opacity={0.65} mb={2.5} />

			<Text
				color="gray.500"
				fontSize="sm"
				lineHeight="1.65"
				whiteSpace="pre-line"
				fontFamily="body"
				wordBreak="break-word"
				overflowWrap="anywhere"
			>
				{linkifyText(answer)}
			</Text>
		</MotionBox>
	);
}
