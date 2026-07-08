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

function writeFile(relPath: string, content: string): void {
  const full = path.resolve(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
}

/**
 * Ensure config/rsvp.json exists so the server-only RSVP form config can be
 * statically imported (and thus baked into the serverless function bundle,
 * available at RUNTIME — unlike a plain build-shell env var, which is not).
 *
 * Source of truth, in order:
 *   1. RSVP_JSON — full JSON: { "formUrl": "...", "nameEntry": "..." }
 *   2. RSVP_FORM_URL (+ optional RSVP_FORM_NAME_ENTRY) — synthesized into JSON
 *   3. Neither — write an empty placeholder so the import resolves (verify then
 *      returns 503 until configured), without clobbering an existing file.
 */
function ensureRsvpConfig(): void {
  const rel = 'config/rsvp.json';
  const rsvpJson = process.env.RSVP_JSON?.trim();
  if (rsvpJson) {
    writeFile(rel, rsvpJson);
    return;
  }

  const formUrl = process.env.RSVP_FORM_URL?.trim();
  if (formUrl) {
    const nameEntry = process.env.RSVP_FORM_NAME_ENTRY?.trim() || '';
    writeFile(rel, JSON.stringify({ formUrl, nameEntry }, null, 2));
    return;
  }

  writeIfMissing(rel, '{}\n');
}

writeIfMissing('config/wedding.json', process.env.WEDDING_JSON);
writeIfMissing('config/guests/bea.json', process.env.GUESTS_BEA_JSON);
writeIfMissing('config/guests/koji.json', process.env.GUESTS_KOJI_JSON);
ensureRsvpConfig();

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle at .next/standalone/server.js so the
  // multi-stage Dockerfile can run `node server.js` without the full toolchain.
  //
  // ONLY enable for the Docker build (BUILD_STANDALONE=1). On Vercel, `vercel
  // build --prebuilt` must use the default output — the standalone layout is
  // not served correctly by Vercel's runtime and makes the whole deployment
  // return 503 (both SSR routes and static assets).
  output: process.env.BUILD_STANDALONE === '1' ? 'standalone' : undefined,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
