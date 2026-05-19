/**
 * Font style objects for use in inline `style={{}}` props.
 *
 * These reference CSS custom properties set at server render time by layout.tsx
 * from config/wedding.json → theme.fonts, so changing the font config
 * automatically updates all consumers.
 *
 * For Chakra UI components, prefer the semantic token props instead:
 *   fontFamily="heading" | fontFamily="display" | fontFamily="body"
 *
 * Use fontStyles only when you need a plain JS style object
 * (e.g., in components that don't use Chakra UI).
 *
 * @example
 * <h1 style={{ ...fontStyles.heading, fontSize: '3rem' }}>Title</h1>
 * <p style={{ ...fontStyles.body }}>Body text</p>
 */
export const fontStyles = {
  heading: { fontFamily: "var(--font-heading), cursive" },
  display: { fontFamily: "var(--font-display), Georgia, serif" },
  body: { fontFamily: "var(--font-body), Arial, sans-serif" },
} as const satisfies Record<string, React.CSSProperties>;
