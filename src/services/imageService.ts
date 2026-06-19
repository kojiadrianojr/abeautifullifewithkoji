import { IImageProvider, ImageMetadata, createLocalProvider } from "@/services/providers";

/**
 * Image service — reads wedding photos from public/images/.
 *
 * Google Drive sync happens at build time (scripts/sync-images.ts).
 * This service always uses the local filesystem provider at runtime.
 */

const provider: IImageProvider = createLocalProvider("");

function metadataToUrls(metadata: ImageMetadata[]): string[] {
	return metadata.map((img) => img.url);
}

async function getCollectionImages(directory: string): Promise<string[]> {
	try {
		const images = await provider.getImagesFromDirectory(directory);
		return metadataToUrls(images);
	} catch (error) {
		console.error(`Error reading ${directory} directory:`, error);
		return [];
	}
}

async function getCollectionImagesMetadata(directory: string): Promise<ImageMetadata[]> {
	try {
		return await provider.getImagesFromDirectory(directory);
	} catch (error) {
		console.error(`Error reading ${directory} directory:`, error);
		return [];
	}
}

export async function getImagesFromDirectory(directory: string): Promise<string[]> {
	return getCollectionImages(directory);
}

export async function getImagesMetadataFromDirectory(
	directory: string
): Promise<ImageMetadata[]> {
	return getCollectionImagesMetadata(directory);
}

export async function getHeroAlbumImages(): Promise<string[]> {
	return getCollectionImages("hero-album");
}

export async function getGalleryImages(): Promise<string[]> {
	return getCollectionImages("gallery");
}

export async function getThrowbackPhotos(): Promise<string[]> {
	return getCollectionImages("throwback");
}

export async function getPrenupPhotos(): Promise<string[]> {
	return getCollectionImages("prenup");
}

export async function getHeroAlbumImagesMetadata(): Promise<ImageMetadata[]> {
	return getCollectionImagesMetadata("hero-album");
}

export async function getGalleryImagesMetadata(): Promise<ImageMetadata[]> {
	return getCollectionImagesMetadata("gallery");
}

export async function getThrowbackPhotosMetadata(): Promise<ImageMetadata[]> {
	return getCollectionImagesMetadata("throwback");
}

export async function getPrenupPhotosMetadata(): Promise<ImageMetadata[]> {
	return getCollectionImagesMetadata("prenup");
}

export async function getDressCodePhotos(): Promise<string[]> {
	return getCollectionImages("dress-code");
}

export async function getDressCodePhotosMetadata(): Promise<ImageMetadata[]> {
	return getCollectionImagesMetadata("dress-code");
}

export async function validateImagePath(): Promise<boolean> {
	try {
		return await provider.isConfigured();
	} catch {
		return false;
	}
}

export async function getImageDimensions(): Promise<{
	width: number;
	height: number;
} | null> {
	return null;
}
