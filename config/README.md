# Configuration Files

This directory contains all the configuration files for your wedding website.

## Files Overview

### `wedding.json`

Main configuration file containing wedding details, theme settings, and content for all sections.

**Key sections:**

- `wedding`: Couple names, date, time, and venue information
- `theme`: Colors and fonts customization
- `content`: Control visibility and content for each section
- `contact`: Contact information
- `social`: Social media handles and hashtags

### `faq.json`

Frequently Asked Questions data displayed in the FAQ section.

**Structure:**

```json
{
	"title": "Frequently Asked Questions",
	"questions": [
		{
			"id": 1,
			"question": "Your question here",
			"answer": "Your answer here",
			"category": "category-name"
		}
	]
}
```

**Categories:** Use categories to organize FAQs (e.g., "dress-code", "venue", "food", "guests", "schedule")

### `guests.json`

Guest list for RSVP management and personalized features.

**Structure:**

```json
{
	"guests": [
		{
			"id": "unique-id",
			"name": "Guest Name",
			"email": "guest@example.com",
			"phone": "+1234567890",
			"plusOne": false,
			"rsvpStatus": "pending"
		}
	]
}
```

## How to Customize

### Adding FAQ Questions

1. Open `faq.json`
2. Add a new object to the `questions` array:
   ```json
   {
   	"id": 7,
   	"question": "What is the weather like?",
   	"answer": "The weather in August is typically warm and sunny.",
   	"category": "venue"
   }
   ```
3. Make sure each question has a unique `id`

### Updating Wedding Details

1. Open `wedding.json`
2. Update the relevant sections:
   - Couple names under `wedding.couple`
   - Date and time under `wedding.date` and `wedding.time`
   - Venue information under `wedding.venue`

### Customizing Colors

1. Open `wedding.json`
2. Navigate to `theme.colors`
3. Update color hex codes:
   ```json
   "colors": {
     "primary": "#Your-Primary-Color",
     "secondary": "#Your-Secondary-Color",
     "accent": "#Your-Accent-Color"
   }
   ```

### Enabling/Disabling Sections

1. Open `wedding.json`
2. Find the section under `content`
3. Set `enabled` to `true` or `false`:
   ```json
   "gallery": {
     "enabled": false
   }
   ```

## Tips

- Always validate your JSON files before deploying (use a JSON validator)
- Keep backups of your configuration files
- Test changes locally before deploying to production
- Use meaningful category names in FAQ for better organization
- Maintain consistent ID numbering for FAQ questions

## Need Help?

Refer to the main documentation in the `/documentation` folder for detailed guides on:

- [CUSTOMIZATION.md](../documentation/CUSTOMIZATION.md) - Complete customization guide
- [QUICK_START.md](../documentation/QUICK_START.md) - Getting started quickly
- [DEPLOYMENT.md](../documentation/DEPLOYMENT.md) - Deploying your website
