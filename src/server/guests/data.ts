import "server-only";

import beaData from "@/config/guests/bea.json";
import kojiData from "@/config/guests/koji.json";
import { mergeGuestLists, type Guest, type GuestsFile } from "@/config/guests/types";

const bea = beaData as GuestsFile;
const koji = kojiData as GuestsFile;

const guests: Guest[] = mergeGuestLists(bea.guests, koji.guests);

export function getAllGuests(): Guest[] {
	return guests;
}
