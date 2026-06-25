"use client";

import { Box, Text, VStack, HStack, Flex } from "@chakra-ui/react";
import { CheckCircleIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Guest } from "@/services";
import {
	RSVPCard,
	RSVPStepLabel,
	RSVPCardHeader,
	RSVPDivider,
	RSVPHelperText,
	RSVP_OUTLINE_BUTTON_PROPS,
} from "./RSVPPrimitives";

export interface GuestResultProps {
	guest: Guest;
	stepLabel?: string;
	onWrongGuest?: () => void;
	wrongGuestLabel?: string;
}

export function GuestResult({
	guest,
	stepLabel,
	onWrongGuest,
	wrongGuestLabel = "This Is Not My Name",
}: GuestResultProps) {
	const seatCount = guest.allowedSeats ?? guest.members?.length ?? 1;
	const hasMultipleMembers = guest.members && guest.members.length > 1;
	const isSingleMember = !guest.members || guest.members.length <= 1;
	const singleName = guest.fullName || (guest.members?.[0] ?? "");

	return (
		<RSVPCard>
			<VStack spacing={3} p={{ base: 4, md: 5 }} align="stretch">
				{stepLabel && <RSVPStepLabel>{stepLabel}</RSVPStepLabel>}

				<RSVPCardHeader
					icon={CheckCircleIcon}
					title="We found your name!"
					iconBg="secondary.50"
					iconColor="secondary.400"
				/>

				<RSVPDivider />

				<Box textAlign="center">
					<Text
						fontFamily="body"
						fontSize="sm"
						fontWeight="semibold"
						color="gray.500"
						mb={2}
					>
						{hasMultipleMembers ? "Names on your invitation" : "Your name"}
					</Text>

					{isSingleMember ? (
						<Text
							fontSize={{ base: "xl", md: "2xl" }}
							fontWeight="semibold"
							color="gray.800"
							lineHeight="shorter"
							fontFamily="body"
						>
							{singleName}
						</Text>
					) : (
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
										fontFamily="body"
									>
										{member}
									</Text>
								</HStack>
							))}
						</VStack>
					)}
				</Box>

				<RSVPDivider />

				{seatCount > 0 && (
					<>
						<Flex align="center" justify="center" gap={3} py={1}>
							<Text
								fontFamily="body"
								fontSize="sm"
								fontWeight="semibold"
								color="gray.500"
							>
								Seats saved for you
							</Text>
							<HStack
								spacing={1.5}
								align="baseline"
								borderRadius="xl"
								px={4}
								py={2}
								bg="secondary.50"
								border="1px solid"
								borderColor="purple.100"
							>
								<Text
									fontSize={{ base: "3xl", md: "4xl" }}
									fontWeight="bold"
									color="secondary.400"
									lineHeight="none"
								>
									{seatCount}
								</Text>
								<Text
									fontSize={{ base: "sm", md: "md" }}
									color="gray.600"
									fontFamily="body"
									fontWeight="medium"
								>
									{seatCount === 1 ? "seat" : "seats"}
								</Text>
							</HStack>
						</Flex>

						{seatCount > 1 && (
							<RSVPHelperText>
								{seatCount} seats are saved for your group.
							</RSVPHelperText>
						)}
					</>
				)}

				{onWrongGuest && (
					<>
						<RSVPDivider />
						<RSVPHelperText>
							Please check that the name above matches your invitation.
						</RSVPHelperText>
						<AnimatedButton
							w="100%"
							minH="44px"
							leftIcon={<ArrowBackIcon />}
							onClick={onWrongGuest}
							{...RSVP_OUTLINE_BUTTON_PROPS}
						>
							{wrongGuestLabel}
						</AnimatedButton>
					</>
				)}
			</VStack>
		</RSVPCard>
	);
}
