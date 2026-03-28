import {
	IImageProvider,
	ImageMetadata,
	LocalProviderConfig,
	GoogleDriveProviderConfig,
	createLocalProvider,
	createGoogleDriveProvider,
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
	type: "local" | "google-drive" | "direct-google-drive" | "hybrid";
	googleDrive?: {
		folderId: string;
		serviceAccountKey?: string;
		folders?: Record<string, string>; // collection name -> folder ID mapping
	};
}

/**
 * Parse image source configuration from environment variables
 */
function getImageSourceConfig(): ImageSourceConfig {
	const sourceType =
		(process.env.IMAGE_SOURCE_TYPE as "local" | "google-drive" | "direct-google-drive" | "hybrid") ||
		"local";

	const config: ImageSourceConfig = {
		type: sourceType,
	};

	if (sourceType === "google-drive" || sourceType === "direct-google-drive" || sourceType === "hybrid") {
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

		case "google-drive":
			if (!config.googleDrive?.folderId) {
				console.warn(
					"Google Drive folder ID not configured. Falling back to local provider."
				);
				defaultProvider = createLocalProvider("");
			} else {
				// Read cache configuration from environment
				const cacheEnabled = process.env.IMAGE_CACHE_ENABLED !== "false";
				const cacheDuration = process.env.IMAGE_CACHE_DURATION
					? parseInt(process.env.IMAGE_CACHE_DURATION, 10)
					: 5 * 60 * 1000; // 5 minutes default

				defaultProvider = createGoogleDriveProvider({
					folderId: config.googleDrive.folderId,
					serviceAccountKey: config.googleDrive.serviceAccountKey,
					includeSubfolders: false,
					cacheEnabled: cacheEnabled,
					cacheDuration: cacheDuration,
				});
			}
			break;

		case "direct-google-drive":
			if (!config.googleDrive?.folderId) {
				console.warn(
					"Google Drive folder ID not configured. Falling back to local provider."
				);
				defaultProvider = createLocalProvider("");
			} else {
				// Read cache configuration from environment
				const cacheEnabled = process.env.IMAGE_CACHE_ENABLED !== "false";
				const cacheDuration = process.env.IMAGE_CACHE_DURATION
					? parseInt(process.env.IMAGE_CACHE_DURATION, 10)
					: 5 * 60 * 1000; // 5 minutes default

				defaultProvider = createDirectGoogleDriveProvider({
					folderId: config.googleDrive.folderId,
					serviceAccountKey: config.googleDrive.serviceAccountKey,
					includeSubfolders: false,
					cacheEnabled: cacheEnabled,
					cacheDuration: cacheDuration,
				});
			}
			break;

		case "hybrid":
			const providers: Array<LocalProviderConfig | GoogleDriveProviderConfig> = [
				{
					type: "local" as const,
					baseDirectory: "",
					priority: 1,
				},
			];

			if (config.googleDrive?.folderId) {
				// Read cache configuration from environment
				const cacheEnabled = process.env.IMAGE_CACHE_ENABLED !== "false";
				const cacheDuration = process.env.IMAGE_CACHE_DURATION
					? parseInt(process.env.IMAGE_CACHE_DURATION, 10)
					: 5 * 60 * 1000; // 5 minutes default

				providers.push({
					type: "google-drive" as const,
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

	// If using local or already initialized default, use that
	if (config.type === "local" || config.type === "hybrid") {
		return initializeDefaultProvider();
	}

	// For google-drive or direct-google-drive type, check if there's a specific folder for this collection
	if ((config.type === "google-drive" || config.type === "direct-google-drive") && config.googleDrive) {
		const specificFolderId =
			config.googleDrive.folders?.[collectionName] ||
			config.googleDrive.folderId;

		if (specificFolderId) {
			// Read cache configuration from environment
			const cacheEnabled = process.env.IMAGE_CACHE_ENABLED !== "false";
			const cacheDuration = process.env.IMAGE_CACHE_DURATION
				? parseInt(process.env.IMAGE_CACHE_DURATION, 10)
				: 5 * 60 * 1000; // 5 minutes default

			// Use the appropriate provider based on type
			if (config.type === "direct-google-drive") {
				return createDirectGoogleDriveProvider({
					folderId: specificFolderId,
					serviceAccountKey: config.googleDrive.serviceAccountKey,
					includeSubfolders: false,
					cacheEnabled: cacheEnabled,
					cacheDuration: cacheDuration,
				});
			} else {
				return createGoogleDriveProvider({
					folderId: specificFolderId,
					serviceAccountKey: config.googleDrive.serviceAccountKey,
					includeSubfolders: false,
					cacheEnabled: cacheEnabled,
					cacheDuration: cacheDuration,
				});
			}
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
