# Wedding Website Customization Guide

This guide will walk you through customizing your wedding website step-by-step.

## Step 1: Update Couple Information

Open `config/wedding.json` and update the couple names and wedding details:

```json
{
	"wedding": {
		"couple": {
			"partner1": {
				"firstName": "YOUR_NAME",
				"lastName": "YOUR_LAST_NAME"
			},
			"partner2": {
				"firstName": "PARTNER_NAME",
				"lastName": "PARTNER_LAST_NAME"
			}
		},
		"date": "2026-08-15",
		"time": "4:00 PM"
	}
}
```

## Step 2: Update Venue Information

```json
{
	"venue": {
		"ceremony": {
			"name": "Your Venue Name",
			"address": "Full Address",
			"googleMapsUrl": "https://maps.google.com/?q=your+venue"
		}
	}
}
```

**Tip**: Get your Google Maps URL by:

1. Go to Google Maps
2. Search for your venue
3. Click "Share"
4. Copy the link

## Step 3: Choose Your Colors

Pick your wedding colors. Use a color picker tool to get hex codes:

```json
{
	"theme": {
		"colors": {
			"primary": "#8B7355", // Main brand color
			"secondary": "#D4A574", // Accent color
			"accent": "#E8D5C4", // Light accent
			"background": "#FFFAF5", // Page background
			"foreground": "#2C2C2C" // Text color
		}
	}
}
```

### Popular Color Schemes

**Romantic Blush**

```json
{
	"primary": "#C9A0A0",
	"secondary": "#F4E1D2",
	"accent": "#F8EDE3",
	"background": "#FFFBF7",
	"foreground": "#3D3D3D"
}
```

**Classic Navy**

```json
{
	"primary": "#2B3E50",
	"secondary": "#C9B037",
	"accent": "#E8DDB5",
	"background": "#FFFFFF",
	"foreground": "#2C2C2C"
}
```

**Rustic Sage**

```json
{
	"primary": "#8B9A8B",
	"secondary": "#D4C5A9",
	"accent": "#F4EEE0",
	"background": "#FFFEF9",
	"foreground": "#3A3A3A"
}
```

## Step 4: Add Your Story

Update the story section with your unique journey:

```json
{
	"content": {
		"story": {
			"enabled": true,
			"title": "Our Story",
			"content": "Write your story here...",
			"timeline": [
				{
					"year": "2020",
					"title": "We Met",
					"description": "How you met..."
				}
			]
		}
	}
}
```

## Step 5: Add Photos

1. Create these folders in `public/`:
   - `public/images/`
   - `public/images/gallery/`
   - `public/images/hero-album/`

2. Add your photos:
   - Hero background: `public/images/hero-bg.jpg` (optional, used for page background)
   - Hero album photos: Simply add images to `public/images/hero-album/` with any filename (e.g., `1.jpg`, `2.jpg`, `engagement.jpg`, etc.)
   - Gallery photos: `public/images/gallery/photo1.jpg`, etc.

**Hero Album Feature** - Automatic Image Loading:

- **Simply add images** to the `public/images/hero-album/` folder
- All images are **automatically detected** - no configuration needed!
- Supported formats: JPG, JPEG, PNG, WebP, GIF, AVIF
- Images are sorted naturally (1.jpg, 2.jpg, 10.jpg, etc.)
- Visitors can click the image or use arrow buttons to navigate through the album
- Navigation controls appear automatically when multiple images are present
- If no images are found in the folder, the hero image section is hidden

**Photo Tips**:

- Use high-quality images (at least 1920px wide for hero)
- Hero album works best with portrait-oriented photos (600x800px or similar)
- Compress images before uploading to improve load times
- Use consistent aspect ratios for gallery
- No limit on the number of hero images - add as many as you like!

## Step 6: Set Up Schedule

Customize your wedding day timeline:

```json
{
	"content": {
		"schedule": {
			"events": [
				{
					"time": "3:30 PM",
					"title": "Guest Arrival",
					"description": "Please arrive early"
				}
			]
		}
	}
}
```

## Step 7: Add Registry Links

Update with your actual registry URLs:

```json
{
	"content": {
		"registry": {
			"registries": [
				{
					"name": "Amazon",
					"url": "YOUR_AMAZON_REGISTRY_URL"
				}
			]
		}
	}
}
```

## Step 8: Set RSVP Details

Configure your RSVP section:

```json
{
	"content": {
		"rsvp": {
			"enabled": true,
			"deadline": "2026-07-15",
			"formUrl": "YOUR_FORM_URL",
			"message": "Please RSVP by July 15th"
		}
	}
}
```

**RSVP Form Options**:

- Google Forms (free)
- Typeform (beautiful UI)
- Joy (wedding-specific)
- RSVPify (dedicated platform)

## Step 9: Customize FAQ

The FAQ section now uses a separate configuration file for better organization. Edit `config/faq.json`:

```json
{
	"title": "Frequently Asked Questions",
	"questions": [
		{
			"id": 1,
			"question": "What should I wear?",
			"answer": "Your dress code...",
			"category": "dress-code"
		},
		{
			"id": 2,
			"question": "Where should I park?",
			"answer": "Parking information...",
			"category": "venue"
		}
	]
}
```

**FAQ Best Practices**:

- Use unique sequential IDs for each question
- Group related questions using categories
- Keep answers concise but informative
- Cover the most common guest concerns

**Common FAQ Categories**:

- `dress-code` - Attire guidelines
- `venue` - Parking, location, accessibility
- `food` - Menu, dietary restrictions
- `guests` - Plus ones, children policy
- `schedule` - Timeline, arrival times
- `accommodations` - Hotel recommendations
- `gifts` - Registry, gift policy

**Display**: FAQs are shown as interactive cards in a 2-column grid layout with hover animations.

## Step 10: Update Contact Information

```json
{
	"contact": {
		"email": "your-email@example.com",
		"phone": "(555) 123-4567"
	},
	"social": {
		"instagram": "#YourHashtag",
		"hashtag": "#YourHashtag"
	}
}
```

## Step 11: Enable/Disable Sections

Turn sections on or off:

```json
{
	"content": {
		"hero": { "enabled": true },
		"story": { "enabled": true },
		"gallery": { "enabled": false } // Hide this section
	}
}
```

## Step 12: Test Your Site

1. Run development server:

   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Check each section:
   - [ ] Names are correct
   - [ ] Date and time are correct
   - [ ] Colors match your theme
   - [ ] All links work
   - [ ] Images load properly
   - [ ] Mobile view looks good

## Step 13: Deploy

See the main README.md for deployment instructions.

## Quick Checklist

Before launching:

- [ ] All names spelled correctly
- [ ] Date and time verified
- [ ] Venue addresses correct
- [ ] All links tested
- [ ] Photos optimized and uploaded
- [ ] RSVP form created and linked
- [ ] Contact information current
- [ ] Tested on mobile
- [ ] Tested on different browsers
- [ ] Shared with a friend to review

## Need Help?

Common issues and solutions:

**Issue**: Colors not changing
**Solution**: Make sure hex codes start with `#` and are valid

**Issue**: Images not loading
**Solution**: Check that paths start with `/` and files exist in `public/`

**Issue**: Date format wrong
**Solution**: Use ISO format: `YYYY-MM-DD`

---

Congratulations on your wedding! 🎉
