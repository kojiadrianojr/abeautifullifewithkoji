"use client";

import { Box, Text, VStack } from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import {
	RSVPCard,
	RSVPCardHeader,
	RSVPDivider,
	RSVPHelperText,
} from "./RSVPPrimitives";

export interface NotFoundMessageProps {
	searchTerm: string;
}

export function NotFoundMessage({ searchTerm }: NotFoundMessageProps) {
	return (
		<RSVPCard>
			<VStack spacing={3} p={{ base: 4, md: 5 }} align="stretch">
				<RSVPCardHeader
					icon={WarningTwoIcon}
					title="Guest Not Found"
					iconBg="secondary.50"
					iconColor="secondary.500"
				/>

				<RSVPDivider />

				{searchTerm && (
					<RSVPHelperText>
						We couldn&apos;t locate &ldquo;
						<Text as="span" fontWeight="semibold" color="gray.800">
							{searchTerm}
						</Text>
						&rdquo; in our guest list.
					</RSVPHelperText>
				)}

				<Box
					bg="purple.50"
					borderRadius="xl"
					p={{ base: 3.5, md: 4 }}
					border="1px solid"
					borderColor="purple.100"
				>
					<VStack spacing={2} align="stretch">
						<Text
							fontSize="xs"
							color="gray.400"
							fontWeight="medium"
							textAlign="center"
							letterSpacing="wider"
							textTransform="uppercase"
						>
							Please Try
						</Text>
						<VStack spacing={1.5} align="start" pl={1}>
							<Text fontSize="sm" color="gray.600">
								♡ Verify the spelling of your name
							</Text>
							<Text fontSize="sm" color="gray.600">
								♡ Use your complete name as written on the invitation
							</Text>
							<Text fontSize="sm" color="gray.600">
								♡ Contact us if you believe this is an oversight
							</Text>
						</VStack>
					</VStack>
				</Box>
			</VStack>
		</RSVPCard>
	);
}
