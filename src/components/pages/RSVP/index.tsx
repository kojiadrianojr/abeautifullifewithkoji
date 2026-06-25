"use client";

import { Box, Container, Text, VStack } from "@chakra-ui/react";
import { ConfigService, DateService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GuestSearch } from "./GuestSearch";
import { getAssetPath } from "@/lib/asset-path";
import { RSVPDivider, RSVPNoteText, RSVPStepsGuide } from "./RSVPPrimitives";

export function RSVPSection() {
	const config = ConfigService.getConfig();
	const { rsvp } = config.content;
	const rsvpBgPath = getAssetPath("/images/assets/RSVP-bg.webp");
	const deadlineDate = DateService.formatDate(rsvp.deadline, {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<Box
			id="rsvp"
			as="section"
			py={{ base: 14, md: 20 }}
			position="relative"
			overflow="hidden"
		>
			<Box
				position="absolute"
				inset={0}
				bgImage={`url(${rsvpBgPath})`}
				bgSize="cover"
				bgPosition="center"
				bgRepeat="no-repeat"
			/>

			<Box
				position="absolute"
				inset={0}
				background="radial-gradient(ellipse at 20% 40%, rgba(195,177,225,0.25) 0%, transparent 55%), radial-gradient(ellipse at 80% 60%, rgba(245,202,195,0.25) 0%, transparent 55%), linear-gradient(180deg, rgba(255,250,240,0.3) 0%, rgba(255,250,240,0.1) 100%)"
				pointerEvents="none"
			/>

			<Container maxW="2xl" position="relative" zIndex={1}>
				<Box
					bg="rgba(255, 255, 255, 0.65)"
					backdropFilter="blur(12px)"
					borderRadius="3xl"
					boxShadow="0 4px 32px rgba(195,177,225,0.2), 0 1px 8px rgba(0,0,0,0.05)"
					border="1.5px solid"
					borderColor="purple.100"
					px={{ base: 5, md: 8 }}
					py={{ base: 7, md: 10 }}
				>
					<VStack spacing={5}>
						<VStack spacing={3} align="center" w="100%">
							<SectionTitle
								color="secondary.600"
								mb={0}
								subtitle="Let us know if you can join us."
							>
								{rsvp.title}
							</SectionTitle>

							<Text
								fontFamily="body"
								fontSize={{ base: "lg", md: "xl" }}
								textAlign="center"
								fontWeight={500}
								color="gray.700"
								maxW="lg"
								lineHeight="tall"
							>
								Please reply by{" "}
								<Text as="span" fontWeight="bold" color="secondary.600">
									{deadlineDate}
								</Text>
							</Text>
						</VStack>

						<RSVPStepsGuide
							steps={[
								'Type your name below, then tap "Look Up My Name".',
								"Fill out the short form that opens.",
							]}
						/>

						<RSVPDivider />

						<Box w="100%">
							<GuestSearch formUrl={rsvp.formUrl} />
						</Box>

						<RSVPNoteText>
							Can&apos;t come? Please still let us know so we can plan ahead.
						</RSVPNoteText>
					</VStack>
				</Box>
			</Container>
		</Box>
	);
}
