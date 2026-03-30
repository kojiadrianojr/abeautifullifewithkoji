"use client";

import { Box, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface QAItem {
	question: string;
	answer: string;
}

interface QASectionProps {
	questions: QAItem[];
}

export function QASection({ questions }: QASectionProps) {
	return (
		<SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
			{questions.map((item, index) => (
				<MotionBox
					key={index}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: index * 0.1 }}
					viewport={{ once: true }}
				>
					<Box
						p={6}
						bg="white"
						borderRadius="lg"
						shadow="md"
						_hover={{ shadow: "lg", transform: "translateY(-2px)" }}
						transition="all 0.3s"
						height="100%"
					>
						<VStack align="start" gap={3}>
							<Text
								fontSize="lg"
								fontWeight="bold"
								color="primary.600"
								lineHeight="tall"
							>
								{item.question}
							</Text>
							<Text color="gray.600" lineHeight="tall">
								{item.answer}
							</Text>
						</VStack>
					</Box>
				</MotionBox>
			))}
		</SimpleGrid>
	);
}
