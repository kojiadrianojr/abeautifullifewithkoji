import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

console.log("🔍 Environment Variables Check:\n");
console.log("IMAGE_SOURCE_TYPE:", process.env.IMAGE_SOURCE_TYPE);
console.log("GOOGLE_DRIVE_FOLDER_ID:", process.env.GOOGLE_DRIVE_FOLDER_ID);
console.log("GOOGLE_SERVICE_ACCOUNT_KEY:", process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? "SET (hidden)" : "NOT SET");
console.log("");

// Now import and test the service
import { getHeroAlbumImages } from "@/services/imageService";

async function testWithEnv() {
	console.log("📸 Testing image loading with proper env...\n");
	
	try {
		const heroImages = await getHeroAlbumImages();
		console.log(`Found ${heroImages.length} images`);
		if (heroImages.length > 0) {
			console.log(`First 3 URLs:`);
			heroImages.slice(0, 3).forEach((url, i) => {
				console.log(`  ${i + 1}. ${url}`);
			});
		}
	} catch (error) {
		console.error("❌ Error:", error);
	}
}

testWithEnv();
