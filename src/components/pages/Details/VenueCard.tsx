"use client";

import {
	Box,
	Card,
	CardBody,
	Heading,
	Text,
	VStack,
	HStack,
	Button,
	useToast,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaDirections, FaCopy } from "react-icons/fa";

interface VenueCardProps {
	type: string;
	name: string;
	address: string;
	googleMapsUrl: string;
}

export function VenueCard({
	type,
	name,
	address,
	googleMapsUrl,
}: VenueCardProps) {
	const toast = useToast();

	const handleCopyAddress = async () => {
		try {
			await navigator.clipboard.writeText(address);
			toast({
				title: "Address copied!",
				description: "The address has been copied to your clipboard.",
				status: "success",
				duration: 3000,
				isClosable: true,
				position: "top",
			});
		} catch (error) {
			toast({
				title: "Failed to copy",
				description: "Please copy the address manually.",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top",
			});
		}
	};

	const handleOpenDirections = () => {
		window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
	};

	// Create a Google Maps embed URL using the address
	const getEmbedUrl = () => {
		// Use Google Maps iframe with place query (doesn't require API key)
		const encodedAddress = encodeURIComponent(address);
		return `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
	};

	return (
		<Card
			overflow="hidden"
			transition="all 0.3s ease"
			_hover={{
				transform: "translateY(-4px)",
				shadow: "xl",
			}}
			bg="white"
		>
			<CardBody p={0}>
				<VStack spacing={4} align="stretch">
					{/* Map Embed */}
					<Box
						position="relative"
						height={{ base: "250px", md: "300px" }}
						bg="gray.100"
					>
						<iframe
							width="100%"
							height="100%"
							style={{ border: 0 }}
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							src={getEmbedUrl()}
							title={`${type} Location Map`}
							allowFullScreen
						/>
					</Box>

					{/* Venue Details */}
					<VStack spacing={4} px={6} pb={6} align="stretch">
						<Box>
							<Text
								fontSize="sm"
								fontWeight="semibold"
								color="primary.500"
								textTransform="uppercase"
								letterSpacing="wide"
								mb={2}
							>
								{type}
							</Text>
							<Heading size="sm" mb={3} fontFamily="body">
								{name}
							</Heading>
							<HStack spacing={2} align="start">
								<Box mt={1}>
									<FaMapMarkerAlt size={14} />
								</Box>
								<Text fontSize="sm" color="gray.600" lineHeight="tall">
									{address}
								</Text>
							</HStack>
						</Box>

						{/* Action Buttons */}
						<HStack spacing={3}>
							<Button
								flex={1}
								colorScheme="primary"
								leftIcon={<FaDirections />}
								onClick={handleOpenDirections}
								size="md"
							>
								Directions
							</Button>
							<Button
								flex={1}
								variant="outline"
								colorScheme="primary"
								leftIcon={<FaCopy />}
								onClick={handleCopyAddress}
								size="md"
							>
								Copy Address
							</Button>
						</HStack>
					</VStack>
				</VStack>
			</CardBody>
		</Card>
	);
}
