export interface Guest {
	id: string;
	groupName?: string;
	fullName?: string;
	members?: string[];
	allowedSeats?: number;
	rsvpStatus?: "pending" | "confirmed" | "declined";
	rsvpCount?: number;
	rsvpDate?: string | null;
	dietaryRestrictions?: string | null;
	notes?: string | null;
}

export interface GuestsFile {
	guests: Guest[];
	lastSyncedAt?: string;
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

export function applyRsvpUpdates(
	sourceGuests: Guest[],
	updatedGuests: Guest[]
): Guest[] {
	const updatedByKey = new Map(
		updatedGuests.map((guest) => [guestKey(guest), guest])
	);

	return sourceGuests.map((guest) => {
		const updated = updatedByKey.get(guestKey(guest));
		if (!updated) return guest;

		return {
			...guest,
			rsvpStatus: updated.rsvpStatus,
			rsvpCount: updated.rsvpCount,
			rsvpDate: updated.rsvpDate,
			dietaryRestrictions: updated.dietaryRestrictions,
			notes: updated.notes,
		};
	});
}
