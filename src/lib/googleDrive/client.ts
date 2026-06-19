import { google, drive_v3 } from "googleapis";

const DRIVE_READONLY_SCOPE = "https://www.googleapis.com/auth/drive.readonly";

/**
 * Create an authenticated Google Drive API client from a service account key.
 */
export async function createDriveClient(
	serviceAccountKey?: string
): Promise<drive_v3.Drive> {
	const key = serviceAccountKey ?? process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

	if (!key) {
		throw new Error(
			"GOOGLE_SERVICE_ACCOUNT_KEY is not set. Provide a service account key to access Google Drive."
		);
	}

	const credentials =
		typeof key === "string" ? JSON.parse(key) : key;

	const auth = new google.auth.GoogleAuth({
		credentials,
		scopes: [DRIVE_READONLY_SCOPE],
	});

	return google.drive({ version: "v3", auth });
}
