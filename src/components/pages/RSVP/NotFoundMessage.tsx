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
					title="Name not found"
					iconBg="secondary.50"
					iconColor="secondary.500"
				/>

				<RSVPDivider />

				{searchTerm && (
					<RSVPHelperText>
						We could not find &ldquo;
						<Text as="span" fontWeight="semibold" color="gray.800">
							{searchTerm}
						</Text>
						&rdquo; on our guest list.
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
							fontFamily="body"
							fontSize="sm"
							fontWeight="semibold"
							color="secondary.600"
							textAlign="center"
						>
							Please try
						</Text>
						<VStack spacing={2} align="start" pl={1}>
							<Text fontFamily="body" fontSize={{ base: "md", md: "lg" }} color="gray.700">
								• Check the spelling of your name
							</Text>
							<Text fontFamily="body" fontSize={{ base: "md", md: "lg" }} color="gray.700">
								• Use your full name as written on the invitation
							</Text>
							<Text fontFamily="body" fontSize={{ base: "md", md: "lg" }} color="gray.700">
								• Contact us if you think this is a mistake
							</Text>
						</VStack>
					</VStack>
				</Box>
			</VStack>
		</RSVPCard>
	);
}
