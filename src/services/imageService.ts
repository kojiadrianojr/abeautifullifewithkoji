import fs from "fs";
import path from "path";

/**
 * Service for handling image-related operations
 */

/**
 * Get all image files from a specific directory
 * @param directory - Directory path relative to /public/images
 * @returns Array of image paths relative to /public
 */
export function getImagesFromDirectory(directory: string): string[] {
	try {
		const imageDir = path.join(process.cwd(), "public", "images", directory);

		// Check if directory exists
		if (!fs.existsSync(imageDir)) {
			return [];
		}

		// Read directory contents
		const files = fs.readdirSync(imageDir);

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
		return imageFiles.map((file) => `/images/${directory}/${file}`);
	} catch (error) {
		console.error(`Error reading ${directory} directory:`, error);
		return [];
	}
}

/**
 * Get hero album images
 */
export function getHeroAlbumImages(): string[] {
	return getImagesFromDirectory("hero-album");
}

/**
 * Get gallery images
 */
export function getGalleryImages(): string[] {
	return getImagesFromDirectory("gallery");
}

/**
 * Get throwback photos
 */
export function getThrowbackPhotos(): string[] {
	return getImagesFromDirectory("throwback");
}

/**
 * Get prenup photos
 */
export function getPrenupPhotos(): string[] {
	return getImagesFromDirectory("prenup");
}

/**
 * Validate if image path exists
 */
export function validateImagePath(imagePath: string): boolean {
	try {
		const fullPath = path.join(process.cwd(), "public", imagePath);
		return fs.existsSync(fullPath);
	} catch {
		return false;
	}
}

/**
 * Get image dimensions (if needed in the future)
 * This would require an image processing library like 'sharp' or 'image-size'
 */
export async function getImageDimensions(): Promise<{
	width: number;
	height: number;
} | null> {
	// Placeholder for future implementation
	return null;
}
