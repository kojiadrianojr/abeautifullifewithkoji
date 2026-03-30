"use client";

import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { VenueCard } from "./VenueCard";

export function DetailsSection() {
	const config = ConfigService.getConfig();
	const { venue } = config.wedding;

	if (!config.content.details?.enabled) {
		return null;
	}

	return (
		<Box id="details" as="section" py={{ base: 16, md: 24 }} bg="accent.50">
			<Container maxW="6xl">
				<SectionTitle color="primary.500" mb={16}>
					{config.content.details.title || "Venue Details"}
				</SectionTitle>

				<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
					<VenueCard
						type="Ceremony"
						name={venue.ceremony.name}
						address={venue.ceremony.address}
						googleMapsUrl={venue.ceremony.googleMapsUrl}
					/>
					<VenueCard
						type="Reception"
						name={venue.reception.name}
						address={venue.reception.address}
						googleMapsUrl={venue.reception.googleMapsUrl}
					/>
				</SimpleGrid>
			</Container>
		</Box>
	);
}
