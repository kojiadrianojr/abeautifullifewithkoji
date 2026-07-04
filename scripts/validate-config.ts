#!/usr/bin/env tsx
/**
 * Lightweight, dependency-free config validator.
 *
 * Verifies that config/wedding.json exists, is valid JSON, and contains the
 * required top-level structure the app relies on at build/runtime. Also checks
 * that the guest list files parse as `{ "guests": [...] }` IF they are present
 * (they are gitignored and injected from secrets in CI, so absence is fine).
 *
 * Exits non-zero with a clear message on the first failure so it can gate CI.
 *
 * Usage:
 *   npm run validate-config
 */

import fs from "fs";
import path from "path";

const errors: string[] = [];

function fail(msg: string): void {
	errors.push(msg);
}

function readJson(relPath: string): unknown | undefined {
	const full = path.resolve(relPath);
	if (!fs.existsSync(full)) return undefined;
	const raw = fs.readFileSync(full, "utf8");
	try {
		return JSON.parse(raw);
	} catch (err) {
		fail(`${relPath}: invalid JSON — ${(err as Error).message}`);
		return undefined;
	}
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Assert a dotted path (e.g. "wedding.couple.partner1.firstName") exists. */
function requirePath(root: Record<string, unknown>, dotted: string): void {
	const parts = dotted.split(".");
	let current: unknown = root;
	const walked: string[] = [];
	for (const part of parts) {
		walked.push(part);
		if (!isObject(current) || !(part in current)) {
			fail(`config/wedding.json: missing required key "${walked.join(".")}"`);
			return;
		}
		current = (current as Record<string, unknown>)[part];
	}
}

// --- config/wedding.json (required) ---------------------------------------
const wedding = readJson("config/wedding.json");
if (wedding === undefined && errors.length === 0) {
	fail("config/wedding.json: file not found (required to build the site)");
} else if (wedding !== undefined) {
	if (!isObject(wedding)) {
		fail("config/wedding.json: expected a top-level JSON object");
	} else {
		const requiredPaths = [
			"wedding.couple.partner1.firstName",
			"wedding.couple.partner2.firstName",
			"wedding.date",
			"wedding.venue.ceremony",
			"wedding.venue.reception",
			"content",
			"contact",
			"social",
		];
		for (const p of requiredPaths) requirePath(wedding, p);
	}
}

// --- config/guests/*.json (optional; gitignored, injected in CI) ----------
for (const guestFile of ["config/guests/bea.json", "config/guests/koji.json"]) {
	if (!fs.existsSync(path.resolve(guestFile))) {
		console.log(`  ℹ️  ${guestFile} absent — skipping (injected from secrets in CI).`);
		continue;
	}
	const parsed = readJson(guestFile);
	if (parsed === undefined) continue; // JSON error already recorded
	if (!isObject(parsed) || !Array.isArray((parsed as Record<string, unknown>).guests)) {
		fail(`${guestFile}: expected an object with a "guests" array`);
	}
}

// --- report ---------------------------------------------------------------
if (errors.length > 0) {
	console.error("\n❌ Config validation failed:");
	for (const e of errors) console.error(`   • ${e}`);
	console.error("");
	process.exit(1);
}

console.log("✅ Config validation passed.");
