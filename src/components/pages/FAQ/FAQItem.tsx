"use client";

import {
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Heading,
	Text,
	Box,
} from "@chakra-ui/react";

interface FAQItemProps {
	question: string;
	answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
	return (
		<AccordionItem
			border="1px solid"
			borderColor="gray.200"
			borderRadius="xl"
			mb={4}
			_last={{ mb: 0 }}
		>
			<AccordionButton
				py={4}
				px={6}
				_hover={{ bg: "gray.50" }}
				_expanded={{ bg: "gray.50" }}
				borderRadius="xl"
			>
				<Box flex={1} textAlign="left">
					<Heading as="h3" size="md" fontWeight="semibold">
						{question}
					</Heading>
				</Box>
				<AccordionIcon color="primary.500" fontSize="2xl" />
			</AccordionButton>
			<AccordionPanel
				pb={6}
				px={6}
				pt={4}
				borderTop="1px solid"
				borderColor="gray.200"
			>
				<Text color="gray.600" fontSize="md">
					{answer}
				</Text>
			</AccordionPanel>
		</AccordionItem>
	);
}
