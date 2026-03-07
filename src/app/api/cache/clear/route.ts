import { NextRequest, NextResponse } from "next/server";
import { clearImageCache } from "@/services/imageService";

/**
 * API Route to clear image cache
 * 
 * Usage:
 *   POST /api/cache/clear
 * 
 * This is useful when you update images in Google Drive and want
 * to see the changes immediately without waiting for cache to expire.
 */
export async function POST(request: NextRequest) {
	try {
		// Optional: Add authentication here for production
		// const authHeader = request.headers.get("authorization");
		// if (authHeader !== `Bearer ${process.env.CACHE_CLEAR_SECRET}`) {
		//   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		// }

		await clearImageCache();

		return NextResponse.json({
			success: true,
			message: "Image cache cleared successfully",
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error clearing cache:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to clear cache",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

/**
 * GET endpoint to check cache status
 */
export async function GET() {
	return NextResponse.json({
		message: "Image cache API",
		endpoints: {
			POST: "/api/cache/clear - Clear image cache",
		},
		cacheConfig: {
			enabled: process.env.IMAGE_CACHE_ENABLED !== "false",
			duration: process.env.IMAGE_CACHE_DURATION || "5 minutes (default)",
		},
	});
}
