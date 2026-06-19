/**
 * Guest Service — search and display for the RSVP flow.
 * Guest lists: config/guests/bea.json + config/guests/koji.json (merged in config/guests/index.ts).
 */

import guestsData from "../../config/guests";
import type { Guest } from "../../config/guests/types";

export type { Guest } from "../../config/guests/types";

export class GuestService {
	static getAllGuests(): Guest[] {
		return guestsData.guests;
	}

	static searchGuest(searchTerm: string): Guest[] {
		if (!searchTerm || searchTerm.trim() === "") {
			return [];
		}

		const normalizedSearch = searchTerm.toLowerCase().trim();

		return this.getAllGuests().filter((guest) => {
			if (guest.groupName?.toLowerCase().includes(normalizedSearch)) {
				return true;
			}

			if (guest.fullName?.toLowerCase().includes(normalizedSearch)) {
				return true;
			}

			if (guest.members) {
				return guest.members.some((member) =>
					member.toLowerCase().includes(normalizedSearch)
				);
			}

			return false;
		});
	}

	static findGuestByMemberName(memberName: string): Guest | undefined {
		const normalizedName = memberName.toLowerCase().trim();

		return this.getAllGuests().find((guest) => {
			if (guest.fullName?.toLowerCase() === normalizedName) {
				return true;
			}

			if (guest.members) {
				return guest.members.some(
					(member) => member.toLowerCase() === normalizedName
				);
			}

			return false;
		});
	}

	static getGuestDisplayName(guest: Guest): string {
		if (guest.fullName) return guest.fullName;
		if (guest.groupName) return guest.groupName;
		if (!guest.members?.length) return "Guest";

		if (guest.members.length === 1) return guest.members[0];
		if (guest.members.length === 2) {
			return `${guest.members[0]} and ${guest.members[1]}`;
		}

		const lastMember = guest.members[guest.members.length - 1];
		const otherMembers = guest.members.slice(0, -1).join(", ");
		return `${otherMembers}, and ${lastMember}`;
	}
}
