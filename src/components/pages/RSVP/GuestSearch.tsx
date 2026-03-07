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

							{/* Simple Divider */}
							<Box height="1px" bg="gold.300" opacity={0.4} w="60%" />

							{/* RSVP Button - Royal Style */}
							<Box position="relative" w="100%">
								{/* Decorative background */}
								<Box
									position="absolute"
									top="-4px"
									left="-4px"
									right="-4px"
									bottom="-4px"
									bg="gold.200"
									opacity={0.3}
									borderRadius="xl"
									filter="blur(8px)"
								/>
								
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
										bg="white"
										color="primary.500"
										leftIcon={<EditIcon />}
										px={{ base: 8, md: 10 }}
										py={{ base: 6, md: 7 }}
										fontSize={{ base: "md", md: "lg" }}
										fontWeight="bold"
										w="100%"
										border="2px solid"
										borderColor="gold.400"
										boxShadow="0 8px 32px rgba(0,0,0,0.2)"
										position="relative"
										_hover={{
											bg: "gold.50",
											borderColor: "gold.500",
											boxShadow: "0 12px 40px rgba(212,175,55,0.3)",
											transform: "translateY(-2px)",
										}}
										_before={{
											content: '""',
											position: "absolute",
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											background: "linear-gradient(135deg, rgba(212,175,55,0.1) 0%, transparent 50%, rgba(212,175,55,0.1) 100%)",
											borderRadius: "inherit",
										}}
									>
										<Text position="relative" zIndex={1}>
											Proceed to RSVP Form
										</Text>
									</AnimatedButton>
								</Link>
							</Box>

							{/* Try Another Name */}
							<Text
								fontSize="xs"
								color="gray.600"
								textAlign="center"
								cursor="pointer"
								textDecoration="underline"
								onClick={handleReset}
								_hover={{ color: "gray.800" }}
								fontStyle="italic"
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
								bg="white"
								color="primary.500"
								borderColor="gold.400"
								border="2px solid"
								px={8}
								py={5}
								fontSize="sm"
								fontWeight="semibold"
								onClick={handleReset}
								_hover={{
									bg: "gold.50",
									borderColor: "gold.500",
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
