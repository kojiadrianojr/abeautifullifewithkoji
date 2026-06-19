import beaData from "./bea.json";
import kojiData from "./koji.json";
import { mergeGuestLists, type GuestsFile } from "./types";

const bea = beaData as GuestsFile;
const koji = kojiData as GuestsFile;

const guestsData = {
	guests: mergeGuestLists(bea.guests, koji.guests),
	lastSyncedAt: bea.lastSyncedAt ?? koji.lastSyncedAt,
};

export default guestsData;
