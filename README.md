# 💒 Wedding Website Template

A beautiful, customizable wedding website template built with Next.js 15, TypeScript, and Tailwind CSS. Designed to be easily deployed with Docker and customized through a simple JSON configuration file.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

## ✨ Features

- 🎨 **Fully Customizable** - Edit a single JSON file to customize everything
- 🎭 **Dynamic Theming** - Change colors and fonts through configuration
- 📱 **Responsive Design** - Beautiful on all devices
- 🚀 **Easy Deployment** - Docker-ready for simple hosting
- ⚡ **Modern Stack** - Built with Next.js 15 App Router and TypeScript
- 🔧 **Modular Components** - Enable/disable sections as needed
- 🎬 **Smooth Animations** - Elegant transitions and interactions
- 📸 **Multiple Image Sources** - Local files or Google Drive (with caching)
- 👥 **Guest Management** - Built-in guest list and RSVP tracking
- 🔗 **Google Forms Integration** - Automatic RSVP sync from Google Forms

## 📦 What's Included

### Sections
- **Hero** - Eye-catching landing with couple names and date
- **Our Story** - Timeline of your relationship
- **Gallery** - Photo gallery with lightbox
- **Schedule** - Event timeline for the day
- **Registry** - Links to gift registries
- **RSVP** - Call-to-action for guest responses with guest search
- **FAQ** - Answer common questions
- **Footer** - Contact information and social links

### Guest Management
- **Guest List** - Manage your guest list in `config/guests.json`
- **Guest Search** - Let guests find themselves before RSVP
- **Google Forms Integration** - Sync RSVP responses from Google Forms
- **RSVP Tracking** - Track confirmed, declined, and pending responses
- **Statistics** - Get insights on RSVPs and headcount

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (or Docker)
- npm or yarn

### Installation

1. **Clone or download this template**
   ```bash
   cd your-wedding-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Customize your wedding**
   Edit the `config/wedding.json` file with your details

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Customization Guide

### Basic Configuration

All customization is done through the `config/wedding.json` file. Here's what you can customize:

#### Couple Information
```json
{
  "wedding": {
    "couple": {
      "partner1": {
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "partner2": {
        "firstName": "John",
        "lastName": "Doe"
      }
    },
    "date": "2026-08-15",
    "time": "4:00 PM"
  }
}
```

#### Theme Colors
```json
{
  "theme": {
    "colors": {
      "primary": "#8B7355",
      "secondary": "#D4A574",
      "accent": "#E8D5C4",
      "background": "#FFFAF5",
      "foreground": "#2C2C2C"
    }
  }
}
```

#### Fonts
```json
{
  "theme": {
    "fonts": {
      "serif": "Playfair Display",
      "sans": "Inter"
    }
  }
}
```

### Enable/Disable Sections

Each section can be toggled on or off:

```json
{
  "content": {
    "hero": { "enabled": true },
    "story": { "enabled": true },
    "gallery": { "enabled": false }
  }
}
```

### Adding Images

#### Option 1: Local Images (Default)

1. Place your images in the `public/images` directory:
   - `public/images/hero-album/` - Hero section background images
   - `public/images/gallery/` - Gallery section photos
   - `public/images/throwback/` - Throwback photos
   - `public/images/prenup/` - Prenup/engagement photos

2. Update image paths in `config/wedding.json`:

```json
{
  "content": {
    "hero": {
      "backgroundImage": "/images/hero-bg.jpg"
    },
    "gallery": {
      "images": [
        "/images/gallery/photo1.jpg",
        "/images/gallery/photo2.jpg"
      ]
    }
  }
}
```

#### Option 2: Google Drive Images (New!)

Store and manage your photos directly in Google Drive - no need to redeploy when adding new photos!

**Quick Setup:**
1. Create folders in Google Drive for your photos
2. Configure `.env.local` with your folder IDs
3. Images load automatically from Google Drive

**See detailed guide:** [Image Sources Documentation](documentation/IMAGE_SOURCES.md)

**Benefits:**
- ✅ Update photos without redeploying
- ✅ Easy photo management in Google Drive
- ✅ Automatic caching for better performance
- ✅ Supports hybrid mode (local + Google Drive)

**Configuration:** 
```env
IMAGE_SOURCE_TYPE=google-drive
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
```

### Managing Guests and RSVPs

#### Guest List Setup

Edit `config/guests.json` to add your guest list:

```json
{
  "guests": [
    {
      "id": "1",
      "fullName": "John Smith",
      "allowedSeats": 2
    },
    {
      "id": "2",
      "groupName": "The Johnson Family",
      "members": ["Mike Johnson", "Sarah Johnson"],
      "allowedSeats": 4
    }
  ]
}
```

#### Google Forms RSVP Integration

Automatically sync RSVP responses from Google Forms:

1. **Quick Setup**: See [Google Forms Quick Reference](documentation/GOOGLE_FORMS_QUICK_REFERENCE.md)
2. **Detailed Guide**: See [Google Forms Setup](documentation/GOOGLE_FORMS_SETUP.md)

**Quick steps:**
```bash
# 1. Create Google Form and link to Sheets
# 2. Setup Google Cloud service account
# 3. Configure environment variables in .env.local
# 4. Install dependencies
npm install

# 5. Sync RSVP responses
npm run sync-rsvp
```

The script will:
- ✅ Fetch responses from Google Sheets
- ✅ Match responses to your guest list
- ✅ Update guest RSVP status automatically
- ✅ Track dietary restrictions and notes
- ✅ Create backups before updating

**Get RSVP statistics:**
```typescript
import { GuestService } from '@/services';

const stats = GuestService.getRsvpStats();
// { confirmed: 45, declined: 5, pending: 10, responseRate: 83% }
```

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t wedding-website .

# Run the container
docker run -p 3000:3000 wedding-website
```

### Using Docker Compose

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down
```

## 📤 Deployment Options

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Deploy automatically

### Netlify

1. Push your code to GitHub
2. Connect to [Netlify](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `.next`

### Self-Hosted

Use Docker Compose on any server with Docker installed:

```bash
git clone your-repo
cd wedding-website
docker-compose up -d
```

## 🎯 Product Features for Selling

This template is designed to be sold as a product. Key selling points:

### For Customers
- ✅ No coding required - just edit JSON
- ✅ Professional design out of the box
- ✅ Mobile-responsive
- ✅ Easy to deploy
- ✅ Affordable compared to custom development

### For You (The Seller)
- 🔄 Reusable template
- 📝 Simple customization process
- 💰 Low maintenance
- 🎨 Easy to create variations
- 📚 Complete documentation included

## 📂 Project Structure

```
wedding-website/
├── config/
│   └── wedding.json          # Main configuration file
├── public/
│   └── images/              # Image assets
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── Navigation.tsx   # Navigation bar
│   │   ├── ThemeProvider.tsx # Theme system
│   │   └── sections/        # Page sections
│   │       ├── Hero.tsx
│   │       ├── Story.tsx
│   │       ├── Gallery.tsx
│   │       ├── Schedule.tsx
│   │       ├── Registry.tsx
│   │       ├── RSVP.tsx
│   │       ├── FAQ.tsx
│   │       └── Footer.tsx
│   └── lib/
│       └── config.ts        # Config utilities
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Sections

1. Create component in `src/components/sections/`
2. Add configuration in `config/wedding.json`
3. Import and use in `src/app/page.tsx`

## 🎨 Customization Ideas

### Different Themes
Create multiple JSON files for different themes:
- `config/wedding-classic.json`
- `config/wedding-modern.json`
- `config/wedding-rustic.json`

### Color Schemes
Popular wedding color combinations:
- **Classic**: Gold & White
- **Romantic**: Blush & Rose Gold
- **Modern**: Navy & Silver
- **Rustic**: Sage & Cream
- **Elegant**: Burgundy & Ivory

## 🐛 Troubleshooting

### Images not showing?
- Ensure images are in the `public/images` directory
- Check file paths in `wedding.json` start with `/`

### Styles not updating?
- Clear browser cache
- Restart dev server: `npm run dev`

### Docker build fails?
- Ensure Node.js 20+ is specified
- Check `.dockerignore` includes `node_modules`

## � Complete Documentation

This template includes 11 comprehensive guides:

1. **[INDEX.md](INDEX.md)** - Complete documentation index (start here!)
2. **[OVERVIEW.md](OVERVIEW.md)** - Complete package overview
3. **[QUICK_START.md](QUICK_START.md)** - 15-minute setup guide
4. **[CUSTOMIZATION.md](CUSTOMIZATION.md)** - Step-by-step customization
5. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Multiple deployment options
6. **[COLOR_SCHEMES.md](COLOR_SCHEMES.md)** - 10 pre-made color themes
7. **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Complete file overview
8. **[BUSINESS.md](BUSINESS.md)** - Guide for selling as a product
9. **[CONTRIBUTING.md](CONTRIBUTING.md)** - Developer contribution guide
10. **[CHANGELOG.md](CHANGELOG.md)** - Version history and roadmap
11. **[README.md](README.md)** - This file

**Not sure where to start?** Check [INDEX.md](INDEX.md) for a complete guide to all documentation.

## 📄 License

This template is provided as-is for commercial use. You can:
- ✅ Use for client projects
- ✅ Sell as a product
- ✅ Modify and customize
- ✅ Create derivative templates

See [LICENSE](LICENSE) for full details (MIT License).

## 🤝 Support

For support:
- 📧 Email: wedding@example.com
- 📖 Documentation: See [INDEX.md](INDEX.md)
- 💬 Discord: [Link to community]
- 🐛 Issues: Create a GitHub issue

## 🎯 Roadmap

Completed:
- [x] RSVP form integration with Google Forms
- [x] Guest management system with search
- [x] Automatic RSVP sync from Google Sheets

Future enhancements:
- [ ] Admin panel for easier customization
- [ ] Multiple theme presets
- [ ] Animation options
- [ ] Multi-language support
- [ ] Email notifications for RSVPs

## 💝 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

Made with ❤️ for your special day
