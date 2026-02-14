# Changelog

All notable changes to this wedding website template will be documented here.

## [2.0.0] - 2026-02-14

### Major Refactoring 🔄

#### Architecture Improvements

- ✨ **New Services Layer**: Centralized business logic in dedicated services
  - `ConfigService`: Configuration management
  - `DateService`: Date/time formatting and calculations
  - `ImageService`: Image loading and directory management
  - `NavigationService`: Scroll and navigation utilities
- 🏗️ **Component Restructure**: Broke down large components into smaller, focused ones
- 📁 **Improved Organization**: New folder structure for better maintainability
  - `components/pages/`: Feature-specific page sections
  - `components/ui/`: Reusable UI components
  - `services/`: Business logic layer
- 🔄 **Backward Compatibility**: Maintained compatibility with existing code through wrapper functions

#### Component Refactoring

**Hero Section** - Split into 7 focused components:

- `HeroSection`: Main container
- `HeroTitle`: Tagline and couple names
- `HeroDetails`: Date, time, venue information
- `HeroBackground`: Background image and decorative gradients
- `DecorativeGradients`: Reusable gradient overlays
- `CountdownBox`: Countdown display
- `StackedImageGallery`: Image carousel

**Story Section** - Split into 4 components:

- `StorySection`: Main container
- `StoryText`: Story content and timeline
- `PhotoAlbum`: Individual photo album display
- `PhotoAlbums`: Multiple albums container
- `DecorativeFlowers`: Decorative elements

**Gallery Section** - Split into 3 components:

- `GallerySection`: Main container
- `GalleryGrid`: Image grid layout
- `GalleryImage`: Individual image item

**Schedule Section** - Split into 2 components:

- `ScheduleSection`: Main container
- `ScheduleEvent`: Individual schedule event card

**Registry Section** - Split into 2 components:

- `RegistrySection`: Main container
- `RegistryCard`: Individual registry card

**RSVP Section** - Simplified into single focused component

**FAQ Section** - Split into 2 components:

- `FAQSection`: Main container
- `FAQItem`: Individual FAQ accordion item

#### New Reusable UI Components

**Animation Components**:

- `FadeIn`: Configurable fade-in animation with direction support
- `ScaleIn`: Scale-in animation

**Utility Components**:

- `ImageNavigator`: Dot-based image navigation
- `LoadingSpinner`: Loading indicator with size variants
- `ErrorMessage`: Error display with retry functionality
- `SectionDivider`: Section separator with variants

#### Services API

**ConfigService** methods:

- `getConfig()`: Get full configuration
- `getCoupleNames()`: Get couple names (first names)
- `getFullCoupleNames()`: Get full couple names
- `getWeddingDate()`: Get wedding date as Date object
- `formatWeddingDate()`: Get formatted wedding date
- `getVenue()`, `getCeremonyVenue()`, `getReceptionVenue()`
- `getContentSection()`: Get specific section config
- `isSectionEnabled()`: Check if section is enabled
- `getPrimaryColor()`, `getSecondaryColor()`, `getAccentColor()`

**DateService** methods:

- `formatDate()`: Format date with custom options
- `formatTime()`: Format time with custom options
- `formatDateTime()`: Format date and time together
- `getTimeRemaining()`: Calculate countdown values
- `isPast()`, `isFuture()`: Date comparison
- `getRelativeTime()`: Get relative time description

**NavigationService** methods:

- `smoothScrollTo()`: Scroll to section smoothly
- `scrollToTop()`: Scroll to top of page
- `getScrollPosition()`: Get current scroll position
- `hasScrolledPast()`: Check if scrolled past threshold
- `getActiveSection()`: Get currently visible section
- `isInViewport()`: Check if element is visible
- `addScrollListener()`: Add throttled scroll listener

**ImageService** methods:

- `getImagesFromDirectory()`: Load images from any directory
- `getHeroAlbumImages()`: Get hero album images
- `getGalleryImages()`: Get gallery images
- `getThrowbackPhotos()`: Get throwback photos
- `getPrenupPhotos()`: Get prenup photos
- `validateImagePath()`: Check if image exists

#### Documentation

- 📖 **ARCHITECTURE.md**: Comprehensive architecture documentation
- 📘 **QUICK_REFERENCE.md**: Quick reference guide for services and components
- Updated existing documentation to reflect new structure

#### Benefits

- ✅ **Improved Maintainability**: Smaller, focused components easier to maintain
- ✅ **Better Reusability**: Generic UI components usable across sections
- ✅ **Enhanced Testability**: Small components and services easier to test
- ✅ **Clearer Code**: Separation of concerns between UI and business logic
- ✅ **Type Safety**: Comprehensive TypeScript types throughout
- ✅ **Developer Experience**: Better IDE autocomplete and error detection

### Migration Notes

- Old imports from `@/lib/*` still work but are deprecated
- New code should use `@/services` for business logic
- Component imports updated to use `@/components/pages`
- See ARCHITECTURE.md for detailed migration guide

---

## [1.0.0] - 2026-01-17

### Initial Release 🎉

#### Features

- ✨ Complete wedding website template
- 🎨 7 customizable sections (Hero, Story, Gallery, Schedule, Registry, RSVP, FAQ)
- 🎭 Dynamic theming system with CSS variables
- 📱 Fully responsive design
- ⚙️ JSON-based configuration (no coding required)
- 🐳 Docker support for easy deployment
- 📚 Comprehensive documentation
- 🎨 10 pre-made color schemes
- 🚀 Next.js 15 with App Router
- 📝 TypeScript support

#### Components

- Fixed navigation with mobile menu
- Hero section with background image support
- Story timeline with custom events
- Photo gallery with lightbox
- Event schedule with times
- Gift registry links
- RSVP call-to-action
- FAQ accordion
- Footer with contact info

#### Documentation

- README.md - Main documentation
- QUICK_START.md - 15-minute setup guide
- CUSTOMIZATION.md - Detailed customization guide
- DEPLOYMENT.md - Multiple deployment options
- BUSINESS.md - Guide for selling as a product
- COLOR_SCHEMES.md - Pre-made color palettes
- PROJECT_STRUCTURE.md - Complete project overview

#### Deployment

- Dockerfile for containerization
- docker-compose.yml for easy deployment
- Vercel-ready configuration
- Netlify-compatible
- Self-hosting support

### Technical Stack

- Next.js 15.1.4
- React 19.0.0
- TypeScript 5
- Tailwind CSS 3.4.1
- Node.js 20+

---

## Future Roadmap

### [1.1.0] - Planned

- [ ] Admin panel for easier customization
- [ ] Built-in RSVP form (no external service needed)
- [ ] Email notifications for RSVPs
- [ ] Guest list management
- [ ] Photo upload for guests
- [ ] Multiple language support
- [ ] Animation library integration (Framer Motion)
- [ ] SEO optimization improvements
- [ ] OpenGraph meta tags
- [ ] Structured data for search engines

### [1.2.0] - Planned

- [ ] Multiple theme presets (Classic, Modern, Rustic, Beach)
- [ ] Dark mode support
- [ ] Custom font upload
- [ ] Advanced color customization tool
- [ ] Video background support
- [ ] Music player
- [ ] Countdown timer
- [ ] Instagram feed integration

### [1.3.0] - Planned

- [ ] Guest authentication system
- [ ] Private sections for invited guests only
- [ ] Accommodation recommendations
- [ ] Transportation information section
- [ ] Live stream integration
- [ ] Virtual guest book
- [ ] Thank you card generator

### [2.0.0] - Future

- [ ] Full CMS integration
- [ ] Database backend (optional)
- [ ] Real-time updates
- [ ] Mobile app version
- [ ] Analytics dashboard
- [ ] A/B testing support
- [ ] Multi-wedding support (for businesses)
- [ ] API for third-party integrations

---

## Version History

| Version | Release Date | Notes           |
| ------- | ------------ | --------------- |
| 1.0.0   | 2026-01-17   | Initial release |

---

## How to Request Features

If you have ideas for improvements:

1. **GitHub Issues** (if open source)
   - Create a new issue
   - Label it as "feature request"
   - Describe your use case

2. **Email**
   - Send to: wedding@example.com
   - Subject: "Feature Request"
   - Include details and examples

3. **Community**
   - Join our Discord/Slack
   - Share in #feature-requests
   - Vote on existing requests

---

## Breaking Changes

None yet - this is version 1.0.0!

When we introduce breaking changes, they'll be documented here with migration guides.

---

## Contributors

- Initial development: [Your Name/Team]
- Special thanks to: Next.js, Vercel, Tailwind CSS teams

---

## License

This project is licensed under the MIT License - see LICENSE file for details.
