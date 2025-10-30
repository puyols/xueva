const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const PUBLIC_DIR = __dirname;

const server = http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname;
  
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
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('404 - File not found');
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
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('404 - File not found');
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
    case '.woff':
      contentType = 'font/woff';
      break;
    case '.woff2':
      contentType = 'font/woff2';
      break;
    case '.xml':
      contentType = 'application/xml; charset=utf-8';
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

