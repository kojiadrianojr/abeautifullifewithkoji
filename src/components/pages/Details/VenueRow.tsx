"use client";

import { Box, Flex, VStack } from "@chakra-ui/react";
import { VenueTypography, VenueActions } from "./VenueDetailBlock";
import { VenueImageSlot } from "./VenueImageSlot";

interface VenueRowProps {
	type: string;
	displayName: string;
	locationLabel: string;
	address: string;
	googleMapsUrl: string;
	time?: string;
	image?: string;
	imageAlt?: string;
	imagePosition: "left" | "right";
}

const detailsBg = "#f7fafc";

export function VenueRow({
	type,
	displayName,
	locationLabel,
	address,
	googleMapsUrl,
	time,
	image,
	imageAlt,
	imagePosition,
}: VenueRowProps) {
	const isImageLeft = imagePosition === "left";
	const textAlign = isImageLeft ? "left" : "right";

	const imageBlock = (
		<Box
			flexShrink={0}
			w={{ base: "full", md: "440px", lg: "500px" }}
			maxW={{ base: "400px", md: "500px" }}
			mx={{ base: "auto", md: "unset" }}
			bg={detailsBg}
		>
			<VenueImageSlot label={type} src={image} alt={imageAlt} />
		</Box>
	);

	const textBlock = (
		<VStack
			spacing={3}
			align={{ base: "center", md: textAlign === "left" ? "flex-start" : "flex-end" }}
			flexShrink={0}
			minW={0}
			maxW={{ base: "340px", md: "320px" }}
			mx={{ base: "auto", md: "unset" }}
			w={{ base: "full", md: "auto" }}
		>
			<VenueTypography
				type={type}
				displayName={displayName}
				locationLabel={locationLabel}
				time={time}
				textAlign={textAlign}
			/>
			<VenueActions
				type={type}
				address={address}
				googleMapsUrl={googleMapsUrl}
				textAlign={textAlign}
			/>
		</VStack>
	);

	const imageColumn = (
		<Flex
			flex={{ md: 1 }}
			w={{ base: "full", md: "50%" }}
			align="center"
			justify={{ base: "center", md: isImageLeft ? "flex-end" : "flex-start" }}
			order={{ base: 2, md: "unset" }}
			px={{ md: 2 }}
		>
			{imageBlock}
		</Flex>
	);

	const textColumn = (
		<Flex
			flex={{ md: 1 }}
			w={{ base: "full", md: "50%" }}
			align="center"
			justify={{ base: "center", md: isImageLeft ? "flex-start" : "flex-end" }}
			order={{ base: 1, md: "unset" }}
			px={{ md: 2 }}
		>
			{textBlock}
		</Flex>
	);

	return (
		<Flex
			direction={{ base: "column", md: "row" }}
			align="center"
			w="full"
			gap={{ base: 4, md: 8, lg: 10 }}
			py={{ base: 4, md: 5 }}
		>
			{isImageLeft ? (
				<>
					{imageColumn}
					{textColumn}
				</>
			) : (
				<>
					{textColumn}
					{imageColumn}
				</>
			)}
		</Flex>
	);
}
