"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { VStack, Box, Link, Input, Text, useToast } from "@chakra-ui/react";
import { EditIcon, RepeatIcon, LockIcon } from "@chakra-ui/icons";
import type { PublicGuest } from "@/services";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { GuestSearchInput } from "./GuestSearchInput";
import { GuestResult } from "./GuestResult";
import { GuestSearchResultsList } from "./GuestSearchResultsList";
import { NotFoundMessage } from "./NotFoundMessage";
import { RSVPSearchAlert } from "./RSVPSearchAlert";
import { RSVPScrollHint } from "./RSVPScrollHint";
import {
	RSVPCard,
	RSVPStepLabel,
	RSVPDivider,
	RSVPHelperText,
	RSVPNoteText,
	RSVP_OUTLINE_BUTTON_PROPS,
} from "./RSVPPrimitives";

const SCROLL_HINT_DELAY_MS = 2500;
const MIN_QUERY_LENGTH = 3;

function findExactMatch(guests: PublicGuest[], term: string): PublicGuest | null {
	const normalized = term.toLowerCase().trim();
	return (
		guests.find((guest) => {
			if (guest.fullName?.toLowerCase() === normalized) return true;
			if (guest.members) {
				return guest.members.some((member) => member.toLowerCase() === normalized);
			}
			return false;
		}) ?? null
	);
}

function getSearchAlert(
	results: PublicGuest[],
	selectedGuest: PublicGuest | null,
	tooBroad: boolean,
): { status: "success" | "info" | "warning"; title: string; description: string } | null {
	if (tooBroad) {
		return {
			status: "warning",
			title: "Too many matches",
			description: "Please enter your full name as printed on your invitation.",
		};
	}

	if (results.length === 0) {
		return {
			status: "warning",
			title: "Name not found",
			description: "Scroll down for tips on what to try.",
		};
	}

	if (selectedGuest) {
		return {
			status: "success",
			title: "We found your name!",
			description: "Scroll down to finish your reply.",
		};
	}

	return {
		status: "info",
		title: `We found ${results.length} names`,
		description: "Scroll down to pick yours.",
	};
}

export function GuestSearch() {
	const toast = useToast();
	const resultsRef = useRef<HTMLDivElement>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchedTerm, setSearchedTerm] = useState("");
	const [matchingGuests, setMatchingGuests] = useState<PublicGuest[]>([]);
	const [selectedGuest, setSelectedGuest] = useState<PublicGuest | null>(null);
	const [isTooBroad, setIsTooBroad] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [showScrollHint, setShowScrollHint] = useState(false);
	const [inviteCode, setInviteCode] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [verifyError, setVerifyError] = useState<string | null>(null);
	const [verifiedFormUrl, setVerifiedFormUrl] = useState<string | null>(null);

	const clearVerification = useCallback(() => {
		setInviteCode("");
		setIsVerifying(false);
		setVerifyError(null);
		setVerifiedFormUrl(null);
	}, []);

	const searchAlert = useMemo(
		() =>
			hasSearched && !isSearching
				? getSearchAlert(matchingGuests, selectedGuest, isTooBroad)
				: null,
		[hasSearched, isSearching, matchingGuests, selectedGuest, isTooBroad],
	);

	const notifySearchResult = useCallback(
		(results: PublicGuest[], selected: PublicGuest | null, tooBroad: boolean) => {
			const alert = getSearchAlert(results, selected, tooBroad);
			if (!alert) return;

			toast({
				title: alert.title,
				description: alert.description,
				status: alert.status,
				duration: 4000,
				isClosable: true,
				position: "top",
			});
		},
		[toast],
	);

	const scheduleScrollHint = useCallback(() => {
		setShowScrollHint(false);

		const timer = window.setTimeout(() => {
			const el = resultsRef.current;
			if (!el) return;

			const rect = el.getBoundingClientRect();
			const visibleHeight =
				Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
			const visibleRatio = visibleHeight / rect.height;

			if (visibleRatio < 0.35) {
				setShowScrollHint(true);
			}
		}, SCROLL_HINT_DELAY_MS);

		return () => window.clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!hasSearched) {
			setShowScrollHint(false);
			return;
		}

		return scheduleScrollHint();
	}, [hasSearched, matchingGuests, selectedGuest, scheduleScrollHint]);

	useEffect(() => {
		const el = resultsRef.current;
		if (!el || !showScrollHint) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setShowScrollHint(false);
				}
			},
			{ threshold: 0.15, rootMargin: "-40px 0px 0px 0px" },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [showScrollHint, hasSearched, matchingGuests, selectedGuest]);

	const handleSearch = async () => {
		const trimmed = searchTerm.trim();

		if (!trimmed) {
			setMatchingGuests([]);
			setSelectedGuest(null);
			setHasSearched(false);
			return;
		}

		if (trimmed.length < MIN_QUERY_LENGTH) {
			toast({
				title: "Keep typing",
				description: `Please enter at least ${MIN_QUERY_LENGTH} characters to search.`,
				status: "info",
				duration: 4000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		setIsSearching(true);
		setHasSearched(true);
		setSearchedTerm(trimmed);
		setShowScrollHint(false);

		try {
			const response = await fetch("/api/guests/search", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query: trimmed }),
			});

			if (!response.ok) {
				throw new Error(`Search request failed with status ${response.status}`);
			}

			const data = (await response.json()) as {
				guests?: PublicGuest[];
				tooBroad?: boolean;
			};
			const tooBroad = data.tooBroad ?? false;
			const results = tooBroad ? [] : data.guests ?? [];
			clearVerification();
			setMatchingGuests(results);
			setIsTooBroad(tooBroad);

			let selected: PublicGuest | null = null;
			if (results.length === 1) {
				selected = results[0];
			} else if (results.length > 1) {
				selected = findExactMatch(results, trimmed);
			}

			setSelectedGuest(selected);
			notifySearchResult(results, selected, tooBroad);
		} catch (err) {
			setMatchingGuests([]);
			setSelectedGuest(null);
			setIsTooBroad(false);
			console.error("Guest search error:", err);
			toast({
				title: "Something went wrong",
				description: "Please try again in a moment.",
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsSearching(false);
		}
	};

	const handleReset = () => {
		setSearchTerm("");
		setSearchedTerm("");
		setMatchingGuests([]);
		setSelectedGuest(null);
		setIsTooBroad(false);
		setHasSearched(false);
		setShowScrollHint(false);
		clearVerification();
	};

	const handleRefineSearch = () => {
		setMatchingGuests([]);
		setSelectedGuest(null);
		setIsTooBroad(false);
		setHasSearched(false);
		setShowScrollHint(false);
		clearVerification();
	};

	const handleBackToList = () => {
		setSelectedGuest(null);
		clearVerification();
	};

	const handleGuestSelect = (guest: PublicGuest) => {
		setSelectedGuest(guest);
		clearVerification();
		notifySearchResult(matchingGuests, guest, false);
	};

	const handleVerify = async () => {
		if (!selectedGuest) return;

		const code = inviteCode.trim();
		if (!code) {
			toast({
				title: "Enter your code",
				description: "Please type the invite code printed on your invitation.",
				status: "info",
				duration: 4000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		setIsVerifying(true);
		setVerifyError(null);

		try {
			const response = await fetch("/api/guests/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: selectedGuest.id, code }),
			});

			const data = (await response.json().catch(() => ({}))) as {
				formUrl?: string;
				error?: string;
			};

			if (!response.ok || !data.formUrl) {
				const message =
					data.error ?? "We couldn't verify that code. Please try again.";
				setVerifyError(message);
				toast({
					title: "Code not verified",
					description: message,
					status: "error",
					duration: 4000,
					isClosable: true,
					position: "top",
				});
				return;
			}

			setVerifiedFormUrl(data.formUrl);
			toast({
				title: "You're verified!",
				description: "Your reply form is ready to open.",
				status: "success",
				duration: 4000,
				isClosable: true,
				position: "top",
			});
		} catch (err) {
			console.error("Guest verify error:", err);
			const message = "Something went wrong. Please try again in a moment.";
			setVerifyError(message);
			toast({
				title: "Something went wrong",
				description: message,
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "top",
			});
		} finally {
			setIsVerifying(false);
		}
	};

	return (
		<>
			<VStack spacing={4} w="100%" align="stretch">
				<GuestSearchInput
					value={searchTerm}
					onChange={setSearchTerm}
					onSearch={handleSearch}
					isLoading={isSearching}
				/>

				{searchAlert && (
					<RSVPSearchAlert
						status={searchAlert.status}
						title={searchAlert.title}
						description={searchAlert.description}
					/>
				)}

				{hasSearched && !isSearching && (
					<Box w="100%" ref={resultsRef}>
						{matchingGuests.length > 1 && !selectedGuest ? (
							<GuestSearchResultsList
								guests={matchingGuests}
								searchTerm={searchedTerm}
								onSelect={handleGuestSelect}
								onRefineSearch={handleRefineSearch}
							/>
						) : selectedGuest ? (
							<VStack spacing={4} w="100%">
								<GuestResult
									guest={selectedGuest}
									stepLabel={
										matchingGuests.length > 1
											? "Step 2 of 2 — Check your name"
											: "Step 2 of 2"
									}
									onWrongGuest={
										matchingGuests.length > 1
											? handleBackToList
											: handleReset
									}
									wrongGuestLabel={
										matchingGuests.length > 1
											? "Go Back to the List"
											: "This Is Not My Name"
									}
								/>

								<RSVPCard>
									<VStack spacing={3} p={{ base: 4, md: 5 }} align="stretch">
										<RSVPStepLabel>Almost done</RSVPStepLabel>

										<RSVPDivider />

										{verifiedFormUrl ? (
											<>
												<RSVPHelperText>
													You&apos;re verified! Tap the button below to open the
													reply form. It will open in a new tab.
												</RSVPHelperText>

												<Link
													href={verifiedFormUrl}
													target="_blank"
													rel="noopener noreferrer"
													_hover={{ textDecoration: "none" }}
													w="100%"
												>
													<AnimatedButton
														size="lg"
														variant="solid"
														bg="secondary.500"
														color="white"
														leftIcon={<EditIcon />}
														px={{ base: 8, md: 10 }}
														py={{ base: 6, md: 7 }}
														minH="52px"
														fontSize={{ base: "md", md: "lg" }}
														fontFamily="body"
														fontWeight="semibold"
														w="100%"
														borderRadius="xl"
														boxShadow="0 4px 16px rgba(192,57,43,0.3)"
														_hover={{
															bg: "secondary.600",
															boxShadow: "0 6px 24px rgba(192,57,43,0.4)",
															transform: "translateY(-2px)",
														}}
													>
														Go to Reply Form
													</AnimatedButton>
												</Link>
											</>
										) : (
											<>
												<RSVPHelperText>
													Enter the invite code printed on your invitation to
													unlock your reply form.
												</RSVPHelperText>

												<Input
													value={inviteCode}
													onChange={(e) => setInviteCode(e.target.value)}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															void handleVerify();
														}
													}}
													placeholder="e.g. K7Q9ZP"
													aria-label="Invite code"
													autoCapitalize="characters"
													autoCorrect="off"
													spellCheck={false}
													maxLength={16}
													isDisabled={isVerifying}
													isInvalid={Boolean(verifyError)}
													bg="white"
													textAlign="center"
													fontFamily="body"
													fontSize={{ base: "lg", md: "xl" }}
													fontWeight="semibold"
													letterSpacing="0.25em"
													textTransform="uppercase"
													minH="52px"
													borderRadius="xl"
													borderColor="purple.100"
													_placeholder={{
														letterSpacing: "normal",
														textTransform: "none",
														fontWeight: "normal",
														color: "gray.400",
													}}
													_focusVisible={{
														borderColor: "secondary.400",
														boxShadow:
															"0 0 0 1px var(--chakra-colors-secondary-400)",
													}}
												/>

												{verifyError && (
													<Text
														fontFamily="body"
														fontSize={{ base: "sm", md: "md" }}
														color="secondary.600"
														textAlign="center"
														lineHeight="tall"
														role="alert"
													>
														{verifyError}
													</Text>
												)}

												<AnimatedButton
													size="lg"
													variant="solid"
													bg="secondary.500"
													color="white"
													leftIcon={<LockIcon />}
													onClick={() => void handleVerify()}
													isLoading={isVerifying}
													loadingText="Checking your code…"
													px={{ base: 8, md: 10 }}
													py={{ base: 6, md: 7 }}
													minH="52px"
													fontSize={{ base: "md", md: "lg" }}
													fontFamily="body"
													fontWeight="semibold"
													w="100%"
													borderRadius="xl"
													boxShadow="0 4px 16px rgba(192,57,43,0.3)"
													_hover={{
														bg: "secondary.600",
														boxShadow: "0 6px 24px rgba(192,57,43,0.4)",
														transform: "translateY(-2px)",
													}}
												>
													Unlock My Reply Form
												</AnimatedButton>

												<RSVPNoteText>
													The code is on your invitation. Can&apos;t find it?
													Please reach out to the couple.
												</RSVPNoteText>
											</>
										)}

										<RSVPNoteText>
											You can come back here anytime if you need to look up your
											name again.
										</RSVPNoteText>

										<AnimatedButton
											w="100%"
											minH="44px"
											leftIcon={<RepeatIcon />}
											onClick={handleReset}
											{...RSVP_OUTLINE_BUTTON_PROPS}
										>
											Try a Different Name
										</AnimatedButton>
									</VStack>
								</RSVPCard>
							</VStack>
						) : (
							<VStack spacing={4} w="100%">
								<NotFoundMessage
									searchTerm={searchedTerm}
									reason={isTooBroad ? "too_broad" : "not_found"}
								/>

								<AnimatedButton
									w="100%"
									minH="44px"
									onClick={handleReset}
									{...RSVP_OUTLINE_BUTTON_PROPS}
								>
									Try Again
								</AnimatedButton>
							</VStack>
						)}
					</Box>
				)}
			</VStack>

			<RSVPScrollHint targetRef={resultsRef} show={showScrollHint} />
		</>
	);
}
