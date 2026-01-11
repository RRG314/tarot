# Mystic Tarot PWA

A Progressive Web App for interactive tarot card readings with moon phases and zodiac guidance.

## Features

- 🃏 **78-Card Deck** - Complete tarot deck with custom artwork
- 🌙 **Moon Phases** - Real-time moon phase tracking with tarot connections
- ♈ **Zodiac Guide** - All 12 signs with associated cards and meanings
- 📱 **Works Offline** - Full functionality without internet
- 💾 **Save Readings** - History stored locally on your device
- 🔔 **Daily Cards** - Get a new card each day
- 📲 **Installable** - Add to home screen like a native app

## File Structure

```
tarot-pwa/
├── index.html          # Main app (all-in-one HTML with embedded images)
├── manifest.json       # PWA manifest for installation
├── sw.js              # Service worker for offline support
├── favicon.ico        # Browser tab icon
├── offline.html       # Fallback page when offline
├── robots.txt         # Search engine instructions
├── sitemap.xml        # SEO sitemap
├── browserconfig.xml  # Windows tile configuration
│
├── # Hosting configs (use the one for your platform):
├── .htaccess          # Apache server config
├── _headers           # Netlify headers
├── _redirects         # Netlify redirects  
├── vercel.json        # Vercel config
│
├── .well-known/       # Platform verification
│   └── assetlinks.json  # Android TWA config (if wrapping as app)
│
├── icons/             # App icons for all platforms
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── screenshot-wide.png
│   └── screenshot-narrow.png
│
└── README.md          # This file
```

## What Each File Does

| File | Purpose |
|------|---------|
| `index.html` | The entire app - HTML, CSS, JS, and embedded card images |
| `manifest.json` | Tells browsers this is an installable app |
| `sw.js` | Caches files for offline use |
| `favicon.ico` | Icon shown in browser tabs |
| `offline.html` | Shown if you're offline and cache fails |
| `robots.txt` | Tells search engines what to index |
| `sitemap.xml` | Helps search engines find all pages |
| `.htaccess` | Apache server caching & security headers |
| `_headers` | Netlify security headers |
| `vercel.json` | Vercel caching & security headers |

## Deployment Options

### Option 1: GitHub Pages (Free)

1. Create a new GitHub repository
2. Upload all files from the `tarot-pwa` folder
3. Go to Settings → Pages
4. Select "Deploy from a branch" → main → / (root)
5. Your PWA will be live at `https://yourusername.github.io/repo-name/`

### Option 2: Netlify (Free)

1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag and drop the `tarot-pwa` folder to deploy
3. Get a free URL like `https://random-name.netlify.app`
4. Optionally connect a custom domain

### Option 3: Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Import your GitHub repo or drag-drop the folder
3. Get a free URL like `https://project-name.vercel.app`

### Option 4: Firebase Hosting (Free tier)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select your folder as public directory
firebase deploy
```

### Option 5: Any Static Host

Upload to any web server that can serve static files:
- Amazon S3 + CloudFront
- Google Cloud Storage
- DigitalOcean Spaces
- Your own server with nginx/Apache

## HTTPS Requirement

**Important:** PWAs require HTTPS to work properly. All the free hosting options above provide HTTPS automatically. If self-hosting, make sure to set up SSL certificates (Let's Encrypt is free).

## Testing Locally

For local testing, you need a local server (service workers don't work with file:// URLs):

```bash
# Using Python
cd tarot-pwa
python -m http.server 8000
# Visit http://localhost:8000

# Using Node.js
npx serve tarot-pwa
# Visit http://localhost:3000

# Using PHP
cd tarot-pwa
php -S localhost:8000
```

## PWA Installation

Once deployed to HTTPS:

**On Mobile (iOS/Android):**
1. Open the site in your browser
2. Tap the "Install" banner, or
3. Use browser menu → "Add to Home Screen"

**On Desktop (Chrome/Edge):**
1. Look for the install icon in the address bar
2. Click "Install"

## Customization

### Changing the App Name
Edit `manifest.json`:
- `name` - Full name shown during install
- `short_name` - Name shown under icon

### Changing Theme Colors
Edit `manifest.json`:
- `theme_color` - Browser UI color
- `background_color` - Splash screen background

Also update in `index.html`:
- `<meta name="theme-color">`
- `<meta name="background-color">`

### Replacing Icons
Replace the PNG files in the `icons` folder. Keep the same filenames and sizes.

## Browser Support

- ✅ Chrome (Desktop & Mobile)
- ✅ Edge
- ✅ Firefox
- ✅ Safari (iOS 11.3+)
- ✅ Samsung Internet
- ✅ Opera

## Troubleshooting

**App won't install:**
- Make sure you're using HTTPS
- Check manifest.json is valid (use Chrome DevTools → Application)
- Ensure all icons exist and are accessible

**Offline doesn't work:**
- Check service worker is registered (DevTools → Application → Service Workers)
- Clear cache and reload

**Icons not showing:**
- Verify icon paths in manifest.json match actual file locations
- Check icons are valid PNG files

## License

Apache 2.0


