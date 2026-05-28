"use client";

import { Box, Text, VStack, Icon } from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";

export interface NotFoundMessageProps {
	searchTerm: string;
}

export function NotFoundMessage({ searchTerm }: NotFoundMessageProps) {
	return (
		<Box
			w="100%"
			bg="white"
			borderRadius="2xl"
				boxShadow="0 4px 24px rgba(192,57,43,0.1), 0 1px 6px rgba(0,0,0,0.05)"
			border="1.5px solid"
			borderColor="primary.100"
				overflow="hidden"
			>
				{/* Top accent bar */}
				<Box
					h="4px"
					bgGradient="linear(to-r, primary.400, secondary.400)"
				/>

				<VStack spacing={3} p={{ base: 5, md: 6 }}>
					<Icon
						as={WarningTwoIcon}
						boxSize={{ base: 6, md: 7 }}
						color="primary.400"
					/>

					<Text
						fontSize={{ base: "lg", md: "xl" }}
						fontWeight="bold"
						color="gray.700"
						textAlign="center"
						fontFamily="heading"
					>
						Guest Not Found
					</Text>

					{searchTerm && (
						<>
							<Box height="1px" bg="gray.100" w="60%" />
							<Text
								fontSize={{ base: "sm", md: "md" }}
								color="gray.500"
								textAlign="center"
								fontStyle="italic"
							>
								We couldn&apos;t locate &quot;<Text as="span" fontWeight="semibold" color="gray.700">{searchTerm}</Text>&quot; in our guest registry.
							</Text>
						</>
					)}

					<Box
						bg="accent.50"
						borderRadius="xl"
						p={{ base: 4, md: 5 }}
						w="100%"
						border="1px solid"
						borderColor="primary.100"
						mt={1}
					>
						<VStack spacing={2} align="stretch">
							<Text
								fontSize="2xs"
								color="gray.400"
								fontWeight="bold"
								textAlign="center"
								letterSpacing="widest"
								textTransform="uppercase"
								mb={1}
							>
								Please Consider
							</Text>
							<VStack spacing={1.5} align="start" pl={1}>
								<Text fontSize="xs" color="gray.600">
									♡ Verify the spelling of your name
								</Text>
								<Text fontSize="xs" color="gray.600">
									♡ Use your complete name as written on the invitation
								</Text>
								<Text fontSize="xs" color="gray.600">
									♡ Contact us if you believe this is an oversight
								</Text>
							</VStack>
						</VStack>
					</Box>
				</VStack>
			</Box>
		);
}
