import { google, drive_v3 } from "googleapis";
import {
	IImageProvider,
	ImageMetadata,
	GoogleDriveProviderConfig,
} from "@/types/imageProvider";

/**
 * Google Drive Image Provider
 * Fetches images from Google Drive folders
 */
export class GoogleDriveImageProvider implements IImageProvider {
	private drive: drive_v3.Drive | null = null;
	private config: GoogleDriveProviderConfig;
	private cache: Map<string, { data: ImageMetadata[]; timestamp: number }> =
		new Map();
	private readonly DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

	constructor(config: GoogleDriveProviderConfig) {
		this.config = {
			includeSubfolders: false,
			cacheEnabled: true,
			cacheDuration: this.DEFAULT_CACHE_DURATION,
			...config,
		};
	}

	/**
	 * Initialize Google Drive API client
	 */
	private async initializeDrive(): Promise<void> {
		if (this.drive) return;

		try {
			// Get service account credentials
			const credentials =
				this.config.serviceAccountKey ||
				process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

			if (!credentials) {
				throw new Error(
					"Google Drive service account key is not configured. " +
						"Please set GOOGLE_SERVICE_ACCOUNT_KEY in environment variables."
				);
			}

			// Parse credentials if they're a JSON string
			const parsedCredentials =
				typeof credentials === "string"
					? JSON.parse(credentials)
					: credentials;

			// Configure auth
			const auth = new google.auth.GoogleAuth({
				credentials: parsedCredentials,
				scopes: ["https://www.googleapis.com/auth/drive.readonly"],
			});

			// Create Drive client
			this.drive = google.drive({ version: "v3", auth });
		} catch (error) {
			console.error("Failed to initialize Google Drive:", error);
			throw new Error(
				`Failed to initialize Google Drive: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	}

	/**
	 * Check if provider is properly configured
	 */
	async isConfigured(): Promise<boolean> {
		try {
			await this.initializeDrive();
			return this.drive !== null;
		} catch {
			return false;
		}
	}

	/**
	 * Get cached data if available and not expired
	 */
	private getCachedData(key: string): ImageMetadata[] | null {
		if (!this.config.cacheEnabled) return null;

		const cached = this.cache.get(key);
		if (!cached) return null;

		const now = Date.now();
		const cacheAge = now - cached.timestamp;
		const maxAge = this.config.cacheDuration || this.DEFAULT_CACHE_DURATION;

		if (cacheAge > maxAge) {
			this.cache.delete(key);
			return null;
		}

		return cached.data;
	}

	/**
	 * Cache data
	 */
	private setCachedData(key: string, data: ImageMetadata[]): void {
		if (!this.config.cacheEnabled) return;

		this.cache.set(key, {
			data,
			timestamp: Date.now(),
		});
	}

	/**
	 * Clear all cached data
	 */
	async clearCache(): Promise<void> {
		this.cache.clear();
	}

	/**
	 * Fetch files from a Google Drive folder
	 */
	private async fetchFilesFromFolder(
		folderId: string,
		includeSubfolders: boolean = false
	): Promise<ImageMetadata[]> {
		if (!this.drive) {
			await this.initializeDrive();
		}

		if (!this.drive) {
			throw new Error("Google Drive client is not initialized");
		}

		const images: ImageMetadata[] = [];
		const imageExtensions = [
			"jpg",
			"jpeg",
			"png",
			"gif",
			"webp",
			"avif",
			"bmp",
			"svg",
		];

		try {
			// Query for image files in the folder
			const query = `'${folderId}' in parents and trashed=false and (${imageExtensions.map((ext) => `mimeType contains 'image/${ext}' or fileExtension='${ext}'`).join(" or ")})`;

			const response = await this.drive.files.list({
				q: query,
				fields:
					"files(id, name, mimeType, thumbnailLink, webContentLink, webViewLink, createdTime, modifiedTime)",
				orderBy: "name",
				pageSize: 1000, // Maximum allowed by API
			});

			const files = response.data.files || [];

			// Process each file
			for (const file of files) {
				if (!file.id) continue;

				// Use drive.usercontent.google.com format for better browser compatibility
				const imageUrl = this.getImageUrl(file.id);
				const thumbnailUrl = this.getThumbnailUrl(file.id, file.thumbnailLink);

				images.push({
					id: file.id,
					url: imageUrl,
					thumbnailUrl: thumbnailUrl,
					name: file.name || undefined,
					mimeType: file.mimeType || undefined,
					createdAt: file.createdTime || undefined,
					modifiedAt: file.modifiedTime || undefined,
				});
			}

			// If includeSubfolders, recursively fetch from subfolders
			if (includeSubfolders) {
				const foldersResponse = await this.drive.files.list({
					q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
					fields: "files(id)",
					pageSize: 1000,
				});

				const folders = foldersResponse.data.files || [];

				for (const folder of folders) {
					if (folder.id) {
						const subfolderImages = await this.fetchFilesFromFolder(
							folder.id,
							true
						);
						images.push(...subfolderImages);
					}
				}
			}

			return images;
		} catch (error) {
			console.error(`Error fetching images from Google Drive folder:`, error);
			throw new Error(
				`Failed to fetch images from Google Drive: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	}

	/**
	 * Get image URL that works well for embedding in HTML img tags
	 * Uses the API proxy route to handle authentication with Google Drive
	 */
	private getImageUrl(fileId: string): string {
		// Use the API proxy route which handles service account authentication
		// This allows the images to be loaded in the browser without CORS issues
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
		return `${baseUrl}/api/images/${fileId}`;
	}

	/**
	 * Get thumbnail URL with high quality
	 */
	private getThumbnailUrl(
		fileId: string,
		thumbnailLink?: string | null
	): string {
		// Use the API proxy route with thumbnail parameter
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
		return `${baseUrl}/api/images/${fileId}?thumbnail=true`;
	}

	/**
	 * Get direct download URL for a Google Drive file (legacy method)
	 */
	private getDirectDownloadUrl(fileId: string): string {
		// Use the API proxy route for downloads as well
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
		return `${baseUrl}/api/images/${fileId}`;
	}

	/**
	 * Get all images from the configured folder
	 */
	async getImages(): Promise<ImageMetadata[]> {
		const cacheKey = `folder:${this.config.folderId}`;
		const cached = this.getCachedData(cacheKey);

		if (cached) {
			return cached;
		}

		const images = await this.fetchFilesFromFolder(
			this.config.folderId,
			this.config.includeSubfolders
		);

		this.setCachedData(cacheKey, images);
		return images;
	}

	/**
	 * Get images from a specific directory (subfolder)
	 * @param directory - Can be a folder name or folder ID
	 */
	async getImagesFromDirectory(directory: string): Promise<ImageMetadata[]> {
		const cacheKey = `directory:${directory}`;
		const cached = this.getCachedData(cacheKey);

		if (cached) {
			return cached;
		}

		if (!this.drive) {
			await this.initializeDrive();
		}

		if (!this.drive) {
			throw new Error("Google Drive client is not initialized");
		}

		try {
			let folderId = directory;

			// Check if directory looks like a Google Drive folder ID (typically 33+ chars with special chars)
			// If it's a short name like "throwback", treat it as a folder name
			const isLikelyFolderId = directory.length > 20 && /^[a-zA-Z0-9_-]+$/.test(directory);

			if (!isLikelyFolderId) {
				// Search for folder by name within the parent folder
				const searchResponse = await this.drive.files.list({
					q: `name='${directory}' and mimeType='application/vnd.google-apps.folder' and '${this.config.folderId}' in parents and trashed=false`,
					fields: "files(id)",
					pageSize: 1,
				});

				const folders = searchResponse.data.files || [];
				if (folders.length === 0) {
					console.warn(
						`Folder '${directory}' not found in Google Drive folder ${this.config.folderId}. Returning empty array.`
					);
					return [];
				}

				folderId = folders[0].id!;
			}

			const images = await this.fetchFilesFromFolder(folderId, false);
			this.setCachedData(cacheKey, images);
			return images;
		} catch (error) {
			console.error(
				`Error fetching images from directory '${directory}':`,
				error
			);
			return [];
		}
	}

	/**
	 * Get folder ID by name (helper method)
	 */
	async getFolderIdByName(folderName: string): Promise<string | null> {
		if (!this.drive) {
			await this.initializeDrive();
		}

		if (!this.drive) return null;

		try {
			const response = await this.drive.files.list({
				q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${this.config.folderId}' in parents and trashed=false`,
				fields: "files(id)",
				pageSize: 1,
			});

			const folders = response.data.files || [];
			return folders.length > 0 ? folders[0].id || null : null;
		} catch (error) {
			console.error(`Error searching for folder '${folderName}':`, error);
			return null;
		}
	}
}

/**
 * Create a Google Drive image provider instance
 */
export function createGoogleDriveProvider(
	config: Omit<GoogleDriveProviderConfig, "type">
): GoogleDriveImageProvider {
	return new GoogleDriveImageProvider({
		type: "google-drive",
		...config,
	});
}
