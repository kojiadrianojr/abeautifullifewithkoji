# Copilot Instructions

## Project Overview

A wedding website for Koji & Bea built with Next.js 15 (App Router), TypeScript, Chakra UI, and Framer Motion. The site is a **static export** (`output: 'export'` in `next.config.ts`) deployed via Docker or GitHub Pages.

## Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Runs prebuild (sync-images + optimize-images) then next build
npm run lint         # ESLint via next lint
npm run sync-images  # Manually sync images from Google Drive → public/images/
npm run sync-rsvp    # Sync RSVP responses from Google Sheets → config/guests.json
npm run clear-cache  # Clear the image cache
```

There are no tests in this project.

## Architecture

### Component organization

- `src/components/pages/` — full page sections (Hero, Gallery, Schedule, etc.), each in its own subdirectory
- `src/components/sections/` — only `Footer.tsx` (legacy naming; new sections go in `pages/`)
- `src/components/ui/` — reusable primitives: `SectionTitle`, `AnimatedButton`, `AnimatedIconButton`, `TimelineCard`, `GalleryLightbox`, `SkeletonImage`
- `src/components/ui/skeletons/` — per-section skeleton loaders used as `next/dynamic` fallbacks
- `src/hooks/` — custom hooks: `useActiveSection`, `useMounted`, `useScrollPosition`
- `src/types/` — shared TypeScript types (e.g., `ImageMetadata`)
- `scripts/` — build-time scripts run via `tsx` (sync-images, optimize-images, sync-rsvp)

### Dynamic imports and skeletons

All page sections except `HeroSection` are loaded with `next/dynamic` in `HomeContent.tsx`, each paired with a skeleton fallback from `src/components/ui/skeletons/`. When adding a new section, create both the section component and its corresponding skeleton, then register them in `HomeContent.tsx` using this pattern:

```tsx
const MySection = dynamic(
  () => import("@/components/pages/MySection").then((m) => ({ default: m.MySectionComponent })),
  { loading: () => <MySectionSkeleton /> }
);
```

### Config-driven content

All wedding content lives in `config/wedding.json`. Every section (hero, schedule, gallery, etc.) has an `enabled` boolean field. Components check `ConfigService.isSectionEnabled(section)` before rendering. To add/change any wedding detail, update `config/wedding.json` — do not hardcode values in components.

`ConfigService` (`src/services/configService.ts`) is the single entry point for all config data. It's a static class with typed accessors derived directly from the JSON (`WeddingConfig = typeof weddingConfig`).

### Page structure

`src/app/page.tsx` is a **server component** that fetches images in parallel via `Promise.all`, then passes them as props to `HomeContent.tsx` (client component). All page sections (`src/components/pages/`) are rendered inside `HomeContent`. New sections should follow this same server-fetch → client-render split.

### Image provider system

Images can come from three sources, controlled by `IMAGE_SOURCE_TYPE` env var:
- `local` (default) — reads from `public/images/<collection>/`
- `direct-google-drive` — downloads images from Google Drive at **build time** (`scripts/sync-images.ts` runs as `prebuild`), then serves them as local static assets
- `hybrid` — local files + live Google Drive API at runtime

`src/services/imageService.ts` exposes named functions per collection (`getGalleryImages()`, `getPrenupPhotos()`, etc.). The `IImageProvider` interface (`src/services/providers/`) abstracts the underlying source. Image collections are: `hero-album`, `gallery`, `throwback`, `prenup`, `dress-code`.

### Service layer conventions

- Services in `src/services/index.ts` re-export are **safe for both client and server**.
- `imageService.ts` and `googleFormsService.ts` are **server-side only** — import them directly, never from the barrel export.
- All services are either static classes (`ConfigService`, `NavigationService`) or exported async functions (`imageService`).

### Theme system

`config/wedding.json` → `theme.colors` and `theme.fonts` drive the entire visual theme. `ThemeProvider.tsx` extends Chakra UI's theme with these values and injects CSS variables (`--font-heading`, `--font-display`, `--font-body`) into `<head>`. To change the look, edit `config/wedding.json` theme fields only.

### Asset paths

Always use `getAssetPath()` from `src/lib/asset-path.ts` for image `src` attributes. This handles the `NEXT_PUBLIC_BASE_PATH` prefix needed for GitHub Pages subdirectory deployments (not needed for custom domains).

### Maintenance mode

`MaintenanceGate` wraps the entire app. Set `NEXT_PUBLIC_MAINTENANCE_MODE=true` in `.env.local` to show a holding page. Bypass with `/?token=<NEXT_PUBLIC_MAINTENANCE_TOKEN>` — the token is stored in `sessionStorage` for the session.

## Key Environment Variables

Copy `.env.local.example` to `.env.local`. Key vars:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_MAINTENANCE_MODE` | `true` to show maintenance page |
| `NEXT_PUBLIC_BASE_PATH` | Set for GitHub Pages subdirectory (leave empty for custom domains) |
| `IMAGE_SOURCE_TYPE` | `local` / `direct-google-drive` / `hybrid` |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON service account for Drive & Sheets APIs |
| `GOOGLE_DRIVE_FOLDER_ID` | Parent Drive folder; subfolders named `hero-album`, `gallery`, etc. are auto-discovered |

## Static Export Constraints

Because `output: 'export'` is set, **there are no API routes** and no server-side rendering at request time. All data fetching must happen at build time in server components. `next/image` optimization is disabled (`unoptimized: true`); images are pre-optimized to WebP by `scripts/optimize-images.ts` during prebuild.

## Commit Message Format

```
Add: New feature
Fix: Bug description
Update: What was updated
Remove: What was removed
Docs: Documentation changes
Refactor: Code restructure (no functionality change)
```
