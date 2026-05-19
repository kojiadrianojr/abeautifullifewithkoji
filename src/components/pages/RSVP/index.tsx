"use client";

import { Box, Container, Text, VStack } from "@chakra-ui/react";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GuestSearch } from "./GuestSearch";
import { getAssetPath } from "@/lib/asset-path";

export function RSVPSection() {
	const config = ConfigService.getConfig();
	const { rsvp } = config.content;
	const rsvpBgPath = getAssetPath("/images/assets/RSVP-bg.png");

	return (
		<Box
			id="rsvp"
			as="section"
			py={{ base: 14, md: 20 }}
			position="relative"
			overflow="hidden"
		>
			{/* Background image */}
			<Box
				position="absolute"
				inset={0}
				bgImage={`url(${rsvpBgPath})`}
				bgSize="cover"
				bgPosition="center"
				bgRepeat="no-repeat"
			/>

			{/* Soft watercolor gradient overlay */}
			<Box
				position="absolute"
				inset={0}
				background="radial-gradient(ellipse at 20% 40%, rgba(195,177,225,0.25) 0%, transparent 55%), radial-gradient(ellipse at 80% 60%, rgba(245,202,195,0.25) 0%, transparent 55%), linear-gradient(180deg, rgba(255,250,240,0.3) 0%, rgba(255,250,240,0.1) 100%)"
				pointerEvents="none"
			/>

			<Container maxW="2xl" position="relative" zIndex={1}>
				<VStack spacing={5}>
					<SectionTitle color="primary.600">{rsvp.title}</SectionTitle>
					<Text
						fontSize={{ base: "lg", md: "xl" }}
						textAlign="center"
						fontWeight={400}
						color="gray.700"
						fontStyle="italic"
						maxW="lg"
					>
						{rsvp.message}
					</Text>

					{/* Guest Search Component */}
					<Box w="100%" pt={3}>
						<GuestSearch formUrl={rsvp.formUrl} />
					</Box>

					<Text
						fontSize="xs"
						textAlign="center"
						color="gray.700"
						fontStyle="italic"
						textShadow="0 1px 3px rgba(255,255,255,0.6)"
						textDecor="underline"
					>
						Can&apos;t make it? Please let us know so we can plan accordingly.
					</Text>
				</VStack>
			</Container>
		</Box>
	);
}
