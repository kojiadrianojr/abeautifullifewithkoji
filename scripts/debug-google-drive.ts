import { google } from "googleapis";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

/**
 * Debug script to list all folders and files in the Google Drive parent folder
 */
async function debugGoogleDrive() {
	try {
		// Get service account credentials
		const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
		const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

		if (!credentials) {
			console.error("❌ GOOGLE_SERVICE_ACCOUNT_KEY is not set");
			return;
		}

		if (!folderId) {
			console.error("❌ GOOGLE_DRIVE_FOLDER_ID is not set");
			return;
		}

		console.log("🔍 Debugging Google Drive folder:", folderId);
		console.log("");

		// Parse credentials
		const parsedCredentials =
			typeof credentials === "string"
				? JSON.parse(credentials)
				: credentials;

		// Configure auth
		const auth = new google.auth.GoogleAuth({
			credentials: parsedCredentials,
			scopes: ["https://www.googleapis.com/auth/drive.readonly"],
		});

		// Create Drive client
		const drive = google.drive({ version: "v3", auth });

		// Get parent folder info
		console.log("📁 Parent Folder Info:");
		try {
			const folderInfo = await drive.files.get({
				fileId: folderId,
				fields: "id, name, mimeType, parents",
			});

			console.log("  Name:", folderInfo.data.name);
			console.log("  ID:", folderInfo.data.id);
			console.log("  Type:", folderInfo.data.mimeType);
			console.log("");
		} catch (error) {
			console.error("  ❌ Cannot access folder:", error);
			console.log("");
		}

		// List all folders inside
		console.log("📂 Subfolders:");
		const foldersResponse = await drive.files.list({
			q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
			fields: "files(id, name)",
			pageSize: 100,
		});

		const folders = foldersResponse.data.files || [];
		if (folders.length === 0) {
			console.log("  ℹ️  No subfolders found");
		} else {
			folders.forEach((folder) => {
				console.log(`  - ${folder.name} (ID: ${folder.id})`);
			});
		}
		console.log("");

		// List all image files (non-folders)
		console.log("🖼️  Image Files:");
		const filesResponse = await drive.files.list({
			q: `'${folderId}' in parents and mimeType contains 'image' and trashed=false`,
			fields: "files(id, name, mimeType)",
			pageSize: 50,
		});

		const files = filesResponse.data.files || [];
		if (files.length === 0) {
			console.log("  ℹ️  No image files found");
		} else {
			files.forEach((file) => {
				console.log(`  - ${file.name} (${file.mimeType})`);
			});
		}
		console.log("");

		// Try to find specific folders
		console.log("🔎 Searching for specific folders:");
		const expectedFolders = ["throwback", "prenup", "gallery", "hero-album"];

		for (const folderName of expectedFolders) {
			const searchResponse = await drive.files.list({
				q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${folderId}' in parents and trashed=false`,
				fields: "files(id, name)",
				pageSize: 1,
			});

			const found = searchResponse.data.files || [];
			if (found.length > 0) {
				console.log(`  ✅ '${folderName}' found (ID: ${found[0].id})`);
			} else {
				console.log(`  ❌ '${folderName}' NOT found`);
			}
		}

		console.log("");
		console.log("✅ Debug complete!");
	} catch (error) {
		console.error("❌ Error:", error);
	}
}

// Run the debug function
debugGoogleDrive();
