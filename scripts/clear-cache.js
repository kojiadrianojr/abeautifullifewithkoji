#!/usr/bin/env node
/**
 * Clear image cache script
 *
 * This project is a static site (next.config.ts: output: 'export').
 * There is no running API server, so the image cache lives only in
 * memory during a build or dev-server session.
 *
 * To pick up new/updated Google Drive images, run:
 *   npm run build   — rebuilds the static site with fresh images
 *   npm run dev     — restarts the dev server (cache resets on restart)
 *
 * Usage:
 *   npm run clear-cache           → triggers a full rebuild
 *   npm run clear-cache -- --dev  → prints instructions for dev server
 */

const { execSync } = require('child_process');

const isDev = process.argv.includes('--dev');

if (isDev) {
	console.log('ℹ️  Dev server cache refresh\n');
	console.log('   The image cache resets automatically when you restart the dev server.');
	console.log('   Stop the server (Ctrl+C) then run:\n');
	console.log('     npm run dev\n');
	console.log('   Or set IMAGE_CACHE_ENABLED=false in .env.local to disable caching entirely.\n');
	process.exit(0);
}

console.log('🧹 Clearing image cache by rebuilding the static site...\n');
console.log('   (This project uses static export — there is no API server to clear cache against.)\n');

try {
	execSync('npm run build', { stdio: 'inherit' });
	console.log('\n✅ Rebuild complete! Google Drive images have been refreshed.');
	console.log('   Deploy the updated "out/" directory to see the changes.\n');
} catch (error) {
	console.error('\n❌ Build failed. Check the output above for errors.\n');
	process.exit(1);
}
