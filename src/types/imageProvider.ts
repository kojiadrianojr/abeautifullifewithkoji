/**
 * Image provider types and interfaces.
 * Runtime images are always served from public/images/ (local provider).
 * Google Drive is used only at build time via scripts/sync-images.ts.
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

export interface LocalProviderConfig {
	type: "local";
	baseDirectory: string;
}

export interface IImageProvider {
	getImages(): Promise<ImageMetadata[]>;
	getImagesFromDirectory(directory: string): Promise<ImageMetadata[]>;
	isConfigured(): Promise<boolean>;
	clearCache?(): Promise<void>;
}
