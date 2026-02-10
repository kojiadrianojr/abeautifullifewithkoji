import fs from "fs";
import path from "path";

/**
 * Get all image files from the hero-album directory
 * @returns Array of image paths relative to /public
 */
export function getHeroAlbumImages(): string[] {
	try {
		const heroAlbumDir = path.join(
			process.cwd(),
			"public",
			"images",
			"hero-album",
		);

		// Check if directory exists
		if (!fs.existsSync(heroAlbumDir)) {
			return [];
		}

		// Read directory contents
		const files = fs.readdirSync(heroAlbumDir);

		// Filter for image files only
		const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
		const imageFiles = files.filter((file) => {
			const ext = path.extname(file).toLowerCase();
			return imageExtensions.includes(ext);
		});

		// Sort files naturally (1.jpg, 2.jpg, 10.jpg, etc.)
		imageFiles.sort((a, b) => {
			// Extract numbers from filenames for natural sorting
			const numA = parseInt(a.match(/\d+/)?.[0] || "0");
			const numB = parseInt(b.match(/\d+/)?.[0] || "0");

			if (numA !== numB) {
				return numA - numB;
			}

			// If numbers are same or no numbers, sort alphabetically
			return a.localeCompare(b);
		});

		// Convert to public URL paths
		return imageFiles.map((file) => `/images/hero-album/${file}`);
	} catch (error) {
		console.error("Error reading hero-album directory:", error);
		return [];
	}
}
