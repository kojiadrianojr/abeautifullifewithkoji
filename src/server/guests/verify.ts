import "server-only";

import crypto from "node:crypto";

import { getGuestDisplayName } from "@/lib/guestDisplay";
import { getRsvpFormUrl, getRsvpNameEntry } from "@/server/rsvp/formConfig";
import { getAllGuests } from "./data";

export interface VerifyResult {
	ok: boolean;
	/**
	 * The reply-form URL, only present on a successful verification. Absent when
	 * the code is wrong OR when the server is missing `RSVP_FORM_URL`.
	 */
	formUrl?: string;
}

/**
 * Codes are compared case-insensitively and ignoring spaces/dashes so guests
 * can type them however they like (e.g. "k7q9zp", "K7Q9-ZP").
 */
function normalizeCode(value: string): string {
	return value.toUpperCase().replace(/[^0-9A-Z]/g, "");
}

/**
 * Length-safe constant-time comparison. Falls back to a self-compare when the
 * lengths differ so the early-return does not leak length via timing.
 */
function constantTimeEquals(a: string, b: string): boolean {
	const bufA = Buffer.from(a, "utf8");
	const bufB = Buffer.from(b, "utf8");
	if (bufA.length !== bufB.length) {
		crypto.timingSafeEqual(bufA, bufA);
		return false;
	}
	return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Build the reply-form URL from the server-only `RSVP_FORM_URL`, optionally
 * prefilling the guest's name via `RSVP_FORM_NAME_ENTRY` (a Google Form
 * `entry.<id>` field) so submissions are attributable for reconciliation.
 * Returns undefined when `RSVP_FORM_URL` is not configured.
 */
function buildFormUrl(displayName: string): string | undefined {
	const base = getRsvpFormUrl();
	if (!base) return undefined;

	try {
		const url = new URL(base);
		const nameEntry = getRsvpNameEntry();
		if (nameEntry) url.searchParams.set(nameEntry, displayName);
		return url.toString();
	} catch {
		return base;
	}
}

/**
 * Verify a guest's secret invite code. On success returns the (optionally
 * prefilled) reply-form URL. Never reveals whether the id or the code was the
 * reason for a failure.
 */
export function verifyGuestCode(id: string, code: string): VerifyResult {
	const normalizedInput = normalizeCode(code);
	if (!normalizedInput) return { ok: false };

	const guest = getAllGuests().find((candidate) => candidate.id === id);

	if (!guest?.inviteCode) {
		// Burn a comparison so an unknown/uncoded id costs the same as a real one.
		constantTimeEquals(normalizedInput, normalizedInput);
		return { ok: false };
	}

	if (!constantTimeEquals(normalizedInput, normalizeCode(guest.inviteCode))) {
		return { ok: false };
	}

	return { ok: true, formUrl: buildFormUrl(getGuestDisplayName(guest)) };
}
