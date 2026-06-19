import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { drive_v3 } from "googleapis";

export const IMAGE_MIME_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/avif",
	"image/bmp",
] as const;

export const LOCAL_IMAGE_EXTENSIONS = new Set([
	".jpg",
	".jpeg",
	".png",
	".gif",
	".webp",
	".avif",
	".bmp",
]);

/**
 * Replace characters unsafe for local filenames.
 */
export function sanitizeFilename(name: string): string {
	return name.replace(/[/\\?%*:|"<>]/g, "-");
}

/**
 * List image files in a Google Drive folder.
 */
export async function listImageFiles(
	drive: drive_v3.Drive,
	folderId: string
): Promise<drive_v3.Schema$File[]> {
	const mimeQuery = IMAGE_MIME_TYPES.map((type) => `mimeType='${type}'`).join(" or ");

	const response = await drive.files.list({
		q: `'${folderId}' in parents and (${mimeQuery}) and trashed=false`,
		fields: "files(id, name, mimeType, modifiedTime, size)",
		orderBy: "name",
		pageSize: 1000,
	});

	return response.data.files || [];
}

/**
 * Returns true when the local copy is already up to date (original or WebP variant).
 */
export function isLocalCopyUpToDate(
	file: drive_v3.Schema$File,
	outputPath: string
): boolean {
	if (!file.modifiedTime) return false;

	const remoteMtime = new Date(file.modifiedTime);
	const webpPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");

	if (fs.existsSync(outputPath)) {
		const localMtime = fs.statSync(outputPath).mtime;
		if (localMtime >= remoteMtime) return true;
	}

	if (fs.existsSync(webpPath)) {
		const webpMtime = fs.statSync(webpPath).mtime;
		if (webpMtime >= remoteMtime) return true;
	}

	return false;
}

/**
 * Download a Drive file to a local path.
 */
export async function downloadFile(
	drive: drive_v3.Drive,
	fileId: string,
	outputPath: string
): Promise<void> {
	const response = await drive.files.get(
		{ fileId, alt: "media" },
		{ responseType: "stream" }
	);

	const writeStream = fs.createWriteStream(outputPath);
	await pipeline(response.data as unknown as Readable, writeStream);
}

/**
 * Build the set of local filenames to keep for a collection.
 * Includes WebP variants for JPEG/PNG sources (written by optimize-images).
 */
export function getKeepFilenames(remoteFiles: drive_v3.Schema$File[]): Set<string> {
	const keep = new Set<string>();

	for (const file of remoteFiles) {
		if (!file.name) continue;

		const safeFilename = sanitizeFilename(file.name);
		keep.add(safeFilename);

		const webpVariant = safeFilename.replace(/\.(jpg|jpeg|png)$/i, ".webp");
		if (webpVariant !== safeFilename) {
			keep.add(webpVariant);
		}
	}

	return keep;
}

/**
 * Remove local image files that are no longer present in Google Drive.
 */
export function removeOrphanedLocalImages(
	outputDir: string,
	keepFilenames: Set<string>,
	onRemoved?: (filename: string) => void
): number {
	if (!fs.existsSync(outputDir)) return 0;

	let removed = 0;

	for (const entry of fs.readdirSync(outputDir, { withFileTypes: true })) {
		if (!entry.isFile()) continue;

		const ext = path.extname(entry.name).toLowerCase();
		if (!LOCAL_IMAGE_EXTENSIONS.has(ext)) continue;
		if (keepFilenames.has(entry.name)) continue;

		fs.unlinkSync(path.join(outputDir, entry.name));
		removed++;
		onRemoved?.(entry.name);
	}

	return removed;
}
