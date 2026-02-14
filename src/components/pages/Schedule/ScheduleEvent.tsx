"use client";

import { Card, CardBody, Tag, Heading, Text, Box } from "@chakra-ui/react";

interface ScheduleEventProps {
	time: string;
	title: string;
	description: string;
}

export function ScheduleEvent({
	time,
	title,
	description,
}: ScheduleEventProps) {
	return (
		<Card
			boxShadow="md"
			transition="all 0.3s ease"
			_hover={{
				boxShadow: "xl",
				transform: "translateY(-4px)",
			}}
			borderRadius="xl"
		>
			<CardBody
				display="flex"
				flexDirection={{ base: "column", md: "row" }}
				alignItems={{ base: "flex-start", md: "center" }}
				gap={6}
				p={6}
			>
				<Box minW={{ md: 120 }}>
					<Tag
						size="lg"
						colorScheme="secondary"
						fontSize="xl"
						fontWeight="bold"
						py={3}
						px={4}
					>
						{time}
					</Tag>
				</Box>

				<Box
					flex={1}
					borderTop={{ base: "2px solid", md: "none" }}
					borderLeft={{ base: "none", md: "2px solid" }}
					borderColor="primary.500"
					pt={{ base: 4, md: 0 }}
					pl={{ base: 0, md: 6 }}
				>
					<Heading as="h3" size="md" mb={2} fontWeight="semibold">
						{title}
					</Heading>
					<Text color="gray.600">{description}</Text>
				</Box>
			</CardBody>
		</Card>
	);
}
