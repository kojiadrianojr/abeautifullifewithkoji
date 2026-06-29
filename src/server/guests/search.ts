import "server-only";

import type { Guest } from "@/config/guests/types";
import { getAllGuests } from "./data";
import { levenshtein } from "./levenshtein";

export const MIN_QUERY_LENGTH = 3;
export const MAX_QUERY_LENGTH = 80;
export const MAX_RESULTS = 8;

/**
 * Edit-distance tolerance scales with the query length so short queries stay
 * strict (avoiding noisy matches) while longer names tolerate more typos.
 */
function maxDistanceFor(queryLength: number): number {
	if (queryLength <= 4) return 1;
	if (queryLength <= 7) return 2;
	return 3;
}

function normalize(value: string): string {
	return value.toLowerCase().trim();
}

/**
 * Best (lowest) match score for a query against a single candidate string.
 * 0 means substring/exact hit; otherwise the smallest edit distance to the
 * whole string or any of its words, or Infinity when nothing is close enough.
 */
function scoreCandidate(candidate: string, query: string, maxDistance: number): number {
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

	return best <= maxDistance ? best : Infinity;
}

function guestStrings(guest: Guest): string[] {
	const strings: string[] = [];
	if (guest.fullName) strings.push(guest.fullName);
	if (guest.groupName) strings.push(guest.groupName);
	if (guest.members) strings.push(...guest.members);
	return strings;
}

function scoreGuest(guest: Guest, query: string, maxDistance: number): number {
	let best = Infinity;
	for (const candidate of guestStrings(guest)) {
		const score = scoreCandidate(candidate, query, maxDistance);
		if (score < best) best = score;
		if (best === 0) break;
	}
	return best;
}

/**
 * Fuzzy, typo-tolerant guest search. Returns only matching guests (capped),
 * ranked by closeness — never the full list.
 */
export function searchGuests(searchTerm: string): Guest[] {
	const query = normalize(searchTerm);
	if (query.length < MIN_QUERY_LENGTH) return [];

	const maxDistance = maxDistanceFor(query.length);

	const scored = getAllGuests()
		.map((guest) => ({ guest, score: scoreGuest(guest, query, maxDistance) }))
		.filter((entry) => entry.score !== Infinity);

	scored.sort((a, b) => a.score - b.score);

	return scored.slice(0, MAX_RESULTS).map((entry) => entry.guest);
}
