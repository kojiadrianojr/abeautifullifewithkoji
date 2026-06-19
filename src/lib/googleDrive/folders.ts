import { drive_v3 } from "googleapis";
import type { ImageCollection } from "./config";

/**
 * Resolve the Drive folder ID for an image collection.
 *
 * - Uses the configured folder ID when set.
 * - Otherwise searches for a subfolder named after the collection inside the main folder.
 */
export async function resolveCollectionFolderId(
	drive: drive_v3.Drive,
	collection: ImageCollection,
	configuredId: string | undefined,
	fallbackFolderId: string
): Promise<string | null> {
	if (configuredId) return configuredId;

	try {
		const response = await drive.files.list({
			q: `'${fallbackFolderId}' in parents and name='${collection}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
			fields: "files(id, name)",
			pageSize: 1,
		});

		const folders = response.data.files || [];
		if (folders.length > 0 && folders[0].id) {
			return folders[0].id;
		}
	} catch (error) {
		throw new Error(
			`Could not search for subfolder "${collection}": ${error instanceof Error ? error.message : String(error)}`
		);
	}

	return null;
}
