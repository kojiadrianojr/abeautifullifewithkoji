import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

/**
 * API Route: /api/images/[fileId]
 * 
 * This endpoint serves as a proxy for Google Drive images. It fetches images
 * from Google Drive using the service account authentication and streams them
 * to the client. This is necessary because Google Drive images accessed via
 * service accounts cannot be loaded directly in the browser.
 * 
 * Query Parameters:
 * - thumbnail: (optional) If "true", returns a thumbnail version (max 800px)
 */

// Cache control for images (7 days)
const CACHE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ fileId: string }> }
) {
	try {
		const { fileId } = await params;
		const searchParams = request.nextUrl.searchParams;
		const isThumbnail = searchParams.get("thumbnail") === "true";

		// Validate file ID
		if (!fileId || typeof fileId !== "string") {
			return NextResponse.json(
				{ error: "Invalid file ID" },
				{ status: 400 }
			);
		}

		// Initialize Google Drive API
		const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
		if (!credentials) {
			console.error("GOOGLE_SERVICE_ACCOUNT_KEY not configured");
			return NextResponse.json(
				{ error: "Image service not configured" },
				{ status: 503 }
			);
		}

		const parsedCredentials = JSON.parse(credentials);
		const auth = new google.auth.GoogleAuth({
			credentials: parsedCredentials,
			scopes: ["https://www.googleapis.com/auth/drive.readonly"],
		});

		const drive = google.drive({ version: "v3", auth });

		// Get file metadata first to check if it exists and get MIME type
		const fileMetadata = await drive.files.get({
			fileId: fileId,
			fields: "id, name, mimeType, size",
		});

		if (!fileMetadata.data) {
			return NextResponse.json(
				{ error: "File not found" },
				{ status: 404 }
			);
		}

		// For thumbnails, use the thumbnail endpoint
		if (isThumbnail) {
			// Google Drive API doesn't provide a direct thumbnail download,
			// so we'll fetch the full image and let the browser handle resizing
			// Alternatively, we could use sharp or another library to resize server-side
		}

		// Fetch the file content
		const response = await drive.files.get(
			{
				fileId: fileId,
				alt: "media",
			},
			{
				responseType: "arraybuffer",
			}
		);

		// Create response with proper headers
		const buffer = Buffer.from(response.data as ArrayBuffer);
		const mimeType = fileMetadata.data.mimeType || "image/jpeg";

		return new NextResponse(buffer, {
			status: 200,
			headers: {
				"Content-Type": mimeType,
				"Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
				"Content-Length": buffer.length.toString(),
				// Security headers
				"X-Content-Type-Options": "nosniff",
			},
		});
	} catch (error: any) {
		console.error("Error fetching image from Google Drive:", error);

		// Handle specific API errors
		if (error.code === 404) {
			return NextResponse.json(
				{ error: "Image not found" },
				{ status: 404 }
			);
		}

		if (error.code === 403) {
			return NextResponse.json(
				{ error: "Access denied to image" },
				{ status: 403 }
			);
		}

		// Generic error
		return NextResponse.json(
			{ error: "Failed to fetch image", details: error.message },
			{ status: 500 }
		);
	}
}
