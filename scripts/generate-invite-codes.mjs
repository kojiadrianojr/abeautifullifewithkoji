#!/usr/bin/env node
/**
 * Assign a unique secret invite code to every guest that does not already have
 * one, across both guest lists, and emit a distribution CSV.
 *
 * - Idempotent: guests that already have an `inviteCode` keep it untouched.
 * - Codes are unique across BOTH bea.json and koji.json.
 * - Codes use a Crockford-style base32 alphabet with the ambiguous characters
 *   (I, L, O, U) removed, so they are easy to print and read aloud.
 *
 * Usage:
 *   node scripts/generate-invite-codes.mjs
 *   node scripts/generate-invite-codes.mjs --export-only
 *
 * Outputs:
 *   - Rewrites config/guests/bea.json and config/guests/koji.json in place
 *     (unless --export-only).
 *   - Writes config/guests/invite-codes.csv (gitignored — contains secrets)
 *     from config/guests/bea.json and config/guests/koji.json with columns:
 *     list, id, groupName, guestName, code.
 *
 * IMPORTANT: after running, refresh your GUESTS_BEA_JSON / GUESTS_KOJI_JSON
 * deploy secrets (and your local files are already updated).
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CODE_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // no I, L, O, U
const CODE_LENGTH = 6;

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const guestsDir = path.resolve(scriptDir, "..", "config", "guests");

const LISTS = [
	{ label: "bea", file: path.join(guestsDir, "bea.json") },
	{ label: "koji", file: path.join(guestsDir, "koji.json") },
];

function generateCode(used) {
	// With a 32-char alphabet and length 6 there are ~1.07B combinations, so
	// collisions are rare; loop just in case.
	for (let attempt = 0; attempt < 10000; attempt += 1) {
		let code = "";
		for (let i = 0; i < CODE_LENGTH; i += 1) {
			code += CODE_ALPHABET[crypto.randomInt(0, CODE_ALPHABET.length)];
		}
		if (!used.has(code)) return code;
	}
	throw new Error("Unable to generate a unique invite code — alphabet exhausted?");
}

function csvCell(value) {
	const str = String(value ?? "");
	return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/** One CSV row per person: groupName when present, individual guest name, shared code. */
function inviteCodeRows(guest, listLabel) {
	const code = guest.inviteCode ?? "";
	const groupName = guest.groupName?.trim() ?? "";

	if (guest.fullName?.trim()) {
		return [[listLabel, guest.id, "", guest.fullName.trim(), code]];
	}

	if (Array.isArray(guest.members) && guest.members.length > 0) {
		return guest.members.map((member) => [
			listLabel,
			guest.id,
			groupName,
			String(member).trim(),
			code,
		]);
	}

	if (groupName) {
		return [[listLabel, guest.id, groupName, groupName, code]];
	}

	return [[listLabel, guest.id, "", "(unnamed)", code]];
}

function writeInviteCodesCsv(loaded) {
	const csvRows = [["list", "id", "groupName", "guestName", "code"]];

	for (const { label, data } of loaded) {
		for (const guest of data.guests) {
			csvRows.push(...inviteCodeRows(guest, label));
		}
	}

	const csvPath = path.join(guestsDir, "invite-codes.csv");
	fs.writeFileSync(
		csvPath,
		`${csvRows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`,
		"utf8",
	);

	return csvPath;
}

const exportOnly = process.argv.includes("--export-only");

const loaded = LISTS.map(({ label, file }) => {
	if (!fs.existsSync(file)) {
		throw new Error(`Guest file not found: ${file}`);
	}
	const data = JSON.parse(fs.readFileSync(file, "utf8"));
	if (!data || !Array.isArray(data.guests)) {
		throw new Error(`Invalid guest file (expected { guests: [...] }): ${file}`);
	}
	return { label, file, data };
});

// Seed the used-set with any codes that already exist so we never collide.
const used = new Set();
for (const { data } of loaded) {
	for (const guest of data.guests) {
		if (typeof guest.inviteCode === "string" && guest.inviteCode.trim()) {
			used.add(guest.inviteCode.trim().toUpperCase());
		}
	}
}

let assigned = 0;
let kept = 0;

if (!exportOnly) {
	for (const { file, data } of loaded) {
		for (const guest of data.guests) {
			if (typeof guest.inviteCode === "string" && guest.inviteCode.trim()) {
				kept += 1;
			} else {
				const code = generateCode(used);
				used.add(code);
				guest.inviteCode = code;
				assigned += 1;
			}
		}

		fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
	}
}

const csvPath = writeInviteCodesCsv(loaded);

if (exportOnly) {
	console.log(`Distribution sheet exported from ${LISTS.map((l) => path.basename(l.file)).join(", ")}.`);
} else {
	console.log(`Invite codes: ${assigned} newly assigned, ${kept} kept.`);
	console.log(`Guest files updated: ${LISTS.map((l) => path.basename(l.file)).join(", ")}`);
}
console.log(`Distribution sheet: ${csvPath}`);
if (!exportOnly) {
	console.log("Remember to refresh GUESTS_BEA_JSON / GUESTS_KOJI_JSON deploy secrets.");
}
