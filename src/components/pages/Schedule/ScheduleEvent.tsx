"use client";

import { Box, Heading, Text, HStack, VStack, Icon } from "@chakra-ui/react";
import { ReactElement } from "react";
import {
	FaDoorOpen,
	FaChurch,
	FaGlassCheers,
	FaUtensils,
	FaMusic,
} from "react-icons/fa";
import { GiPartyFlags } from "react-icons/gi";

interface ScheduleEventProps {
	time: string;
	title: string;
	description: string;
	isFirst?: boolean;
	isLast?: boolean;
	index: number;
}

// Map event titles to icons
const getEventIcon = (title: string): ReactElement => {
	const lowerTitle = title.toLowerCase();
	if (lowerTitle.includes("arrival") || lowerTitle.includes("guest")) {
		return <FaDoorOpen />;
	}
	if (lowerTitle.includes("ceremony")) {
		return <FaChurch />;
	}
	if (lowerTitle.includes("cocktail")) {
		return <FaGlassCheers />;
	}
	if (lowerTitle.includes("reception")) {
		return <FaUtensils />;
	}
	if (lowerTitle.includes("dance")) {
		return <FaMusic />;
	}
	return <GiPartyFlags />;
};

export function ScheduleEvent({
	time,
	title,
	description,
	isLast = false,
	index,
}: ScheduleEventProps) {
	const isEven = index % 2 === 0;

	return (
		<Box position="relative">
			{/* Timeline connector line */}
			{!isLast && (
				<Box
					position="absolute"
					left="50%"
					top="60px"
					bottom="-40px"
					w="4px"
					bgGradient="linear(to-b, primary.500, primary.400, secondary.500)"
					transform="translateX(-50%)"
					zIndex={0}
					boxShadow="0 0 8px rgba(212, 102, 140, 0.3)"
					opacity={0.9}
				/>
			)}

			<HStack
				spacing={8}
				justify="center"
				align="center"
				position="relative"
				flexDirection={{ base: "column", md: "row" }}
			>
				{/* Left side - shows content for odd indices (1, 3, 5) */}
				<Box
					flex={1}
					display={{ base: "none", md: "flex" }}
					justifyContent="flex-end"
					order={1}
				>
					{!isEven && (
						<VStack
							spacing={2}
							align="flex-end"
							pr={4}
							opacity={0}
							animation="fadeInLeft 0.6s ease forwards"
							sx={{
								"@keyframes fadeInLeft": {
									from: {
										opacity: 0,
										transform: "translateX(30px)",
									},
									to: {
										opacity: 1,
										transform: "translateX(0)",
									},
								},
								animationDelay: `${index * 0.2}s`,
							}}
						>
							<Heading
								as="h3"
								size="md"
								color="primary.600"
								fontFamily="body"
								fontWeight="bold"
								textAlign="right"
							>
								{title}
							</Heading>
							<Text
								color="gray.600"
								fontSize="sm"
								maxW="300px"
								textAlign="right"
							>
								{description}
							</Text>
						</VStack>
					)}
				</Box>

				{/* Center icon and time */}
				<VStack spacing={2} order={{ base: 1, md: 2 }} zIndex={1} flexShrink={0}>
					<Box
						w={{ base: "70px", md: "80px" }}
						h={{ base: "70px", md: "80px" }}
						borderRadius="full"
						bg="white"
					border="5px solid"
					borderColor="primary.500"
					display="flex"
					alignItems="center"
					justifyContent="center"
					boxShadow="0 4px 24px rgba(212, 102, 140, 0.4), 0 0 0 8px rgba(255, 255, 255, 0.8)"
						transition="all 0.3s ease"
						_hover={{
							transform: "scale(1.1) rotate(5deg)",
							boxShadow: "0 6px 36px rgba(212, 102, 140, 0.5), 0 0 0 8px rgba(255, 255, 255, 0.9)",
						}}
						position="relative"
						opacity={0}
						animation="scaleIn 0.5s ease forwards"
						sx={{
							"@keyframes scaleIn": {
								from: {
									opacity: 0,
									transform: "scale(0)",
								},
								to: {
									opacity: 1,
									transform: "scale(1)",
								},
							},
							animationDelay: `${index * 0.2 + 0.2}s`,
						}}
					>
						<Icon
							as={() => getEventIcon(title)}
							boxSize={{ base: 7, md: 8 }}
							color="primary.500"
						/>

						{/* Decorative pulse ring */}
						<Box
							position="absolute"
							inset={0}
							borderRadius="full"
							border="2px solid"
							borderColor="primary.300"
							opacity={0.6}
							animation="pulse 2s ease-in-out infinite"
							sx={{
								"@keyframes pulse": {
									"0%, 100%": {
										transform: "scale(1)",
										opacity: 0.6,
									},
									"50%": {
										transform: "scale(1.2)",
										opacity: 0.2,
									},
								},
								animationDelay: `${index * 0.3}s`,
							}}
						/>
					</Box>

					{/* Time badge */}
					<Box
						bgGradient="linear(to-r, primary.500, primary.400)"
						color="white"
						px={4}
						py={1.5}
						borderRadius="full"
						fontSize="sm"
						fontWeight="bold"
						boxShadow="sm"
						whiteSpace="nowrap"
					>
						{time}
					</Box>

					{/* Mobile content - shown below icon */}
					<VStack
						spacing={2}
						display={{ base: "flex", md: "none" }}
						pt={2}
						opacity={0}
						animation="fadeInUp 0.6s ease forwards"
						sx={{
							"@keyframes fadeInUp": {
								from: {
									opacity: 0,
									transform: "translateY(20px)",
								},
								to: {
									opacity: 1,
									transform: "translateY(0)",
								},
							},
							animationDelay: `${index * 0.2}s`,
						}}
					>
						<Heading
							as="h3"
							size="md"
							color="primary.600"
							fontFamily="body"
							fontWeight="bold"
							textAlign="center"
						>
							{title}
						</Heading>
						<Text
							color="gray.600"
							fontSize="sm"
							maxW="300px"
							textAlign="center"
						>
							{description}
						</Text>
					</VStack>
				</VStack>

				{/* Right side - shows content for even indices (0, 2, 4) */}
				<Box
					flex={1}
					display={{ base: "none", md: "flex" }}
					justifyContent="flex-start"
					order={3}
				>
					{isEven && (
						<VStack
							spacing={2}
							align="flex-start"
							pl={4}
							opacity={0}
							animation="fadeInRight 0.6s ease forwards"
							sx={{
								"@keyframes fadeInRight": {
									from: {
										opacity: 0,
										transform: "translateX(-30px)",
									},
									to: {
										opacity: 1,
										transform: "translateX(0)",
									},
								},
								animationDelay: `${index * 0.2}s`,
							}}
						>
							<Heading
								as="h3"
								size="md"
								color="primary.600"
								fontFamily="body"
								fontWeight="bold"
								textAlign="left"
							>
								{title}
							</Heading>
							<Text
								color="gray.600"
								fontSize="sm"
								maxW="300px"
								textAlign="left"
							>
								{description}
							</Text>
						</VStack>
					)}
				</Box>
			</HStack>
		</Box>
	);
}
