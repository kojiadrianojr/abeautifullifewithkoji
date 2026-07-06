"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
	Box,
	Text,
	VStack,
	Button,
	HStack,
	Icon,
	Flex,
} from "@chakra-ui/react";
import { SearchIcon, ChevronDownIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import type { Guest } from "@/services";
import { getGuestDisplayName } from "@/lib/guestDisplay";
import {
	RSVPCard,
	RSVPStepLabel,
	RSVPCardHeader,
	RSVPDivider,
	RSVPHelperText,
	RSVP_OUTLINE_BUTTON_PROPS,
} from "./RSVPPrimitives";

export interface GuestSearchResultsListProps {
	guests: Guest[];
	searchTerm: string;
	onSelect: (guest: Guest) => void;
	onRefineSearch?: () => void;
}

function HighlightMatch({
	text,
	searchTerm,
}: {
	text: string;
	searchTerm: string;
}) {
	const normalized = searchTerm.toLowerCase().trim();
	if (!normalized) {
		return <>{text}</>;
	}

	const lowerText = text.toLowerCase();
	const matchIndex = lowerText.indexOf(normalized);
	if (matchIndex === -1) {
		return <>{text}</>;
	}

	const before = text.slice(0, matchIndex);
	const match = text.slice(matchIndex, matchIndex + normalized.length);
	const after = text.slice(matchIndex + normalized.length);

	return (
		<>
			{before}
			<Text as="span" fontWeight="bold" color="secondary.600">
				{match}
			</Text>
			{after}
		</>
	);
}

function formatMembers(members: string[], searchTerm: string) {
	return members.map((member, i) => (
		<span key={member}>
			{i > 0 &&
				(i === members.length - 1
					? members.length === 2
						? " and "
						: ", and "
					: ", ")}
			<HighlightMatch text={member} searchTerm={searchTerm} />
		</span>
	));
}

const SCROLLBAR_CSS = {
	"&::-webkit-scrollbar": { width: "6px" },
	"&::-webkit-scrollbar-thumb": {
		background: "var(--chakra-colors-secondary-300)",
		borderRadius: "4px",
	},
	"&::-webkit-scrollbar-track": {
		background: "var(--chakra-colors-purple-50)",
		borderRadius: "4px",
	},
	scrollbarWidth: "thin",
	scrollbarColor:
		"var(--chakra-colors-secondary-300) var(--chakra-colors-purple-50)",
} as const;

export function GuestSearchResultsList({
	guests,
	searchTerm,
	onSelect,
	onRefineSearch,
}: GuestSearchResultsListProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScroll, setCanScroll] = useState(false);
	const [isAtTop, setIsAtTop] = useState(true);
	const [isAtBottom, setIsAtBottom] = useState(false);

	const updateScrollState = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;

		const { scrollTop, scrollHeight, clientHeight } = el;
		const overflow = scrollHeight > clientHeight + 2;
		setCanScroll(overflow);
		setIsAtTop(scrollTop <= 4);
		setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 4);
	}, []);

	useEffect(() => {
		updateScrollState();
		const el = scrollRef.current;
		if (!el) return;

		const observer = new ResizeObserver(updateScrollState);
		observer.observe(el);
		return () => observer.disconnect();
	}, [guests.length, updateScrollState]);

	const scrollDown = () => {
		scrollRef.current?.scrollBy({ top: 96, behavior: "smooth" });
	};

	const listMaxHeight = { base: "min(240px, 42vh)", md: "min(280px, 38vh)" };

	return (
		<RSVPCard>
			<VStack spacing={3} p={{ base: 4, md: 5 }} align="stretch" minW={0}>
				<RSVPStepLabel>Step 1 of 2 — Pick your name</RSVPStepLabel>

				<RSVPCardHeader
					icon={SearchIcon}
					title="We found a few names"
					subtitle={`${guests.length} ${guests.length === 1 ? "match" : "matches"}`}
				/>

				<RSVPDivider />

				<RSVPHelperText>
					Tap the name on your invitation. Your typed name is shown in{" "}
					<Text as="span" fontWeight="bold" color="secondary.600">
						bold
					</Text>
					.
				</RSVPHelperText>

				<Box position="relative" w="100%" minW={0}>
					{canScroll && !isAtTop && (
						<Box
							position="absolute"
							top={0}
							left={0}
							right={0}
							h="14px"
							bgGradient="linear(to-b, white, transparent)"
							pointerEvents="none"
							zIndex={1}
						/>
					)}

					<Box
						ref={scrollRef}
						w="100%"
						minW={0}
						maxH={listMaxHeight}
						overflowY="auto"
						overflowX="hidden"
						px={0.5}
						onScroll={updateScrollState}
						css={SCROLLBAR_CSS}
						role="listbox"
						aria-label="Matching guest invitations"
					>
						<VStack spacing={2} align="stretch" w="100%">
							{guests.map((guest) => {
								const displayName = getGuestDisplayName(guest);
								const showMembers =
									guest.groupName &&
									guest.members &&
									guest.members.length > 0;
								const initial =
									displayName.replace(/^[^A-Za-z]*/, "").charAt(0).toUpperCase() ||
									"?";

								return (
									<Button
										key={guest.id}
										variant="outline"
										w="100%"
										maxW="100%"
										h="auto"
										minH="48px"
										py={3}
										px={3.5}
										borderRadius="xl"
										borderColor="purple.100"
										bg="white"
										boxShadow="0 1px 6px rgba(195,177,225,0.12)"
										textAlign="left"
										whiteSpace="normal"
										overflow="hidden"
										justifyContent="flex-start"
										alignItems="flex-start"
										flexShrink={0}
										onClick={() => onSelect(guest)}
										role="option"
										aria-label={`Select ${displayName}`}
										_hover={{
											borderColor: "secondary.300",
											bg: "secondary.50",
											boxShadow: "0 4px 14px rgba(192,57,43,0.1)",
										}}
										_active={{ bg: "secondary.100" }}
									>
										<HStack spacing={3} align="flex-start" w="100%" minW={0}>
											<Flex
												as="span"
												align="center"
												justify="center"
												boxSize={9}
												borderRadius="full"
												bg="purple.50"
												color="primary.500"
												fontSize="sm"
												fontWeight="semibold"
												flexShrink={0}
												fontFamily="body"
												mt={0.5}
											>
												{initial}
											</Flex>

											<Box flex={1} minW={0} overflow="hidden">
												<Text
													fontFamily="body"
													fontSize={{ base: "md", md: "lg" }}
													fontWeight="semibold"
													color="gray.800"
													lineHeight="short"
													wordBreak="break-word"
													overflowWrap="anywhere"
													noOfLines={2}
												>
													<HighlightMatch
														text={displayName}
														searchTerm={searchTerm}
													/>
												</Text>
												{showMembers && (
													<Text
														fontFamily="body"
														fontSize={{ base: "sm", md: "md" }}
														color="gray.600"
														mt={0.5}
														lineHeight="short"
														wordBreak="break-word"
														overflowWrap="anywhere"
														noOfLines={3}
													>
														{formatMembers(guest.members!, searchTerm)}
													</Text>
												)}
											</Box>
										</HStack>
									</Button>
								);
							})}
						</VStack>
					</Box>

					{canScroll && !isAtBottom && (
						<Box
							position="absolute"
							bottom={0}
							left={0}
							right={0}
							h="20px"
							bgGradient="linear(to-t, white, transparent)"
							pointerEvents="none"
							zIndex={1}
						/>
					)}
				</Box>

				{canScroll && !isAtBottom && (
					<Button
						variant="ghost"
						size="sm"
						h="auto"
						py={1}
						color="secondary.500"
						fontWeight="medium"
						fontFamily="body"
						fontSize={{ base: "md", md: "lg" }}
						onClick={scrollDown}
						rightIcon={<Icon as={ChevronDownIcon} boxSize={4} />}
						_hover={{ bg: "secondary.50" }}
						aria-label="Scroll down to see more guests"
					>
						Show more names
					</Button>
				)}

				{onRefineSearch && (
					<AnimatedButton
						w="100%"
						minH="44px"
						leftIcon={<ArrowBackIcon />}
						onClick={onRefineSearch}
						{...RSVP_OUTLINE_BUTTON_PROPS}
					>
						Try a Different Name
					</AnimatedButton>
				)}
			</VStack>
		</RSVPCard>
	);
}
