"use client";

import { Box, Container, VStack } from "@chakra-ui/react";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScheduleEvent } from "./ScheduleEvent";

export function ScheduleSection() {
	const config = ConfigService.getConfig();
	const { schedule } = config.content;

	return (
		<Box id="schedule" as="section" py={{ base: 16, md: 24 }}>
			<Container maxW="3xl">
				<SectionTitle color="primary.500" mb={16}>
					{schedule.title}
				</SectionTitle>

				<VStack spacing={6} align="stretch">
					{schedule.events.map((event, index) => (
						<ScheduleEvent
							key={index}
							time={event.time}
							title={event.title}
							description={event.description}
						/>
					))}
				</VStack>
			</Container>
		</Box>
	);
}
