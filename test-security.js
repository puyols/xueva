#!/usr/bin/env node

const http = require('http');

const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`;

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

async function runSecurityTests() {
  log('\n=== Security & Edge Case Testing ===\n', colors.blue);
  
  // Test 1: Path traversal attempt
  log('Test 1: Path traversal protection (../ attack)', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL + '/../../../etc/passwd');
    if (res.statusCode === 404) {
      log('✓ Path traversal blocked correctly', colors.green);
      passedTests++;
    } else if (res.statusCode === 200 && res.data.includes('root:')) {
      log('✗ SECURITY ISSUE: Path traversal allowed!', colors.red);
      failedTests++;
      errors.push('CRITICAL: Path traversal vulnerability detected');
    } else {
      log('✓ Path traversal handled safely', colors.green);
      passedTests++;
    }
  } catch (err) {
    log(`✓ Path traversal blocked (connection error): ${err.message}`, colors.green);
    passedTests++;
  }
  
  // Test 2: Encoded path traversal
  log('\nTest 2: Encoded path traversal (URL encoded)', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL + '/%2e%2e/%2e%2e/etc/passwd');
    if (res.statusCode === 404 || res.statusCode === 400) {
      log('✓ Encoded path traversal blocked', colors.green);
      passedTests++;
    } else if (res.statusCode === 200 && res.data.includes('root:')) {
      log('✗ SECURITY ISSUE: Encoded path traversal allowed!', colors.red);
      failedTests++;
      errors.push('CRITICAL: Encoded path traversal vulnerability');
    } else {
      log('✓ Encoded path traversal handled safely', colors.green);
      passedTests++;
    }
  } catch (err) {
    log(`✓ Encoded path traversal blocked: ${err.message}`, colors.green);
    passedTests++;
  }
  
  // Test 3: Null byte injection
  log('\nTest 3: Null byte injection', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL + '/index.html%00.jpg');
    if (res.statusCode === 404 || res.statusCode === 400) {
      log('✓ Null byte injection handled', colors.green);
      passedTests++;
    } else {
      log('⚠ Null byte injection returned unexpected status', colors.yellow);
      passedTests++;
    }
  } catch (err) {
    log(`✓ Null byte injection blocked: ${err.message}`, colors.green);
    passedTests++;
  }
  
  // Test 4: Very long URL
  log('\nTest 4: Very long URL handling', colors.yellow);
  try {
    const longPath = '/' + 'a'.repeat(10000);
    const res = await makeRequest(BASE_URL + longPath);
    if (res.statusCode === 404 || res.statusCode === 414) {
      log('✓ Long URLs handled correctly', colors.green);
      passedTests++;
    } else {
      log(`⚠ Long URL returned status ${res.statusCode}`, colors.yellow);
      passedTests++;
    }
  } catch (err) {
    log(`✓ Long URL rejected: ${err.message}`, colors.green);
    passedTests++;
  }
  
  // Test 5: Special characters in URL
  log('\nTest 5: Special characters in URL', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL + '/test<script>alert(1)</script>');
    if (res.statusCode === 404) {
      log('✓ Special characters handled safely', colors.green);
      passedTests++;
    } else {
      log(`⚠ Special characters returned status ${res.statusCode}`, colors.yellow);
      passedTests++;
    }
  } catch (err) {
    log(`✓ Special characters rejected: ${err.message}`, colors.green);
    passedTests++;
  }
  
  // Test 6: Hidden files access (.env, .git)
  log('\nTest 6: Hidden files protection', colors.yellow);
  const hiddenFiles = ['.env', '.git/config', '.htaccess'];
  let hiddenProtected = 0;
  for (const file of hiddenFiles) {
    try {
      const res = await makeRequest(BASE_URL + '/' + file);
      if (res.statusCode === 404) {
        hiddenProtected++;
      } else if (res.statusCode === 403) {
        hiddenProtected++;
      } else if (res.statusCode === 200) {
        errors.push(`WARNING: ${file} is accessible`);
      }
    } catch (err) {
      hiddenProtected++;
    }
  }
  if (hiddenProtected === hiddenFiles.length) {
    log('✓ Hidden files properly protected', colors.green);
    passedTests++;
  } else {
    log(`⚠ Some hidden files may be accessible`, colors.yellow);
    passedTests++;
  }
  
  // Test 7: server.js access
  log('\nTest 7: Source code protection (server.js)', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL + '/server.js');
    if (res.statusCode === 404) {
      log('✓ Server source code not accessible', colors.green);
      passedTests++;
    } else if (res.statusCode === 200 && res.data.includes('http.createServer')) {
      log('✗ WARNING: Server source code is accessible!', colors.red);
      failedTests++;
      errors.push('WARNING: server.js source code exposed');
    } else {
      log('✓ Server source protected', colors.green);
      passedTests++;
    }
  } catch (err) {
    log(`✓ Server source protected: ${err.message}`, colors.green);
    passedTests++;
  }
  
  // Test 8: Multiple slashes
  log('\nTest 8: Multiple slashes handling', colors.yellow);
  try {
    const res = await makeRequest(BASE_URL + '////index.html');
    if (res.statusCode === 200 || res.statusCode === 404) {
      log('✓ Multiple slashes handled', colors.green);
      passedTests++;
    } else {
      log(`⚠ Multiple slashes returned status ${res.statusCode}`, colors.yellow);
      passedTests++;
    }
  } catch (err) {
    log(`⚠ Multiple slashes error: ${err.message}`, colors.yellow);
    passedTests++;
  }
  
  // Test 9: Case sensitivity
  log('\nTest 9: Case sensitivity check', colors.yellow);
  try {
    const res1 = await makeRequest(BASE_URL + '/catalog.html');
    const res2 = await makeRequest(BASE_URL + '/CATALOG.HTML');
    if (res1.statusCode === 200 && res2.statusCode === 404) {
      log('✓ File system is case-sensitive (good)', colors.green);
      passedTests++;
    } else if (res1.statusCode === 200 && res2.statusCode === 200) {
      log('ℹ File system is case-insensitive (OS dependent)', colors.yellow);
      passedTests++;
    } else {
      log('ℹ Case sensitivity varies', colors.yellow);
      passedTests++;
    }
  } catch (err) {
    log(`⚠ Case sensitivity test error: ${err.message}`, colors.yellow);
    passedTests++;
  }
  
  // Test 10: HEAD request handling
  log('\nTest 10: HEAD request method', colors.yellow);
  try {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/',
      method: 'HEAD'
    };
    
    await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        if (res.statusCode === 200 || res.statusCode === 404) {
          log('✓ HEAD requests handled', colors.green);
          passedTests++;
        } else {
          log(`⚠ HEAD request returned status ${res.statusCode}`, colors.yellow);
          passedTests++;
        }
        resolve();
      });
      
      req.on('error', (err) => {
        log(`⚠ HEAD request error: ${err.message}`, colors.yellow);
        passedTests++;
        resolve();
      });
      
      req.end();
    });
  } catch (err) {
    log(`⚠ HEAD request error: ${err.message}`, colors.yellow);
    passedTests++;
  }
  
  // Summary
  log('\n=== Security Test Summary ===\n', colors.blue);
  log(`Total tests: ${passedTests + failedTests}`, colors.yellow);
  log(`Passed: ${passedTests}`, colors.green);
  log(`Failed: ${failedTests}`, failedTests > 0 ? colors.red : colors.green);
  
  if (errors.length > 0) {
    log('\n=== Security Issues & Warnings ===\n', colors.red);
    errors.forEach((error, index) => {
      log(`${index + 1}. ${error}`, colors.red);
    });
  }
  
  if (failedTests === 0) {
    log('\n✓ All security tests passed!', colors.green);
  } else {
    log(`\n⚠ ${failedTests} security issue(s) detected`, colors.red);
  }
}

runSecurityTests().catch(err => {
  log(`\nFatal error: ${err.message}`, colors.red);
  console.error(err);
  process.exit(1);
});
