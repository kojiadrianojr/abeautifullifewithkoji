"use client";

import { Box, Container, VStack } from "@chakra-ui/react";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScheduleEvent } from "./ScheduleEvent";

export function ScheduleSection() {
	const config = ConfigService.getConfig();
	const { schedule } = config.content;

	return (
		<Box
			id="schedule"
			as="section"
			py={{ base: 16, md: 24 }}
			position="relative"
			className="schedule-pattern"
			sx={{ bg: "var(--color-background)" }}
		>
			<Container maxW="5xl" position="relative" zIndex={1}>
				<SectionTitle color="secondary.500" mb={20}>
					{schedule.title}
				</SectionTitle>

				<VStack spacing={{ base: 16, md: 20 }} align="stretch" py={8}>
					{schedule.events.map((event, index) => (
						<ScheduleEvent
							key={index}
							index={index}
							time={event.time}
							title={event.title}
							description={event.description}
							isFirst={index === 0}
							isLast={index === schedule.events.length - 1}
						/>
					))}
				</VStack>
			</Container>
		</Box>
	);
}
