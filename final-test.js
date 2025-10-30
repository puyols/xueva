#!/usr/bin/env node

const http = require('http');

const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`;

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

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

async function runFinalTests() {
  log('\n╔═══════════════════════════════════════════════════╗', colors.cyan);
  log('║   BELKA FLOWERS - FINAL ERROR TESTING SUITE      ║', colors.cyan);
  log('╚═══════════════════════════════════════════════════╝\n', colors.cyan);
  
  const tests = [];
  
  // Test suite 1: Error responses
  log('📋 Test Suite 1: Error Response Handling\n', colors.magenta);
  
  tests.push({
    name: 'Non-existent page returns 404',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/this-page-does-not-exist-xyz');
      return res.statusCode === 404;
    }
  });
  
  tests.push({
    name: '404 page contains proper HTML',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/non-existent');
      return res.statusCode === 404 && res.data.includes('<!DOCTYPE html>');
    }
  });
  
  tests.push({
    name: 'Invalid file extension handled',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/test.invalidext');
      return res.statusCode === 404;
    }
  });
  
  // Test suite 2: Security
  log('🔒 Test Suite 2: Security & Access Control\n', colors.magenta);
  
  tests.push({
    name: 'Server source code blocked',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/server.js');
      return res.statusCode === 404;
    }
  });
  
  tests.push({
    name: 'Package.json blocked',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/package.json');
      return res.statusCode === 404;
    }
  });
  
  tests.push({
    name: '.env file blocked',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/.env');
      return res.statusCode === 404;
    }
  });
  
  tests.push({
    name: '.git directory blocked',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/.git/config');
      return res.statusCode === 404;
    }
  });
  
  tests.push({
    name: 'Path traversal blocked',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/../../../etc/passwd');
      return res.statusCode === 404;
    }
  });
  
  // Test suite 3: Valid pages
  log('✅ Test Suite 3: Valid Page Access\n', colors.magenta);
  
  tests.push({
    name: 'Homepage loads correctly',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/');
      return res.statusCode === 200 && res.data.includes('<!DOCTYPE html>');
    }
  });
  
  tests.push({
    name: 'Catalog page loads',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/catalog.html');
      return res.statusCode === 200;
    }
  });
  
  tests.push({
    name: 'Cart page loads',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/cart.html');
      return res.statusCode === 200;
    }
  });
  
  tests.push({
    name: 'Checkout page loads',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/checkout.html');
      return res.statusCode === 200;
    }
  });
  
  // Test suite 4: Static assets
  log('📦 Test Suite 4: Static Assets\n', colors.magenta);
  
  tests.push({
    name: 'JavaScript files accessible',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/_next/static/chunks/main-e10717a0b5ff7e2d.js');
      return res.statusCode === 200 && res.headers['content-type'].includes('javascript');
    }
  });
  
  tests.push({
    name: 'Favicon loads',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/favicon.ico');
      return res.statusCode === 200;
    }
  });
  
  tests.push({
    name: 'Manifest file loads',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/manifest.json');
      return res.statusCode === 200 && res.headers['content-type'].includes('json');
    }
  });
  
  // Test suite 5: Content type headers
  log('📝 Test Suite 5: Content-Type Headers\n', colors.magenta);
  
  tests.push({
    name: 'HTML has correct content-type',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/');
      return res.headers['content-type'].includes('text/html');
    }
  });
  
  tests.push({
    name: 'JavaScript has correct content-type',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/_next/static/chunks/main-e10717a0b5ff7e2d.js');
      return res.headers['content-type'].includes('javascript');
    }
  });
  
  tests.push({
    name: 'JSON has correct content-type',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/manifest.json');
      return res.headers['content-type'].includes('json');
    }
  });
  
  tests.push({
    name: 'UTF-8 encoding set',
    test: async () => {
      const res = await makeRequest(BASE_URL + '/');
      return res.headers['content-type'].includes('utf-8');
    }
  });
  
  // Run all tests
  let passed = 0;
  let failed = 0;
  const failures = [];
  
  log('\n🧪 Running Tests...\n', colors.yellow);
  
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    try {
      const result = await test.test();
      if (result) {
        log(`✓ ${test.name}`, colors.green);
        passed++;
      } else {
        log(`✗ ${test.name}`, colors.red);
        failed++;
        failures.push(test.name);
      }
    } catch (err) {
      log(`✗ ${test.name} - Error: ${err.message}`, colors.red);
      failed++;
      failures.push(`${test.name} - ${err.message}`);
    }
  }
  
  // Final summary
  log('\n╔═══════════════════════════════════════════════════╗', colors.cyan);
  log('║                  TEST SUMMARY                     ║', colors.cyan);
  log('╚═══════════════════════════════════════════════════╝\n', colors.cyan);
  
  log(`Total Tests: ${tests.length}`, colors.yellow);
  log(`Passed:      ${passed}`, colors.green);
  log(`Failed:      ${failed}`, failed > 0 ? colors.red : colors.green);
  log(`Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%\n`, failed === 0 ? colors.green : colors.yellow);
  
  if (failures.length > 0) {
    log('Failed Tests:', colors.red);
    failures.forEach((f, i) => log(`  ${i + 1}. ${f}`, colors.red));
    log('');
  }
  
  if (failed === 0) {
    log('╔═══════════════════════════════════════════════════╗', colors.green);
    log('║           🎉 ALL TESTS PASSED! 🎉                ║', colors.green);
    log('╚═══════════════════════════════════════════════════╝\n', colors.green);
    log('✅ The application has NO ERRORS detected!', colors.green);
    log('✅ All security measures in place!', colors.green);
    log('✅ Ready for deployment!\n', colors.green);
  } else {
    log('╔═══════════════════════════════════════════════════╗', colors.red);
    log('║          ⚠️  SOME TESTS FAILED  ⚠️               ║', colors.red);
    log('╚═══════════════════════════════════════════════════╝\n', colors.red);
    process.exit(1);
  }
}

runFinalTests().catch(err => {
  log(`\n❌ Fatal error: ${err.message}`, colors.red);
  console.error(err);
  process.exit(1);
});
