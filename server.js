const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;

function serve404(res) {
  const notFoundPath = path.join(PUBLIC_DIR, '404.html');
  if (fs.existsSync(notFoundPath)) {
    fs.readFile(notFoundPath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('404 - Page not found');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('404 - Page not found');
  }
}

const server = http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname;
  
  // Security: Block access to sensitive files and directories
  const blockedFiles = [
    'server.js',
    'package.json',
    'package-lock.json',
    '.env',
    '.env.example',
    'test-errors.js',
    'test-security.js',
    'CHANGELOG.md',
    'DEPLOYMENT.md',
    'FIXES_SUMMARY.md'
  ];
  
  const blockedPatterns = [
    /^\./,           // Hidden files starting with .
    /\/\./,          // Hidden files in subdirectories
    /\.git/,         // Git directory
    /\.gitignore/,   // Git ignore file
    /node_modules/,  // Node modules
  ];
  
  // Normalize pathname to prevent path traversal
  const normalizedPath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  
  // Check if file/pattern is blocked
  if (blockedFiles.some(file => normalizedPath === '/' + file || normalizedPath.endsWith('/' + file))) {
    serve404(res);
    return;
  }
  
  for (const pattern of blockedPatterns) {
    if (pattern.test(normalizedPath)) {
      serve404(res);
      return;
    }
  }
  
  // Remove leading slash
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  // Try to serve the file as-is first
  let filePath = path.join(PUBLIC_DIR, pathname);

  // Check if file exists as-is
  if (fs.existsSync(filePath)) {
    // If it's a directory, try index.html
    if (fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      if (!fs.existsSync(filePath)) {
        serve404(res);
        return;
      }
    }
  } else {
    // Try adding .html extension
    const htmlPath = path.join(PUBLIC_DIR, pathname + '.html');
    if (fs.existsSync(htmlPath)) {
      filePath = htmlPath;
    } else {
      // Try as directory with index.html
      const dirPath = path.join(PUBLIC_DIR, pathname, 'index.html');
      if (fs.existsSync(dirPath)) {
        filePath = dirPath;
      } else {
        serve404(res);
        return;
      }
    }
  }
  
  // Determine content type
  const ext = path.extname(filePath);
  let contentType = 'text/html; charset=utf-8';
  
  switch (ext) {
    case '.js':
      contentType = 'application/javascript; charset=utf-8';
      break;
    case '.css':
      contentType = 'text/css; charset=utf-8';
      break;
    case '.json':
      contentType = 'application/json; charset=utf-8';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.webp':
      contentType = 'image/webp';
      break;
    case '.ico':
      contentType = 'image/x-icon';
      break;
    case '.woff':
      contentType = 'font/woff';
      break;
    case '.woff2':
      contentType = 'font/woff2';
      break;
    case '.ttf':
      contentType = 'font/ttf';
      break;
    case '.otf':
      contentType = 'font/otf';
      break;
    case '.xml':
      contentType = 'application/xml; charset=utf-8';
      break;
    case '.pdf':
      contentType = 'application/pdf';
      break;
    case '.txt':
      contentType = 'text/plain; charset=utf-8';
      break;
  }
  
  // Read and serve the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('500 - Internal Server Error');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
