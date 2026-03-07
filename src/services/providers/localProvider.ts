import fs from "fs";
import path from "path";
import {
	IImageProvider,
	ImageMetadata,
	LocalProviderConfig,
} from "@/types/imageProvider";

/**
 * Local File System Image Provider
 * Fetches images from the local filesystem (public/images directory)
 */
export class LocalImageProvider implements IImageProvider {
	private config: LocalProviderConfig;
	private baseDirectory: string;

	constructor(config: LocalProviderConfig) {
		this.config = config;
		// Base directory is relative to public/images
		this.baseDirectory = path.join(
			process.cwd(),
			"public",
			"images",
			config.baseDirectory || ""
		);
	}

	/**
	 * Check if provider is properly configured
	 */
	async isConfigured(): Promise<boolean> {
		try {
			return fs.existsSync(this.baseDirectory);
		} catch {
			return false;
		}
	}

	/**
	 * Get all supported image extensions
	 */
	private getImageExtensions(): string[] {
		return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".bmp", ".svg"];
	}

	/**
	 * Check if file is an image based on extension
	 */
	private isImageFile(filename: string): boolean {
		const ext = path.extname(filename).toLowerCase();
		return this.getImageExtensions().includes(ext);
	}

	/**
	 * Sort files naturally (1.jpg, 2.jpg, 10.jpg instead of 1.jpg, 10.jpg, 2.jpg)
	 */
	private sortFilesNaturally(files: string[]): string[] {
		return files.sort((a, b) => {
			// Extract numbers from filenames for natural sorting
			const numA = parseInt(a.match(/\d+/)?.[0] || "0");
			const numB = parseInt(b.match(/\d+/)?.[0] || "0");

			if (numA !== numB) {
				return numA - numB;
			}

			// If numbers are same or no numbers, sort alphabetically
			return a.localeCompare(b);
		});
	}

	/**
	 * Convert local file path to public URL
	 */
	private getPublicUrl(relativePath: string): string {
		// relativePath should be relative to public/images
		return `/images/${relativePath}`;
	}

	/**
	 * Get file metadata
	 */
	private getFileMetadata(
		filePath: string,
		relativePath: string
	): ImageMetadata {
		try {
			const stats = fs.statSync(filePath);
			const publicUrl = this.getPublicUrl(relativePath);

			return {
				id: relativePath,
				url: publicUrl,
				thumbnailUrl: publicUrl, // For local files, thumbnail is same as original
				name: path.basename(filePath),
				mimeType: this.getMimeType(filePath),
				createdAt: stats.birthtime.toISOString(),
				modifiedAt: stats.mtime.toISOString(),
			};
		} catch (error) {
			console.error(`Error getting metadata for ${filePath}:`, error);
			// Return basic metadata if stats fail
			const publicUrl = this.getPublicUrl(relativePath);
			return {
				id: relativePath,
				url: publicUrl,
				thumbnailUrl: publicUrl,
				name: path.basename(filePath),
				mimeType: this.getMimeType(filePath),
			};
		}
	}

	/**
	 * Get MIME type from file extension
	 */
	private getMimeType(filename: string): string {
		const ext = path.extname(filename).toLowerCase();
		const mimeTypes: Record<string, string> = {
			".jpg": "image/jpeg",
			".jpeg": "image/jpeg",
			".png": "image/png",
			".gif": "image/gif",
			".webp": "image/webp",
			".avif": "image/avif",
			".bmp": "image/bmp",
			".svg": "image/svg+xml",
		};
		return mimeTypes[ext] || "image/jpeg";
	}

	/**
	 * Read directory and get image files
	 */
	private readDirectory(directory: string, baseRelativePath: string = ""): ImageMetadata[] {
		try {
			if (!fs.existsSync(directory)) {
				return [];
			}

			const files = fs.readdirSync(directory);
			const imageFiles = files.filter((file) => this.isImageFile(file));
			const sortedFiles = this.sortFilesNaturally(imageFiles);

			return sortedFiles.map((file) => {
				const filePath = path.join(directory, file);
				const relativePath = path.join(
					this.config.baseDirectory || "",
					baseRelativePath,
					file
				);
				return this.getFileMetadata(filePath, relativePath);
			});
		} catch (error) {
			console.error(`Error reading directory ${directory}:`, error);
			return [];
		}
	}

	/**
	 * Get all images from the base directory
	 */
	async getImages(): Promise<ImageMetadata[]> {
		return this.readDirectory(this.baseDirectory);
	}

	/**
	 * Get images from a specific subdirectory
	 */
	async getImagesFromDirectory(directory: string): Promise<ImageMetadata[]> {
		const targetDirectory = path.join(this.baseDirectory, directory);
		return this.readDirectory(targetDirectory, directory);
	}

	/**
	 * Validate if an image path exists
	 */
	async validateImagePath(imagePath: string): Promise<boolean> {
		try {
			const fullPath = path.join(process.cwd(), "public", imagePath);
			return fs.existsSync(fullPath);
		} catch {
			return false;
		}
	}

	/**
	 * Clear cache (no-op for local provider as there's no cache)
	 */
	async clearCache(): Promise<void> {
		// No cache to clear for local provider
		return;
	}
}

/**
 * Create a local image provider instance
 */
export function createLocalProvider(
	baseDirectory: string = ""
): LocalImageProvider {
	return new LocalImageProvider({
		type: "local",
		baseDirectory,
	});
}
