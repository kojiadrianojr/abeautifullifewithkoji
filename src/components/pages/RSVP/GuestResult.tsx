"use client";

import { Box, Text, VStack, HStack, Icon, Flex } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Guest, GuestService } from "@/services";
import { RoyalBorder } from "./RoyalBorder";

export interface GuestResultProps {
	guest: Guest;
}

export function GuestResult({ guest }: GuestResultProps) {
	const seatCount = guest.allowedSeats ?? guest.members?.length ?? 1;
	const guestName = guest.fullName || (guest.members ? GuestService.formatMembersList(guest.members) : "");
	
	return (
		<RoyalBorder variant="primary">
			<VStack spacing={3} p={{ base: 5, md: 6 }} align="stretch">
				{/* Success Icon and Header */}
				<HStack spacing={2} justify="center">
					<Icon
						as={CheckCircleIcon}
						boxSize={{ base: 5, md: 6 }}
						color="green.500"
						filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
					/>
					<Text
						fontSize={{ base: "xl", md: "2xl" }}
						fontWeight="bold"
						color="primary.500"
						fontFamily="heading"
						textAlign="center"
						letterSpacing="wide"
					>
						You're Invited!
					</Text>
				</HStack>

				{/* Divider */}
				<Box height="1px" bg="gold.300" opacity={0.3} my={1} />

				{/* Guest Names - Royal Style */}
				<Box textAlign="center">
					<Text
						fontSize="2xs"
						fontWeight="semibold"
						color="gold.600"
						letterSpacing="widest"
						textTransform="uppercase"
						mb={1}
					>
						{(guest.members && guest.members.length > 1) ? "Honored Guests" : "Honored Guest"}
					</Text>
					<Text
						fontSize={{ base: "xl", md: "2xl" }}
						fontWeight="bold"
						color="gray.800"
						fontFamily="heading"
						lineHeight="shorter"
					>
						{guestName}
					</Text>
				</Box>

				{/* Divider */}
				<Box height="1px" bg="gold.300" opacity={0.3} my={1} />

				{/* Allowed Seats - Compact Display */}
				{
					seatCount > 0 && (
						<>
							<Flex align="center" justify="center" gap={3} py={1}>
								<Box textAlign="right">
									<Text
										fontSize="2xs"
										fontWeight="semibold"
										color="gold.600"
										letterSpacing="widest"
										textTransform="uppercase"
										mb={0.5}
									>
										Reserved Seats
									</Text>
								</Box>
								<HStack spacing={2} align="baseline">
									<Text
										fontSize={{ base: "4xl", md: "5xl" }}
										fontWeight="bold"
										color="primary.500"
										lineHeight="none"
										fontFamily="heading"
									>
										{seatCount}
									</Text>
									<Text
										fontSize={{ base: "lg", md: "xl" }}
										color="gray.600"
										fontStyle="italic"
									>
										{seatCount === 1 ? "seat" : "seats"}
									</Text>
								</HStack>
							</Flex>

							{/* Information Text */}
							{
								seatCount > 1 && (
									<Text
										fontSize={{ base: "xs", md: "sm" }}
										color="gray.600"
										textAlign="center"
										fontStyle="italic"
										pt={1}
									>
										Total of {seatCount} {seatCount === 1 ? "seat" : "seats"} reserved for your party
									</Text>
								)
							}
						</>
					)
				}


			</VStack>
		</RoyalBorder>
	);
}
