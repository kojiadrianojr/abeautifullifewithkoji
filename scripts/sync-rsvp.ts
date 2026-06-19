#!/usr/bin/env node

/**
 * Sync Google Forms responses into config/guests/bea.json and config/guests/koji.json.
 *
 * Usage: tsx scripts/sync-rsvp.ts [spreadsheetId]
 */

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { GoogleFormsService } from "../src/services/googleFormsService";
import {
	applyRsvpUpdates,
	mergeGuestLists,
	type Guest,
	type GuestsFile,
} from "../config/guests/types";

dotenv.config({ path: ".env.local" });

const BEA_GUESTS_PATH = path.join(process.cwd(), "config", "guests", "bea.json");
const KOJI_GUESTS_PATH = path.join(process.cwd(), "config", "guests", "koji.json");

function readGuestsFile(filePath: string): GuestsFile {
	return JSON.parse(fs.readFileSync(filePath, "utf-8")) as GuestsFile;
}

function loadSourceGuestFiles(): { bea: GuestsFile; koji: GuestsFile } {
	return {
		bea: readGuestsFile(BEA_GUESTS_PATH),
		koji: readGuestsFile(KOJI_GUESTS_PATH),
	};
}

function syncRsvpToSourceFiles(
	updatedGuests: Guest[],
	lastSyncedAt: string
): void {
	const { bea, koji } = loadSourceGuestFiles();

	const nextBea: GuestsFile = {
		...bea,
		guests: applyRsvpUpdates(bea.guests, updatedGuests),
		lastSyncedAt,
	};
	const nextKoji: GuestsFile = {
		...koji,
		guests: applyRsvpUpdates(koji.guests, updatedGuests),
		lastSyncedAt,
	};

	fs.writeFileSync(BEA_GUESTS_PATH, JSON.stringify(nextBea, null, 2));
	fs.writeFileSync(KOJI_GUESTS_PATH, JSON.stringify(nextKoji, null, 2));
}

function matchesGuestName(guest: Guest, guestName: string): boolean {
	const normalized = guestName.toLowerCase();
	return (
		!!guest.fullName?.toLowerCase().includes(normalized) ||
		!!guest.groupName?.toLowerCase().includes(normalized) ||
		!!guest.members?.some((member) => member.toLowerCase().includes(normalized))
	);
}

async function main() {
	try {
		const spreadsheetId =
			process.argv[2] || process.env.GOOGLE_FORMS_SPREADSHEET_ID;

		if (!spreadsheetId) {
			console.error("❌ Error: Spreadsheet ID is required");
			console.log("\nUsage:");
			console.log("  npm run sync-rsvp [spreadsheetId]");
			console.log("\nOr set GOOGLE_FORMS_SPREADSHEET_ID environment variable");
			process.exit(1);
		}

		console.log("🔄 Fetching RSVP responses from Google Forms...\n");

		const { bea, koji } = loadSourceGuestFiles();
		const guests = mergeGuestLists(bea.guests, koji.guests);

		console.log(`📋 Loaded ${guests.length} guests (bea.json + koji.json)`);

		const formsService = new GoogleFormsService();
		const responses = await formsService.fetchResponses(spreadsheetId);

		console.log(`📝 Fetched ${responses.length} form responses\n`);

		if (responses.length === 0) {
			console.log("⚠️  No responses found.");
			return;
		}

		const updatedGuests = formsService.matchResponsesToGuests(responses, guests);

		let confirmedCount = 0;
		let declinedCount = 0;
		let pendingCount = 0;

		updatedGuests.forEach((guest) => {
			if (guest.rsvpStatus === "confirmed") confirmedCount++;
			else if (guest.rsvpStatus === "declined") declinedCount++;
			else pendingCount++;
		});

		console.log("📊 RSVP Summary:");
		console.log(`   ✅ Confirmed: ${confirmedCount}`);
		console.log(`   ❌ Declined: ${declinedCount}`);
		console.log(`   ⏳ Pending: ${pendingCount}`);
		console.log(`   📍 Total Guests: ${updatedGuests.length}\n`);

		console.log("🔗 Matched Responses:");
		responses.forEach((response) => {
			const matchedGuest = updatedGuests.find((guest) =>
				matchesGuestName(guest, response.guestName)
			);

			const status = response.attendance === "Yes" ? "✅" : "❌";
			const guestInfo = matchedGuest
				? `${matchedGuest.fullName || matchedGuest.groupName}`
				: "❓ Not matched";

			console.log(`   ${status} ${response.guestName} → ${guestInfo}`);

			if (response.dietaryRestrictions) {
				console.log(`      🍽️  Dietary: ${response.dietaryRestrictions}`);
			}
			if (response.notes) {
				console.log(`      📝 Notes: ${response.notes}`);
			}
		});

		console.log("\n");

		const timestamp = Date.now();
		for (const sourcePath of [BEA_GUESTS_PATH, KOJI_GUESTS_PATH]) {
			const backupPath = sourcePath.replace(/\.json$/, `.backup.${timestamp}.json`);
			fs.writeFileSync(backupPath, fs.readFileSync(sourcePath, "utf-8"));
			console.log(`💾 Backup created: ${path.basename(backupPath)}`);
		}

		syncRsvpToSourceFiles(updatedGuests, new Date().toISOString());
		console.log("✅ Successfully updated bea.json and koji.json\n");

		const unmatchedResponses = responses.filter(
			(response) =>
				!updatedGuests.some((guest) => matchesGuestName(guest, response.guestName))
		);

		if (unmatchedResponses.length > 0) {
			console.log("⚠️  Unmatched Responses (not found in guest list):");
			unmatchedResponses.forEach((response) => {
				console.log(`   - ${response.guestName} (${response.attendance})`);
			});
			console.log("\n   💡 Consider adding these guests to bea.json or koji.json\n");
		}
	} catch (error) {
		console.error("\n❌ Error syncing RSVP responses:");
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error(errorMessage);
		process.exit(1);
	}
}

main();
