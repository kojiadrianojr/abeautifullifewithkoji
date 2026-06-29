/**
 * Guest types and client-safe display helpers for the RSVP flow.
 *
 * Guest DATA and SEARCH are server-only and live in `src/server/guests/*`,
 * exposed exclusively through the `POST /api/guests/search` route. Nothing in
 * this module imports the guest list, so it is safe to use in client components
 * without leaking the full list into the browser bundle.
 */

export type { Guest } from "@/config/guests/types";
export { getGuestDisplayName } from "@/lib/guestDisplay";
