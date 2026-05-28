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
			{/* Desktop timeline connector line — centered */}
			{!isLast && (
				<Box
					display={{ base: "none", md: "block" }}
					position="absolute"
					left="50%"
					top="60px"
					bottom="-40px"
					w="4px"
					bgGradient="linear(to-b, primary.500, primary.400, secondary.500)"
					transform="translateX(-50%)"
					zIndex={0}
					boxShadow="0 0 8px rgba(192,57,43,0.25)"
					opacity={0.9}
				/>
			)}

			{/* Mobile timeline connector line — left-aligned with the icon */}
			{!isLast && (
				<Box
					display={{ base: "block", md: "none" }}
					position="absolute"
					left="35px"
					top="70px"
					bottom="-32px"
					w="4px"
					bgGradient="linear(to-b, primary.500, primary.400, secondary.500)"
					transform="translateX(-50%)"
					zIndex={0}
					boxShadow="0 0 8px rgba(192,57,43,0.25)"
					opacity={0.9}
				/>
			)}

			{/* ── Mobile layout: icon left, content right ── */}
			<Box display={{ base: "flex", md: "none" }} alignItems="flex-start" gap={4}>
				{/* Left column: icon + time */}
				<VStack spacing={2} flexShrink={0} zIndex={1} alignItems="center" w="70px">
					<Box
						w="70px"
						h="70px"
						borderRadius="full"
						bg="white"
						border="5px solid"
						borderColor="secondary.500"
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
								from: { opacity: 0, transform: "scale(0)" },
								to: { opacity: 1, transform: "scale(1)" },
							},
							animationDelay: `${index * 0.2 + 0.2}s`,
						}}
					>
						<Icon
							as={() => getEventIcon(title)}
							boxSize={7}
							color="secondary.500"
						/>
						<Box
							position="absolute"
							inset={0}
							borderRadius="full"
							border="2px solid"
							borderColor="secondary.400"
							opacity={0.6}
							animation="pulse 2s ease-in-out infinite"
							sx={{
								"@keyframes pulse": {
									"0%, 100%": { transform: "scale(1)", opacity: 0.6 },
									"50%": { transform: "scale(1.2)", opacity: 0.2 },
								},
								animationDelay: `${index * 0.3}s`,
							}}
						/>
					</Box>

					<Box
						bgGradient="linear(to-r, primary.500, primary.400)"
						color="white"
						px={2}
						py={1}
						borderRadius="full"
						fontSize="xs"
						fontWeight="bold"
						boxShadow="sm"
						whiteSpace="nowrap"
						textAlign="center"
					>
						{time}
					</Box>
				</VStack>

				{/* Right column: title + description */}
				<VStack
					spacing={1}
					align="flex-start"
					pt={1}
					flex={1}
					opacity={0}
					animation="fadeInRight 0.6s ease forwards"
					sx={{
						"@keyframes fadeInRight": {
							from: { opacity: 0, transform: "translateX(-20px)" },
							to: { opacity: 1, transform: "translateX(0)" },
						},
						animationDelay: `${index * 0.2}s`,
					}}
				>
					<Heading
						as="h3"
						size="sm"
						color="secondary.600"
						fontFamily="body"
						fontWeight="bold"
					>
						{title}
					</Heading>
					<Text color="gray.600" fontSize="sm">
						{description}
					</Text>
				</VStack>
			</Box>

			{/* ── Desktop layout: alternating left / center / right ── */}
			<HStack
				spacing={8}
				justify="center"
				align="center"
				position="relative"
				display={{ base: "none", md: "flex" }}
			>
				{/* Left side - shows content for odd indices (1, 3, 5) */}
				<Box flex={1} display="flex" justifyContent="flex-end" order={1}>
					{!isEven && (
						<VStack
							spacing={2}
							align="flex-end"
							pr={4}
							opacity={0}
							animation="fadeInLeft 0.6s ease forwards"
							sx={{
								"@keyframes fadeInLeft": {
									from: { opacity: 0, transform: "translateX(30px)" },
									to: { opacity: 1, transform: "translateX(0)" },
								},
								animationDelay: `${index * 0.2}s`,
							}}
						>
							<Heading
								as="h3"
								size="md"
								color="secondary.600"
								fontFamily="body"
								fontWeight="bold"
								textAlign="right"
							>
								{title}
							</Heading>
							<Text color="gray.600" fontSize="sm" maxW="300px" textAlign="right">
								{description}
							</Text>
						</VStack>
					)}
				</Box>

				{/* Center icon and time */}
				<VStack spacing={2} order={2} zIndex={1} flexShrink={0}>
					<Box
						w="80px"
						h="80px"
						borderRadius="full"
						bg="white"
						border="5px solid"
						borderColor="secondary.500"
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
								from: { opacity: 0, transform: "scale(0)" },
								to: { opacity: 1, transform: "scale(1)" },
							},
							animationDelay: `${index * 0.2 + 0.2}s`,
						}}
					>
						<Icon as={() => getEventIcon(title)} boxSize={8} color="secondary.500" />
						<Box
							position="absolute"
							inset={0}
							borderRadius="full"
							border="2px solid"
							borderColor="secondary.400"
							opacity={0.6}
							animation="pulse 2s ease-in-out infinite"
							sx={{
								"@keyframes pulse": {
									"0%, 100%": { transform: "scale(1)", opacity: 0.6 },
									"50%": { transform: "scale(1.2)", opacity: 0.2 },
								},
								animationDelay: `${index * 0.3}s`,
							}}
						/>
					</Box>

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
				</VStack>

				{/* Right side - shows content for even indices (0, 2, 4) */}
				<Box flex={1} display="flex" justifyContent="flex-start" order={3}>
					{isEven && (
						<VStack
							spacing={2}
							align="flex-start"
							pl={4}
							opacity={0}
							animation="fadeInRight 0.6s ease forwards"
							sx={{
								"@keyframes fadeInRight": {
									from: { opacity: 0, transform: "translateX(-30px)" },
									to: { opacity: 1, transform: "translateX(0)" },
								},
								animationDelay: `${index * 0.2}s`,
							}}
						>
							<Heading
								as="h3"
								size="md"
								color="secondary.600"
								fontFamily="body"
								fontWeight="bold"
								textAlign="left"
							>
								{title}
							</Heading>
							<Text color="gray.600" fontSize="sm" maxW="300px" textAlign="left">
								{description}
							</Text>
						</VStack>
					)}
				</Box>
			</HStack>
		</Box>
	);
}
