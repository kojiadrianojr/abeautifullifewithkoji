/**
 * Image optimization script: converts local JPEG/PNG images in public/images
 * to WebP format, then removes the originals to avoid duplicates.
 *
 * Usage: npm run optimize-images
 * (Run once after adding or updating images in public/images/)
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";

const IMAGE_DIRS = [
	"hero-album",
	"gallery",
	"prenup",
	"throwback",
	"dress-code",
];

const PUBLIC_IMAGES = path.join(process.cwd(), "public", "images");
const SUPPORTED_EXTS = new Set([".jpg", ".jpeg", ".png"]);
const WEBP_QUALITY = 82;

async function convertToWebp(filePath: string): Promise<void> {
	const ext = path.extname(filePath).toLowerCase();
	if (!SUPPORTED_EXTS.has(ext)) return;

	const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, ".webp");

	// Skip if WebP already exists and is newer than the source
	if (fs.existsSync(webpPath)) {
		const srcStat = fs.statSync(filePath);
		const webpStat = fs.statSync(webpPath);
		if (webpStat.mtimeMs >= srcStat.mtimeMs) {
			console.log(`  ↳ skip  ${path.relative(process.cwd(), webpPath)} (up to date)`);
			// Remove the original since WebP is already current
			fs.unlinkSync(filePath);
			console.log(`  🗑  removed ${path.relative(process.cwd(), filePath)}`);
			return;
		}
	}

	const srcSize = fs.statSync(filePath).size;
	await sharp(filePath).webp({ quality: WEBP_QUALITY }).toFile(webpPath);
	const webpSize = fs.statSync(webpPath).size;
	const savings = (((srcSize - webpSize) / srcSize) * 100).toFixed(1);
	console.log(
		`  ✓ ${path.relative(process.cwd(), webpPath)} ` +
		`(${(srcSize / 1024).toFixed(0)} KB → ${(webpSize / 1024).toFixed(0)} KB, -${savings}%)`
	);

	// Remove the original after successful conversion
	fs.unlinkSync(filePath);
	console.log(`  🗑  removed ${path.relative(process.cwd(), filePath)}`);
}

async function processDirectory(dir: string): Promise<void> {
	if (!fs.existsSync(dir)) return;

	const entries = fs.readdirSync(dir, { withFileTypes: true });
	await Promise.all(
		entries.map((entry) => {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) return processDirectory(fullPath);
			if (entry.isFile()) return convertToWebp(fullPath);
			return Promise.resolve();
		})
	);
}

async function main(): Promise<void> {
	console.log("🖼  Optimizing images to WebP…\n");

	// Convert hero-bg.jpg and background.png at root level
	const rootImages = fs
		.readdirSync(PUBLIC_IMAGES)
		.filter((f) => SUPPORTED_EXTS.has(path.extname(f).toLowerCase()))
		.map((f) => path.join(PUBLIC_IMAGES, f));

	await Promise.all(rootImages.map(convertToWebp));

	// Convert images in each sub-directory
	for (const dir of IMAGE_DIRS) {
		const dirPath = path.join(PUBLIC_IMAGES, dir);
		console.log(`\n📁 ${dir}/`);
		await processDirectory(dirPath);
	}

	console.log("\n✅ Done.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
