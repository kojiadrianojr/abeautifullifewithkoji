"use client";

import { Box, Container } from "@chakra-ui/react";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { VenueRow } from "./VenueRow";

export function DetailsSection() {
	const config = ConfigService.getConfig();
	const { venue } = config.wedding;
	const details = config.content.details;

	if (!details?.enabled) {
		return null;
	}

	const titlePrefix = details.titlePrefix ?? "The";
	const title = details.title ?? "Finer Details";

	return (
		<Box id="details" as="section" py={{ base: 12, md: 20 }} bg="gray.50">
			<Container maxW="5xl">
				<SectionTitle color="secondary.500" mb={{ base: 6, md: 8 }}>
					{titlePrefix} {title}
				</SectionTitle>

				<Box display="flex" flexDirection="column">
					<VenueRow
						type="Ceremony"
						displayName={venue.ceremony.displayName ?? venue.ceremony.name}
						locationLabel={
							venue.ceremony.locationLabel ?? venue.ceremony.address
						}
						address={venue.ceremony.address}
						googleMapsUrl={venue.ceremony.googleMapsUrl}
						time={venue.ceremony.time}
						image={venue.ceremony.image}
						imageAlt={venue.ceremony.imageAlt}
						imagePosition="left"
					/>

					<VenueRow
						type="Reception"
						displayName={venue.reception.displayName ?? venue.reception.name}
						locationLabel={
							venue.reception.locationLabel ?? venue.reception.address
						}
						address={venue.reception.address}
						googleMapsUrl={venue.reception.googleMapsUrl}
						time={venue.reception.time}
						image={venue.reception.image}
						imageAlt={venue.reception.imageAlt}
						imagePosition="right"
					/>
				</Box>
			</Container>
		</Box>
	);
}
