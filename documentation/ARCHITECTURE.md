# Refactored Code Architecture

## Overview

This document explains the refactored architecture that improves code organization, reusability, and maintainability.

## Directory Structure

```
src/
├── services/              # Business logic layer
│   ├── configService.ts   # Configuration management
│   ├── dateService.ts     # Date/time formatting utilities
│   ├── imageService.ts    # Image loading and management
│   ├── navigationService.ts # Navigation and scrolling utilities
│   └── index.ts          # Service exports
│
├── components/
│   ├── pages/            # Page section components (organized by feature)
│   │   ├── Hero/
│   │   │   ├── index.tsx           # Main HeroSection component
│   │   │   ├── HeroContent.tsx     # Hero text content
│   │   │   ├── HeroTitle.tsx       # Couple names and tagline
│   │   │   ├── HeroDetails.tsx     # Date, time, venue info
│   │   │   ├── HeroBackground.tsx  # Background and decorations
│   │   │   ├── DecorativeGradients.tsx
│   │   │   ├── CountdownBox.tsx    # Countdown display
│   │   │   └── StackedImageGallery.tsx # Image carousel
│   │   │
│   │   ├── Story/
│   │   │   ├── index.tsx           # Main StorySection component
│   │   │   ├── StoryText.tsx       # Story content and timeline
│   │   │   ├── PhotoAlbum.tsx      # Photo album display
│   │   │   ├── PhotoAlbums.tsx     # Multiple albums container
│   │   │   └── DecorativeFlowers.tsx
│   │   │
│   │   ├── Gallery/
│   │   │   ├── index.tsx           # Main GallerySection component
│   │   │   ├── GalleryGrid.tsx     # Image grid layout
│   │   │   └── GalleryImage.tsx    # Individual gallery image
│   │   │
│   │   ├── Schedule/
│   │   │   ├── index.tsx           # Main ScheduleSection component
│   │   │   └── ScheduleEvent.tsx   # Individual schedule event
│   │   │
│   │   ├── Registry/
│   │   │   ├── index.tsx           # Main RegistrySection component
│   │   │   └── RegistryCard.tsx    # Individual registry card
│   │   │
│   │   ├── RSVP/
│   │   │   └── index.tsx           # Main RSVPSection component
│   │   │
│   │   ├── FAQ/
│   │   │   ├── index.tsx           # Main FAQSection component
│   │   │   └── FAQItem.tsx         # Individual FAQ item
│   │   │
│   │   └── index.ts      # Export all page sections
│   │
│   ├── ui/               # Reusable UI components
│   │   ├── animations/
│   │   │   ├── FadeIn.tsx
│   │   │   ├── ScaleIn.tsx
│   │   │   └── index.ts
│   │   ├── AnimatedButton.tsx
│   │   ├── AnimatedIconButton.tsx
│   │   ├── GalleryLightbox.tsx
│   │   ├── ImageCard.tsx
│   │   ├── ImageNavigator.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── ParallaxBackground.tsx
│   │   ├── SectionContainer.tsx
│   │   ├── SectionTitle.tsx
│   │   ├── SectionDivider.tsx
│   │   └── TimelineCard.tsx
│   │
│   └── sections/         # Legacy sections (for backward compatibility)
│       └── Footer.tsx
│
└── lib/                  # Backward compatibility wrappers
    ├── config.ts         # Wraps ConfigService
    ├── date.ts          # Wraps DateService
    ├── hero-images.ts   # Wraps imageService
    └── navigation.ts    # Wraps NavigationService
```

## Architecture Principles

### 1. Separation of Concerns

#### Services Layer

All business logic is now centralized in the `services/` directory:

- **ConfigService**: Handles all configuration-related operations
- **DateService**: Manages date/time formatting and calculations
- **ImageService**: Handles image loading from directories
- **NavigationService**: Manages scrolling and navigation logic

#### Components Layer

Components are now organized by feature and responsibility:

- **Pages**: Feature-specific sections (Hero, Story, Gallery, etc.)
- **UI**: Reusable, generic UI components
- **Sections**: Legacy components for backward compatibility

### 2. Component Composition

Each page section is broken down into smaller, focused components:

**Before (Hero.tsx - ~100 lines)**:

- All hero logic in one file
- Hard to maintain and test

**After (Hero/ folder - multiple files)**:

- `HeroSection` (main component)
- `HeroTitle` (tagline and couple names)
- `HeroDetails` (date, time, venue)
- `HeroBackground` (background image and effects)
- `CountdownBox` (countdown display)
- `StackedImageGallery` (image carousel)

Benefits:

- Each component has a single responsibility
- Easier to test individual components
- Better code reusability
- Simpler debugging

### 3. Reusable UI Components

Generic components in `components/ui/`:

**Animation Components**:

- `FadeIn`: Configurable fade-in animation
- `ScaleIn`: Scale-in animation

**Common Components**:

- `ImageNavigator`: Dot-based image navigation
- `ImageCard`: Styled image card with effects
- `LoadingSpinner`: Loading indicator
- `ErrorMessage`: Error display component
- `SectionDivider`: Section separator

### 4. Service-Driven Architecture

Services provide a clean API for business logic:

```typescript
// Before
import { getWeddingConfig } from "@/lib/config";
const config = getWeddingConfig();
const coupleNames = `${config.wedding.couple.partner1.firstName} & ${config.wedding.couple.partner2.firstName}`;

// After
import { ConfigService } from "@/services";
const coupleNames = ConfigService.getCoupleNames();
```

### 5. Type Safety

All services and components use TypeScript for type safety:

```typescript
export class DateService {
	static formatDate(date: Date | string, options?: DateFormatOptions): string;
	static getTimeRemaining(targetDate: Date | string): TimeRemaining;
	static isPast(date: Date | string): boolean;
}
```

## Usage Examples

### Using Services

```typescript
import { ConfigService, DateService, NavigationService } from "@/services";

// Get configuration
const config = ConfigService.getConfig();
const coupleNames = ConfigService.getCoupleNames();

// Format dates
const formattedDate = DateService.formatDate(new Date());
const timeRemaining = DateService.getTimeRemaining(weddingDate);

// Navigation
NavigationService.smoothScrollTo("hero");
NavigationService.scrollToTop();
```

### Using Page Components

```typescript
import {
  HeroSection,
  StorySection,
  GallerySection
} from "@/components/pages";

export default function Home() {
  return (
    <>
      <HeroSection heroImages={images} />
      <StorySection />
      <GallerySection />
    </>
  );
}
```

### Using UI Components

```typescript
import { FadeIn, ScaleIn } from "@/components/ui/animations";
import { LoadingSpinner, ErrorMessage } from "@/components/ui";

export function MyComponent() {
  return (
    <FadeIn delay={0.2} direction="up">
      <div>Content</div>
    </FadeIn>
  );
}
```

## Migration Guide

### For Existing Code

The refactored code maintains backward compatibility through wrapper functions in `lib/`:

```typescript
// Old code still works
import { getWeddingConfig } from "@/lib/config";
const config = getWeddingConfig();

// But new code should use services
import { ConfigService } from "@/services";
const config = ConfigService.getConfig();
```

### Recommended Migration Steps

1. **Update imports**: Change from `@/lib/*` to `@/services`
2. **Update component imports**: Use new page components from `@/components/pages`
3. **Use UI components**: Replace custom components with reusable ones from `@/components/ui`

## Benefits

### Improved Maintainability

- Smaller, focused components
- Clear separation of concerns
- Easier to locate and fix bugs

### Better Reusability

- Generic UI components can be used across sections
- Services provide consistent APIs
- Animation components reduce code duplication

### Enhanced Testability

- Small components are easier to test
- Services can be mocked easily
- Clear interfaces for testing

### Scalability

- Easy to add new sections
- Simple to extend services
- Component composition allows growth

### Developer Experience

- Clear folder structure
- Intuitive naming conventions
- Comprehensive type safety
- Better IDE autocomplete

## Best Practices

1. **Keep components small**: Each component should do one thing well
2. **Use services for logic**: Keep components focused on UI
3. **Leverage composition**: Build complex UIs from simple components
4. **Type everything**: Use TypeScript for all new code
5. **Follow the pattern**: Match the established folder structure

## Future Enhancements

Potential improvements:

- Add unit tests for services
- Create component documentation
- Add Storybook for UI components
- Implement error boundaries
- Add performance monitoring
