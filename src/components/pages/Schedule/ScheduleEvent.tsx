"use client";

import { Box, Heading, Text, HStack, VStack } from "@chakra-ui/react";
import { IconType } from "react-icons";
import {
	LuDoorOpen,
	LuHeart,
	LuWine,
	LuUtensilsCrossed,
	LuMusic2,
	LuSparkles,
} from "react-icons/lu";

interface ScheduleEventProps {
	time: string;
	label?: string;
	title: string;
	description: string;
	isFirst?: boolean;
	isLast?: boolean;
	index: number;
}

const getEventIcon = (title: string): IconType => {
	const lowerTitle = title.toLowerCase();
	if (lowerTitle.includes("arrival") || lowerTitle.includes("guest")) {
		return LuDoorOpen;
	}
	if (lowerTitle.includes("ceremony")) {
		return LuHeart;
	}
	if (lowerTitle.includes("cocktail")) {
		return LuWine;
	}
	if (lowerTitle.includes("reception")) {
		return LuUtensilsCrossed;
	}
	if (lowerTitle.includes("dance")) {
		return LuMusic2;
	}
	return LuSparkles;
};

const CONNECTOR_EXTENSION = { base: "1rem", md: "5.25rem" };

function DividerLine({ align }: { align: "left" | "right" }) {
	const towardTimeline = align === "left" ? "right" : "left";

	return (
		<Box
			position="relative"
			w="full"
			h="2px"
			mt={3}
			bg="secondary.400"
			_before={{
				content: '""',
				position: "absolute",
				top: 0,
				h: "2px",
				bg: "secondary.400",
				w: CONNECTOR_EXTENSION,
				[towardTimeline]: "100%",
			}}
			_after={{
				content: '""',
				position: "absolute",
				top: "50%",
				w: "5px",
				h: "5px",
				borderRadius: "full",
				bg: "secondary.500",
				...(align === "left"
					? {
							left: { base: "calc(-1rem)", md: "calc(-5.25rem)" },
							transform: "translate(-50%, -50%)",
						}
					: {
							left: { base: "calc(100% + 1rem)", md: "calc(100% + 5.25rem)" },
							transform: "translate(-50%, -50%)",
						}),
			}}
		/>
	);
}

interface EventContentProps {
	label?: string;
	title: string;
	description: string;
	align: "left" | "right";
	index: number;
	animation: "fadeInLeft" | "fadeInRight";
}

function EventContent({
	label,
	title,
	description,
	align,
	index,
	animation,
}: EventContentProps) {
	const isLeft = align === "left";

	return (
		<Box
			maxW="300px"
			overflow="visible"
			opacity={0}
			animation={`${animation} 0.6s ease forwards`}
			sx={{
				"@keyframes fadeInLeft": {
					from: { opacity: 0, transform: "translateX(30px)" },
					to: { opacity: 1, transform: "translateX(0)" },
				},
				"@keyframes fadeInRight": {
					from: { opacity: 0, transform: "translateX(-30px)" },
					to: { opacity: 1, transform: "translateX(0)" },
				},
				animationDelay: `${index * 0.2}s`,
			}}
		>
			<VStack
				spacing={0}
				align={isLeft ? "flex-start" : "flex-end"}
			>
				{label ? (
					<Box
						alignSelf={isLeft ? "flex-start" : "flex-end"}
						w="fit-content"
						maxW="300px"
						overflow="visible"
					>
						<Text
							as="p"
							fontFamily="heading"
							fontSize={{ base: "2xl", md: "3xl" }}
							color="secondary.500"
							lineHeight="1.1"
							textAlign={isLeft ? "left" : "right"}
						>
							{label}
						</Text>
						<DividerLine align={isLeft ? "left" : "right"} />
					</Box>
				) : (
					<Heading
						as="h3"
						fontFamily="heading"
						fontSize={{ base: "2xl", md: "3xl" }}
						color="secondary.500"
						fontWeight="normal"
						lineHeight="1.1"
						textAlign={isLeft ? "left" : "right"}
					>
						{title}
					</Heading>
				)}

				{label && (
					<Text
						as="p"
						fontFamily="display"
						fontSize={{ base: "md", md: "lg" }}
						fontWeight="semibold"
						color="secondary.700"
						letterSpacing="0.02em"
						textAlign={isLeft ? "left" : "right"}
						mt={3}
						mb={2}
					>
						{title}
					</Text>
				)}

				<Text
					as="p"
					fontFamily="body"
					fontSize="sm"
					color="gray.600"
					lineHeight="1.7"
					textAlign={isLeft ? "left" : "right"}
					fontStyle="italic"
					opacity={0.9}
				>
					{description}
				</Text>
			</VStack>
		</Box>
	);
}

interface TimelineNodeProps {
	title: string;
	time: string;
	index: number;
	side: "left" | "right" | "mobile";
	isLast?: boolean;
}

function TimelineNode({ title, time, index, side, isLast }: TimelineNodeProps) {
	const IconComponent = getEventIcon(title);
	const iconSize = side === "mobile" ? 28 : 32;
	const nodeSize = side === "mobile" ? "64px" : "72px";
	const iconCenter = side === "mobile" ? "32px" : "36px";
	const gapToNext = side === "mobile" ? "64px" : "80px";

	return (
		<Box position="relative" alignSelf="flex-start" flexShrink={0}>
			{/* Vertical connector — only between events, not before first or after last */}
			{!isLast && (
				<Box
					position="absolute"
					left="50%"
					top={iconCenter}
					transform="translateX(-50%)"
					w="2px"
					h={`calc(100% - ${iconCenter} + ${gapToNext} + ${iconCenter})`}
					bg="linear-gradient(180deg, var(--chakra-colors-secondary-400), var(--chakra-colors-secondary-300))"
					zIndex={0}
					display={{ base: side === "mobile" ? "block" : "none", md: "block" }}
				/>
			)}

			<VStack spacing={2} zIndex={2} position="relative">
				<Box
					w={nodeSize}
					h={nodeSize}
					borderRadius="full"
					bg="secondary.50"
					border="3px solid"
					borderColor="secondary.400"
					display="flex"
					alignItems="center"
					justifyContent="center"
					boxShadow="0 2px 12px rgba(192, 57, 43, 0.15)"
					transition="transform 0.25s ease, box-shadow 0.25s ease"
					_hover={{
						transform: "scale(1.06)",
						boxShadow: "0 4px 16px rgba(192, 57, 43, 0.22)",
					}}
					opacity={0}
					animation="scaleIn 0.5s ease forwards"
					sx={{
						"@keyframes scaleIn": {
							from: { opacity: 0, transform: "scale(0.8)" },
							to: { opacity: 1, transform: "scale(1)" },
						},
						animationDelay: `${index * 0.2 + 0.2}s`,
					}}
				>
					<Box as={IconComponent} boxSize={`${iconSize}px`} color="secondary.600" strokeWidth={1.75} />
				</Box>

				<Box
					bg="white"
					color="secondary.600"
					borderWidth="1px"
					borderColor="secondary.200"
					px={side === "mobile" ? 2 : 4}
					py={side === "mobile" ? 1 : 1.5}
					borderRadius="full"
					fontFamily="display"
					fontSize={side === "mobile" ? "xs" : "sm"}
					fontWeight="600"
					letterSpacing="0.06em"
					whiteSpace="nowrap"
					textAlign="center"
				>
					{time}
				</Box>
			</VStack>
		</Box>
	);
}

export function ScheduleEvent({
	time,
	label,
	title,
	description,
	index,
	isLast,
}: ScheduleEventProps) {
	const isEven = index % 2 === 0;

	return (
		<Box position="relative" zIndex={1} overflow="visible">
			{/* ── Mobile layout: icon left, content right ── */}
			<Box
				display={{ base: "flex", md: "none" }}
				alignItems="flex-start"
				gap={4}
				position="relative"
			>
				<TimelineNode
					title={title}
					time={time}
					index={index}
					side="mobile"
					isLast={isLast}
				/>

				<Box pt={1} flex={1}>
					<EventContent
						label={label}
						title={title}
						description={description}
						align="left"
						index={index}
						animation="fadeInRight"
					/>
				</Box>
			</Box>

			{/* ── Desktop layout: alternating left / center / right ── */}
			<HStack
				spacing={8}
				justify="center"
				align="flex-start"
				position="relative"
				overflow="visible"
				display={{ base: "none", md: "flex" }}
			>
				<Box flex={1} display="flex" justifyContent="flex-end" order={1}>
					{!isEven && (
						<Box pr={4}>
							<EventContent
								label={label}
								title={title}
								description={description}
								align="right"
								index={index}
								animation="fadeInLeft"
							/>
						</Box>
					)}
				</Box>

				<Box order={2}>
					<TimelineNode
						title={title}
						time={time}
						index={index}
						side={isEven ? "right" : "left"}
						isLast={isLast}
					/>
				</Box>

				<Box flex={1} display="flex" justifyContent="flex-start" order={3}>
					{isEven && (
						<Box pl={4}>
							<EventContent
								label={label}
								title={title}
								description={description}
								align="left"
								index={index}
								animation="fadeInRight"
							/>
						</Box>
					)}
				</Box>
			</HStack>
		</Box>
	);
}
