"use client";

import { useState } from "react";
import { Box, SimpleGrid, Text, VStack, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { QuestionIcon, InfoIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);

interface QAItem {
	question: string;
	answer: string;
}

interface QASectionProps {
	questions: QAItem[];
}

interface FlipCardProps {
	question: string;
	answer: string;
	index: number;
}

function FlipCard({ question, answer, index }: FlipCardProps) {
	const [isFlipped, setIsFlipped] = useState(false);

	return (
		<MotionBox
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			viewport={{ once: true }}
			style={{ perspective: "1000px" }}
			minH="240px"
		>
			<Box
				position="relative"
				w="full"
				h="full"
				minH="240px"
				cursor="pointer"
				onClick={() => setIsFlipped(!isFlipped)}
				style={{
					transformStyle: "preserve-3d",
					transition: "transform 0.6s",
					transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
				}}
			>
				{/* Front Face - Question */}
				<Box
					position="absolute"
					w="full"
					h="full"
					minH="240px"
					p={6}
					bg="white"
					borderRadius="lg"
					shadow="md"
					_hover={{ shadow: "xl" }}
					transition="all 0.3s"
					style={{
						backfaceVisibility: "hidden",
						WebkitBackfaceVisibility: "hidden",
					}}
					border="2px solid"
					borderColor="primary.200"
				>
					<VStack h="full" justify="center" align="center" gap={4}>
						<Icon
							as={QuestionIcon}
							boxSize={8}
							color="primary.500"
						/>
						<Text
							fontSize="lg"
							fontWeight="bold"
							color="primary.600"
							textAlign="center"
							lineHeight="tall"
						>
							{question}
						</Text>
						{/* <Text
							fontSize="sm"
							color="gray.500"
							fontStyle="italic"
							mt={4}
						>
							Click to reveal answer
						</Text> */}
					</VStack>
				</Box>

				{/* Back Face - Answer */}
				<Box
					position="absolute"
					w="full"
					h="full"
					minH="240px"
					p={6}
					bg="primary.500"
					color="white"
					borderRadius="lg"
					shadow="md"
					_hover={{ shadow: "xl" }}
					transition="all 0.3s"
					style={{
						backfaceVisibility: "hidden",
						WebkitBackfaceVisibility: "hidden",
						transform: "rotateY(180deg)",
					}}
					border="2px solid"
					borderColor="primary.600"
				>
					<VStack h="full" justify="center" align="center" gap={4}>
						<Icon
							as={InfoIcon}
							boxSize={8}
							color="white"
						/>
						<Text
							fontSize="md"
							textAlign="center"
							lineHeight="tall"
						>
							{answer}
						</Text>
						<Text
							fontSize="sm"
							opacity={0.8}
							fontStyle="italic"
							mt={4}
						>
							Click to see question
						</Text>
					</VStack>
				</Box>
			</Box>
		</MotionBox>
	);
}

export function QASection({ questions }: QASectionProps) {
	return (
		<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
			{questions.map((item, index) => (
				<FlipCard
					key={index}
					question={item.question}
					answer={item.answer}
					index={index}
				/>
			))}
		</SimpleGrid>
	);
}
