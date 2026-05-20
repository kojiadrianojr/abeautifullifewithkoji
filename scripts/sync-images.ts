#!/usr/bin/env tsx
/**
 * Build-time Google Drive Image Sync Script
 *
 * Downloads images from Google Drive to public/images/ at build time.
 * Images are baked into the static export — the browser never hits Google
 * Drive directly at runtime (no rate limits, no broken images).
 *
 * Usage:
 *   npm run sync-images           (manual run)
 *   Runs automatically before `npm run build` via the "prebuild" script.
 *
 * How it works:
 *   1. Authenticates with Google Drive API via service account
 *   2. Lists image files in each configured folder
 *   3. Downloads only new/changed files (skips unchanged ones)
 *   4. Saves to public/images/<collection>/
 *   5. Next.js build then treats them as local static assets
 *
 * Set IMAGE_SOURCE_TYPE=direct-google-drive or IMAGE_SOURCE_TYPE=hybrid to
 * enable syncing. Set IMAGE_SOURCE_TYPE=local to skip the sync entirely.
 */

import { config } from "dotenv";
import { google, drive_v3 } from "googleapis";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

// Load environment variables
config({ path: ".env.local" });

// ─── Configuration ────────────────────────────────────────────────────────────

const COLLECTIONS: Record<string, string | undefined> = {
	"hero-album": process.env.GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID,
	gallery: process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID,
	throwback: process.env.GOOGLE_DRIVE_THROWBACK_FOLDER_ID,
	prenup: process.env.GOOGLE_DRIVE_PRENUP_FOLDER_ID,
	"dress-code": process.env.GOOGLE_DRIVE_DRESS_CODE_FOLDER_ID,
};

const FALLBACK_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "";
const IMAGE_OUTPUT_DIR = path.join(process.cwd(), "public", "images");

// Supported image MIME types
const IMAGE_MIME_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/avif",
	"image/bmp",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sanitizeFilename(name: string): string {
	// Replace characters unsafe for filenames
	return name.replace(/[/\\?%*:|"<>]/g, "-");
}

function log(msg: string) {
	console.log(msg);
}

function warn(msg: string) {
	console.warn(`  ⚠️  ${msg}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
	log("\n📥 Google Drive Image Sync\n" + "=".repeat(50));

	// Skip if explicitly set to local
	const sourceType = process.env.IMAGE_SOURCE_TYPE;
	if (sourceType === "local") {
		log(`\nℹ️  IMAGE_SOURCE_TYPE=local — skipping Google Drive sync.`);
		log("   Set IMAGE_SOURCE_TYPE=direct-google-drive or IMAGE_SOURCE_TYPE=hybrid to enable.\n");
		return;
	}

	// Validate credentials
	const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
	if (!serviceAccountKey) {
		warn("GOOGLE_SERVICE_ACCOUNT_KEY not set — skipping image sync.");
		warn("Images will not be updated. Set the key in .env.local to enable sync.\n");
		return;
	}
	if (!FALLBACK_FOLDER_ID) {
		warn("GOOGLE_DRIVE_FOLDER_ID not set — skipping image sync.\n");
		return;
	}

	// Initialize Google Drive client
	let drive: drive_v3.Drive;
	try {
		const credentials =
			typeof serviceAccountKey === "string"
				? JSON.parse(serviceAccountKey)
				: serviceAccountKey;

		const auth = new google.auth.GoogleAuth({
			credentials,
			scopes: ["https://www.googleapis.com/auth/drive.readonly"],
		});

		drive = google.drive({ version: "v3", auth });
		log("✅ Authenticated with Google Drive\n");
	} catch (err) {
		warn(`Failed to initialize Google Drive: ${err}`);
		warn("Skipping image sync. Build will continue with existing local images.\n");
		return;
	}

	let totalDownloaded = 0;
	let totalSkipped = 0;
	let totalFailed = 0;

	/**
	 * Resolve a folder ID for a collection:
	 *  - If a specific ID is configured, use it directly.
	 *  - Otherwise, find a subfolder named after the collection inside the main folder.
	 */
	async function resolveFolderId(
		collection: string,
		configuredId: string | undefined
	): Promise<string | null> {
		if (configuredId) return configuredId;

		// Search for a subfolder named <collection> inside the main folder
		try {
			const res = await drive.files.list({
				q: `'${FALLBACK_FOLDER_ID}' in parents and name='${collection}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
				fields: "files(id, name)",
				pageSize: 1,
			});
			const folders = res.data.files || [];
			if (folders.length > 0 && folders[0].id) {
				log(`   ↳ Found subfolder "${collection}" (${folders[0].id})`);
				return folders[0].id;
			}
		} catch (err) {
			warn(`Could not search for subfolder "${collection}": ${err}`);
		}
		return null;
	}

	for (const [collection, folderId] of Object.entries(COLLECTIONS)) {
		log(`📂 Syncing "${collection}"`);

		const resolvedFolderId = await resolveFolderId(collection, folderId);

		if (!resolvedFolderId) {
			warn(`No folder found for "${collection}" — skipping.`);
			log("");
			continue;
		}

		log(`   Folder: ${resolvedFolderId}`);

		const outputDir = path.join(IMAGE_OUTPUT_DIR, collection);
		fs.mkdirSync(outputDir, { recursive: true });

		// List image files in the folder
		let files: drive_v3.Schema$File[] = [];
		try {
			const mimeQuery = IMAGE_MIME_TYPES.map((t) => `mimeType='${t}'`).join(" or ");
			const response = await drive.files.list({
				q: `'${resolvedFolderId}' in parents and (${mimeQuery}) and trashed=false`,
				fields: "files(id, name, mimeType, modifiedTime, size)",
				orderBy: "name",
				pageSize: 1000,
			});
			files = response.data.files || [];
		} catch (err) {
			warn(`Could not list files in "${collection}": ${err}`);
			continue;
		}

		if (files.length === 0) {
			log(`   ℹ️  No images found.\n`);
			continue;
		}

		log(`   Found ${files.length} image(s)`);

		let downloaded = 0;
		let skipped = 0;
		let failed = 0;

		for (const file of files) {
			if (!file.id || !file.name) continue;

			const safeFilename = sanitizeFilename(file.name);
			const outputPath = path.join(outputDir, safeFilename);

			// Skip if file already exists and hasn't changed
			if (fs.existsSync(outputPath) && file.modifiedTime) {
				const localMtime = fs.statSync(outputPath).mtime;
				const remoteMtime = new Date(file.modifiedTime);
				if (localMtime >= remoteMtime) {
					skipped++;
					continue;
				}
			}

			// Download the file using service account (no sharing restrictions, no rate limits)
			try {
				const response = await drive.files.get(
					{ fileId: file.id, alt: "media" },
					{ responseType: "stream" }
				);

				const writeStream = fs.createWriteStream(outputPath);
				await pipeline(response.data as unknown as Readable, writeStream);

				downloaded++;
				process.stdout.write(`   ↓ ${safeFilename}\n`);
			} catch (err) {
				failed++;
				warn(`Failed to download "${file.name}": ${err}`);
				// Remove partially written file
				if (fs.existsSync(outputPath)) {
					fs.unlinkSync(outputPath);
				}
			}
		}

		log(
			`   ✅ Downloaded: ${downloaded}  ⏭  Skipped (unchanged): ${skipped}  ❌ Failed: ${failed}\n`
		);
		totalDownloaded += downloaded;
		totalSkipped += skipped;
		totalFailed += failed;
	}

	log("=".repeat(50));
	log(`📊 Sync complete`);
	log(`   Downloaded : ${totalDownloaded}`);
	log(`   Skipped    : ${totalSkipped}`);
	log(`   Failed     : ${totalFailed}`);

	if (totalFailed > 0) {
		log(`\n⚠️  ${totalFailed} file(s) failed. Check errors above.`);
	} else {
		log(`\n🎉 All images synced! They are now served as local static assets.`);
	}

	log("");
}

main().catch((err) => {
	console.error("\n❌ Fatal error during image sync:", err);
	// Exit 0 so a sync failure doesn't break the build
	// Remove this if you want a failed sync to block deployment
	process.exit(0);
});
