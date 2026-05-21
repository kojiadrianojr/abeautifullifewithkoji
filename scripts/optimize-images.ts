/**
 * Image optimization script: converts local JPEG/PNG images in public/images
 * to WebP format, resizes to web-appropriate dimensions, then removes the
 * originals to avoid duplicates.
 *
 * Usage:
 *   npm run optimize-images           # Skip already-optimized files
 *   npm run optimize-images -- --force  # Re-optimize all files (incl. existing WebP)
 *
 * (Run once after adding or updating images in public/images/)
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import os from "os";

// Max display width per collection. Height scales proportionally.
const MAX_WIDTHS: Record<string, number> = {
	"hero-album": 1920,
	gallery: 1600,
	prenup: 1600,
	throwback: 1200,
	"dress-code": 800,
	assets: 1920,
	root: 1920, // root-level images (hero-bg, etc.)
};

const IMAGE_DIRS = [
	"hero-album",
	"gallery",
	"prenup",
	"throwback",
	"dress-code",
	"assets",
];

const PUBLIC_IMAGES = path.join(process.cwd(), "public", "images");
const SUPPORTED_EXTS = new Set([".jpg", ".jpeg", ".png"]);
const WEBP_QUALITY = 75;
const FORCE = process.argv.includes("--force");

/**
 * Convert or resize a JPEG/PNG → WebP. Also resizes existing WebP files when
 * their dimensions exceed the max width for the collection.
 */
async function optimizeImage(filePath: string, maxWidth: number): Promise<void> {
	const ext = path.extname(filePath).toLowerCase();
	const isWebP = ext === ".webp";
	const isSource = SUPPORTED_EXTS.has(ext);
	if (!isSource && !isWebP) return;

	const webpPath = isWebP
		? filePath
		: filePath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
	const rel = path.relative(process.cwd(), webpPath);

	// For source files: skip if up-to-date WebP exists (and not forced)
	if (isSource && !FORCE && fs.existsSync(webpPath)) {
		const srcStat = fs.statSync(filePath);
		const webpStat = fs.statSync(webpPath);
		if (webpStat.mtimeMs >= srcStat.mtimeMs) {
			console.log(`  ↳ skip  ${rel} (up to date)`);
			fs.unlinkSync(filePath);
			return;
		}
	}

	// For existing WebP files: check dimensions before doing any work
	if (isWebP && !FORCE) {
		const meta = await sharp(filePath).metadata();
		if ((meta.width ?? 0) <= maxWidth) {
			console.log(`  ↳ skip  ${rel} (${meta.width}px ≤ ${maxWidth}px)`);
			return;
		}
	}

	const srcSize = fs.statSync(filePath).size;

	if (isWebP) {
		// Resize WebP in-place via a temp file to avoid corruption
		const tmp = path.join(os.tmpdir(), `opt-${Date.now()}-${path.basename(filePath)}`);
		await sharp(filePath)
			.resize({ width: maxWidth, withoutEnlargement: true })
			.webp({ quality: WEBP_QUALITY })
			.toFile(tmp);
		fs.renameSync(tmp, filePath);
	} else {
		await sharp(filePath)
			.resize({ width: maxWidth, withoutEnlargement: true })
			.webp({ quality: WEBP_QUALITY })
			.toFile(webpPath);
		fs.unlinkSync(filePath);
	}

	const outSize = fs.statSync(webpPath).size;
	const savings = (((srcSize - outSize) / srcSize) * 100).toFixed(1);
	const meta = await sharp(webpPath).metadata();
	console.log(
		`  ✓ ${rel} ` +
		`(${(srcSize / 1024).toFixed(0)} KB → ${(outSize / 1024).toFixed(0)} KB, -${savings}%, ${meta.width}×${meta.height})`
	);
}

async function processDirectory(dir: string, maxWidth: number): Promise<void> {
	if (!fs.existsSync(dir)) return;

	const entries = fs.readdirSync(dir, { withFileTypes: true });
	await Promise.all(
		entries.map((entry) => {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) return processDirectory(fullPath, maxWidth);
			if (entry.isFile()) return optimizeImage(fullPath, maxWidth);
			return Promise.resolve();
		})
	);
}

async function main(): Promise<void> {
	console.log(`🖼  Optimizing images to WebP (quality ${WEBP_QUALITY})${FORCE ? " [--force]" : ""}…\n`);

	// Root-level images (hero-bg, etc.)
	const rootImages = fs
		.readdirSync(PUBLIC_IMAGES)
		.filter((f) => {
			const ext = path.extname(f).toLowerCase();
			return SUPPORTED_EXTS.has(ext) || ext === ".webp";
		})
		.map((f) => path.join(PUBLIC_IMAGES, f));

	if (rootImages.length) {
		console.log("📁 (root)/");
		await Promise.all(rootImages.map((f) => optimizeImage(f, MAX_WIDTHS.root)));
	}

	// Sub-directories
	for (const dir of IMAGE_DIRS) {
		const dirPath = path.join(PUBLIC_IMAGES, dir);
		const maxWidth = MAX_WIDTHS[dir] ?? 1920;
		console.log(`\n📁 ${dir}/`);
		await processDirectory(dirPath, maxWidth);
	}

	console.log("\n✅ Done.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
