import { NextResponse } from "next/server";
import {
	searchGuests,
	MIN_QUERY_LENGTH,
	MAX_QUERY_LENGTH,
} from "@/server/guests/search";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" } as const;

// Best-effort, per-instance rate limiting. Serverless instances are ephemeral
// and not shared, so this throttles bursts from a single client without
// promising global accuracy. Swap for a durable store (e.g. Upstash) if needed.
// Two windows guard against both rapid bursts and slow enumeration (data mining)
// of the guest list.
const RATE_LIMIT_MINUTE_MS = 60_000;
const RATE_LIMIT_MINUTE_MAX = 12;
const RATE_LIMIT_HOUR_MS = 3_600_000;
const RATE_LIMIT_HOUR_MAX = 60;

interface RateWindow {
	count: number;
	resetAt: number;
}

const minuteHits = new Map<string, RateWindow>();
const hourHits = new Map<string, RateWindow>();

function getClientIp(request: Request): string {
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) return forwarded.split(",")[0].trim();
	return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function exceedsWindow(
	store: Map<string, RateWindow>,
	ip: string,
	windowMs: number,
	max: number,
): boolean {
	const now = Date.now();
	const entry = store.get(ip);

	if (!entry || now > entry.resetAt) {
		store.set(ip, { count: 1, resetAt: now + windowMs });
		return false;
	}

	entry.count += 1;
	return entry.count > max;
}

function isRateLimited(ip: string): boolean {
	// Evaluate both windows so each increments on every request.
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

	const query =
		typeof body === "object" && body !== null && "query" in body
			? (body as { query: unknown }).query
			: undefined;

	if (typeof query !== "string") {
		return NextResponse.json(
			{ error: "A search query is required." },
			{ status: 400, headers: NO_STORE_HEADERS },
		);
	}

	const trimmed = query.trim();

	if (trimmed.length < MIN_QUERY_LENGTH) {
		return NextResponse.json(
			{
				error: `Please enter at least ${MIN_QUERY_LENGTH} characters.`,
				guests: [],
			},
			{ status: 400, headers: NO_STORE_HEADERS },
		);
	}

	if (trimmed.length > MAX_QUERY_LENGTH) {
		return NextResponse.json(
			{ error: "Search query is too long." },
			{ status: 400, headers: NO_STORE_HEADERS },
		);
	}

	const { guests, tooBroad } = searchGuests(trimmed);

	return NextResponse.json(
		{ guests, tooBroad },
		{ status: 200, headers: NO_STORE_HEADERS },
	);
}
