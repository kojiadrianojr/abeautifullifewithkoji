import type { Guest } from "@/config/guests/types";

/**
 * Pure, client-safe display helpers for guests.
 * This module intentionally imports the Guest TYPE only (stripped at build),
 * never the guest data — so it can be used in client components without
 * shipping the guest list to the browser.
 */
export function getGuestDisplayName(guest: Guest): string {
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
