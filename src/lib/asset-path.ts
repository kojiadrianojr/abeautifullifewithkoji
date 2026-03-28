/**
 * Get the correct asset path with basePath for production
 * This ensures assets work correctly on GitHub Pages or other deployments with basePath
 * 
 * Note: For custom domains, NEXT_PUBLIC_BASE_PATH should be empty or unset.
 * Only set NEXT_PUBLIC_BASE_PATH when deploying to a subdirectory (e.g., username.github.io/repo-name)
 */
export function getAssetPath(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Get basePath from environment (defaults to empty string for custom domains)
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // In production with basePath, prepend it; otherwise use root path
  if (basePath) {
    return `${basePath}/${cleanPath}`;
  }
  
  // Return the path with leading slash (for both development and production with custom domains)
  return `/${cleanPath}`;
}
