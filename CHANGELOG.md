# Changelog

## [1.0.0] - 2025-10-30

### Added
- ✨ Created `package.json` with proper metadata and scripts
- ✨ Created `README.md` with comprehensive project documentation
- ✨ Created `DEPLOYMENT.md` with detailed deployment instructions
- ✨ Created `robots.txt` for SEO optimization
- ✨ Created `.env.example` for environment configuration template
- ✨ Added graceful shutdown handling (SIGTERM, SIGINT)
- ✨ Added proper 404 error page handling using `404.html`
- ✨ Added support for additional MIME types (.webp, .ico, .ttf, .otf, .pdf, .txt)

### Changed
- ♻️ Updated `server.js` to use `process.env.PORT` instead of hardcoded port
- ♻️ Improved error handling with custom 404 page
- ♻️ Enhanced MIME type detection for better content serving
- ♻️ Updated `.gitignore` to exclude server log files

### Fixed
- 🐛 Fixed 404 error handling to serve custom 404.html page
- 🐛 Fixed MIME type for robots.txt (text/plain instead of text/html)
- 🐛 Fixed missing Content-Type headers for various file types
- 🐛 Fixed port configuration to support environment variables

### Documentation
- 📝 Added complete README with installation and usage instructions
- 📝 Added DEPLOYMENT guide with multiple hosting options
- 📝 Added inline comments in server.js for better code understanding
- 📝 Added environment variable examples

### Infrastructure
- 🔧 Configured proper HTTP server with Node.js
- 🔧 Added support for Apache hosting via .htaccess
- 🔧 Configured static file serving with correct headers
- 🔧 Added process management recommendations (PM2)

## Project Structure

```
belka-flowers-static/
├── _next/              # Next.js static assets
├── images/             # Product and content images
├── api/                # Static API endpoints
├── bukety_tsvetov/     # Bouquets category
├── rozy/               # Roses category
├── tulpany/            # Tulips category
├── novosti/            # News/blog
├── server.js           # Node.js HTTP server (UPDATED)
├── package.json        # Project metadata (NEW)
├── README.md           # Project documentation (NEW)
├── DEPLOYMENT.md       # Deployment guide (NEW)
├── CHANGELOG.md        # This file (NEW)
├── robots.txt          # SEO robots file (NEW)
├── .env.example        # Environment template (NEW)
├── manifest.json       # PWA manifest
├── sitemap.xml         # SEO sitemap
└── *.html              # Static HTML pages
```

## Technical Details

### Server Improvements
- Port configuration via environment variable
- Graceful shutdown on SIGTERM/SIGINT
- Custom 404 error page
- Enhanced MIME type support
- Better error handling

### MIME Types Supported
- HTML, CSS, JavaScript
- JSON, XML
- Images: PNG, JPG, GIF, WebP, SVG, ICO
- Fonts: WOFF, WOFF2, TTF, OTF
- Documents: PDF, TXT

### Hosting Support
- ✅ Node.js hosting (PM2, direct)
- ✅ Apache hosting (.htaccess)
- ✅ Nginx (with proxy)
- ✅ Static hosting (Vercel, Netlify)
- ✅ Shared hosting (FTP/cPanel)

## Contact

- Website: https://flowers-belka.ru
- Phone: +7 (903) 734-98-44
- Email: info@belka-flowers.ru
