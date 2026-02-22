"use client";

import { Box, Text, VStack, Icon } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { RoyalBorder } from "./RoyalBorder";

export interface NotFoundMessageProps {
	searchTerm: string;
}

export function NotFoundMessage({ searchTerm }: NotFoundMessageProps) {
	return (
		<RoyalBorder variant="secondary">
			<VStack spacing={3} p={{ base: 5, md: 6 }}>
				<Icon 
					as={WarningIcon} 
					boxSize={{ base: 7, md: 8 }} 
					color="orange.400"
					filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
				/>
				
				<Text
					fontSize={{ base: "lg", md: "xl" }}
					fontWeight="bold"
					color="gray.800"
					textAlign="center"
					fontFamily="heading"
				>
					Guest Not Found
				</Text>
				
				{searchTerm && (
					<>
						<Box height="1px" bg="orange.300" opacity={0.3} w="60%" my={1} />
						<Text 
							fontSize={{ base: "sm", md: "md" }} 
							color="gray.600" 
							textAlign="center"
							fontStyle="italic"
						>
							We couldn&apos;t locate &quot;<Text as="span" fontWeight="bold">{searchTerm}</Text>&quot; in our guest registry.
						</Text>
					</>
				)}

				<Box
					bg="linear-gradient(135deg, rgba(255,243,224,0.5) 0%, rgba(255,237,213,0.5) 100%)"
					borderRadius="lg"
					p={{ base: 4, md: 5 }}
					w="100%"
					border="1px solid"
					borderColor="orange.200"
					mt={2}
				>
					<VStack spacing={2} align="stretch">
						<Text 
							fontSize="2xs" 
							color="gold.700" 
							fontWeight="bold"
							textAlign="center"
							letterSpacing="wide"
							textTransform="uppercase"
							mb={1}
						>
							Please Consider
						</Text>
						<VStack spacing={1.5} align="start" pl={1}>
							<Text fontSize="xs" color="gray.700">
								✦ Verify the spelling of your name
							</Text>
							<Text fontSize="xs" color="gray.700">
								✦ Use your complete name as written on the invitation
							</Text>
							<Text fontSize="xs" color="gray.700">
								✦ Contact us if you believe this is an oversight
							</Text>
						</VStack>
					</VStack>
				</Box>
			</VStack>
		</RoyalBorder>
	);
}
