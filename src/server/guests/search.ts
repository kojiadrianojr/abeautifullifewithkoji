import "server-only";

import type { Guest } from "@/config/guests/types";
import { getAllGuests } from "./data";
import { levenshtein } from "./levenshtein";

export const MIN_QUERY_LENGTH = 3;
export const MAX_QUERY_LENGTH = 80;
export const MAX_RESULTS = 6;

export interface GuestSearchResult {
	guests: Guest[];
	tooBroad: boolean;
}

/**
 * Edit-distance tolerance scales with the query length so short queries stay
 * strict (avoiding noisy matches) while longer names tolerate more typos.
 */
function maxDistanceFor(queryLength: number): number {
	if (queryLength <= 4) return 1;
	if (queryLength <= 7) return 2;
	return 3;
}

/**
 * Per-token tolerance is stricter than the whole-query tolerance: each word of
 * a multi-word query must match a word in the candidate fairly closely, which
 * keeps token-subset matching from drifting into noisy results.
 */
function tokenTolerance(tokenLength: number): number {
	if (tokenLength <= 2) return 0;
	if (tokenLength <= 4) return 1;
	if (tokenLength <= 7) return 2;
	return 3;
}

function normalize(value: string): string {
	return value.toLowerCase().trim();
}

function tokenize(value: string): string[] {
	return normalize(value)
		.split(/[\s.,]+/)
		.filter(Boolean);
}

/**
 * Order-independent token-subset match: every query token must match some
 * candidate token (exact, prefix, or within per-token edit tolerance). Returns
 * the summed best per-token distances, or Infinity if any token is unmatched.
 * This lets "Klyde Rayel" match "Klyde Reinier J. Rayel" (omitted middle name).
 */
function scoreTokens(candidateTokens: string[], queryTokens: string[]): number {
	if (candidateTokens.length === 0 || queryTokens.length === 0) return Infinity;

	let total = 0;

	for (const queryToken of queryTokens) {
		const tolerance = tokenTolerance(queryToken.length);
		let bestForToken = Infinity;

		for (const candidateToken of candidateTokens) {
			if (candidateToken === queryToken || candidateToken.startsWith(queryToken)) {
				bestForToken = 0;
				break;
			}
			const distance = levenshtein(candidateToken, queryToken);
			if (distance <= tolerance && distance < bestForToken) {
				bestForToken = distance;
			}
		}

		if (bestForToken === Infinity) return Infinity;
		total += bestForToken;
	}

	return total;
}

/**
 * Best (lowest) match score for a query against a single candidate string.
 * 0 means substring/exact hit; otherwise the smallest edit distance to the
 * whole string, any of its words, or a token-subset match, or Infinity when
 * nothing is close enough.
 */
function scoreCandidate(
	candidate: string,
	query: string,
	queryTokens: string[],
	maxDistance: number,
): number {
	const normalizedCandidate = normalize(candidate);
	if (!normalizedCandidate) return Infinity;

	if (normalizedCandidate.includes(query)) return 0;

	let best = levenshtein(normalizedCandidate, query);

	for (const word of normalizedCandidate.split(/\s+/)) {
		if (!word) continue;
		if (word.startsWith(query)) return 0;
		const distance = levenshtein(word, query);
		if (distance < best) best = distance;
	}

	const wordScore = best <= maxDistance ? best : Infinity;
	const tokenScore = scoreTokens(tokenize(candidate), queryTokens);

	return Math.min(wordScore, tokenScore);
}

function guestStrings(guest: Guest): string[] {
	const strings: string[] = [];
	if (guest.fullName) strings.push(guest.fullName);
	if (guest.groupName) strings.push(guest.groupName);
	if (guest.members) strings.push(...guest.members);
	return strings;
}

function scoreGuest(
	guest: Guest,
	query: string,
	queryTokens: string[],
	maxDistance: number,
): number {
	let best = Infinity;
	for (const candidate of guestStrings(guest)) {
		const score = scoreCandidate(candidate, query, queryTokens, maxDistance);
		if (score < best) best = score;
		if (best === 0) break;
	}
	return best;
}

/**
 * Fuzzy, typo-tolerant guest search. Returns only matching guests (capped),
 * ranked by closeness — never the full list. Broad/vague queries that match
 * more guests than the cap reveal no names (tooBroad) to deter data mining.
 */
export function searchGuests(searchTerm: string): GuestSearchResult {
	const query = normalize(searchTerm);
	if (query.length < MIN_QUERY_LENGTH) return { guests: [], tooBroad: false };

	const maxDistance = maxDistanceFor(query.length);
	const queryTokens = tokenize(searchTerm);

	const scored = getAllGuests()
		.map((guest) => ({
			guest,
			score: scoreGuest(guest, query, queryTokens, maxDistance),
		}))
		.filter((entry) => entry.score !== Infinity);

	if (scored.length > MAX_RESULTS) {
		return { guests: [], tooBroad: true };
	}

	scored.sort((a, b) => a.score - b.score);

	return { guests: scored.map((entry) => entry.guest), tooBroad: false };
}
