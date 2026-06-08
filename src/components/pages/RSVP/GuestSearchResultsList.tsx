"use client";

import { Box, Text, VStack, Button } from "@chakra-ui/react";
import { Guest, GuestService } from "@/services";

export interface GuestSearchResultsListProps {
	guests: Guest[];
	searchTerm: string;
	onSelect: (guest: Guest) => void;
}

export function GuestSearchResultsList({
	guests,
	searchTerm,
	onSelect,
}: GuestSearchResultsListProps) {
	return (
		<VStack spacing={4} w="100%" align="stretch">
			<Box textAlign="center">
				<Text
					fontSize={{ base: "sm", md: "md" }}
					fontWeight="semibold"
					color="gray.700"
				>
					Multiple guests found
				</Text>
				<Text fontSize="sm" color="gray.500" mt={1}>
					Please select your name from the list below
				</Text>
			</Box>

			<VStack
				spacing={2}
				w="100%"
				align="stretch"
				maxH="280px"
				overflowY="auto"
				px={1}
			>
				{guests.map((guest) => {
					const displayName = GuestService.getGuestDisplayName(guest);
					const showMembers =
						guest.groupName &&
						guest.members &&
						guest.members.length > 0;

					return (
						<Button
							key={guest.id}
							variant="outline"
							w="100%"
							h="auto"
							py={4}
							px={5}
							borderRadius="xl"
							borderColor="secondary.200"
							bg="white"
							boxShadow="0 2px 8px rgba(0,0,0,0.04)"
							textAlign="left"
							whiteSpace="normal"
							onClick={() => onSelect(guest)}
							_hover={{
								borderColor: "secondary.400",
								bg: "secondary.50",
								transform: "translateY(-1px)",
								boxShadow: "0 4px 12px rgba(192,57,43,0.12)",
							}}
							_active={{
								bg: "secondary.100",
							}}
						>
							<Box w="100%">
								<Text
									fontSize={{ base: "md", md: "lg" }}
									fontWeight="semibold"
									color="gray.800"
									lineHeight="short"
								>
									{displayName}
								</Text>
								{showMembers && (
									<Text
										fontSize="sm"
										color="gray.500"
										mt={1}
										lineHeight="short"
									>
										{GuestService.formatMembersList(guest.members!)}
									</Text>
								)}
							</Box>
						</Button>
					);
				})}
			</VStack>

			<Text fontSize="xs" color="gray.400" textAlign="center">
				Showing {guests.length} result{guests.length === 1 ? "" : "s"} for
				&ldquo;{searchTerm}&rdquo;
			</Text>
		</VStack>
	);
}
