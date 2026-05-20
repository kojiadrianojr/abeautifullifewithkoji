import {
	IImageProvider,
	ImageMetadata,
	LocalProviderConfig,
	GoogleDriveProviderConfig,
	createLocalProvider,
	createDirectGoogleDriveProvider,
	createHybridProvider,
} from "@/services/providers";

/**
 * Service for handling image-related operations with support for multiple providers
 * (local filesystem, Google Drive, or hybrid)
 */

// Default provider configuration
let defaultProvider: IImageProvider | null = null;

/**
 * Image source configuration from environment
 */
interface ImageSourceConfig {
	type: "local" | "direct-google-drive" | "hybrid";
	googleDrive?: {
		folderId: string;
		serviceAccountKey?: string;
		folders?: Record<string, string>;
	};
}

/**
 * Parse image source configuration from environment variables
 */
function getImageSourceConfig(): ImageSourceConfig {
	const sourceType =
		(process.env.IMAGE_SOURCE_TYPE as "local" | "direct-google-drive" | "hybrid") ||
		"local";

	const config: ImageSourceConfig = {
		type: sourceType,
	};

	if (sourceType === "direct-google-drive" || sourceType === "hybrid") {
		config.googleDrive = {
			folderId: process.env.GOOGLE_DRIVE_FOLDER_ID || "",
			serviceAccountKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
			folders: {
				"hero-album":
					process.env.GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID ||
					process.env.GOOGLE_DRIVE_FOLDER_ID ||
					"",
				gallery:
					process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID ||
					process.env.GOOGLE_DRIVE_FOLDER_ID ||
					"",
				throwback:
					process.env.GOOGLE_DRIVE_THROWBACK_FOLDER_ID ||
					process.env.GOOGLE_DRIVE_FOLDER_ID ||
					"",
				prenup:
					process.env.GOOGLE_DRIVE_PRENUP_FOLDER_ID ||
					process.env.GOOGLE_DRIVE_FOLDER_ID ||
					"",
				"dress-code":
					process.env.GOOGLE_DRIVE_DRESS_CODE_FOLDER_ID ||
					process.env.GOOGLE_DRIVE_FOLDER_ID ||
					"",
			},
		};
	}

	return config;
}

/**
 * Initialize the default image provider based on configuration
 */
function initializeDefaultProvider(): IImageProvider {
	if (defaultProvider) return defaultProvider;

	const config = getImageSourceConfig();

	switch (config.type) {
		case "local":
			defaultProvider = createLocalProvider("");
			break;

		case "direct-google-drive":
			// Google Drive is source of truth: images are synced to public/images/ at build
			// time by sync-images.ts (prebuild). At runtime we serve them as local static assets.
			defaultProvider = createLocalProvider("");
			break;

		case "hybrid": {
			const providers: Array<LocalProviderConfig | GoogleDriveProviderConfig> = [
				{
					type: "local" as const,
					baseDirectory: "",
					priority: 1,
				},
			];

			if (config.googleDrive?.folderId) {
				const cacheEnabled = process.env.IMAGE_CACHE_ENABLED !== "false";
				const cacheDuration = process.env.IMAGE_CACHE_DURATION
					? parseInt(process.env.IMAGE_CACHE_DURATION, 10)
					: 5 * 60 * 1000;

				providers.push({
					type: "direct-google-drive" as const,
					folderId: config.googleDrive.folderId,
					serviceAccountKey: config.googleDrive.serviceAccountKey,
					includeSubfolders: false,
					cacheEnabled: cacheEnabled,
					cacheDuration: cacheDuration,
					priority: 2,
				});
			}

			defaultProvider = createHybridProvider(providers);
			break;
		}

		default:
			defaultProvider = createLocalProvider("");
	}

	return defaultProvider;
}

/**
 * Get provider for a specific collection
 */
function getProviderForCollection(collectionName: string): IImageProvider {
	const config = getImageSourceConfig();

	// If using local, use the default local provider
	if (config.type === "local") {
		return initializeDefaultProvider();
	}

	// For direct-google-drive type, use the default local provider (images synced at build time)
	if (config.type === "direct-google-drive") {
		return initializeDefaultProvider();
	}

	// For hybrid type, check if there's a specific Google Drive folder for this collection
	if (config.type === "hybrid" && config.googleDrive) {
		const specificFolderId =
			config.googleDrive.folders?.[collectionName] ||
			config.googleDrive.folderId;

		if (specificFolderId) {
			const cacheEnabled = process.env.IMAGE_CACHE_ENABLED !== "false";
			const cacheDuration = process.env.IMAGE_CACHE_DURATION
				? parseInt(process.env.IMAGE_CACHE_DURATION, 10)
				: 5 * 60 * 1000;

			return createDirectGoogleDriveProvider({
				folderId: specificFolderId,
				serviceAccountKey: config.googleDrive.serviceAccountKey,
				includeSubfolders: false,
				cacheEnabled: cacheEnabled,
				cacheDuration: cacheDuration,
			});
		}
	}

	return initializeDefaultProvider();
}

/**
 * Convert ImageMetadata array to simple string array for backward compatibility
 */
function metadataToUrls(metadata: ImageMetadata[]): string[] {
	return metadata.map((img) => img.url);
}

/**
 * Get all image files from a specific directory
 * @param directory - Directory path relative to /public/images or folder name
 * @returns Array of image paths/URLs
 */
export async function getImagesFromDirectory(
	directory: string
): Promise<string[]> {
	try {
		const provider = initializeDefaultProvider();
		const images = await provider.getImagesFromDirectory(directory);
		return metadataToUrls(images);
	} catch (error) {
		console.error(`Error reading ${directory} directory:`, error);
		return [];
	}
}

/**
 * Get all image metadata from a specific directory (includes full metadata)
 * @param directory - Directory path relative to /public/images or folder name
 * @returns Array of image metadata
 */
export async function getImagesMetadataFromDirectory(
	directory: string
): Promise<ImageMetadata[]> {
	try {
		const provider = initializeDefaultProvider();
		return await provider.getImagesFromDirectory(directory);
	} catch (error) {
		console.error(`Error reading ${directory} directory:`, error);
		return [];
	}
}

/**
 * Get hero album images
 */
export async function getHeroAlbumImages(): Promise<string[]> {
	const provider = getProviderForCollection("hero-album");
	const images = await provider.getImagesFromDirectory("hero-album");
	return metadataToUrls(images);
}

/**
 * Get gallery images
 */
export async function getGalleryImages(): Promise<string[]> {
	const provider = getProviderForCollection("gallery");
	const images = await provider.getImagesFromDirectory("gallery");
	return metadataToUrls(images);
}

/**
 * Get throwback photos
 */
export async function getThrowbackPhotos(): Promise<string[]> {
	const provider = getProviderForCollection("throwback");
	const images = await provider.getImagesFromDirectory("throwback");
	return metadataToUrls(images);
}

/**
 * Get prenup photos
 */
export async function getPrenupPhotos(): Promise<string[]> {
	const provider = getProviderForCollection("prenup");
	const images = await provider.getImagesFromDirectory("prenup");
	return metadataToUrls(images);
}

/**
 * Get hero album images with full metadata
 */
export async function getHeroAlbumImagesMetadata(): Promise<ImageMetadata[]> {
	const provider = getProviderForCollection("hero-album");
	return await provider.getImagesFromDirectory("hero-album");
}

/**
 * Get gallery images with full metadata
 */
export async function getGalleryImagesMetadata(): Promise<ImageMetadata[]> {
	const provider = getProviderForCollection("gallery");
	return await provider.getImagesFromDirectory("gallery");
}

/**
 * Get throwback photos with full metadata
 */
export async function getThrowbackPhotosMetadata(): Promise<ImageMetadata[]> {
	const provider = getProviderForCollection("throwback");
	return await provider.getImagesFromDirectory("throwback");
}

/**
 * Get prenup photos with full metadata
 */
export async function getPrenupPhotosMetadata(): Promise<ImageMetadata[]> {
	const provider = getProviderForCollection("prenup");
	return await provider.getImagesFromDirectory("prenup");
}

/**
 * Get dress code photos
 */
export async function getDressCodePhotos(): Promise<string[]> {
	const provider = getProviderForCollection("dress-code");
	const images = await provider.getImagesFromDirectory("dress-code");
	return metadataToUrls(images);
}

/**
 * Get dress code photos with full metadata (name field required for category grouping)
 */
export async function getDressCodePhotosMetadata(): Promise<ImageMetadata[]> {
	try {
		const provider = getProviderForCollection("dress-code");
		return await provider.getImagesFromDirectory("dress-code");
	} catch (error) {
		console.error("Error reading dress-code images:", error);
		return [];
	}
}

/**
 * Validate if image path exists (for local images only)
 */
export async function validateImagePath(): Promise<boolean> {
	try {
		const provider = initializeDefaultProvider();
		return await provider.isConfigured();
	} catch {
		return false;
	}
}

/**
 * Clear image cache (useful for Google Drive provider)
 */
export async function clearImageCache(): Promise<void> {
	try {
		const provider = initializeDefaultProvider();
		if (provider.clearCache) {
			await provider.clearCache();
		}
	} catch (error) {
		console.error("Error clearing image cache:", error);
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
