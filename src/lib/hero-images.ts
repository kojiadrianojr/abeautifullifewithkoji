/**
 * @deprecated Use imageService from @/services/imageService instead
 * This file is kept for backward compatibility
 */

import { getHeroAlbumImages as getHeroImages } from "@/services/imageService";

/**
 * Get all image files from the hero-album directory
 * @returns Promise resolving to array of image paths relative to /public
 */
export async function getHeroAlbumImages(): Promise<string[]> {
	return await getHeroImages();
}
