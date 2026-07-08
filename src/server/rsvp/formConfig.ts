import "server-only";

import rsvpConfig from "@/config/rsvp.json";

/**
 * Server-only RSVP form config. The value is baked into the function bundle at
 * build time (config/rsvp.json is synthesized by next.config.ts from the
 * RSVP_JSON / RSVP_FORM_URL secrets), so it is available at RUNTIME without
 * relying on the Vercel dashboard env. A runtime `process.env` fallback is kept
 * so setting the vars directly in the host dashboard also works.
 */
interface RsvpFormConfig {
	formUrl?: string;
	nameEntry?: string;
}

const fileConfig = rsvpConfig as RsvpFormConfig;

function firstNonEmpty(...values: (string | undefined)[]): string | undefined {
	for (const value of values) {
		const trimmed = value?.trim();
		if (trimmed) return trimmed;
	}
	return undefined;
}

/** The reply-form URL, or undefined when RSVP is not configured yet. */
export function getRsvpFormUrl(): string | undefined {
	return firstNonEmpty(fileConfig.formUrl, process.env.RSVP_FORM_URL);
}

/** The Google Form `entry.<id>` name field, or undefined to skip prefilling. */
export function getRsvpNameEntry(): string | undefined {
	return firstNonEmpty(fileConfig.nameEntry, process.env.RSVP_FORM_NAME_ENTRY);
}
