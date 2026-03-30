"use client";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface TimelineItem {
	year: string;
	title: string;
	description: string;
}

interface MilestonesTimelineProps {
	timeline: TimelineItem[];
}

export function MilestonesTimeline({ timeline }: MilestonesTimelineProps) {
	return (
		<VStack gap={8} align="stretch">
			{timeline.map((item, index) => (
				<MotionBox
					key={index}
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: index * 0.1 }}
					viewport={{ once: true }}
				>
					<HStack
						align="start"
						gap={6}
						p={6}
						bg="white"
						borderRadius="lg"
						shadow="md"
						_hover={{ shadow: "lg" }}
						transition="all 0.3s"
					>
						{/* Year Badge */}
						<Box
							minW="80px"
							textAlign="center"
							py={2}
							px={4}
							bg="primary.500"
							color="white"
							borderRadius="full"
							fontWeight="bold"
							fontSize="lg"
						>
							{item.year}
						</Box>

						{/* Content */}
						<VStack align="start" flex={1} gap={2}>
							<Text
								fontSize="xl"
								fontWeight="bold"
								color="primary.600"
							>
								{item.title}
							</Text>
							<Text color="gray.600">
								{item.description}
							</Text>
						</VStack>
					</HStack>
				</MotionBox>
			))}
		</VStack>
	);
}
