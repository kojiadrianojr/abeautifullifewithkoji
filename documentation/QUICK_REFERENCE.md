# Quick Reference: Refactored Code

## Services API

### ConfigService

```typescript
import { ConfigService } from "@/services";

// Get full config
const config = ConfigService.getConfig();

// Get couple information
const coupleNames = ConfigService.getCoupleNames(); // "John & Jane"
const fullNames = ConfigService.getFullCoupleNames(); // "John Doe & Jane Smith"

// Get wedding details
const weddingDate = ConfigService.getWeddingDate(); // Date object
const formattedDate = ConfigService.formatWeddingDate(); // "Saturday, June 15, 2024"
const time = ConfigService.getWeddingTime(); // "4:00 PM"

// Get venue information
const venue = ConfigService.getVenue();
const ceremony = ConfigService.getCeremonyVenue();
const reception = ConfigService.getReceptionVenue();

// Get sections
const heroSection = ConfigService.getContentSection("hero");
const isEnabled = ConfigService.isSectionEnabled("gallery");

// Get theme
const theme = ConfigService.getTheme();
const primaryColor = ConfigService.getPrimaryColor();
const secondaryColor = ConfigService.getSecondaryColor();
const accentColor = ConfigService.getAccentColor();
```

### DateService

```typescript
import { DateService } from "@/services";

// Format dates
const formatted = DateService.formatDate(new Date());
const customFormat = DateService.formatDate(date, {
	year: "numeric",
	month: "short",
	day: "numeric",
});

// Format time
const time = DateService.formatTime(new Date());

// Format date and time together
const dateTime = DateService.formatDateTime(new Date());

// Get time remaining
const remaining = DateService.getTimeRemaining(weddingDate);
console.log(
	remaining.days,
	remaining.hours,
	remaining.minutes,
	remaining.seconds,
);

// Check if date is past/future
const isPast = DateService.isPast(date);
const isFuture = DateService.isFuture(date);

// Get relative time
const relative = DateService.getRelativeTime(date); // "in 3 days"
```

### NavigationService

```typescript
import { NavigationService } from "@/services";

// Scroll to section
NavigationService.smoothScrollTo("hero");
NavigationService.scrollToTop();

// Get scroll info
const scrollPos = NavigationService.getScrollPosition();
const hasScrolled = NavigationService.hasScrolledPast(300);

// Get active section
const activeSection = NavigationService.getActiveSection([
	"hero",
	"story",
	"gallery",
]);

// Check if element is visible
const element = document.getElementById("hero");
const isVisible = NavigationService.isInViewport(element);

// Add scroll listener
const cleanup = NavigationService.addScrollListener(
	() => console.log("Scrolled!"),
	{ throttle: 100 },
);

// Call cleanup when done
cleanup();
```

### ImageService (Server-Side Only)

```typescript
// Note: ImageService uses Node.js fs module and must be used in server components only
import {
  getHeroAlbumImages,
  getGalleryImages,
  getThrowbackPhotos,
  getPrenupPhotos,
  getImagesFromDirectory,
  validateImagePath
} from "@/services/imageService";

// Get images from specific directories
const heroImages = getHeroAlbumImages();
const galleryImages = getGalleryImages();
const throwbackPhotos = getThrowbackPhotos();
const prenupPhotos = getPrenupPhotos();

// Get images from any directory
const customImages = getImagesFromDirectory("custom-folder");

// Validate an image path
const exists = validateImagePath("/images/hero-album/1.jpg");

// Example usage in Server Component:
// src/app/page.tsx
import { getHeroAlbumImages } from "@/services/imageService";

export default function Home() {
  const heroImages = getHeroAlbumImages();
  return <HomeContent heroImages={heroImages} />;
}
```

## Component Usage

### Page Components

```typescript
import {
  HeroSection,
  StorySection,
  GallerySection,
  ScheduleSection,
  RegistrySection,
  RSVPSection,
  FAQSection
} from "@/components/pages";

// Use in your page
<HeroSection heroImages={images} />
<StorySection />
<GallerySection />
```

### UI Components

#### Animations

```typescript
import { FadeIn, ScaleIn } from "@/components/ui/animations";

<FadeIn delay={0.2} duration={1} direction="up" mounted={true}>
  <div>Content fades in from bottom</div>
</FadeIn>

<ScaleIn delay={0} duration={1.2} mounted={true}>
  <div>Content scales in</div>
</ScaleIn>
```

Direction options: `"up" | "down" | "left" | "right" | "none"`

#### Image Components

```typescript
import { ImageNavigator, ImageCard } from "@/components/ui";

<ImageNavigator
  totalImages={5}
  currentIndex={0}
  onSelectImage={(index) => setCurrentIndex(index)}
/>
```

#### Utility Components

```typescript
import {
  LoadingSpinner,
  ErrorMessage,
  SectionDivider
} from "@/components/ui";

<LoadingSpinner size="md" message="Loading..." />

<ErrorMessage
  title="Oops!"
  message="Something went wrong"
  onRetry={() => retry()}
/>

<SectionDivider variant="gradient" />
```

## Component Patterns

### Creating a New Page Section

```typescript
// src/components/pages/MySection/index.tsx
"use client";

import { Box, Container } from "@chakra-ui/react";
import { ConfigService } from "@/services";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function MySection() {
  const config = ConfigService.getConfig();
  const { mySection } = config.content;

  return (
    <Box id="my-section" as="section" py={{ base: 16, md: 24 }}>
      <Container maxW="7xl">
        <SectionTitle color="primary.500" mb={16}>
          {mySection.title}
        </SectionTitle>
        {/* Your content */}
      </Container>
    </Box>
  );
}
```

### Creating a Reusable Component

```typescript
// src/components/ui/MyComponent.tsx
"use client";

import { Box } from "@chakra-ui/react";

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <Box onClick={onClick}>
      {title}
    </Box>
  );
}
```

### Using Services in Components

```typescript
"use client";

import { useState, useEffect } from "react";
import { ConfigService, DateService } from "@/services";

export function MyComponent() {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const weddingDate = ConfigService.getWeddingDate();
    const remaining = DateService.getTimeRemaining(weddingDate);
    setCountdown(remaining);
  }, []);

  return <div>{countdown?.days} days remaining</div>;
}
```

## Folder Structure Quick Reference

```
src/
├── services/              # Business logic
│   ├── configService.ts
│   ├── dateService.ts
│   ├── imageService.ts
│   ├── navigationService.ts
│   └── index.ts
│
├── components/
│   ├── pages/            # Page sections (by feature)
│   │   ├── Hero/
│   │   ├── Story/
│   │   ├── Gallery/
│   │   ├── Schedule/
│   │   ├── Registry/
│   │   ├── RSVP/
│   │   ├── FAQ/
│   │   └── index.ts
│   │
│   └── ui/               # Reusable components
│       ├── animations/
│       ├── AnimatedButton.tsx
│       ├── LoadingSpinner.tsx
│       └── ...
│
└── lib/                  # Legacy (backward compatibility)
    ├── config.ts
    ├── date.ts
    └── navigation.ts
```

## Common Tasks

### Adding a New Service Method

```typescript
// src/services/configService.ts
export class ConfigService {
	// ... existing methods

	static getCustomField(): string {
		return this.config.custom.field;
	}
}
```

### Creating a Sub-component

```typescript
// src/components/pages/Hero/HeroButton.tsx
"use client";

import { Button } from "@chakra-ui/react";

interface HeroButtonProps {
  text: string;
  onClick: () => void;
}

export function HeroButton({ text, onClick }: HeroButtonProps) {
  return (
    <Button
      colorScheme="primary"
      onClick={onClick}
      size="lg"
    >
      {text}
    </Button>
  );
}
```

Then import in parent:

```typescript
// src/components/pages/Hero/index.tsx
import { HeroButton } from "./HeroButton";
```

### Using Multiple Services

```typescript
import {
  ConfigService,
  DateService,
  NavigationService
} from "@/services";

export function MyComponent() {
  const config = ConfigService.getConfig();
  const weddingDate = ConfigService.getWeddingDate();
  const formattedDate = DateService.formatDate(weddingDate);

  const handleClick = () => {
    NavigationService.smoothScrollTo("rsvp");
  };

  return (
    <div onClick={handleClick}>
      {formattedDate}
    </div>
  );
}
```

## Backward Compatibility

All old imports still work:

```typescript
// Old way (still works)
import { getWeddingConfig } from "@/lib/config";
import { formatDate } from "@/lib/date";
import { smoothScrollTo } from "@/lib/navigation";

// New way (recommended)
import { ConfigService, DateService, NavigationService } from "@/services";
```

## Tips

1. **Import from services**: Always use `@/services` for new code
2. **Use TypeScript**: Leverage autocomplete and type safety
3. **Keep components small**: Break down complex components
4. **Reuse UI components**: Don't create custom components when reusable ones exist
5. **Follow patterns**: Match the existing folder structure and naming conventions
