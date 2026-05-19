/**
 * Utility for generating Google Fonts URLs from theme font names.
 * Font names come from config/wedding.json → theme.fonts
 */

function toGoogleFontsFamily(fontName: string, type: "heading" | "body" | "display"): string {
  const encoded = fontName.replace(/ /g, "+");
  if (type === "body") {
    return `family=${encoded}:wght@300;400;500;600;700`;
  }
  if (type === "display") {
    // Serif display fonts need italic + regular weight variants
    return `family=${encoded}:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600`;
  }
  // Heading/script fonts (e.g. "Great Vibes") typically have no weight variants
  return `family=${encoded}`;
}

/**
 * Builds a Google Fonts CSS2 URL for the configured font names.
 * - Heading fonts: no weight variants (script/display single-weight)
 * - Display fonts: regular + italic weight variants
 * - Body fonts: common weights (300–700)
 */
export function buildGoogleFontsUrl(heading: string, body: string, display?: string): string {
  const families = [
    toGoogleFontsFamily(heading, "heading"),
    display ? toGoogleFontsFamily(display, "display") : null,
    toGoogleFontsFamily(body, "body"),
  ]
    .filter(Boolean)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
