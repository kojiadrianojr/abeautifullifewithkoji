/**
 * @deprecated Use imageService from @/services/imageService instead
 * This file is kept for backward compatibility
 */

import { getHeroAlbumImages as getHeroImages } from "@/services/imageService";

/**
 * Get all image files from the hero-album directory
 * @returns Array of image paths relative to /public
 */
export function getHeroAlbumImages(): string[] {
	return getHeroImages();
}
