/**
 * Image provider types and interfaces
 * Defines the contract for different image source providers
 */

/**
 * Configuration for image source
 */
export type ImageSourceType = "local" | "google-drive" | "hybrid";

/**
 * Image metadata
 */
export interface ImageMetadata {
	id: string;
	url: string;
	thumbnailUrl?: string;
	name?: string;
	mimeType?: string;
	createdAt?: string;
	modifiedAt?: string;
}

/**
 * Image provider configuration
 */
export interface ImageProviderConfig {
	type: ImageSourceType;
	priority?: number; // For hybrid mode, lower number = higher priority
}

/**
 * Local file system provider configuration
 */
export interface LocalProviderConfig extends ImageProviderConfig {
	type: "local";
	baseDirectory: string;
}

/**
 * Google Drive provider configuration
 */
export interface GoogleDriveProviderConfig extends ImageProviderConfig {
	type: "google-drive";
	folderId: string;
	serviceAccountKey?: string; // If not provided, will use env variable
	includeSubfolders?: boolean;
	cacheEnabled?: boolean;
	cacheDuration?: number; // in milliseconds
}

/**
 * Hybrid provider configuration (uses multiple sources)
 */
export interface HybridProviderConfig extends ImageProviderConfig {
	type: "hybrid";
	providers: (LocalProviderConfig | GoogleDriveProviderConfig)[];
}

/**
 * Image provider interface that all providers must implement
 */
export interface IImageProvider {
	/**
	 * Get all images from this provider
	 */
	getImages(): Promise<ImageMetadata[]>;

	/**
	 * Get images from a specific directory/folder
	 */
	getImagesFromDirectory(directory: string): Promise<ImageMetadata[]>;

	/**
	 * Validate if the provider is properly configured
	 */
	isConfigured(): Promise<boolean>;

	/**
	 * Clear any cached data
	 */
	clearCache?(): Promise<void>;
}

/**
 * Image collection configuration
 * Maps collection names to their provider configurations
 */
export interface ImageCollectionConfig {
	[collectionName: string]: {
		provider: ImageProviderConfig;
		directory?: string;
	};
}
