#!/usr/bin/env node
/**
 * Clear image cache script
 * 
 * This script clears the Google Drive image cache by calling the API endpoint.
 * Useful after updating images in Google Drive.
 * 
 * Usage:
 *   npm run clear-cache
 *   or
 *   node scripts/clear-cache.js [URL]
 * 
 * Examples:
 *   node scripts/clear-cache.js
 *   node scripts/clear-cache.js http://localhost:3000
 *   node scripts/clear-cache.js https://your-domain.com
 */

const baseUrl = process.argv[2] || 'http://localhost:3000';
const endpoint = `${baseUrl}/api/cache/clear`;

console.log('🧹 Clearing image cache...\n');
console.log(`Endpoint: ${endpoint}\n`);

fetch(endpoint, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
})
	.then(async (response) => {
		const data = await response.json();
		
		if (response.ok && data.success) {
			console.log('✅ Cache cleared successfully!');
			console.log(`   Timestamp: ${data.timestamp}`);
			console.log('\n💡 Tip: Refresh your browser to see updated images\n');
		} else {
			console.error('❌ Failed to clear cache:');
			console.error(`   ${data.error || data.message}`);
			console.log('\n💡 Make sure the development server is running\n');
			process.exit(1);
		}
	})
	.catch((error) => {
		console.error('❌ Error connecting to server:');
		console.error(`   ${error.message}`);
		console.log('\n💡 Troubleshooting:');
		console.log('   1. Make sure the dev server is running: npm run dev');
		console.log('   2. Check the URL is correct');
		console.log('   3. Try: node scripts/clear-cache.js http://localhost:3000\n');
		process.exit(1);
	});
