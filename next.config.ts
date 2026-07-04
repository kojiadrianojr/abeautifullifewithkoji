import fs from 'fs';
import path from 'path';
import type { NextConfig } from 'next';

/**
 * Restore gitignored config files from environment variables when they are
 * absent from disk (e.g. Vercel direct builds, fresh CI checkouts without a
 * file-injection step). This runs before Next.js compiles any modules, so
 * static JSON imports in configService.ts and server/guests/data.ts resolve.
 *
 * Set these in the Vercel dashboard (build environment) and as GitHub secrets:
 *   WEDDING_JSON        — full contents of config/wedding.json
 *   GUESTS_BEA_JSON     — full contents of config/guests/bea.json
 *   GUESTS_KOJI_JSON    — full contents of config/guests/koji.json
 */
function writeIfMissing(relPath: string, content: string | undefined): void {
  if (!content) return;
  const full = path.resolve(relPath);
  if (fs.existsSync(full)) return;
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
}

writeIfMissing('config/wedding.json', process.env.WEDDING_JSON);
writeIfMissing('config/guests/bea.json', process.env.GUESTS_BEA_JSON);
writeIfMissing('config/guests/koji.json', process.env.GUESTS_KOJI_JSON);

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle at .next/standalone/server.js so the
  // multi-stage Dockerfile can run `node server.js` without the full toolchain.
  output: 'standalone',
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
