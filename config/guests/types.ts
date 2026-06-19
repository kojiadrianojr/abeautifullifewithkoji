export interface Guest {
	id: string;
	groupName?: string;
	fullName?: string;
	members?: string[];
	allowedSeats?: number;
}

export interface GuestsFile {
	guests: Guest[];
}

export function guestKey(
	guest: Pick<Guest, "fullName" | "groupName" | "members">
): string {
	if (guest.fullName) return guest.fullName.toLowerCase().trim();
	if (guest.groupName) return guest.groupName.toLowerCase().trim();
	if (guest.members?.length) return guest.members.join("|").toLowerCase().trim();
	return "";
}

export function reindexGuests(guests: Guest[]): Guest[] {
	return guests.map((guest, index) => {
		const { id: _id, ...rest } = guest;
		return { id: String(index + 1), ...rest };
	});
}

export function mergeGuestLists(beaGuests: Guest[], kojiGuests: Guest[]): Guest[] {
	return reindexGuests([...beaGuests, ...kojiGuests]);
}
