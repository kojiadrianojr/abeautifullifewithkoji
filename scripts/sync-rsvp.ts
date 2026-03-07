#!/usr/bin/env node

/**
 * Sync Google Forms Responses Script
 * 
 * This script fetches responses from Google Forms (via Google Sheets API)
 * and updates the guests.json file with RSVP information.
 * 
 * Usage:
 *   tsx scripts/sync-rsvp.ts [spreadsheetId]
 * 
 * Environment Variables Required:
 *   GOOGLE_SERVICE_ACCOUNT_KEY - JSON string of Google Cloud service account credentials
 *   GOOGLE_FORMS_SPREADSHEET_ID - (Optional) Default spreadsheet ID if not provided as argument
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { GoogleFormsService } from '../src/services/googleFormsService';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function main() {
	try {
		// Get spreadsheet ID from command line argument or environment variable
		const spreadsheetId = process.argv[2] || process.env.GOOGLE_FORMS_SPREADSHEET_ID;
		
		if (!spreadsheetId) {
			console.error('❌ Error: Spreadsheet ID is required');
			console.log('\nUsage:');
			console.log('  npm run sync-rsvp [spreadsheetId]');
			console.log('\nOr set GOOGLE_FORMS_SPREADSHEET_ID environment variable');
			console.log('\nTo find your spreadsheet ID:');
			console.log('  1. Open your Google Form');
			console.log('  2. Click "Responses" tab');
			console.log('  3. Click the Google Sheets icon to create/open linked spreadsheet');
			console.log('  4. Copy the spreadsheet ID from the URL');
			console.log('     (https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit)');
			process.exit(1);
		}
		
		console.log('🔄 Fetching RSVP responses from Google Forms...\n');
		
		// Read current guests data
		const guestsPath = path.join(process.cwd(), 'config', 'guests.json');
		const guestsData = JSON.parse(fs.readFileSync(guestsPath, 'utf-8'));
		
		console.log(`📋 Loaded ${guestsData.guests.length} guests from guests.json`);
		
		// Fetch responses from Google Sheets
		const formsService = new GoogleFormsService();
		const responses = await formsService.fetchResponses(spreadsheetId);
		
		console.log(`📝 Fetched ${responses.length} form responses\n`);
		
		if (responses.length === 0) {
			console.log('⚠️  No responses found. Make sure:');
			console.log('   - The spreadsheet ID is correct');
			console.log('   - The spreadsheet has responses');
			console.log('   - Your service account has access to the spreadsheet');
			return;
		}
		
		// Match responses to guests
		const updatedGuests = formsService.matchResponsesToGuests(responses, guestsData.guests);
		
		// Count updates
		let confirmedCount = 0;
		let declinedCount = 0;
		let pendingCount = 0;
		
		updatedGuests.forEach(guest => {
			if (guest.rsvpStatus === 'confirmed') confirmedCount++;
			else if (guest.rsvpStatus === 'declined') declinedCount++;
			else pendingCount++;
		});
		
		console.log('📊 RSVP Summary:');
		console.log(`   ✅ Confirmed: ${confirmedCount}`);
		console.log(`   ❌ Declined: ${declinedCount}`);
		console.log(`   ⏳ Pending: ${pendingCount}`);
		console.log(`   📍 Total Guests: ${updatedGuests.length}\n`);
		
		// Show matched responses
		console.log('🔗 Matched Responses:');
		responses.forEach(response => {
			const matchedGuest = updatedGuests.find(g => 
				g.fullName?.toLowerCase().includes(response.guestName.toLowerCase()) ||
				g.groupName?.toLowerCase().includes(response.guestName.toLowerCase()) ||
				g.members?.some(m => m.toLowerCase().includes(response.guestName.toLowerCase()))
			);
			
			const status = response.attendance === 'Yes' ? '✅' : '❌';
			const guestInfo = matchedGuest 
				? `${matchedGuest.fullName || matchedGuest.groupName}` 
				: '❓ Not matched';
				
			console.log(`   ${status} ${response.guestName} → ${guestInfo}`);
			
			if (response.dietaryRestrictions) {
				console.log(`      🍽️  Dietary: ${response.dietaryRestrictions}`);
			}
			if (response.notes) {
				console.log(`      📝 Notes: ${response.notes}`);
			}
		});
		
		console.log('\n');
		
		// Create backup of current guests file
		const backupPath = path.join(
			process.cwd(), 
			'config', 
			`guests.backup.${Date.now()}.json`
		);
		fs.writeFileSync(backupPath, JSON.stringify(guestsData, null, 2));
		console.log(`💾 Backup created: ${path.basename(backupPath)}`);
		
		// Update guests.json file
		const updatedGuestsData = {
			...guestsData,
			guests: updatedGuests,
			lastSyncedAt: new Date().toISOString(),
		};
		
		fs.writeFileSync(guestsPath, JSON.stringify(updatedGuestsData, null, 2));
		console.log('✅ Successfully updated guests.json\n');
		
		// Show unmatched responses (if any)
		const unmatchedResponses = responses.filter(response => {
			return !updatedGuests.some(guest =>
				guest.fullName?.toLowerCase().includes(response.guestName.toLowerCase()) ||
				guest.groupName?.toLowerCase().includes(response.guestName.toLowerCase()) ||
				guest.members?.some(m => m.toLowerCase().includes(response.guestName.toLowerCase()))
			);
		});
		
		if (unmatchedResponses.length > 0) {
			console.log('⚠️  Unmatched Responses (not found in guest list):');
			unmatchedResponses.forEach(response => {
				console.log(`   - ${response.guestName} (${response.attendance})`);
			});
			console.log('\n   💡 Consider adding these guests to guests.json manually\n');
		}
		
	} catch (error) {
		console.error('\n❌ Error syncing RSVP responses:');
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error(errorMessage);
		
		if (errorMessage.includes('GOOGLE_SERVICE_ACCOUNT_KEY')) {
			console.log('\n💡 To fix this:');
			console.log('   1. Create a Google Cloud service account');
			console.log('   2. Enable Google Sheets API');
			console.log('   3. Download the service account key JSON');
			console.log('   4. Set GOOGLE_SERVICE_ACCOUNT_KEY environment variable');
			console.log('   5. Share your Google Sheets with the service account email');
			console.log('\n   See documentation/GOOGLE_FORMS_SETUP.md for detailed instructions');
		}
		
		process.exit(1);
	}
}

main();
