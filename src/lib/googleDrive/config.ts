/**
 * Google Drive image collection names and build-time configuration.
 */

export const IMAGE_COLLECTIONS = [
	"hero-album",
	"gallery",
	"throwback",
	"prenup",
	"dress-code",
] as const;

export type ImageCollection = (typeof IMAGE_COLLECTIONS)[number];

/** Accepted build-time image source values that trigger Drive sync. */
export const DRIVE_SYNC_SOURCE_TYPES = ["google-drive", "direct-google-drive"] as const;

export type DriveSyncSourceType = (typeof DRIVE_SYNC_SOURCE_TYPES)[number];

export interface DriveCollectionConfig {
	collection: ImageCollection;
	folderId: string | undefined;
}

export interface DriveConfig {
	sourceType: string;
	fallbackFolderId: string;
	collections: DriveCollectionConfig[];
	serviceAccountKey: string | undefined;
}

const COLLECTION_ENV_KEYS: Record<ImageCollection, string> = {
	"hero-album": "GOOGLE_DRIVE_HERO_ALBUM_FOLDER_ID",
	gallery: "GOOGLE_DRIVE_GALLERY_FOLDER_ID",
	throwback: "GOOGLE_DRIVE_THROWBACK_FOLDER_ID",
	prenup: "GOOGLE_DRIVE_PRENUP_FOLDER_ID",
	"dress-code": "GOOGLE_DRIVE_DRESS_CODE_FOLDER_ID",
};

/**
 * Returns true when IMAGE_SOURCE_TYPE should trigger a Drive sync at build time.
 */
export function isDriveSyncEnabled(sourceType = process.env.IMAGE_SOURCE_TYPE): boolean {
	if (!sourceType || sourceType === "local") return false;
	if (sourceType === "hybrid") {
		console.error(
			'  ❌ IMAGE_SOURCE_TYPE=hybrid is no longer supported. Use "google-drive" or "local".'
		);
		return false;
	}
	return (DRIVE_SYNC_SOURCE_TYPES as readonly string[]).includes(sourceType);
}

/**
 * Parse Google Drive folder configuration from environment variables.
 */
export function getDriveConfig(env: NodeJS.ProcessEnv = process.env): DriveConfig {
	const collections = IMAGE_COLLECTIONS.map((collection) => ({
		collection,
		folderId: env[COLLECTION_ENV_KEYS[collection]],
	}));

	return {
		sourceType: env.IMAGE_SOURCE_TYPE || "local",
		fallbackFolderId: env.GOOGLE_DRIVE_FOLDER_ID || "",
		collections,
		serviceAccountKey: env.GOOGLE_SERVICE_ACCOUNT_KEY,
	};
}
