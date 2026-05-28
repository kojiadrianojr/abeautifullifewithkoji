"use client";

import { Box, Text, VStack, HStack, Icon, Flex } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Guest, GuestService } from "@/services";

export interface GuestResultProps {
	guest: Guest;
}

export function GuestResult({ guest }: GuestResultProps) {
	const seatCount = guest.allowedSeats ?? guest.members?.length ?? 1;
	const guestName = guest.fullName || (guest.members ? GuestService.formatMembersList(guest.members) : "");

	return (
		<Box
			w="100%"
			bg="white"
			borderRadius="2xl"
			boxShadow="0 4px 24px rgba(195,177,225,0.2), 0 1px 6px rgba(0,0,0,0.06)"
			border="1.5px solid"
			borderColor="purple.100"
			overflow="hidden"
		>
			{/* Top accent bar */}
			<Box
				h="4px"
				bgGradient="linear(to-r, primary.400, secondary.400)"
			/>

			<VStack spacing={3} p={{ base: 5, md: 6 }} align="stretch">
				{/* Success Icon and Header */}
				<HStack spacing={2} justify="center">
					<Icon
						as={CheckCircleIcon}
						boxSize={{ base: 5, md: 5 }}
						color="primary.400"
					/>
					<Text
						fontSize={{ base: "lg", md: "xl" }}
						fontWeight="bold"
						color="primary.500"
						fontFamily="heading"
						textAlign="center"
						letterSpacing="wide"
					>
						You&apos;re Invited!
					</Text>
				</HStack>

				{/* Soft divider */}
				<Box height="1px" bg="gray.100" my={1} />

				{/* Guest Names */}
				<Box textAlign="center">
					<Text
						fontSize="2xs"
						fontWeight="semibold"
						color="gray.400"
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

				{/* Soft divider */}
				<Box height="1px" bg="gray.100" my={1} />

				{/* Allowed Seats */}
				{seatCount > 0 && (
					<>
						<Flex align="center" justify="center" gap={3} py={1}>
							<Box textAlign="right">
								<Text
									fontSize="2xs"
									fontWeight="semibold"
									color="gray.400"
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
									color="primary.400"
									lineHeight="none"
									fontFamily="heading"
								>
									{seatCount}
								</Text>
								<Text
									fontSize={{ base: "lg", md: "xl" }}
									color="gray.500"
									fontStyle="italic"
								>
									{seatCount === 1 ? "seat" : "seats"}
								</Text>
							</HStack>
						</Flex>

						{seatCount > 1 && (
							<Text
								fontSize={{ base: "xs", md: "sm" }}
								color="gray.500"
								textAlign="center"
								fontStyle="italic"
								pt={1}
							>
								Total of {seatCount} {seatCount === 1 ? "seat" : "seats"} reserved for your party
							</Text>
						)}
					</>
				)}
			</VStack>
		</Box>
	);
}
