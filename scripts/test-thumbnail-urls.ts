import { google } from "googleapis";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testThumbnailUrls() {
	try {
		const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
		const photosFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

		if (!credentials || !photosFolderId) {
			console.error("❌ Environment variables not set");
			return;
		}

		const parsedCredentials = JSON.parse(credentials);
		const auth = new google.auth.GoogleAuth({
			credentials: parsedCredentials,
			scopes: ["https://www.googleapis.com/auth/drive.readonly"],
		});

		const drive = google.drive({ version: "v3", auth });

		// Get hero-album folder
		const foldersResponse = await drive.files.list({
			q: `name='hero-album' and mimeType='application/vnd.google-apps.folder' and '${photosFolderId}' in parents and trashed=false`,
			fields: "files(id)",
			pageSize: 1,
		});

		const folders = foldersResponse.data.files || [];
		if (folders.length === 0) {
			console.error("❌ Hero-album folder not found");
			return;
		}

		const heroFolderId = folders[0].id!;

		// Get first image with full details
		const imagesResponse = await drive.files.list({
			q: `'${heroFolderId}' in parents and mimeType contains 'image' and trashed=false`,
			fields: "files(id, name, mimeType, webContentLink, webViewLink, thumbnailLink, permissions)",
			pageSize: 1,
		});

		const images = imagesResponse.data.files || [];
		if (images.length === 0) {
			console.error("❌ No images found");
			return;
		}

		const image = images[0];
		console.log("🖼️  Test Image:", image.name);
		console.log("");
		console.log("📌 Available URLs:");
		console.log("1. webContentLink:", image.webContentLink);
		console.log("2. webViewLink:", image.webViewLink);
		console.log("3. thumbnailLink:", image.thumbnailLink);
		console.log("");
		console.log("🔗 Recommended URL patterns for HTML <img> tags:");
		console.log("A. Direct view (no download prompt):");
		console.log(`   https://drive.google.com/uc?export=view&id=${image.id}`);
		console.log("");
		console.log("B. Thumbnail (always works, but lower quality):");
		console.log(`   ${image.thumbnailLink}`);
		console.log("");
		console.log("C. High-res via drive.usercontent.com:");
		console.log(`   https://drive.usercontent.google.com/download?id=${image.id}&export=view&authuser=0`);
		console.log("");

		// Check sharing settings
		const fileDetails = await drive.files.get({
			fileId: image.id!,
			fields: "permissions,shared",
		});

		console.log("🔒 Sharing Status:");
		console.log("   Shared:", fileDetails.data.shared ? "Yes" : "No");
		const permissions = fileDetails.data.permissions || [];
		permissions.forEach((perm) => {
			console.log(`   - ${perm.type}: ${perm.role}`);
		});

	} catch (error) {
		console.error("❌ Error:", error);
	}
}

testThumbnailUrls();
