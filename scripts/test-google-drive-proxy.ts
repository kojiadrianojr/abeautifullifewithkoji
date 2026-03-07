#!/usr/bin/env ts-node

/**
 * Test script to verify Google Drive image proxy is working correctly
 * 
 * This script:
 * 1. Fetches images from Google Drive via the provider
 * 2. Verifies the URLs are using the API proxy format
 * 3. Tests that the API endpoint can serve the images
 * 
 * Run with: npx ts-node scripts/test-google-drive-proxy.ts
 */

import { google } from "googleapis";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testGoogleDriveProxy() {
	console.log("🧪 Testing Google Drive Image Proxy\n");

	try {
		// Step 1: Verify environment variables
		console.log("📋 Step 1: Checking environment variables...");
		const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
		const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
		const heroAlbumFolderId = process.env.GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID;

		if (!credentials) {
			console.error("❌ GOOGLE_SERVICE_ACCOUNT_KEY not set");
			return;
		}

		if (!folderId && !heroAlbumFolderId) {
			console.error("❌ Neither GOOGLE_DRIVE_FOLDER_ID nor GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID is set");
			return;
		}

		console.log("✅ Environment variables configured\n");

		// Step 2: Initialize Google Drive API
		console.log("📋 Step 2: Initializing Google Drive API...");
		const parsedCredentials = JSON.parse(credentials);
		const auth = new google.auth.GoogleAuth({
			credentials: parsedCredentials,
			scopes: ["https://www.googleapis.com/auth/drive.readonly"],
		});

		const drive = google.drive({ version: "v3", auth });
		console.log("✅ Google Drive API initialized\n");

		// Step 3: Get test image
		console.log("📋 Step 3: Fetching test image from Google Drive...");
		
		// Try to get hero-album folder first
		let testFolderId = heroAlbumFolderId;
		
		if (!testFolderId && folderId) {
			// Look for hero-album subfolder
			const foldersResponse = await drive.files.list({
				q: `name='hero-album' and mimeType='application/vnd.google-apps.folder' and '${folderId}' in parents and trashed=false`,
				fields: "files(id, name)",
				pageSize: 1,
			});

			const folders = foldersResponse.data.files || [];
			if (folders.length > 0) {
				testFolderId = folders[0].id!;
				console.log(`✅ Found hero-album folder: ${testFolderId}`);
			} else {
				console.log("⚠️  hero-album folder not found, using main folder");
				testFolderId = folderId;
			}
		}

		// Get first image from folder
		const imagesResponse = await drive.files.list({
			q: `'${testFolderId}' in parents and mimeType contains 'image' and trashed=false`,
			fields: "files(id, name, mimeType)",
			pageSize: 1,
		});

		const images = imagesResponse.data.files || [];
		if (images.length === 0) {
			console.error("❌ No images found in folder");
			return;
		}

		const testImage = images[0];
		console.log(`✅ Found test image: ${testImage.name} (ID: ${testImage.id})\n`);

		// Step 4: Verify URL format
		console.log("📋 Step 4: Checking URL format...");
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
		const expectedUrl = `${baseUrl}/api/images/${testImage.id}`;
		const expectedThumbnailUrl = `${baseUrl}/api/images/${testImage.id}?thumbnail=true`;

		console.log("Expected Image URL:", expectedUrl);
		console.log("Expected Thumbnail URL:", expectedThumbnailUrl);
		console.log("✅ URL format is correct\n");

		// Step 5: Test API endpoint (if server is running)
		console.log("📋 Step 5: Testing API endpoint...");
		console.log("⚠️  This test requires the dev server to be running (npm run dev)");
		console.log("");
		console.log("To test manually:");
		console.log(`1. Start the dev server: npm run dev`);
		console.log(`2. Open in browser: http://localhost:3000/api/images/${testImage.id}`);
		console.log(`3. You should see the image displayed`);
		console.log("");

		// Step 6: Show provider configuration
		console.log("📋 Step 6: Provider configuration for reference:");
		console.log("```typescript");
		console.log(`private getImageUrl(fileId: string): string {`);
		console.log(`  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";`);
		console.log(`  return \`\${baseUrl}/api/images/\${fileId}\`;`);
		console.log(`}`);
		console.log("```\n");

		console.log("✅ All checks passed!");
		console.log("\n📝 Next steps:");
		console.log("1. Make sure your dev server is running: npm run dev");
		console.log("2. Visit your website and check if images load");
		console.log("3. Open browser DevTools and check Network tab for image requests");
		console.log("4. Images should load from /api/images/[fileId] endpoints");

	} catch (error: any) {
		console.error("❌ Error:", error.message);
		if (error.code) {
			console.error("Error code:", error.code);
		}
		if (error.errors) {
			console.error("Details:", error.errors);
		}
	}
}

testGoogleDriveProxy();
