/**
 * Google Forms Service
 * Handles fetching and processing Google Forms responses
 * 
 * ⚠️ SERVER-SIDE ONLY - This service requires Node.js APIs
 * Do not import this in client components or from services/index.ts
 * 
 * Usage: Only use in server-side scripts (e.g., scripts/sync-rsvp.js)
 * 
 * Note: Google Forms responses are stored in Google Sheets.
 * This service uses the Google Sheets API to fetch responses.
 */

import { google, sheets_v4 } from "googleapis";
import type { Guest } from "./guestService";

export interface FormResponse {
	timestamp: string;
	guestName: string;
	attendance: "Yes" | "No";
	numberOfGuests: number;
	dietaryRestrictions?: string;
	notes?: string;
}

export class GoogleFormsService {
	private sheets: sheets_v4.Sheets | null = null;
	
	/**
	 * Initialize the Google Sheets API client
	 * Requires GOOGLE_SERVICE_ACCOUNT_KEY environment variable
	 */
	private async initializeClient() {
		if (this.sheets) return this.sheets;
		
		const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
		
		if (!serviceAccountKey) {
			throw new Error(
				"GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set. " +
				"Please provide a service account key to access Google Sheets API."
			);
		}
		
		try {
			const credentials = JSON.parse(serviceAccountKey);
			
			const auth = new google.auth.GoogleAuth({
				credentials,
				scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
			});
			
			this.sheets = google.sheets({ version: "v4", auth });
			return this.sheets;
		} catch (error) {
			throw new Error(
				`Failed to initialize Google Sheets API client: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	}
	
	/**
	 * Fetch all responses from a Google Forms spreadsheet
	 * @param spreadsheetId - The ID of the Google Sheets document
	 * @param range - The range to fetch (default: "Form Responses 1!A:Z")
	 * @returns Array of form responses
	 */
	async fetchResponses(
		spreadsheetId: string,
		range: string = "Form Responses 1!A:Z"
	): Promise<FormResponse[]> {
		const sheets = await this.initializeClient();
		
		try {
			const response = await sheets.spreadsheets.values.get({
				spreadsheetId,
				range,
			});
			
			const rows = response.data.values;
			
			if (!rows || rows.length === 0) {
				return [];
			}
			
			// First row contains headers
			const headers = rows[0];
			const dataRows = rows.slice(1);
			
			return this.parseResponses(headers, dataRows);
		} catch (error) {
			throw new Error(
				`Failed to fetch Google Forms responses: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	}
	
	/**
	 * Parse raw spreadsheet data into FormResponse objects
	 * @param headers - Column headers from the spreadsheet
	 * @param rows - Data rows from the spreadsheet
	 * @returns Array of parsed form responses
	 */
	private parseResponses(headers: string[], rows: string[][]): FormResponse[] {
		// Find column indices based on common header patterns
		const timestampIndex = this.findColumnIndex(headers, ["timestamp", "date", "time"]);
		const nameIndex = this.findColumnIndex(headers, ["name", "full name", "guest name"]);
		const attendanceIndex = this.findColumnIndex(headers, ["will you be attending?"]);
		const guestCountIndex = this.findColumnIndex(headers, ["number of guests", "guests", "how many", "party size"]);
		const dietaryIndex = this.findColumnIndex(headers, ["dietary", "restrictions", "allergies", "food"]);
		const notesIndex = this.findColumnIndex(headers, ["notes", "comments", "message", "additional"]);
		
		return rows.map(row => {
			const attendance = row[attendanceIndex] || "";
			const isAttending = attendance.toLowerCase().includes("of course, see you!") || 
			                   attendance.toLowerCase().includes("unfortunately, no.");
			
			return {
				timestamp: row[timestampIndex] || "",
				guestName: row[nameIndex] || "",
				attendance: (isAttending ? "Yes" : "No") as "Yes" | "No",
				numberOfGuests: parseInt(row[guestCountIndex] || "1", 10) || 1,
				dietaryRestrictions: row[dietaryIndex] || undefined,
				notes: row[notesIndex] || undefined,
			};
		}).filter(response => response.guestName.trim() !== "");
	}
	
	/**
	 * Find the index of a column based on potential header names
	 * @param headers - Array of header strings
	 * @param patterns - Array of possible header names to match
	 * @returns The index of the matching column, or -1 if not found
	 */
	private findColumnIndex(headers: string[], patterns: string[]): number {
		const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
		
		for (const pattern of patterns) {
			const index = normalizedHeaders.findIndex(h => h.includes(pattern.toLowerCase()));
			if (index !== -1) return index;
		}
		
		// Return the first or default index if no match found
		return 0;
	}
	
	/**
	 * Match form responses to guest list and update guest RSVP status
	 * @param responses - Array of form responses
	 * @param guests - Array of guests from the guest list
	 * @returns Updated guest list with RSVP information
	 */
	matchResponsesToGuests(responses: FormResponse[], guests: Guest[]): Guest[] {
		const updatedGuests = [...guests];
		
		for (const response of responses) {
			const normalizedName = response.guestName.toLowerCase().trim();
			
			// Find matching guest
			const guestIndex = updatedGuests.findIndex(guest => {
				// Check fullName
				if (guest.fullName?.toLowerCase().trim() === normalizedName) {
					return true;
				}
				
				// Check group name
				if (guest.groupName?.toLowerCase().trim() === normalizedName) {
					return true;
				}
				
				// Check members
				if (guest.members) {
					return guest.members.some(
						member => member.toLowerCase().trim() === normalizedName
					);
				}
				
				// Fuzzy match (contains)
				if (guest.fullName?.toLowerCase().includes(normalizedName) ||
				    normalizedName.includes(guest.fullName?.toLowerCase() || "")) {
					return true;
				}
				
				if (guest.groupName?.toLowerCase().includes(normalizedName) ||
				    normalizedName.includes(guest.groupName?.toLowerCase() || "")) {
					return true;
				}
				
				return false;
			});
			
			if (guestIndex !== -1) {
				updatedGuests[guestIndex] = {
					...updatedGuests[guestIndex],
					rsvpStatus: response.attendance === "Yes" ? "confirmed" : "declined",
					rsvpCount: response.attendance === "Yes" ? response.numberOfGuests : 0,
					rsvpDate: response.timestamp,
					dietaryRestrictions: response.dietaryRestrictions || null,
					notes: response.notes || null,
				};
			}
		}
		
		return updatedGuests;
	}
	
	/**
	 * Extract spreadsheet ID from Google Forms URL or Sheets URL
	 * @param url - Google Forms or Sheets URL
	 * @returns Spreadsheet ID or null if not found
	 */
	static extractSpreadsheetId(url: string): string | null {
		// Pattern for Google Sheets URL
		const sheetsPattern = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
		const sheetsMatch = url.match(sheetsPattern);
		
		if (sheetsMatch) {
			return sheetsMatch[1];
		}
		
		// For Google Forms, you need to get the linked spreadsheet ID manually
		// This cannot be extracted from the form URL alone
		return null;
	}
}

const googleFormsService = new GoogleFormsService();
export default googleFormsService;
