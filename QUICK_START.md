# 🚀 Quick Start Guide

Get your wedding website up and running in 15 minutes!

## Prerequisites

You need Node.js installed. Check with:
```bash
node --version
```

If you don't have Node.js, download it from [nodejs.org](https://nodejs.org) (version 20 or higher).

## Step 1: Install Dependencies (2 minutes)

```bash
npm install
```

## Step 2: Customize Your Wedding (5 minutes)

Open `config/wedding.json` and update:

1. **Your names** (lines 3-12)
   ```json
   "couple": {
     "partner1": {
       "firstName": "YOUR_NAME",
       "lastName": "YOUR_LAST_NAME"
     }
   }
   ```

2. **Your date** (line 14)
   ```json
   "date": "2026-08-15",
   ```

3. **Your venue** (lines 16-25)
   ```json
   "venue": {
     "ceremony": {
       "name": "Your Venue Name"
     }
   }
   ```

That's it! Everything else can be customized later.

## Step 3: Add Your Photos (3 minutes)

1. Add a hero image to `public/images/hero-bg.jpg`
2. Add gallery photos to `public/images/gallery/`

Don't have photos yet? The site will work with placeholders!

## Step 4: Start the Development Server (1 minute)

```bash
npm run dev
```

## Step 5: View Your Site (1 minute)

Open your browser and go to:
```
http://localhost:3000
```

## 🎉 You're Done!

Your wedding website is now running locally!

## Next Steps

### Customize More
- Change colors: See `COLOR_SCHEMES.md` for ready-made options
- Update content: Edit `config/wedding.json`
- Add more photos: Drop them in `public/images/gallery/`

### Deploy Your Site
When you're ready to go live:
1. Read `DEPLOYMENT.md`
2. We recommend Vercel (it's free and takes 5 minutes)

## Need Help?

- **Detailed customization**: See `CUSTOMIZATION.md`
- **Deployment guide**: See `DEPLOYMENT.md`
- **Selling this template**: See `BUSINESS.md`
- **Color schemes**: See `COLOR_SCHEMES.md`

## Common First-Time Issues

**Issue**: `npm: command not found`
**Fix**: Install Node.js from nodejs.org

**Issue**: Images not showing
**Fix**: Make sure images are in `public/images/` folder

**Issue**: Colors not changing
**Fix**: Make sure you're editing `config/wedding.json` and using valid hex colors

**Issue**: Can't see changes
**Fix**: Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

## Quick Reference Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Check code quality
```

---

Congratulations on your upcoming wedding! 💍
