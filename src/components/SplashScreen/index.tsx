'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ConfigService } from "@/services";
import { getAssetPath } from "@/lib/asset-path";

// ---------------------------------------------------------------------------
// Types & helpers
// ---------------------------------------------------------------------------

interface SplashScreenProps {
  onEnter: () => void;
  prenupPhotos?: string[];
}

/** Compute a scatter vector for each tile based on its grid position.
 *  Tiles drift toward the nearest viewport edge. The values are in viewport
 *  units so we avoid any runtime window measurement (SSR-safe). */
function getScatterVector(
  index: number,
  cols: number,
  total: number
): { x: string; y: string } {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const rows = Math.ceil(total / cols);

  // Normalised position in [-1, 1]
  const nx = (col / (cols - 1)) * 2 - 1; // -1 = far left, +1 = far right
  const ny = (row / (rows - 1)) * 2 - 1; // -1 = top, +1 = bottom

  // Amplify toward the closest edge so tiles truly leave the viewport
  const dist = 140; // vw / vh units
  return {
    x: `${(nx * dist).toFixed(0)}vw`,
    y: `${(ny * dist).toFixed(0)}vh`,
  };
}

// ---------------------------------------------------------------------------
// Animation phase timing (seconds)
// ---------------------------------------------------------------------------
const T = {
  tileStaggerDelay: 0.06,  // delay between each tile entrance
  tileEnterDuration: 0.5,  // duration for each tile to appear
  overlayDelay: 1.8,       // when the dark overlay starts fading in
  titleDelay: 2.4,         // when the couple names appear
  titleDuration: 1.0,
  scatterDelay: 4800,      // ms until scatter begins (after mount)
  fadeDelay: 5800,         // ms until background fade-to-cream begins (scatter ~0.9s, +100ms buffer)
  enterDelay: 7200,        // ms until onEnter() is called (gives ~1.4s for the fade)
  reducedTotal: 1200,      // ms for reduced-motion path
  reducedFadeDelay: 1400,  // ms for reduced-motion fade phase
  reducedEnterDelay: 1900, // ms for reduced-motion onEnter
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface TileProps {
  src: string;
  index: number;
  cols: number;
  total: number;
  isScattering: boolean;
  prefersReducedMotion: boolean | null;
}

function Tile({ src, index, cols, total, isScattering, prefersReducedMotion }: TileProps) {
  const scatter = useMemo(
    () => getScatterVector(index, cols, total),
    [index, cols, total]
  );

  const entranceDelay = prefersReducedMotion ? 0 : index * T.tileStaggerDelay;
  const enterDuration = prefersReducedMotion ? 0 : T.tileEnterDuration;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.08 }}
      animate={
        isScattering
          ? {
              opacity: 0,
              x: prefersReducedMotion ? 0 : scatter.x,
              y: prefersReducedMotion ? 0 : scatter.y,
              scale: 0.8,
            }
          : { opacity: 1, scale: 1, x: 0, y: 0 }
      }
      transition={
        isScattering
          ? { duration: prefersReducedMotion ? 0.2 : 0.9, ease: [0.4, 0, 1, 1] }
          : {
              duration: enterDuration,
              delay: entranceDelay,
              ease: [0.22, 1, 0.36, 1],
            }
      }
      style={{
        overflow: 'hidden',
        willChange: 'transform, opacity',
      }}
    >
      {/* Subtle float on individual tiles while idle */}
      <motion.div
        animate={
          !isScattering && !prefersReducedMotion
            ? { y: [0, index % 2 === 0 ? -4 : 4, 0] }
            : {}
        }
        transition={{
          duration: 3 + (index % 3) * 0.7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: (index % 5) * 0.4,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getAssetPath(src)}
          alt=""
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          loading={index < 9 ? 'eager' : 'lazy'}
        />
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function SplashScreen({ onEnter, prenupPhotos = [] }: SplashScreenProps) {
  const config = ConfigService.getConfig();
  const { wedding } = config;
  const prefersReducedMotion = useReducedMotion();

  const [phase, setPhase] = useState<'entering' | 'idle' | 'scattering' | 'fading'>('entering');

  // Pick up to 16 images; fall back gracefully if fewer are available
  const COLS_DESKTOP = 4;
  const COLS_MOBILE = 3;
  const MAX_TILES = 16;
  const tiles = prenupPhotos.slice(0, MAX_TILES);

  useEffect(() => {
    const scatterMs  = prefersReducedMotion ? T.reducedTotal : T.scatterDelay;
    const fadeMs     = prefersReducedMotion ? T.reducedFadeDelay : T.fadeDelay;
    const enterMs    = prefersReducedMotion ? T.reducedEnterDelay : T.enterDelay;

    const scatterTimer = setTimeout(() => setPhase('scattering'), scatterMs);
    const fadeTimer    = setTimeout(() => setPhase('fading'),    fadeMs);
    const enterTimer   = setTimeout(() => onEnter(),             enterMs);

    return () => {
      clearTimeout(scatterTimer);
      clearTimeout(fadeTimer);
      clearTimeout(enterTimer);
    };
  }, [onEnter, prefersReducedMotion]);

  const name1 = wedding.couple.partner1.firstName;
  const name2 = wedding.couple.partner2.firstName;

  // Grid fills the entire viewport — tiles stretch to fill rows evenly
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${COLS_MOBILE}, 1fr)`,
    // 16 tiles ÷ 3 cols = 6 rows on mobile; each row fills an equal fraction of 100vh
    gridAutoRows: `calc(100vh / ${Math.ceil(MAX_TILES / COLS_MOBILE)})`,
    gap: '4px',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  };

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#2C1A15',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        {/* ── Tile Grid ── */}
        <div
          style={{
            ...gridStyle,
            // Override to 4 columns on wider screens via media query equivalent
            // We use a CSS variable trick via a nested style element
          }}
          className="splash-grid"
        >
          {tiles.map((src, i) => (
            <Tile
              key={src}
              src={src}
              index={i}
              cols={COLS_DESKTOP}
              total={tiles.length}
              isScattering={phase === 'scattering' || phase === 'fading'}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>

        {/* ── Warm vignette overlay ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'scattering' || phase === 'fading' ? 0 : 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.8,
            delay: prefersReducedMotion ? 0 : T.overlayDelay,
          }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(44,26,21,0.38) 0%, rgba(44,26,21,0.75) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Couple names ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={
            phase === 'scattering' || phase === 'fading'
              ? { opacity: 0, y: -16 }
              : { opacity: 1, y: 0 }
          }
          transition={{
            duration: prefersReducedMotion ? 0 : T.titleDuration,
            delay: prefersReducedMotion ? 0 : T.titleDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            textAlign: 'center',
            padding: '0 1.5rem',
          }}
        >
          {/* Ornamental top rule */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            maxWidth: '28rem',
            marginBottom: '0.5rem',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(245,184,0,0.7))' }} />
            <span style={{ color: 'var(--color-primary)', fontSize: '0.55rem', letterSpacing: '0.4em' }}>✦</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, transparent, rgba(245,184,0,0.7))' }} />
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: 'var(--color-accent)',
              lineHeight: 1.1,
              textShadow: '0 2px 24px rgba(44,26,21,0.8)',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0',
              fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            }}
          >
            <span>{name1}</span>
            <motion.span
              animate={
                !prefersReducedMotion
                  ? { scale: [1, 1.12, 1], rotate: [0, -4, 4, 0] }
                  : {}
              }
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
              style={{
                display: 'block',
                fontWeight: 400,
                fontSize: '0.65em',
                lineHeight: 1.2,
                color: 'var(--color-primary)',
                filter: 'drop-shadow(0 0 12px rgba(245,184,0,0.45))',
              }}
            >
              &amp;
            </motion.span>
            <span>{name2}</span>
          </h1>

          {/* Ornamental bottom rule */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            maxWidth: '28rem',
            marginTop: '0.5rem',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(245,184,0,0.7))' }} />
            <span style={{ color: 'var(--color-primary)', fontSize: '0.55rem', letterSpacing: '0.4em' }}>✦</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, transparent, rgba(245,184,0,0.7))' }} />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={phase === 'scattering' || phase === 'fading' ? { opacity: 0 } : { opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              delay: prefersReducedMotion ? 0 : T.titleDelay + 0.4,
            }}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(0.6rem, 1.6vw, 0.85rem)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,248,220,0.65)',
              textShadow: '0 1px 10px rgba(44,26,21,0.6)',
              margin: '1rem 0 0',
            }}
          >
            August 14, 2026
          </motion.p>
        </motion.div>

        {/* ── Fade-to-background overlay (prevents flash on entry) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'fading' ? 1 : 0 }}
          transition={{
            duration: prefersReducedMotion ? 0.3 : 1.2,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--color-background)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />

        {/* Responsive grid override */}
        <style>{`
          @media (min-width: 640px) {
            .splash-grid {
              grid-template-columns: repeat(4, 1fr) !important;
              grid-auto-rows: calc(100vh / 4) !important;
            }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
