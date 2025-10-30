#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

let passedTests = 0;
let failedTests = 0;
const errors = [];

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, data });
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runTests() {
  log('\n=== Testing Belka Flowers Static Site ===\n', colors.blue);
  
  // Test 1: Check if server is running
  log('Test 1: Server is running', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL);
    if (res.statusCode === 200) {
      log('✓ Server is running and responding', colors.green);
      passedTests++;
    } else {
      log(`✗ Server returned unexpected status: ${res.statusCode}`, colors.red);
      failedTests++;
      errors.push(`Test 1: Expected status 200, got ${res.statusCode}`);
    }
  } catch (err) {
    log(`✗ Server is not running: ${err.message}`, colors.red);
    failedTests++;
    errors.push(`Test 1: ${err.message}`);
    log('\n⚠ Server is not running. Tests cannot continue.', colors.red);
    return;
  }
  
  // Test 2: Root path serves index.html
  log('\nTest 2: Root path serves index.html', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL + '/');
    if (res.statusCode === 200 && res.data.includes('<!DOCTYPE html>')) {
      log('✓ Root path returns valid HTML', colors.green);
      passedTests++;
    } else {
      log(`✗ Root path issue: status ${res.statusCode}`, colors.red);
      failedTests++;
      errors.push(`Test 2: Root path returned status ${res.statusCode}`);
    }
  } catch (err) {
    log(`✗ Error: ${err.message}`, colors.red);
    failedTests++;
    errors.push(`Test 2: ${err.message}`);
  }
  
  // Test 3: 404 handling
  log('\nTest 3: 404 error handling', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL + '/nonexistent-page-xyz');
    if (res.statusCode === 404) {
      log('✓ 404 errors handled correctly', colors.green);
      passedTests++;
    } else {
      log(`✗ Expected 404, got ${res.statusCode}`, colors.red);
      failedTests++;
      errors.push(`Test 3: Expected 404, got ${res.statusCode}`);
    }
  } catch (err) {
    log(`✗ Error: ${err.message}`, colors.red);
    failedTests++;
    errors.push(`Test 3: ${err.message}`);
  }
  
  // Test 4: HTML files are accessible
  log('\nTest 4: HTML files are accessible', colors.yellow);
  const htmlFiles = ['catalog.html', 'cart.html', 'checkout.html', 'korzina.html'];
  let htmlTestsPassed = 0;
  for (const file of htmlFiles) {
    try {
      const res = await makeRequest(BASE_URL + '/' + file);
      if (res.statusCode === 200) {
        htmlTestsPassed++;
      } else {
        errors.push(`Test 4: ${file} returned status ${res.statusCode}`);
      }
    } catch (err) {
      errors.push(`Test 4: ${file} - ${err.message}`);
    }
  }
  if (htmlTestsPassed === htmlFiles.length) {
    log(`✓ All ${htmlFiles.length} HTML files accessible`, colors.green);
    passedTests++;
  } else {
    log(`✗ Only ${htmlTestsPassed}/${htmlFiles.length} HTML files accessible`, colors.red);
    failedTests++;
  }
  
  // Test 5: Static assets (JS/CSS)
  log('\nTest 5: Static assets are accessible', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL + '/_next/static/chunks/main-e10717a0b5ff7e2d.js');
    if (res.statusCode === 200 && res.headers['content-type'].includes('javascript')) {
      log('✓ JavaScript assets accessible with correct content-type', colors.green);
      passedTests++;
    } else {
      log(`✗ Asset issue: status ${res.statusCode}`, colors.red);
      failedTests++;
      errors.push(`Test 5: JavaScript assets returned status ${res.statusCode}`);
    }
  } catch (err) {
    log(`✗ Error: ${err.message}`, colors.red);
    failedTests++;
    errors.push(`Test 5: ${err.message}`);
  }
  
  // Test 6: Image files
  log('\nTest 6: Image files are accessible', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL + '/favicon.ico');
    if (res.statusCode === 200) {
      log('✓ Image files accessible', colors.green);
      passedTests++;
    } else {
      log(`✗ Image issue: status ${res.statusCode}`, colors.red);
      failedTests++;
      errors.push(`Test 6: Images returned status ${res.statusCode}`);
    }
  } catch (err) {
    log(`✗ Error: ${err.message}`, colors.red);
    failedTests++;
    errors.push(`Test 6: ${err.message}`);
  }
  
  // Test 7: Path without .html extension
  log('\nTest 7: Clean URLs (without .html)', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL + '/catalog');
    if (res.statusCode === 200) {
      log('✓ Clean URLs work correctly', colors.green);
      passedTests++;
    } else {
      log(`✗ Clean URL issue: status ${res.statusCode}`, colors.red);
      failedTests++;
      errors.push(`Test 7: Clean URLs returned status ${res.statusCode}`);
    }
  } catch (err) {
    log(`✗ Error: ${err.message}`, colors.red);
    failedTests++;
    errors.push(`Test 7: ${err.message}`);
  }
  
  // Test 8: Directory handling
  log('\nTest 8: Directory handling', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL + '/novosti/');
    if (res.statusCode === 200 || res.statusCode === 404) {
      log('✓ Directory handling works', colors.green);
      passedTests++;
    } else {
      log(`✗ Directory issue: status ${res.statusCode}`, colors.red);
      failedTests++;
      errors.push(`Test 8: Directory returned status ${res.statusCode}`);
    }
  } catch (err) {
    log(`✗ Error: ${err.message}`, colors.red);
    failedTests++;
    errors.push(`Test 8: ${err.message}`);
  }
  
  // Test 9: Manifest file
  log('\nTest 9: PWA manifest file', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL + '/manifest.json');
    if (res.statusCode === 200 && res.headers['content-type'].includes('json')) {
      const manifest = JSON.parse(res.data);
      if (manifest.name && manifest.short_name) {
        log('✓ Manifest file is valid', colors.green);
        passedTests++;
      } else {
        log('✗ Manifest file is invalid', colors.red);
        failedTests++;
        errors.push('Test 9: Manifest missing required fields');
      }
    } else {
      log(`✗ Manifest issue: status ${res.statusCode}`, colors.red);
      failedTests++;
      errors.push(`Test 9: Manifest returned status ${res.statusCode}`);
    }
  } catch (err) {
    log(`✗ Error: ${err.message}`, colors.red);
    failedTests++;
    errors.push(`Test 9: ${err.message}`);
  }
  
  // Test 10: Character encoding
  log('\nTest 10: Character encoding (UTF-8)', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL + '/');
    if (res.headers['content-type'] && res.headers['content-type'].includes('utf-8')) {
      log('✓ UTF-8 encoding set correctly', colors.green);
      passedTests++;
    } else {
      log('✗ UTF-8 encoding not set', colors.red);
      failedTests++;
      errors.push('Test 10: UTF-8 encoding not found in content-type');
    }
  } catch (err) {
    log(`✗ Error: ${err.message}`, colors.red);
    failedTests++;
    errors.push(`Test 10: ${err.message}`);
  }
  
  // Summary
  log('\n=== Test Summary ===\n', colors.blue);
  log(`Total tests: ${passedTests + failedTests}`, colors.yellow);
  log(`Passed: ${passedTests}`, colors.green);
  log(`Failed: ${failedTests}`, failedTests > 0 ? colors.red : colors.green);
  
  if (errors.length > 0) {
    log('\n=== Errors ===\n', colors.red);
    errors.forEach((error, index) => {
      log(`${index + 1}. ${error}`, colors.red);
    });
  }
  
  if (failedTests === 0) {
    log('\n✓ All tests passed!', colors.green);
  } else {
    log(`\n✗ ${failedTests} test(s) failed`, colors.red);
    process.exit(1);
  }
}

// Check file system for potential issues
function checkFileSystem() {
  log('\n=== Checking File System ===\n', colors.blue);
  
  const criticalFiles = [
    'server.js',
    'package.json',
    'index.html',
    '404.html',
    'manifest.json'
  ];
  
  let allFilesExist = true;
  criticalFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      log(`✓ ${file} exists`, colors.green);
    } else {
      log(`✗ ${file} missing`, colors.red);
      allFilesExist = false;
      errors.push(`Critical file missing: ${file}`);
    }
  });
  
  // Check for _next directory
  const nextDir = path.join(__dirname, '_next');
  if (fs.existsSync(nextDir)) {
    log('✓ _next directory exists', colors.green);
  } else {
    log('✗ _next directory missing', colors.red);
    allFilesExist = false;
    errors.push('_next directory missing');
  }
  
  return allFilesExist;
}

// Run all checks
async function main() {
  log('Starting error testing for Belka Flowers Static Site...', colors.blue);
  
  // Check file system first
  const filesOk = checkFileSystem();
  
  if (!filesOk) {
    log('\n⚠ Critical files are missing. Please check the file system.', colors.red);
    process.exit(1);
  }
  
  // Run HTTP tests
  await runTests();
}

main().catch(err => {
  log(`\nFatal error: ${err.message}`, colors.red);
  console.error(err);
  process.exit(1);
});
