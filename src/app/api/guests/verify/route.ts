import { NextResponse } from "next/server";
import { verifyGuestCode } from "@/server/guests/verify";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" } as const;

// IP burst limiting, mirroring the guest search route. Best-effort and
// per-instance (serverless instances are ephemeral and not shared); swap for a
// durable store (e.g. Upstash) if global accuracy is needed.
const RATE_LIMIT_MINUTE_MS = 60_000;
const RATE_LIMIT_MINUTE_MAX = 10;
const RATE_LIMIT_HOUR_MS = 3_600_000;
const RATE_LIMIT_HOUR_MAX = 40;

// Per-guest brute-force lockout: after too many failed attempts against a
// single guest id (i.e. a known name), lock that id for a while so an attacker
// cannot grind the code space even from rotating IPs.
const LOCKOUT_WINDOW_MS = 15 * 60_000;
const LOCKOUT_MAX_FAILURES = 5;

interface RateWindow {
	count: number;
	resetAt: number;
}

const minuteHits = new Map<string, RateWindow>();
const hourHits = new Map<string, RateWindow>();
const guestFailures = new Map<string, RateWindow>();

function getClientIp(request: Request): string {
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) return forwarded.split(",")[0].trim();
	return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function exceedsWindow(
	store: Map<string, RateWindow>,
	key: string,
	windowMs: number,
	max: number,
): boolean {
	const now = Date.now();
	const entry = store.get(key);

	if (!entry || now > entry.resetAt) {
		store.set(key, { count: 1, resetAt: now + windowMs });
		return false;
	}

	entry.count += 1;
	return entry.count > max;
}

function isRateLimited(ip: string): boolean {
	const minuteExceeded = exceedsWindow(
		minuteHits,
		ip,
		RATE_LIMIT_MINUTE_MS,
		RATE_LIMIT_MINUTE_MAX,
	);
	const hourExceeded = exceedsWindow(
		hourHits,
		ip,
		RATE_LIMIT_HOUR_MS,
		RATE_LIMIT_HOUR_MAX,
	);
	return minuteExceeded || hourExceeded;
}

function isGuestLocked(id: string): boolean {
	const entry = guestFailures.get(id);
	if (!entry) return false;
	if (Date.now() > entry.resetAt) {
		guestFailures.delete(id);
		return false;
	}
	return entry.count >= LOCKOUT_MAX_FAILURES;
}

function recordGuestFailure(id: string): void {
	const now = Date.now();
	const entry = guestFailures.get(id);
	if (!entry || now > entry.resetAt) {
		guestFailures.set(id, { count: 1, resetAt: now + LOCKOUT_WINDOW_MS });
		return;
	}
	entry.count += 1;
}

export async function POST(request: Request) {
	if (isRateLimited(getClientIp(request))) {
		return NextResponse.json(
			{ error: "Too many requests. Please slow down." },
			{ status: 429, headers: NO_STORE_HEADERS },
		);
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ error: "Invalid request body." },
			{ status: 400, headers: NO_STORE_HEADERS },
		);
	}

	const id =
		typeof body === "object" && body !== null && "id" in body
			? (body as { id: unknown }).id
			: undefined;
	const code =
		typeof body === "object" && body !== null && "code" in body
			? (body as { code: unknown }).code
			: undefined;

	if (typeof id !== "string" || !id.trim() || typeof code !== "string" || !code.trim()) {
		return NextResponse.json(
			{ error: "An invite code is required." },
			{ status: 400, headers: NO_STORE_HEADERS },
		);
	}

	const guestId = id.trim();

	if (isGuestLocked(guestId)) {
		return NextResponse.json(
			{ error: "Too many attempts. Please try again in a little while." },
			{ status: 429, headers: NO_STORE_HEADERS },
		);
	}

	const result = verifyGuestCode(guestId, code);

	if (!result.ok) {
		recordGuestFailure(guestId);
		// Generic message: never reveal whether the name or the code was wrong.
		return NextResponse.json(
			{ error: "That code doesn't match your invitation. Please check and try again." },
			{ status: 401, headers: NO_STORE_HEADERS },
		);
	}

	if (!result.formUrl) {
		// Code was correct but the server is missing RSVP_FORM_URL.
		return NextResponse.json(
			{ error: "The reply form is unavailable right now. Please try again later." },
			{ status: 503, headers: NO_STORE_HEADERS },
		);
	}

	guestFailures.delete(guestId);

	return NextResponse.json(
		{ formUrl: result.formUrl },
		{ status: 200, headers: NO_STORE_HEADERS },
	);
}
