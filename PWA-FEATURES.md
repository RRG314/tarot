# Mystic Tarot - Advanced PWA Features

This is a complete Progressive Web App (PWA) implementation of the Mystic Tarot application with RDT PRNG.

## PWA Features Implemented

### 1. Core PWA Requirements ✓
- **Web App Manifest** (`manifest.json`)
  - App name, short name, and description
  - Multiple icon sizes (72x72 to 512x512 PNG)
  - Start URL and scope configuration
  - Display mode: standalone
  - Theme colors (deep purple/mystic theme)
  - Orientation: portrait-primary
  - App shortcuts for quick access

- **Service Worker** (`sw.js`)
  - Version 2.0.0 with advanced caching strategies
  - Static asset caching
  - Dynamic content caching
  - Image and font caching with separate stores
  - Cache size limits to prevent storage bloat
  - Automatic cache cleanup on version updates

### 2. Advanced Caching Strategies
- **Cache-First**: Static assets (HTML, CSS, JS, icons)
- **Network-First**: HTML pages (always try to get fresh content)
- **Stale-While-Revalidate**: Dynamic content (images, fonts)
- Smart cache trimming with configurable limits
- Offline fallbacks for all resource types

### 3. Installation Features
- **Install Prompt**
  - Custom branded install banner
  - Appears 3 seconds after page load
  - Dismissible with localStorage persistence
  - One-click installation

- **Install Detection**
  - Detects when running as installed PWA
  - Adds `pwa-installed` class to body
  - Special styling for installed mode

### 4. Update Management
- **Automatic Update Detection**
  - Service worker checks for updates
  - Shows update notification banner
  - One-click update with page reload
  - Seamless version transitions

- **Version Management**
  - Version number in service worker
  - GET_VERSION message handler
  - Automatic cache versioning

### 5. Offline Support
- **Enhanced Offline Page** (`offline.html`)
  - Mystical themed design matching main app
  - Starfield background with animations
  - Real-time connection status indicator
  - Auto-reconnect when online
  - Manual retry option
  - Information about offline capabilities

- **Offline Indicator**
  - Shows when app goes offline
  - Disappears when connection restored
  - Visual feedback for network status

### 6. RDT PRNG Implementation
- **RDT256 Random Number Generator**
  - Cryptographically secure pseudorandom number generation
  - BigInt-based implementation
  - Deterministic with proper seeding
  - Used for card shuffling and reading generation

### 7. App Features
- **Tarot Reading**
  - Multiple spread types
  - RDT PRNG-based card selection
  - Upright and reversed interpretations
  - Save and load readings

- **Daily Card**
  - Daily tarot guidance
  - Automatic date-based selection
  - Reading history

- **Moon Phases**
  - Real-time moon phase calculation
  - Zodiac integration
  - Lunar cycle information

- **History**
  - Local storage of readings
  - Export/import functionality
  - Reading management

### 8. Performance Optimizations
- Lazy loading of resources
- Efficient cache management
- Optimized icon delivery
- Minimal network requests after installation
- Fast load times from cache

### 9. User Experience
- Smooth animations and transitions
- Toast notifications
- Loading states
- Error handling
- Responsive design (mobile-first)
- Touch-optimized controls

### 10. Additional PWA Features
- **App Shortcuts**
  - Daily Card shortcut
  - New Reading shortcut
  - Moon Phases shortcut

- **Push Notifications** (foundation ready)
  - Service worker handlers implemented
  - Notification click handling
  - Ready for backend integration

- **Background Sync** (foundation ready)
  - Sync event handlers
  - Ready for reading synchronization

## File Structure

```
/
├── index.html              # Main app (with RDT PRNG)
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (v2.0.0)
├── offline.html            # Enhanced offline page
├── favicon.ico             # App favicon
├── icons/                  # App icons
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
├── _headers                # Security headers
├── _redirects              # Redirect rules
├── robots.txt              # SEO configuration
├── sitemap.xml             # Site map
└── vercel.json             # Vercel deployment config
```

## Testing the PWA

### Local Testing
1. Serve the app with a local web server:
   ```bash
   npx serve -s .
   ```
2. Open Chrome DevTools > Application tab
3. Check:
   - Manifest loads correctly
   - Service Worker registers
   - All icons appear
   - Cache storage is populated

### Install Testing
1. Open in Chrome on desktop or mobile
2. Look for install prompt in address bar
3. Click install
4. Verify app opens in standalone mode
5. Test offline functionality

### Offline Testing
1. Open DevTools > Network tab
2. Check "Offline" checkbox
3. Navigate the app
4. Verify offline page appears for new pages
5. Verify cached pages load correctly

### Lighthouse Audit
Run Lighthouse audit in Chrome DevTools:
- Should score 90+ in PWA category
- Should meet all PWA criteria
- Should be installable

## Deployment

The PWA is ready to deploy to any static hosting service:
- **Vercel** (vercel.json configured)
- **Netlify** (_headers and _redirects configured)
- **GitHub Pages**
- **Firebase Hosting**
- Any HTTPS-enabled host

### Requirements
- Must be served over HTTPS
- All files must be accessible
- Service worker must be at root level

## Browser Support

- ✓ Chrome/Edge (full support)
- ✓ Firefox (full support)
- ✓ Safari (iOS 11.3+, macOS)
- ✓ Samsung Internet
- ✓ Opera

## Security

- HTTPS required (enforced)
- CSP headers configured
- No inline scripts (safe)
- XSS protection enabled
- Secure manifest configuration

## Future Enhancements

1. **Push Notifications**
   - Daily card reminders
   - Custom notification scheduling
   - Backend integration

2. **Background Sync**
   - Sync readings across devices
   - Cloud backup integration
   - Offline-first synchronization

3. **Share Target**
   - Share readings to app
   - Social media integration

4. **Periodic Background Sync**
   - Update daily cards
   - Refresh moon phases

5. **Web Share API**
   - Share readings easily
   - Social media integration

## License

Apache License 2.0

## Credits

Built with advanced PWA features and RDT PRNG for secure, offline-capable tarot readings.
