import { google } from "googleapis";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

/**
 * Check contents of photos folder
 */
async function checkPhotosFolder() {
	try {
		const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
		const photosFolderId = "1tQ7pxoJpn8CMSY_fNv7IOo8fT4gMUMkr";

		if (!credentials) {
			console.error("❌ GOOGLE_SERVICE_ACCOUNT_KEY is not set");
			return;
		}

		console.log("🔍 Checking photos folder:", photosFolderId);
		console.log("");

		const parsedCredentials =
			typeof credentials === "string"
				? JSON.parse(credentials)
				: credentials;

		const auth = new google.auth.GoogleAuth({
			credentials: parsedCredentials,
			scopes: ["https://www.googleapis.com/auth/drive.readonly"],
		});

		const drive = google.drive({ version: "v3", auth });

		// List all folders inside photos
		console.log("📂 Subfolders in 'photos':");
		const foldersResponse = await drive.files.list({
			q: `'${photosFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
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

		console.log("✅ Done!");
	} catch (error) {
		console.error("❌ Error:", error);
	}
}

checkPhotosFolder();
