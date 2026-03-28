/**
 * Get the correct asset path with basePath for production
 * This ensures assets work correctly on GitHub Pages or other deployments with basePath
 */
export function getAssetPath(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In production with basePath, prepend it
  if (process.env.NODE_ENV === 'production') {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/abeautifullifewithkoji';
    return `${basePath}/${cleanPath}`;
  }
  
  // In development, return the path with leading slash
  return `/${cleanPath}`;
}
