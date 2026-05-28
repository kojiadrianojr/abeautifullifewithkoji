"use client";

import { Box, Container, Text, VStack } from "@chakra-ui/react";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GuestSearch } from "./GuestSearch";
import { getAssetPath } from "@/lib/asset-path";

export function RSVPSection() {
	const config = ConfigService.getConfig();
	const { rsvp } = config.content;
	const rsvpBgPath = getAssetPath("/images/assets/RSVP-bg.webp");

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
				<Box
					bg="rgba(255, 255, 255, 0.55)"
					backdropFilter="blur(10px)"
					borderRadius="3xl"
					boxShadow="0 4px 32px rgba(195,177,225,0.15), 0 1px 8px rgba(0,0,0,0.05)"
					border="1px solid rgba(255,255,255,0.7)"
					px={{ base: 6, md: 10 }}
					py={{ base: 8, md: 12 }}
				>
					<VStack spacing={5}>
						<SectionTitle color="secondary.600">{rsvp.title}</SectionTitle>
						<Text
							fontSize={{ base: "md", md: "lg" }}
							textAlign="center"
							fontWeight={500}
							color="gray.700"
							maxW="lg"
						>
							{rsvp.message.split("July 14th, 2026").map((part, i, arr) =>
								i < arr.length - 1 ? (
									// eslint-disable-next-line react/no-array-index-key
									<span key={i}>
										{part}
										<Text as="span" fontWeight={700} textDecoration="underline">
											July 14th, 2026
										</Text>
									</span>
								) : (
									part
								)
							)}
						</Text>

						{/* Guest Search Component */}
						<Box w="100%" pt={3}>
							<GuestSearch formUrl={rsvp.formUrl} />
						</Box>

						<Text
							fontSize="sm"
							textAlign="center"
							color="gray.500"
						>
							Can&apos;t make it? Please let us know so we can plan accordingly.
						</Text>
					</VStack>
				</Box>
			</Container>
		</Box>
	);
}
