import { google, drive_v3 } from "googleapis";
import {
	IImageProvider,
	ImageMetadata,
	GoogleDriveProviderConfig,
} from "@/types/imageProvider";

/**
 * Direct Google Drive Image Provider
 * 
 * Uses direct public URLs from Google Drive, suitable for static exports (GitHub Pages).
 * 
 * Requirements:
 * - Files must be publicly shared ("Anyone with the link" can view)
 * - Uses Google Drive API to list files at build time
 * - Generates direct URLs that work without API proxy
 * 
 * Note: This provider is designed for static deployments where API routes
 * are not available. Images load directly from Google Drive CDN.
 */
export class DirectGoogleDriveImageProvider implements IImageProvider {
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
	 * Clear cached data
	 */
	async clearCache(): Promise<void> {
		this.cache.clear();
	}

	/**
	 * Get cached data if available and not expired
	 */
	private getCachedData(key: string): ImageMetadata[] | null {
		if (!this.config.cacheEnabled) {
			return null;
		}

		const cached = this.cache.get(key);
		if (!cached) {
			return null;
		}

		const cacheDuration =
			this.config.cacheDuration || this.DEFAULT_CACHE_DURATION;
		const isExpired = Date.now() - cached.timestamp > cacheDuration;

		if (isExpired) {
			this.cache.delete(key);
			return null;
		}

		return cached.data;
	}

	/**
	 * Cache data
	 */
	private setCachedData(key: string, data: ImageMetadata[]): void {
		if (this.config.cacheEnabled) {
			this.cache.set(key, { data, timestamp: Date.now() });
		}
	}

	/**
	 * Fetch images from a Google Drive folder
	 */
	private async fetchFilesFromFolder(
		folderId: string,
		includeSubfolders: boolean = false
	): Promise<ImageMetadata[]> {
		await this.initializeDrive();

		if (!this.drive) {
			throw new Error("Google Drive client is not initialized");
		}

		try {
			const images: ImageMetadata[] = [];

			// Query for images in the folder
			const query = `'${folderId}' in parents and (${[
				"image/jpeg",
				"image/jpg",
				"image/png",
				"image/gif",
				"image/webp",
				"image/avif",
				"image/bmp",
				"image/svg+xml",
			]
				.map((type) => `mimeType='${type}'`)
				.join(" or ")}) and trashed=false`;

			const response = await this.drive.files.list({
				q: query,
				fields:
					"files(id, name, mimeType, size, createdTime, modifiedTime, webContentLink, thumbnailLink)",
				orderBy: "name",
				pageSize: 1000, // Max allowed by API
			});

			const files = response.data.files || [];

			// Process each file
			for (const file of files) {
				if (!file.id || !file.name) continue;

				images.push({
					id: file.id,
					url: this.getDirectUrl(file.id),
					thumbnailUrl:
						this.getDirectThumbnailUrl(file.id) || this.getDirectUrl(file.id),
					name: file.name,
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
	 * Get direct public URL for Google Drive file
	 * Uses Google's CDN which works for publicly shared files
	 */
	private getDirectUrl(fileId: string): string {
		// Use Google's CDN URL - works for publicly shared files
		return `https://lh3.googleusercontent.com/d/${fileId}`;
	}

	/**
	 * Get direct thumbnail URL
	 * Uses Google Drive thumbnail with size parameter
	 */
	private getDirectThumbnailUrl(fileId: string): string {
		// Alternative: use drive.google.com with thumbnail parameter
		// This returns a smaller version suitable for thumbnails
		return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
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
	 * Get images from a specific directory/subfolder
	 */
	async getImagesFromDirectory(directory: string): Promise<ImageMetadata[]> {
		const cacheKey = `directory:${this.config.folderId}:${directory}`;
		const cached = this.getCachedData(cacheKey);

		if (cached) {
			return cached;
		}

		await this.initializeDrive();

		if (!this.drive) {
			throw new Error("Google Drive client is not initialized");
		}

		try {
			// Check if directory looks like a Google Drive folder ID (typically 33+ chars with special chars)
			const isFolderId =
				directory.length >= 25 && /[_-]/.test(directory);

			let targetFolderId: string;

			if (isFolderId) {
				// If it's already a folder ID, use it directly
				targetFolderId = directory;
			} else {
				// Search for subfolder by name
				const folderQuery = `'${this.config.folderId}' in parents and name='${directory}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

				const folderResponse = await this.drive.files.list({
					q: folderQuery,
					fields: "files(id, name)",
					pageSize: 1,
				});

				const folders = folderResponse.data.files || [];

				if (folders.length === 0) {
					console.warn(
						`Folder '${directory}' not found in Google Drive folder ${this.config.folderId}. Returning empty array.`
					);
					return [];
				}

				targetFolderId = folders[0].id!;
			}

			// Fetch images from the target folder
			const images = await this.fetchFilesFromFolder(targetFolderId, false);

			this.setCachedData(cacheKey, images);
			return images;
		} catch (error) {
			console.error(
				`Error fetching images from directory '${directory}':`,
				error
			);
			throw new Error(
				`Failed to fetch images from directory: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	}
}

/**
 * Factory function to create a Direct Google Drive provider
 */
export function createDirectGoogleDriveProvider(
	config: Omit<GoogleDriveProviderConfig, "type">
): DirectGoogleDriveImageProvider {
	return new DirectGoogleDriveImageProvider({
		type: "direct-google-drive",
		...config,
	});
}
