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

## 📦 What's Included

### Sections
- **Hero** - Eye-catching landing with couple names and date
- **Our Story** - Timeline of your relationship
- **Gallery** - Photo gallery with lightbox
- **Schedule** - Event timeline for the day
- **Registry** - Links to gift registries
- **RSVP** - Call-to-action for guest responses
- **FAQ** - Answer common questions
- **Footer** - Contact information and social links

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

1. Place your images in the `public/images` directory
2. Update the image paths in `config/wedding.json`:

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

Future enhancements:
- [ ] Admin panel for easier customization
- [ ] RSVP form integration
- [ ] Multiple theme presets
- [ ] Animation options
- [ ] Multi-language support
- [ ] Guest management system

## 💝 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

Made with ❤️ for your special day
