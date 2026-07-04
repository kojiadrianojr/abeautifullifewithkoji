"use client";

import { Box, Text, VStack } from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import {
	RSVPCard,
	RSVPCardHeader,
	RSVPDivider,
	RSVPHelperText,
} from "./RSVPPrimitives";

export type NotFoundReason = "not_found" | "too_broad";

export interface NotFoundMessageProps {
	searchTerm: string;
	reason?: NotFoundReason;
}

const TOO_BROAD_TIPS = [
	"Enter your full name as written on the invitation",
	"Include both your first and last name",
	"Contact us if you need help finding your name",
];

const NOT_FOUND_TIPS = [
	"Check the spelling of your name",
	"Use your full name as written on the invitation",
	"Contact us if you think this is a mistake",
];

export function NotFoundMessage({
	searchTerm,
	reason = "not_found",
}: NotFoundMessageProps) {
	const isTooBroad = reason === "too_broad";
	const tips = isTooBroad ? TOO_BROAD_TIPS : NOT_FOUND_TIPS;

	return (
		<RSVPCard>
			<VStack spacing={3} p={{ base: 4, md: 5 }} align="stretch">
				<RSVPCardHeader
					icon={WarningTwoIcon}
					title={isTooBroad ? "Too many matches" : "Name not found"}
					iconBg="secondary.50"
					iconColor="secondary.500"
				/>

				<RSVPDivider />

				{searchTerm &&
					(isTooBroad ? (
						<RSVPHelperText>
							&ldquo;
							<Text as="span" fontWeight="semibold" color="gray.800">
								{searchTerm}
							</Text>
							&rdquo; matches too many guests to list. Please enter your full name as
							printed on your invitation.
						</RSVPHelperText>
					) : (
						<RSVPHelperText>
							We could not find &ldquo;
							<Text as="span" fontWeight="semibold" color="gray.800">
								{searchTerm}
							</Text>
							&rdquo; on our guest list.
						</RSVPHelperText>
					))}

				<Box
					bg="purple.50"
					borderRadius="xl"
					p={{ base: 3.5, md: 4 }}
					border="1px solid"
					borderColor="purple.100"
				>
					<VStack spacing={2} align="stretch">
						<Text
							fontFamily="body"
							fontSize="sm"
							fontWeight="semibold"
							color="secondary.600"
							textAlign="center"
						>
							Please try
						</Text>
						<VStack spacing={2} align="start" pl={1}>
							{tips.map((tip) => (
								<Text
									key={tip}
									fontFamily="body"
									fontSize={{ base: "md", md: "lg" }}
									color="gray.700"
								>
									• {tip}
								</Text>
							))}
						</VStack>
					</VStack>
				</Box>
			</VStack>
		</RSVPCard>
	);
}
