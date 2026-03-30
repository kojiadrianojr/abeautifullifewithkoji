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
			bg="#faf8f5"
			_before={{
				content: '""',
				position: "absolute",
				inset: 0,
				backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4668C' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
				opacity: 0.4,
				pointerEvents: "none",
			}}
		>
			<Container maxW="5xl" position="relative" zIndex={1}>
				<SectionTitle color="primary.500" mb={20}>
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
