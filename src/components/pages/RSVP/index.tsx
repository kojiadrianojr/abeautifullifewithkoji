"use client";

import { Box, Container, Text, VStack, Link } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { ConfigService, DateService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

export function RSVPSection() {
	const config = ConfigService.getConfig();
	const { rsvp } = config.content;
	const formattedDeadline = DateService.formatDate(rsvp.deadline);

	return (
		<Box
			id="rsvp"
			as="section"
			py={{ base: 16, md: 24 }}
			bg="primary.500"
			color="white"
		>
			<Container maxW="3xl">
				<VStack spacing={8}>
					<SectionTitle color="white">{rsvp.title}</SectionTitle>

					<Text
						fontSize={{ base: "xl", md: "2xl" }}
						textAlign="center"
						fontWeight={400}
					>
						{rsvp.message}
					</Text>

					<Text fontSize="lg" textAlign="center" opacity={0.9}>
						Deadline: {formattedDeadline}
					</Text>

					<Link
						href={rsvp.formUrl}
						target="_blank"
						rel="noopener noreferrer"
						_hover={{ textDecoration: "none" }}
					>
						<AnimatedButton
							size="lg"
							colorScheme="white"
							variant="solid"
							bg="white"
							color="primary.500"
							leftIcon={<EditIcon />}
							px={8}
							py={6}
							fontSize="lg"
							fontWeight="bold"
							_hover={{
								bg: "gray.100",
								boxShadow: "xl",
							}}
						>
							Fill Out RSVP Form
						</AnimatedButton>
					</Link>

					<Text fontSize="sm" textAlign="center" opacity={0.75} mt={6}>
						Can&apos;t make it? Please let us know so we can plan accordingly.
					</Text>
				</VStack>
			</Container>
		</Box>
	);
}
