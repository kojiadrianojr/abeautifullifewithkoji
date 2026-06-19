#!/usr/bin/env tsx
/**
 * Build-time Google Drive Image Sync Script
 *
 * Downloads images from Google Drive to public/images/ at build time.
 * Images are baked into the static site — the browser never hits Google
 * Drive directly at runtime.
 *
 * Usage:
 *   npm run sync-images           (manual run)
 *   Runs automatically before `npm run build` via the "prebuild" script.
 *
 * Set IMAGE_SOURCE_TYPE=google-drive (or legacy direct-google-drive) to enable.
 * Set IMAGE_SOURCE_TYPE=local to skip the sync entirely.
 */

import { config } from "dotenv";
import fs from "fs";
import path from "path";
import {
	createDriveClient,
	downloadFile,
	getDriveConfig,
	getKeepFilenames,
	isDriveSyncEnabled,
	isLocalCopyUpToDate,
	listImageFiles,
	removeOrphanedLocalImages,
	resolveCollectionFolderId,
	sanitizeFilename,
} from "../src/lib/googleDrive";

config({ path: ".env.local" });

const IMAGE_OUTPUT_DIR = path.join(process.cwd(), "public", "images");

function log(msg: string) {
	console.log(msg);
}

function warn(msg: string) {
	console.warn(`  ⚠️  ${msg}`);
}

async function main() {
	log("\n📥 Google Drive Image Sync\n" + "=".repeat(50));

	if (!isDriveSyncEnabled()) {
		log(`\nℹ️  IMAGE_SOURCE_TYPE=local — skipping Google Drive sync.`);
		log('   Set IMAGE_SOURCE_TYPE=google-drive to enable.\n');
		return;
	}

	const driveConfig = getDriveConfig();

	if (!driveConfig.serviceAccountKey) {
		warn("GOOGLE_SERVICE_ACCOUNT_KEY not set — skipping image sync.");
		warn("Images will not be updated. Set the key in .env.local to enable sync.\n");
		return;
	}

	if (!driveConfig.fallbackFolderId) {
		warn("GOOGLE_DRIVE_FOLDER_ID not set — skipping image sync.\n");
		return;
	}

	let drive;
	try {
		drive = await createDriveClient(driveConfig.serviceAccountKey);
		log("✅ Authenticated with Google Drive\n");
	} catch (err) {
		warn(`Failed to initialize Google Drive: ${err}`);
		warn("Skipping image sync. Build will continue with existing local images.\n");
		return;
	}

	let totalDownloaded = 0;
	let totalSkipped = 0;
	let totalRemoved = 0;
	let totalFailed = 0;

	for (const { collection, folderId } of driveConfig.collections) {
		log(`📂 Syncing "${collection}"`);

		let resolvedFolderId: string | null;
		try {
			resolvedFolderId = await resolveCollectionFolderId(
				drive,
				collection,
				folderId,
				driveConfig.fallbackFolderId
			);
		} catch (err) {
			warn(String(err));
			log("");
			continue;
		}

		if (!resolvedFolderId) {
			warn(`No folder found for "${collection}" — skipping.`);
			log("");
			continue;
		}

		if (!folderId) {
			log(`   ↳ Found subfolder "${collection}" (${resolvedFolderId})`);
		}
		log(`   Folder: ${resolvedFolderId}`);

		const outputDir = path.join(IMAGE_OUTPUT_DIR, collection);
		fs.mkdirSync(outputDir, { recursive: true });

		let files;
		try {
			files = await listImageFiles(drive, resolvedFolderId);
		} catch (err) {
			warn(`Could not list files in "${collection}": ${err}`);
			continue;
		}

		if (files.length === 0) {
			log(`   ℹ️  No images found in Google Drive.`);
		} else {
			log(`   Found ${files.length} image(s)`);
		}

		let downloaded = 0;
		let skipped = 0;
		let failed = 0;

		for (const file of files) {
			if (!file.id || !file.name) continue;

			const safeFilename = sanitizeFilename(file.name);
			const outputPath = path.join(outputDir, safeFilename);

			if (isLocalCopyUpToDate(file, outputPath)) {
				skipped++;
				continue;
			}

			try {
				await downloadFile(drive, file.id, outputPath);
				downloaded++;
				process.stdout.write(`   ↓ ${safeFilename}\n`);
			} catch (err) {
				failed++;
				warn(`Failed to download "${file.name}": ${err}`);
				if (fs.existsSync(outputPath)) {
					fs.unlinkSync(outputPath);
				}
			}
		}

		const removed = removeOrphanedLocalImages(outputDir, getKeepFilenames(files), (name) => {
			process.stdout.write(`   ✕ ${name} (removed — no longer in Google Drive)\n`);
		});

		log(
			`   ✅ Downloaded: ${downloaded}  ⏭  Skipped (unchanged): ${skipped}  🗑  Removed: ${removed}  ❌ Failed: ${failed}\n`
		);
		totalDownloaded += downloaded;
		totalSkipped += skipped;
		totalRemoved += removed;
		totalFailed += failed;
	}

	log("=".repeat(50));
	log(`📊 Sync complete`);
	log(`   Downloaded : ${totalDownloaded}`);
	log(`   Skipped    : ${totalSkipped}`);
	log(`   Removed    : ${totalRemoved}`);
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
	process.exit(0);
});
