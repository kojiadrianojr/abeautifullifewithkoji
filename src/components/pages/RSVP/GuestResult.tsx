"use client";

import { Box, Text, VStack, HStack, Icon, Flex } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Guest } from "@/services";

export interface GuestResultProps {
	guest: Guest;
}

export function GuestResult({ guest }: GuestResultProps) {
	const seatCount = guest.allowedSeats ?? guest.members?.length ?? 1;
	const hasMultipleMembers = guest.members && guest.members.length > 1;
	const isSingleMember = !guest.members || guest.members.length <= 1;
	const singleName = guest.fullName || (guest.members?.[0] ?? "");

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
				{/* Success Icon and Header — only cursive element */}
				<HStack spacing={2} justify="center">
					<Box
						display="inline-flex"
						alignItems="center"
						justifyContent="center"
						boxSize={8}
						borderRadius="full"
						bg="secondary.50"
						flexShrink={0}
					>
						<Icon
							as={CheckCircleIcon}
							boxSize={4}
							color="secondary.400"
						/>
					</Box>
					<Text
						fontSize={{ base: "lg", md: "xl" }}
						fontWeight="semibold"
						color="secondary.500"
						fontFamily="heading"
						textAlign="center"
					>
						You&apos;re Invited!
					</Text>
				</HStack>

				{/* Soft divider */}
				<Box height="1px" bg="gray.100" my={1} />

				{/* Guest Names */}
				<Box textAlign="center">
					<Text
						fontSize="xs"
						fontWeight="medium"
						color="gray.400"
						letterSpacing="wider"
						textTransform="uppercase"
						mb={2}
					>
						{hasMultipleMembers ? "Honored Guests" : "Honored Guest"}
					</Text>

					{isSingleMember ? (
						/* Single guest — display name directly */
						<Text
							fontSize={{ base: "xl", md: "2xl" }}
							fontWeight="semibold"
							color="gray.800"
							lineHeight="shorter"
						>
							{singleName}
						</Text>
					) : (
						/* Group guests — display members as bullet list */
						<VStack spacing={1.5} align="center" mt={1}>
							{guest.members!.map((member) => (
								<HStack key={member} spacing={2} align="center">
									<Text
										fontSize="xs"
										color="primary.300"
										lineHeight={1}
										aria-hidden="true"
									>
										◆
									</Text>
									<Text
										fontSize={{ base: "md", md: "lg" }}
										fontWeight="medium"
										color="gray.800"
										lineHeight="short"
									>
										{member}
									</Text>
								</HStack>
							))}
						</VStack>
					)}
				</Box>

				{/* Soft divider */}
				<Box height="1px" bg="gray.100" my={1} />

				{/* Allowed Seats */}
				{seatCount > 0 && (
					<>
						<Flex align="center" justify="center" gap={3} py={1}>
							<Box textAlign="right">
								<Text
									fontSize="xs"
									fontWeight="medium"
									color="gray.400"
									letterSpacing="wider"
									textTransform="uppercase"
									mb={0.5}
								>
									Reserved Seats
								</Text>
							</Box>
							<HStack
								spacing={1.5}
								align="baseline"
								borderRadius="xl"
								px={4}
								py={2}
								bg="secondary.50"
							>
								<Text
									fontSize={{ base: "4xl", md: "5xl" }}
									fontWeight="bold"
									color="secondary.400"
									lineHeight="none"
								>
									{seatCount}
								</Text>
								<Text
									fontSize={{ base: "md", md: "lg" }}
									color="gray.500"
									fontWeight="medium"
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
