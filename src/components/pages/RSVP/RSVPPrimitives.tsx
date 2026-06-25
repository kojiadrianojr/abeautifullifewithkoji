"use client";

import { Box, Text, HStack, VStack, Icon, Flex } from "@chakra-ui/react";
import type { ElementType } from "react";

export const RSVP_OUTLINE_BUTTON_PROPS = {
	variant: "outline" as const,
	border: "1.5px solid",
	borderColor: "secondary.300",
	color: "secondary.600",
	fontWeight: "semibold",
	fontSize: { base: "md", md: "lg" },
	fontFamily: "body",
	borderRadius: "xl",
	_hover: {
		bg: "purple.50",
		borderColor: "secondary.400",
	},
};

interface RSVPCardProps {
	children: React.ReactNode;
}

export function RSVPCard({ children }: RSVPCardProps) {
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
			<Box h="4px" bgGradient="linear(to-r, primary.400, secondary.400)" />
			{children}
		</Box>
	);
}

interface RSVPStepLabelProps {
	children: React.ReactNode;
}

export function RSVPStepLabel({ children }: RSVPStepLabelProps) {
	return (
		<Text
			fontFamily="body"
			fontSize="sm"
			fontWeight="semibold"
			color="secondary.600"
			textAlign="center"
		>
			{children}
		</Text>
	);
}

interface RSVPCardHeaderProps {
	icon: ElementType;
	title: string;
	subtitle?: string;
	iconBg?: string;
	iconColor?: string;
}

export function RSVPCardHeader({
	icon,
	title,
	subtitle,
	iconBg = "purple.50",
	iconColor = "primary.400",
}: RSVPCardHeaderProps) {
	return (
		<HStack spacing={2} justify="center">
			<Box
				display="inline-flex"
				alignItems="center"
				justifyContent="center"
				boxSize={8}
				borderRadius="full"
				bg={iconBg}
				flexShrink={0}
			>
				<Icon as={icon} boxSize={4} color={iconColor} />
			</Box>
			<VStack spacing={0} align="flex-start">
				<Text
					fontSize={{ base: "lg", md: "xl" }}
					fontWeight="semibold"
					color="secondary.600"
					fontFamily="body"
					lineHeight="short"
				>
					{title}
				</Text>
				{subtitle && (
					<Text fontFamily="body" fontSize="sm" color="gray.600">
						{subtitle}
					</Text>
				)}
			</VStack>
		</HStack>
	);
}

export function RSVPDivider() {
	return <Box height="1px" bg="gray.100" w="100%" />;
}

interface RSVPHelperTextProps {
	children: React.ReactNode;
}

export function RSVPHelperText({ children }: RSVPHelperTextProps) {
	return (
		<Text
			fontFamily="body"
			fontSize={{ base: "md", md: "lg" }}
			color="gray.700"
			textAlign="center"
			lineHeight="tall"
		>
			{children}
		</Text>
	);
}

interface RSVPNoteTextProps {
	children: React.ReactNode;
}

export function RSVPNoteText({ children }: RSVPNoteTextProps) {
	return (
		<Text
			fontFamily="body"
			fontSize={{ base: "sm", md: "md" }}
			color="gray.600"
			textAlign="center"
			lineHeight="tall"
		>
			{children}
		</Text>
	);
}

interface RSVPStepsGuideProps {
	steps: string[];
}

export function RSVPStepsGuide({ steps }: RSVPStepsGuideProps) {
	return (
		<Box
			w="100%"
			bg="purple.50"
			borderRadius="xl"
			px={{ base: 4, md: 5 }}
			py={{ base: 3.5, md: 4 }}
			border="1px solid"
			borderColor="purple.100"
		>
			<Text
				fontFamily="body"
				fontSize="sm"
				fontWeight="semibold"
				color="secondary.600"
				textAlign="center"
				mb={3}
			>
				How to reply
			</Text>
			<VStack spacing={2.5} align="stretch">
				{steps.map((step, index) => (
					<HStack key={step} spacing={3} align="flex-start">
						<Flex
							align="center"
							justify="center"
							boxSize={7}
							borderRadius="full"
							bg="secondary.500"
							color="white"
							fontFamily="body"
							fontSize="sm"
							fontWeight="bold"
							flexShrink={0}
						>
							{index + 1}
						</Flex>
						<Text
							fontFamily="body"
							fontSize={{ base: "md", md: "lg" }}
							color="gray.700"
							lineHeight="tall"
							pt={0.5}
						>
							{step}
						</Text>
					</HStack>
				))}
			</VStack>
		</Box>
	);
}
