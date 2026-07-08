export interface Guest {
	id: string;
	groupName?: string;
	fullName?: string;
	members?: string[];
	allowedSeats?: number;
	/**
	 * Secret per-guest invite code used to gate access to the RSVP form.
	 * SERVER-ONLY: never send this to the browser. Always strip it with
	 * `toPublicGuest` before returning a guest over the network.
	 */
	inviteCode?: string;
}

/**
 * Guest shape safe to send to the client. Structurally identical to `Guest`
 * minus the secret `inviteCode`.
 */
export type PublicGuest = Omit<Guest, "inviteCode">;

/**
 * Strip the secret `inviteCode` (and any future server-only fields) so a guest
 * can be safely serialized to the browser.
 */
export function toPublicGuest(guest: Guest): PublicGuest {
	const { inviteCode: _inviteCode, ...publicGuest } = guest;
	return publicGuest;
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
