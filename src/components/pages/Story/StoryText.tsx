"use client";

import { Box, Text } from "@chakra-ui/react";
import { TimelineCard } from "@/components/ui/TimelineCard";

interface TimelineItem {
	year: string;
	title: string;
	description: string;
}

interface StoryTextProps {
	content: string;
	timeline: TimelineItem[];
}

export function StoryText({ content, timeline }: StoryTextProps) {
	return (
		<Box>
			<Text
				fontSize={{ base: "lg", md: "xl" }}
				textAlign={{ base: "center", lg: "left" }}
				mb={12}
				lineHeight={1.8}
				color="gray.600"
			>
				{content}
			</Text>

			{/* Timeline */}
			<Box>
				{timeline.map((item, index) => (
					<Box key={index} mb={8}>
						<TimelineCard
							year={item.year}
							title={item.title}
							description={item.description}
						/>
					</Box>
				))}
			</Box>
		</Box>
	);
}
