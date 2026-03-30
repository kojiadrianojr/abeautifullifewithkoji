"use client";

import { useState } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

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
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

	const toggleExpand = (index: number) => {
		setExpandedIndex(expandedIndex === index ? null : index);
	};

	return (
		<VStack gap={4} align="stretch">
			{timeline.map((item, index) => {
				const isExpanded = expandedIndex === index;
				
				return (
					<MotionBox
						key={index}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
						viewport={{ once: true }}
					>
						<Box
							bg="white"
							borderRadius="lg"
							shadow="md"
							_hover={{ shadow: "lg" }}
							transition="all 0.3s"
							overflow="hidden"
						>
							{/* Clickable Header */}
							<HStack
								as="button"
								onClick={() => toggleExpand(index)}
								w="full"
								align="center"
								gap={4}
								p={4}
								cursor="pointer"
								_hover={{ bg: "gray.50" }}
								transition="all 0.2s"
							>
								{/* Year Pill */}
								<Box
									minW="80px"
									textAlign="center"
									py={1.5}
									px={3}
									bg="primary.500"
									color="white"
									borderRadius="full"
									fontWeight="bold"
									fontSize="sm"
									flexShrink={0}
								>
									{item.year}
								</Box>

								{/* Title */}
								<Text
									fontSize="lg"
									fontWeight="semibold"
									color="primary.600"
									flex={1}
									textAlign="left"
								>
									{item.title}
								</Text>

								{/* Expand/Collapse Icon */}
								<Box color="primary.500" flexShrink={0}>
									{isExpanded ? (
										<ChevronUpIcon boxSize={6} />
									) : (
										<ChevronDownIcon boxSize={6} />
									)}
								</Box>
							</HStack>

							{/* Expandable Description */}
							<AnimatePresence>
								{isExpanded && (
									<MotionBox
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.3 }}
									>
										<Box
											px={4}
											pb={4}
											pt={2}
											borderTop="1px"
											borderColor="gray.100"
										>
											<Text color="gray.600" lineHeight="1.7">
												{item.description}
											</Text>
										</Box>
									</MotionBox>
								)}
							</AnimatePresence>
						</Box>
					</MotionBox>
				);
			})}
		</VStack>
	);
}
