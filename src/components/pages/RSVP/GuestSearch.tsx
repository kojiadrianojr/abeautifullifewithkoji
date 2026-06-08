"use client";

import { useState } from "react";
import { VStack, Box, Link, Text } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { GuestService, Guest } from "@/services";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { GuestSearchInput } from "./GuestSearchInput";
import { GuestResult } from "./GuestResult";
import { GuestSearchResultsList } from "./GuestSearchResultsList";
import { NotFoundMessage } from "./NotFoundMessage";

export interface GuestSearchProps {
	formUrl: string;
}

export function GuestSearch({ formUrl }: GuestSearchProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [searchedTerm, setSearchedTerm] = useState("");
	const [matchingGuests, setMatchingGuests] = useState<Guest[]>([]);
	const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
	const [hasSearched, setHasSearched] = useState(false);

	const handleSearch = () => {
		setHasSearched(true);
		setSearchedTerm(searchTerm);

		try {
			if (!searchTerm.trim()) {
				setMatchingGuests([]);
				setSelectedGuest(null);
				setHasSearched(false);
				return;
			}

			const results = GuestService.searchGuest(searchTerm);
			setMatchingGuests(results);

			if (results.length === 0) {
				setSelectedGuest(null);
			} else if (results.length === 1) {
				setSelectedGuest(results[0]);
			} else {
				const exactMatch = GuestService.findGuestByMemberName(searchTerm);
				setSelectedGuest(exactMatch ?? null);
			}
		} catch (err) {
			setMatchingGuests([]);
			setSelectedGuest(null);
			console.error("Guest search error:", err);
		}
	};

	const handleReset = () => {
		setSearchTerm("");
		setSearchedTerm("");
		setMatchingGuests([]);
		setSelectedGuest(null);
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
					{matchingGuests.length > 1 && !selectedGuest ? (
						<GuestSearchResultsList
							guests={matchingGuests}
							searchTerm={searchedTerm}
							onSelect={setSelectedGuest}
						/>
					) : selectedGuest ? (
						<VStack spacing={5} w="100%">
							<GuestResult guest={selectedGuest} />

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
									bg="secondary.500"
									color="white"
									leftIcon={<EditIcon />}
									px={{ base: 8, md: 10 }}
									py={{ base: 6, md: 7 }}
									fontSize={{ base: "md", md: "lg" }}
									fontWeight="semibold"
									w="100%"
									borderRadius="xl"
									boxShadow="0 4px 16px rgba(192,57,43,0.3)"
									_hover={{
										bg: "secondary.600",
										boxShadow: "0 6px 24px rgba(192,57,43,0.4)",
										transform: "translateY(-2px)",
									}}
								>
									Proceed to RSVP Form
								</AnimatedButton>
							</Link>

							{/* Try Another Name */}
							<Text
								fontSize="sm"
								color="gray.500"
								textAlign="center"
								cursor="pointer"
								textDecoration="underline"
								onClick={handleReset}
								_hover={{ color: "gray.700" }}
								mt={-2}
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
								color="secondary.500"
								borderColor="secondary.300"
								border="1.5px solid"
								px={8}
								py={5}
								fontSize="sm"
								fontWeight="semibold"
								borderRadius="xl"
								onClick={handleReset}
								_hover={{
									bg: "purple.50",
									borderColor: "secondary.400",
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
