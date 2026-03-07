import {
	IImageProvider,
	ImageMetadata,
	HybridProviderConfig,
	LocalProviderConfig,
	GoogleDriveProviderConfig,
} from "@/types/imageProvider";
import { LocalImageProvider } from "./localProvider";
import { GoogleDriveImageProvider } from "./googleDriveProvider";

/**
 * Hybrid Image Provider
 * Combines multiple image providers and returns images from all of them
 */
export class HybridImageProvider implements IImageProvider {
	private config: HybridProviderConfig;
	private providers: IImageProvider[] = [];

	constructor(config: HybridProviderConfig) {
		this.config = config;
		this.initializeProviders();
	}

	/**
	 * Initialize all providers from configuration
	 */
	private initializeProviders(): void {
		this.providers = this.config.providers.map((providerConfig) => {
			switch (providerConfig.type) {
				case "local":
					return new LocalImageProvider(
						providerConfig as LocalProviderConfig
					);
				case "google-drive":
					return new GoogleDriveImageProvider(
						providerConfig as GoogleDriveProviderConfig
					);
				default: {
					const unknownConfig = providerConfig as { type: string };
					throw new Error(
						`Unknown provider type: ${unknownConfig.type}`
					);
				}
			}
		});

		// Sort providers by priority (lower number = higher priority)
		this.providers.sort((a, b) => {
			const aConfig = a as unknown as { config?: { priority?: number } };
			const bConfig = b as unknown as { config?: { priority?: number } };
			const aPriority = aConfig.config?.priority || 999;
			const bPriority = bConfig.config?.priority || 999;
			return aPriority - bPriority;
		});
	}

	/**
	 * Check if at least one provider is configured
	 */
	async isConfigured(): Promise<boolean> {
		if (this.providers.length === 0) return false;

		// Check if at least one provider is configured
		const results = await Promise.all(
			this.providers.map((provider) => provider.isConfigured())
		);

		return results.some((result) => result === true);
	}

	/**
	 * Merge and deduplicate images from multiple providers
	 */
	private mergeImages(imagesArray: ImageMetadata[][]): ImageMetadata[] {
		const merged: ImageMetadata[] = [];
		const seenUrls = new Set<string>();

		// Flatten all images maintaining priority order
		for (const images of imagesArray) {
			for (const image of images) {
				// Deduplicate by URL
				if (!seenUrls.has(image.url)) {
					seenUrls.add(image.url);
					merged.push(image);
				}
			}
		}

		return merged;
	}

	/**
	 * Get all images from all providers
	 */
	async getImages(): Promise<ImageMetadata[]> {
		const results = await Promise.allSettled(
			this.providers.map((provider) => provider.getImages())
		);

		const successfulResults = results
			.filter(
				(result): result is PromiseFulfilledResult<ImageMetadata[]> =>
					result.status === "fulfilled"
			)
			.map((result) => result.value);

		// Log any failures
		results.forEach((result, index) => {
			if (result.status === "rejected") {
				console.error(
					`Provider ${index} failed to fetch images:`,
					result.reason
				);
			}
		});

		return this.mergeImages(successfulResults);
	}

	/**
	 * Get images from a specific directory across all providers
	 */
	async getImagesFromDirectory(directory: string): Promise<ImageMetadata[]> {
		const results = await Promise.allSettled(
			this.providers.map((provider) =>
				provider.getImagesFromDirectory(directory)
			)
		);

		const successfulResults = results
			.filter(
				(result): result is PromiseFulfilledResult<ImageMetadata[]> =>
					result.status === "fulfilled"
			)
			.map((result) => result.value);

		// Log any failures
		results.forEach((result, index) => {
			if (result.status === "rejected") {
				console.error(
					`Provider ${index} failed to fetch images from directory '${directory}':`,
					result.reason
				);
			}
		});

		return this.mergeImages(successfulResults);
	}

	/**
	 * Clear cache for all providers
	 */
	async clearCache(): Promise<void> {
		await Promise.all(
			this.providers.map((provider) =>
				provider.clearCache ? provider.clearCache() : Promise.resolve()
			)
		);
	}
}

/**
 * Create a hybrid image provider instance
 */
export function createHybridProvider(
	providers: (LocalProviderConfig | GoogleDriveProviderConfig)[]
): HybridImageProvider {
	return new HybridImageProvider({
		type: "hybrid",
		providers,
	});
}
