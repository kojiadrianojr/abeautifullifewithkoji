/**
 * Guest Service
 * Handles guest-related operations including search and validation
 */

import guestsData from "../../config/guests.json";

export interface Guest {
	id: string;
	groupName?: string;
	members?: string[];
	fullName?: string;
	allowedSeats?: number;
}

export interface GuestsData {
	guests: Guest[];
}

export class GuestService {
	/**
	 * Get all guests from the guest list
	 */
	static getAllGuests(): Guest[] {
		return (guestsData as GuestsData).guests;
	}

	/**
	 * Search for a guest by name (case-insensitive, partial matching)
	 * Searches within all members of each guest group
	 * @param searchTerm - The name to search for
	 * @returns Array of matching guest groups
	 */
	static searchGuest(searchTerm: string): Guest[] {
		if (!searchTerm || searchTerm.trim() === "") {
			return [];
		}

		const normalizedSearch = searchTerm.toLowerCase().trim();
		const guests = this.getAllGuests();

		return guests.filter((guest) => {
			// Search in group name
			if (guest.groupName?.toLowerCase().includes(normalizedSearch)) {
				return true;
			}
			
			// Search in fullName if present
			if (guest.fullName?.toLowerCase().includes(normalizedSearch)) {
				return true;
			}
			
			// Search in any member name
			if (guest.members) {
				return guest.members.some((member) =>
					member.toLowerCase().includes(normalizedSearch)
				);
			}
			
			return false;
		});
	}

	/**
	 * Find an exact match for a guest group by member name (case-insensitive)
	 * @param memberName - The member name to match
	 * @returns The guest group if found, undefined otherwise
	 */
	static findGuestByMemberName(memberName: string): Guest | undefined {
		const normalizedName = memberName.toLowerCase().trim();
		const guests = this.getAllGuests();

		return guests.find((guest) => {
			// Check fullName for exact match
			if (guest.fullName?.toLowerCase() === normalizedName) {
				return true;
			}
			
			// Check members array
			if (guest.members) {
				return guest.members.some((member) => 
					member.toLowerCase() === normalizedName
				);
			}
			
			return false;
		});
	}

	/**
	 * Get guest by ID
	 * @param id - The guest ID
	 * @returns The guest if found, undefined otherwise
	 */
	static getGuestById(id: string): Guest | undefined {
		const guests = this.getAllGuests();
		return guests.find((guest) => guest.id === id);
	}

	/**
	 * Check if a guest exists in the list
	 * @param searchTerm - The name to search for
	 * @returns Boolean indicating if any matches were found
	 */
	static guestExists(searchTerm: string): boolean {
		return this.searchGuest(searchTerm).length > 0;
	}

	/**
	 * Format members list for display
	 * @param members - Array of member names
	 * @returns Formatted string (e.g., "John and Jane Doe", "John, Jane, and Bob")
	 */
	static formatMembersList(members: string[]): string {
		if (members.length === 0) return "";
		if (members.length === 1) return members[0];
		if (members.length === 2) return `${members[0]} and ${members[1]}`;
		
		const lastMember = members[members.length - 1];
		const otherMembers = members.slice(0, -1).join(", ");
		return `${otherMembers}, and ${lastMember}`;
	}
}
