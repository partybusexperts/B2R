#!/usr/bin/env node

/**
 * API Performance Profiler
 * Measures response times for poll endpoints and identifies bottlenecks
 */

const http = require('http');

const API_BASE = 'http://localhost:3003';

async function timeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const start = process.hrtime.bigint();
    
    const options = {
      hostname: 'localhost',
      port: 3003,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'performance-profiler/1.0',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1_000_000;
        
        resolve({
          status: res.statusCode,
          durationMs: Math.round(durationMs * 100) / 100,
          headers: res.headers,
          dataSize: data.length,
          path
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(body);
    }
    
    req.end();
  });
}

async function runPerformanceProfile() {
  console.log('🚀 Starting API Performance Profile\n');
  
  const endpoints = [
    '/api/poll/all',
    '/api/poll/results/bulk?tags=general,pricing,limo',
    '/api/poll/vote',
    '/api/poll?id=poll-001'
  ];

  for (const endpoint of endpoints) {
    console.log(`📊 Testing ${endpoint}:`);
    
    const runs = [];
    for (let i = 0; i < 5; i++) {
      try {
        let result;
        if (endpoint === '/api/poll/vote') {
          // Test vote endpoint with sample data
          result = await timeRequest(endpoint, 'POST', JSON.stringify({
            pollId: 'poll-001',
            optionId: 'option-a'
          }));
        } else {
          result = await timeRequest(endpoint);
        }
        runs.push(result);
        process.stdout.write('.');
      } catch (err) {
        console.error(`\n❌ Request failed: ${err.message}`);
        continue;
      }
    }
    
    if (runs.length > 0) {
      const durations = runs.map(r => r.durationMs);
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const minDuration = Math.min(...durations);
      const maxDuration = Math.max(...durations);
      const avgDataSize = runs.reduce((sum, r) => sum + r.dataSize, 0) / runs.length;
      
      console.log(`\n   ⏱️  Avg: ${avgDuration.toFixed(1)}ms | Min: ${minDuration}ms | Max: ${maxDuration}ms`);
      console.log(`   📦 Data size: ${Math.round(avgDataSize / 1024)}KB`);
      console.log(`   🎯 Status: ${runs[0].status}`);
      
      // Check cache headers
      if (runs[0].headers['cache-control']) {
        console.log(`   🗄️  Cache: ${runs[0].headers['cache-control']}`);
      }
      
      if (avgDuration > 100) {
        console.log(`   ⚠️  SLOW: Consider optimization`);
      }
    }
    
    console.log('');
  }

  // Test concurrent load
  console.log('🔥 Testing concurrent load (10 requests to /api/poll/all):');
  const concurrentStart = process.hrtime.bigint();
  
  const concurrentPromises = Array(10).fill(null).map(() => 
    timeRequest('/api/poll/all')
  );
  
  try {
    const concurrentResults = await Promise.all(concurrentPromises);
    const concurrentEnd = process.hrtime.bigint();
    const totalConcurrentMs = Number(concurrentEnd - concurrentStart) / 1_000_000;
    
    const concurrentDurations = concurrentResults.map(r => r.durationMs);
    const avgConcurrent = concurrentDurations.reduce((a, b) => a + b, 0) / concurrentDurations.length;
    
    console.log(`   ⏱️  Total time: ${totalConcurrentMs.toFixed(1)}ms`);
    console.log(`   📊 Avg per request: ${avgConcurrent.toFixed(1)}ms`);
    console.log(`   🚀 Throughput: ${(1000 / avgConcurrent * 10).toFixed(0)} req/sec`);
    
    if (avgConcurrent > 50) {
      console.log(`   ⚠️  HIGH LATENCY under load`);
    }
  } catch (err) {
    console.error(`❌ Concurrent test failed: ${err.message}`);
  }

  console.log('\n✅ Performance profile complete');
}

// Wait for server to be ready, then run profile
setTimeout(() => {
  runPerformanceProfile().catch(console.error);
}, 3000);
