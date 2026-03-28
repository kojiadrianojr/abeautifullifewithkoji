# Deployment Guide

This guide covers various deployment options for your wedding website.

## Option 1: GitHub Pages (Free & Simple)

**✨ This project is pre-configured for GitHub Pages deployment!**

GitHub Pages offers free hosting with custom domain support, SSL, and automated deployments.

### Quick Start:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository **Settings** → **Pages**
   - Under **Build and deployment**, select **GitHub Actions**

3. **Configure Custom Domain** (abeautifullifewithkoji.com)
   - Add domain in GitHub Pages settings
   - Configure DNS A records:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

**📚 Full Guide:** See [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md) for complete instructions.

**Cost**: **FREE** (including custom domain & SSL)

---

## Option 2: Vercel (Excellent for Next.js)

Vercel offers the simplest deployment for Next.js applications with automatic SSL and global CDN.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

**Cost**: Free for personal projects

## Option 3: Netlify

Similar to Vercel, great for static sites with easy continuous deployment.

### Steps:

1. **Push to GitHub** (same as above)

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect to your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

**Cost**: Free for personal projects

## Option 3: Docker on Your Own Server

Deploy using Docker on any server with Docker installed.

### Prerequisites:
- A server with Docker installed (DigitalOcean, AWS, etc.)
- Domain name (optional)

### Steps:

1. **Connect to your server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Clone your repository**
   ```bash
   git clone YOUR_REPO_URL
   cd wedding-website
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Set up reverse proxy** (optional, for custom domain)

   Install Nginx:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

   Create Nginx config:
   ```bash
   sudo nano /etc/nginx/sites-available/wedding
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/wedding /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Add SSL with Let's Encrypt** (optional)
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

**Cost**: Server costs vary ($5-20/month for basic VPS)

## Option 4: AWS Amplify

Good for AWS users with automatic deployments.

### Steps:

1. **Push to GitHub** (same as Option 1)

2. **Deploy on AWS Amplify**
   - Log into AWS Console
   - Go to AWS Amplify
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Configure build settings:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm install
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: .next
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```
   - Deploy

**Cost**: Pay as you go (usually under $1/month for small sites)

## Option 5: Traditional Hosting (cPanel)

If you have traditional web hosting, you can build and upload the static files.

### Steps:

1. **Build the site**
   ```bash
   npm run build
   npm run export  # Note: You'll need to add this script
   ```

2. **Upload files**
   - Upload the `out/` directory to your hosting
   - Make sure `.htaccess` handles routing

**Note**: This requires additional configuration and is less recommended for Next.js apps.

## Choosing the Right Option

| Option | Best For | Difficulty | Cost |
|--------|----------|------------|------|
| **GitHub Pages** | **Free hosting** | ⭐ **Easy** | **FREE** |
| Vercel | Most users | ⭐ Easy | Free |
| Netlify | Static sites | ⭐ Easy | Free |
| Docker | Full control | ⭐⭐⭐ Advanced | $5-20/mo |
| AWS Amplify | AWS users | ⭐⭐ Moderate | ~$1/mo |

## Post-Deployment Checklist

After deploying:

- [ ] Site is accessible at the URL
- [ ] All images load correctly
- [ ] Navigation works properly
- [ ] RSVP form links work
- [ ] Mobile view is correct
- [ ] SSL certificate is active (HTTPS)
- [ ] Custom domain is connected (if applicable)
- [ ] Test on different devices
- [ ] Share with friends for testing

## Updating Your Site

After making changes:

### For Vercel/Netlify/AWS Amplify:
```bash
git add .
git commit -m "Update wedding details"
git push
```
Your site will automatically redeploy!

### For Docker:
```bash
ssh user@your-server
cd wedding-website
git pull
docker-compose down
docker-compose up -d --build
```

## Custom Domain Setup

### Vercel/Netlify:
1. Go to project settings
2. Add custom domain
3. Update DNS records at your domain registrar:
   - Type: A Record
   - Name: @ or www
   - Value: (provided by platform)

### Docker with Nginx:
1. Point your domain's A record to your server IP
2. Follow the Nginx configuration in Option 3 above

## Troubleshooting

### Site not loading after deployment
- Check build logs for errors
- Verify `package.json` scripts are correct
- Ensure all dependencies are listed

### Images not showing
- Confirm images are in the `public/` directory
- Check image paths start with `/`
- Verify images were included in deployment

### Environment variables not working
- Set environment variables in your platform's dashboard
- Don't commit `.env` files to Git

### Build fails
- Check Node.js version matches (20+)
- Clear cache and rebuild
- Check for TypeScript errors

## Performance Optimization

After deploying:

1. **Optimize Images**
   - Use WebP format
   - Compress before uploading
   - Use Next.js Image component

2. **Enable Caching**
   - Most platforms do this automatically
   - Configure cache headers if using custom server

3. **Monitor Performance**
   - Use Vercel Analytics
   - Or Google PageSpeed Insights

## Security Considerations

- ✅ Always use HTTPS
- ✅ Don't commit sensitive data
- ✅ Keep dependencies updated
- ✅ Use environment variables for API keys

---

Need help? Check the main README.md or reach out for support!
