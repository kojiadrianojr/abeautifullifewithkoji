import { google } from "googleapis";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testImageUrls() {
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

		// Get first image from hero-album folder
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

		const galleryFolderId = folders[0].id!;
		console.log("📁 Hero-album folder ID:", galleryFolderId);
		console.log("");

		// Get first image from hero-album
		const imagesResponse = await drive.files.list({
			q: `'${galleryFolderId}' in parents and mimeType contains 'image' and trashed=false`,
			fields: "files(id, name, mimeType, webContentLink, webViewLink, thumbnailLink, permissions)",
			pageSize: 1,
		});

		const images = imagesResponse.data.files || [];
		if (images.length === 0) {
			console.error("❌ No images found in hero-album");
			return;
		}

		const image = images[0];
		console.log("🖼️  Test Image:");
		console.log("  Name:", image.name);
		console.log("  ID:", image.id);
		console.log("  Type:", image.mimeType);
		console.log("  webContentLink:", image.webContentLink || "Not available");
		console.log("  webViewLink:", image.webViewLink || "Not available");
		console.log("  thumbnailLink:", image.thumbnailLink || "Not available");
		console.log("");

		// Test different URL patterns
		console.log("🔗 URL Patterns:");
		console.log("  1. uc?export=view:", `https://drive.google.com/uc?export=view&id=${image.id}`);
		console.log("  2. uc?export=download:", `https://drive.google.com/uc?export=download&id=${image.id}`);
		console.log("  3. thumbnail:", `https://drive.google.com/thumbnail?id=${image.id}`);
		console.log("");

		// Check permissions
		const fileDetails = await drive.files.get({
			fileId: image.id!,
			fields: "permissions",
		});

		console.log("🔒 Permissions:");
		const permissions = fileDetails.data.permissions || [];
		if (permissions.length === 0) {
			console.log("  ⚠️  No public permissions - file is private to service account");
			console.log("  💡 Solution: Use API proxy endpoint to serve images");
		} else {
			permissions.forEach((perm) => {
				console.log(`  - ${perm.type}: ${perm.role}`);
			});
		}

	} catch (error) {
		console.error("❌ Error:", error);
	}
}

testImageUrls();
