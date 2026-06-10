"use client";

import { useState } from "react";
import { VStack, Box, Link } from "@chakra-ui/react";
import { EditIcon, RepeatIcon } from "@chakra-ui/icons";
import { GuestService, Guest } from "@/services";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { GuestSearchInput } from "./GuestSearchInput";
import { GuestResult } from "./GuestResult";
import { GuestSearchResultsList } from "./GuestSearchResultsList";
import { NotFoundMessage } from "./NotFoundMessage";
import {
	RSVPCard,
	RSVPStepLabel,
	RSVPDivider,
	RSVPHelperText,
	RSVPNoteText,
	RSVP_OUTLINE_BUTTON_PROPS,
} from "./RSVPPrimitives";

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

	const handleRefineSearch = () => {
		setMatchingGuests([]);
		setSelectedGuest(null);
		setHasSearched(false);
	};

	const handleBackToList = () => {
		setSelectedGuest(null);
	};

	return (
		<VStack spacing={4} w="100%" align="stretch">
			<GuestSearchInput
				value={searchTerm}
				onChange={setSearchTerm}
				onSearch={handleSearch}
			/>

			{hasSearched && (
				<Box w="100%">
					{matchingGuests.length > 1 && !selectedGuest ? (
						<GuestSearchResultsList
							guests={matchingGuests}
							searchTerm={searchedTerm}
							onSelect={setSelectedGuest}
							onRefineSearch={handleRefineSearch}
						/>
					) : selectedGuest ? (
						<VStack spacing={4} w="100%">
							<GuestResult
								guest={selectedGuest}
								stepLabel={
									matchingGuests.length > 1
										? "Step 2 of 2 — Confirm Your Invitation"
										: "Step 2 of 2 — Your Invitation"
								}
								onWrongGuest={
									matchingGuests.length > 1
										? handleBackToList
										: handleReset
								}
								wrongGuestLabel={
									matchingGuests.length > 1
										? "Go Back to Guest List"
										: "This Isn't My Invitation"
								}
							/>

							<RSVPCard>
								<VStack spacing={3} p={{ base: 4, md: 5 }} align="stretch">
									<RSVPStepLabel>Complete Your RSVP</RSVPStepLabel>

									<RSVPDivider />

									<RSVPHelperText>
										When you are ready, tap the button below to open the
										RSVP form.
									</RSVPHelperText>

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
											minH="52px"
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
											Open RSVP Form
										</AnimatedButton>
									</Link>

									<RSVPNoteText>
										This opens in a new tab. You can return here anytime.
									</RSVPNoteText>

									<AnimatedButton
										w="100%"
										minH="44px"
										leftIcon={<RepeatIcon />}
										onClick={handleReset}
										{...RSVP_OUTLINE_BUTTON_PROPS}
									>
										Search with a Different Name
									</AnimatedButton>
								</VStack>
							</RSVPCard>
						</VStack>
					) : (
						<VStack spacing={4} w="100%">
							<NotFoundMessage searchTerm={searchedTerm} />

							<AnimatedButton
								w="100%"
								minH="44px"
								onClick={handleReset}
								{...RSVP_OUTLINE_BUTTON_PROPS}
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
