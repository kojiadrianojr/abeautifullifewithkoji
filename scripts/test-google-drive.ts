#!/usr/bin/env tsx
/**
 * Google Drive configuration test script.
 *
 * Validates credentials and lists images per collection folder.
 *
 * Usage: npm run test-drive
 */

import { config } from "dotenv";
import {
	createDriveClient,
	getDriveConfig,
	listImageFiles,
	resolveCollectionFolderId,
} from "../src/lib/googleDrive";

config({ path: ".env.local" });

interface TestResult {
	collection: string;
	folderId: string | null;
	success: boolean;
	imageCount: number;
	error?: string;
	sampleNames?: string[];
}

async function testGoogleDriveConnection() {
	console.log("🧪 Testing Google Drive Image Sync Configuration\n");
	console.log("=".repeat(60));

	const driveConfig = getDriveConfig();

	if (!driveConfig.serviceAccountKey) {
		console.error("❌ ERROR: GOOGLE_SERVICE_ACCOUNT_KEY not found in .env.local");
		console.log("\nSee: documentation/GOOGLE_DRIVE_SETUP.md");
		process.exit(1);
	}

	if (!driveConfig.fallbackFolderId) {
		console.error("❌ ERROR: GOOGLE_DRIVE_FOLDER_ID not found in .env.local");
		console.log("\nSee: documentation/GOOGLE_DRIVE_SETUP.md");
		process.exit(1);
	}

	console.log("✅ Environment variables found\n");

	let drive;
	try {
		drive = await createDriveClient(driveConfig.serviceAccountKey);
	} catch (error) {
		console.error(
			`❌ Failed to authenticate: ${error instanceof Error ? error.message : String(error)}`
		);
		process.exit(1);
	}

	const results: TestResult[] = [];

	for (const { collection, folderId } of driveConfig.collections) {
		console.log(`\n📂 Testing "${collection}" collection...`);

		try {
			const resolvedFolderId = await resolveCollectionFolderId(
				drive,
				collection,
				folderId,
				driveConfig.fallbackFolderId
			);

			if (!resolvedFolderId) {
				results.push({
					collection,
					folderId: null,
					success: false,
					imageCount: 0,
					error: "Folder not found",
				});
				console.log("   ⚠️  No folder found");
				continue;
			}

			console.log(`   Folder ID: ${resolvedFolderId}`);
			const images = await listImageFiles(drive, resolvedFolderId);

			results.push({
				collection,
				folderId: resolvedFolderId,
				success: true,
				imageCount: images.length,
				sampleNames: images.slice(0, 3).map((img) => img.name || "(unnamed)"),
			});

			if (images.length === 0) {
				console.log("   ⚠️  No images found (folder may be empty)");
			} else {
				console.log(`   ✅ Found ${images.length} image(s)`);
				console.log(`   First few: ${results.at(-1)?.sampleNames?.join(", ")}`);
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			results.push({
				collection,
				folderId: folderId ?? null,
				success: false,
				imageCount: 0,
				error: errorMessage,
			});
			console.log(`   ❌ Error: ${errorMessage}`);
		}
	}

	console.log("\n" + "=".repeat(60));
	console.log("📊 TEST SUMMARY\n");

	const successful = results.filter((r) => r.success);
	const failed = results.filter((r) => !r.success);

	console.log(`✅ Successful: ${successful.length}`);
	console.log(`❌ Failed: ${failed.length}`);
	console.log(
		`📸 Total images found: ${successful.reduce((sum, r) => sum + r.imageCount, 0)}\n`
	);

	if (successful.length > 0) {
		console.log("Successful collections:");
		successful.forEach((r) => {
			console.log(`  • ${r.collection}: ${r.imageCount} image(s)`);
		});
	}

	if (failed.length > 0) {
		console.log("\nFailed collections:");
		failed.forEach((r) => {
			console.log(`  • ${r.collection}: ${r.error}`);
		});
	}

	console.log("\n" + "=".repeat(60));

	if (failed.length === 0) {
		console.log("🎉 All tests passed! Your Google Drive setup is working correctly.");
		console.log("\nNext steps:");
		console.log('1. Set IMAGE_SOURCE_TYPE=google-drive in .env.local');
		console.log("2. Run: npm run sync-images  (or npm run build — sync runs automatically)");
		console.log("3. Run: npm run dev");
	} else {
		console.log("⚠️  Some tests failed. Please check the errors above.");
		console.log("\nSee: documentation/GOOGLE_DRIVE_SETUP.md");
	}

	console.log("\n");
}

testGoogleDriveConnection().catch((error) => {
	console.error("\n❌ Fatal error:", error);
	process.exit(1);
});
