# 📁 Project Structure

Complete overview of the wedding website template structure.

## Directory Layout

```
wedding-website/
├── .github/
│   └── copilot-instructions.md    # GitHub Copilot instructions
├── config/
│   └── wedding.json                # Main configuration file
├── public/
│   └── images/
│       ├── hero-bg.jpg            # Hero background image
│       └── gallery/               # Gallery photos
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with fonts
│   │   ├── page.tsx               # Main page
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── Navigation.tsx         # Navigation bar
│   │   ├── ThemeProvider.tsx      # Dynamic theming
│   │   └── sections/
│   │       ├── Hero.tsx           # Hero section
│   │       ├── Story.tsx          # Story timeline
│   │       ├── Gallery.tsx        # Photo gallery
│   │       ├── Schedule.tsx       # Event schedule
│   │       ├── Registry.tsx       # Gift registries
│   │       ├── RSVP.tsx          # RSVP section
│   │       ├── FAQ.tsx           # Frequently asked questions
│   │       └── Footer.tsx        # Footer with contact
│   └── lib/
│       └── config.ts              # Config utilities
├── Dockerfile                      # Docker configuration
├── docker-compose.yml              # Docker Compose setup
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS config
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies
├── .gitignore                      # Git ignore rules
├── .dockerignore                   # Docker ignore rules
├── LICENSE                         # MIT License
├── README.md                       # Main documentation
├── QUICK_START.md                  # Quick start guide
├── CUSTOMIZATION.md                # Customization guide
├── DEPLOYMENT.md                   # Deployment guide
├── BUSINESS.md                     # Selling guide
└── COLOR_SCHEMES.md               # Color scheme examples
```

## Key Files Explained

### Configuration Files

**`config/wedding.json`**
- Single source of truth for all wedding data
- Contains couple info, dates, venue, colors, content
- Easy to edit, no coding required
- JSON format for simplicity

**`tailwind.config.ts`**
- Tailwind CSS configuration
- Extends default theme with custom colors
- Uses CSS variables for dynamic theming
- Configures content paths

**`next.config.ts`**
- Next.js framework configuration
- Sets output mode to 'standalone' for Docker
- Configures image optimization
- Production-ready settings

**`tsconfig.json`**
- TypeScript compiler configuration
- Path aliases (@/* for src/*)
- Strict mode enabled
- Next.js plugin included

### Application Files

**`src/app/layout.tsx`**
- Root layout component
- Loads Google Fonts (Playfair Display, Inter)
- Applies ThemeProvider
- Sets metadata (title, description)

**`src/app/page.tsx`**
- Main homepage
- Conditionally renders sections based on config
- Clean, maintainable structure
- Server component (fast initial load)

**`src/app/globals.css`**
- Global styles and Tailwind directives
- CSS custom properties for theming
- Reusable component classes
- Utility classes

### Components

**`src/components/Navigation.tsx`**
- Fixed navigation bar
- Smooth scroll to sections
- Mobile responsive menu
- Transparent/solid background on scroll

**`src/components/ThemeProvider.tsx`**
- Client component for dynamic theming
- Reads colors from config
- Applies CSS variables at runtime
- Enables hot-swapping themes

**Section Components** (`src/components/sections/*.tsx`)
Each section is self-contained:
- Reads data from config
- Responsive design
- Accessible markup
- Smooth animations

### Utility Files

**`src/lib/config.ts`**
- Helper functions for config access
- Date formatting utilities
- Name formatting functions
- Type-safe config reading

### Docker Files

**`Dockerfile`**
- Multi-stage build
- Optimized for production
- Small final image size
- Non-root user for security

**`docker-compose.yml`**
- Simple one-command deployment
- Port mapping (3000)
- Environment variables
- Auto-restart policy

### Documentation

**`README.md`**
- Main project documentation
- Feature overview
- Installation instructions
- Quick reference

**`QUICK_START.md`**
- 15-minute setup guide
- Step-by-step instructions
- Common issues and fixes
- Perfect for beginners

**`CUSTOMIZATION.md`**
- Detailed customization guide
- Section-by-section walkthrough
- Image management
- FAQ customization

**`DEPLOYMENT.md`**
- Multiple deployment options
- Vercel, Netlify, Docker, AWS
- Domain setup instructions
- SSL configuration

**`BUSINESS.md`**
- Selling guide for developers
- Pricing strategies
- Marketing tips
- Support templates

**`COLOR_SCHEMES.md`**
- Pre-made color schemes
- Ready to copy/paste
- Seasonal recommendations
- Custom color tips

## Data Flow

```
config/wedding.json
        ↓
   lib/config.ts (utilities)
        ↓
   app/layout.tsx (theme)
        ↓
   app/page.tsx (sections)
        ↓
   components/sections/* (render)
```

## Customization Points

### Easy (No code)
- `config/wedding.json` - All content and settings
- `public/images/` - All images

### Medium (Basic code)
- `tailwind.config.ts` - Additional design tokens
- `app/globals.css` - Custom styles

### Advanced (Full code)
- `components/sections/` - New sections
- `app/page.tsx` - Layout changes
- `lib/` - New utilities

## Technology Stack

### Core
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS
- **CSS Variables** - Dynamic theming
- **Google Fonts** - Typography

### Build Tools
- **npm** - Package manager
- **ESLint** - Code linting
- **PostCSS** - CSS processing

### Deployment
- **Docker** - Containerization
- **Vercel** - Recommended hosting
- **Netlify** - Alternative hosting

## File Size Reference

Typical production build sizes:
- Total bundle: ~200-300KB (gzipped)
- First load JS: ~100KB
- CSS: ~10KB
- Images: Varies (optimize for web)

## Performance Features

- **Server Components** - Faster initial load
- **Image Optimization** - Next.js Image component ready
- **Code Splitting** - Automatic by Next.js
- **Static Generation** - Can be exported as static site
- **Font Optimization** - Google Fonts optimized

## Security Features

- **TypeScript** - Type safety
- **ESLint** - Code quality
- **Non-root user** - Docker security
- **Dependency pinning** - Reproducible builds
- **HTTPS ready** - Works with SSL

## Accessibility Features

- **Semantic HTML** - Proper heading hierarchy
- **ARIA labels** - Screen reader support
- **Keyboard navigation** - All interactive elements
- **Color contrast** - WCAG compliant default theme
- **Focus indicators** - Visible focus states

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Maintenance

### Regular Updates
1. Update dependencies monthly
   ```bash
   npm update
   ```

2. Check for security issues
   ```bash
   npm audit
   ```

3. Test after updates
   ```bash
   npm run dev
   ```

### Adding Content
1. Edit `config/wedding.json`
2. Add images to `public/images/`
3. Test locally
4. Deploy

### Troubleshooting
1. Check browser console for errors
2. Verify `wedding.json` is valid JSON
3. Clear `.next/` cache if needed
4. Check Node.js version (20+)

---

This structure is designed to be:
- ✅ Easy to understand
- ✅ Simple to customize
- ✅ Quick to deploy
- ✅ Maintainable long-term
