"use client";

import { useState } from "react";
import { VStack, Box, Link, Text } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { GuestService, Guest } from "@/services";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { GuestSearchInput } from "./GuestSearchInput";
import { GuestResult } from "./GuestResult";
import { NotFoundMessage } from "./NotFoundMessage";

export interface GuestSearchProps {
	formUrl: string;
}

export function GuestSearch({ formUrl }: GuestSearchProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [searchedTerm, setSearchedTerm] = useState("");
	const [foundGuest, setFoundGuest] = useState<Guest | null>(null);
	const [hasSearched, setHasSearched] = useState(false);

	const handleSearch = () => {
		setHasSearched(true);
		setSearchedTerm(searchTerm);

		try {
			if (!searchTerm.trim()) {
				setFoundGuest(null);
				setHasSearched(false);
				return;
			}

			// Search for guest
			const results = GuestService.searchGuest(searchTerm);

			if (results.length === 0) {
				setFoundGuest(null);
			} else if (results.length === 1) {
				// Exact or single match found
				setFoundGuest(results[0]);
			} else {
				// Multiple matches - try to find exact match by member name
				const exactMatch = GuestService.findGuestByMemberName(searchTerm);
				if (exactMatch) {
					setFoundGuest(exactMatch);
				} else {
					// Show first result if no exact match
					setFoundGuest(results[0]);
				}
			}
		} catch (err) {
			setFoundGuest(null);
			console.error("Guest search error:", err);
		}
	};

	const handleReset = () => {
		setSearchTerm("");
		setSearchedTerm("");
		setFoundGuest(null);
		setHasSearched(false);
	};

	return (
		<VStack spacing={6} w="100%" align="stretch">
			{/* Search Input */}
			<Box>
				<GuestSearchInput
					value={searchTerm}
					onChange={setSearchTerm}
					onSearch={handleSearch}
				/>
			</Box>

			{/* Search Results */}
			{hasSearched && (
				<Box w="100%">
					{foundGuest ? (
						<VStack spacing={5} w="100%">
							<GuestResult guest={foundGuest} />

							{/* Soft divider */}
							<Box
								display="flex"
								alignItems="center"
								w="60%"
								gap={3}
							>
								<Box flex={1} height="1px" bg="gray.200" />
								<Text fontSize="xs" color="gray.300" lineHeight={1}>♡</Text>
								<Box flex={1} height="1px" bg="gray.200" />
							</Box>

							{/* RSVP Button */}
							<Link
								href={formUrl}
								target="_blank"
								rel="noopener noreferrer"
								_hover={{ textDecoration: "none" }}
								w="100%"
							>
								<AnimatedButton
									size="lg"
									variant="solid"
									bg="primary.500"
									color="white"
									leftIcon={<EditIcon />}
									px={{ base: 8, md: 10 }}
									py={{ base: 6, md: 7 }}
									fontSize={{ base: "md", md: "lg" }}
									fontWeight="semibold"
									w="100%"
									borderRadius="xl"
									boxShadow="0 4px 16px rgba(195,177,225,0.4)"
									_hover={{
										bg: "primary.600",
										boxShadow: "0 6px 24px rgba(195,177,225,0.5)",
										transform: "translateY(-2px)",
									}}
								>
									Proceed to RSVP Form
								</AnimatedButton>
							</Link>

							{/* Try Another Name */}
							<Text
								fontSize="xs"
								color="gray.700"
								textAlign="center"
								cursor="pointer"
								textDecoration="underline"
								onClick={handleReset}
								_hover={{ color: "gray.900" }}
								fontStyle="italic"
								mt={-2}
								textShadow="0 1px 3px rgba(255,255,255,0.6)"
							>
								Search for another guest
							</Text>
						</VStack>
					) : (
						<VStack spacing={4} w="100%">
							<NotFoundMessage searchTerm={searchedTerm} />

							{/* Try Again Button */}
							<AnimatedButton
								size="md"
								variant="outline"
								color="primary.500"
								borderColor="primary.300"
								border="1.5px solid"
								px={8}
								py={5}
								fontSize="sm"
								fontWeight="semibold"
								borderRadius="xl"
								onClick={handleReset}
								_hover={{
									bg: "purple.50",
									borderColor: "primary.400",
								}}
							>
								Try Again
							</AnimatedButton>
						</VStack>
					)}
				</Box>
			)}
		</VStack>
	);
}
