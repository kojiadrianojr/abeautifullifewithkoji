#!/usr/bin/env tsx
/**
 * Google Drive Image Provider Test Script
 * 
 * This script tests your Google Drive configuration and lists images from your folders.
 * 
 * Usage:
 *   npm run test-drive
 *   or
 *   tsx scripts/test-google-drive.ts
 * 
 * Prerequisites:
 *   - Configure .env.local with Google Drive settings
 *   - Run: npm install
 */

import { config } from "dotenv";
import { createGoogleDriveProvider } from "../src/services/providers/googleDriveProvider";

// Load environment variables
config({ path: ".env.local" });

interface TestResult {
	collection: string;
	folderId: string;
	success: boolean;
	imageCount: number;
	error?: string;
	images?: string[];
}

async function testGoogleDriveConnection() {
	console.log("🧪 Testing Google Drive Image Provider\n");
	console.log("=" .repeat(60));

	// Check environment variables
	const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
	const mainFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

	if (!serviceAccountKey) {
		console.error("❌ ERROR: GOOGLE_SERVICE_ACCOUNT_KEY not found in .env.local");
		console.log("\nPlease set up your Google Cloud service account:");
		console.log("See: documentation/GOOGLE_DRIVE_SETUP.md");
		process.exit(1);
	}

	if (!mainFolderId) {
		console.error("❌ ERROR: GOOGLE_DRIVE_FOLDER_ID not found in .env.local");
		console.log("\nPlease set your Google Drive folder ID:");
		console.log("See: documentation/GOOGLE_DRIVE_SETUP.md");
		process.exit(1);
	}

	console.log("✅ Environment variables found\n");

	// Test collections
	const collections = [
		{
			name: "hero-album",
			folderId:
				process.env.GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID || mainFolderId,
		},
		{
			name: "gallery",
			folderId: process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID || mainFolderId,
		},
		{
			name: "throwback",
			folderId:
				process.env.GOOGLE_DRIVE_THROWBACK_FOLDER_ID || mainFolderId,
		},
		{
			name: "prenup",
			folderId: process.env.GOOGLE_DRIVE_PRENUP_FOLDER_ID || mainFolderId,
		},
	];

	const results: TestResult[] = [];

	for (const collection of collections) {
		console.log(`\n📂 Testing "${collection.name}" collection...`);
		console.log(`   Folder ID: ${collection.folderId}`);

		try {
			const provider = createGoogleDriveProvider({
				folderId: collection.folderId,
				cacheEnabled: false, // Disable cache for testing
			});

			// Check if configured
			const isConfigured = await provider.isConfigured();
			if (!isConfigured) {
				results.push({
					collection: collection.name,
					folderId: collection.folderId,
					success: false,
					imageCount: 0,
					error: "Provider not properly configured",
				});
				console.log("   ❌ Provider not configured");
				continue;
			}

			// Get images
			let images;
			if (
				collection.folderId === mainFolderId &&
				collection.name !== "main"
			) {
				// Try to get from subfolder
				console.log(
					`   Looking for subfolder: ${collection.name}`
				);
				images = await provider.getImagesFromDirectory(
					collection.name
				);
			} else {
				// Get directly from folder
				images = await provider.getImages();
			}

			results.push({
				collection: collection.name,
				folderId: collection.folderId,
				success: true,
				imageCount: images.length,
				images: images.slice(0, 5).map((img) => img.name || img.url),
			});

			if (images.length === 0) {
				console.log("   ⚠️  No images found (folder may be empty)");
			} else {
				console.log(`   ✅ Found ${images.length} image(s)`);
				console.log(
					`   First few: ${images.slice(0, 3).map((img) => img.name).join(", ")}`
				);
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			results.push({
				collection: collection.name,
				folderId: collection.folderId,
				success: false,
				imageCount: 0,
				error: errorMessage,
			});
			console.log(`   ❌ Error: ${errorMessage}`);
		}
	}

	// Print summary
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
		console.log("1. Set IMAGE_SOURCE_TYPE=google-drive in .env.local");
		console.log("2. Run: npm run dev");
		console.log("3. Open: http://localhost:3000");
	} else {
		console.log("⚠️  Some tests failed. Please check the errors above.");
		console.log("\nTroubleshooting:");
		console.log("1. Verify folder IDs are correct");
		console.log("2. Check that service account has 'Viewer' access to folders");
		console.log("3. Ensure Google Drive API is enabled in Google Cloud");
		console.log("4. See: documentation/GOOGLE_DRIVE_SETUP.md");
	}

	console.log("\n");
}

// Run the test
testGoogleDriveConnection().catch((error) => {
	console.error("\n❌ Fatal error:", error);
	process.exit(1);
});
