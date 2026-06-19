#!/usr/bin/env node
/**
 * Rebuild the site to pick up new/updated Google Drive images.
 *
 * Usage:
 *   npm run clear-cache           → triggers a full rebuild
 *   npm run clear-cache -- --dev  → prints instructions for dev server
 */

const { execSync } = require('child_process');

const isDev = process.argv.includes('--dev');

if (isDev) {
	console.log('ℹ️  Dev server refresh\n');
	console.log('   After syncing images, restart the dev server:\n');
	console.log('     npm run sync-images');
	console.log('     npm run dev\n');
	process.exit(0);
}

console.log('🧹 Rebuilding to refresh images...\n');

try {
	execSync('npm run build', { stdio: 'inherit' });
	console.log('\n✅ Rebuild complete! Images have been refreshed.\n');
} catch (error) {
	console.error('\n❌ Build failed. Check the output above for errors.\n');
	process.exit(1);
}
