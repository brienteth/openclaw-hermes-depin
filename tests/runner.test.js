/**
 * Automated test runner for openclaw-hermes-depin
 */

import assert from 'node:assert';
import { DePinMeshProxy } from '../src/mesh_proxy.js';
import { ZeroCostSemanticCache } from '../src/semantic_cache.js';
import { OpenClawCrawler } from '../src/openclaw_crawler.js';
import { HermesAgent } from '../src/hermes_agent.js';
import { DePinTelemetryLedger } from '../src/telemetry_rewards.js';

async function runTests() {
  console.log('🧪 Running openclaw-hermes-depin unit tests...\n');

  // Test 1: DePinMeshProxy
  console.log('Test 1: DePinMeshProxy node rotation and headers...');
  const proxy = new DePinMeshProxy();
  const node1 = proxy.getNextNode();
  const node2 = proxy.getNextNode();
  assert.ok(node1 && node1.id, 'Node 1 must have an id');
  assert.ok(node2 && node2.id, 'Node 2 must have an id');
  assert.notStrictEqual(node1.id, node2.id, 'Nodes should rotate sequentially');
  const headers = proxy.generateHeaders();
  assert.ok(headers['User-Agent'], 'Must include realistic User-Agent');
  assert.strictEqual(headers['X-DePIN-Spore-Hop'], 'active', 'Must mark hop');
  console.log('✓ DePinMeshProxy passed.');

  // Test 2: ZeroCostSemanticCache
  console.log('\nTest 2: ZeroCostSemanticCache get/set and token estimation...');
  const cache = new ZeroCostSemanticCache({ cacheDir: '/tmp/test_myca_cache_' + Date.now() });
  const key = 'test-query-what-is-depin';
  const val = { answer: 'DePIN is Decentralized Physical Infrastructure Network' };
  cache.set(key, val);
  const retrieved = cache.get(key);
  assert.deepStrictEqual(retrieved, val, 'Cache retrieval must match value');
  const stats = cache.getStats();
  assert.strictEqual(stats.hits, 1, 'Hits must be 1');
  assert.ok(stats.tokensSavedEstimate > 0, 'Tokens saved must be estimated');
  console.log('✓ ZeroCostSemanticCache passed.');

  // Test 3: OpenClawCrawler HTML sanitization
  console.log('\nTest 3: OpenClawCrawler HTML extraction and cleaning...');
  const crawler = new OpenClawCrawler({ cache });
  const rawHtml = `<html><body><h1>DePIN Title</h1><script>alert(1);</script><p>Mycelial computing is the future.</p></body></html>`;
  const cleaned = crawler.cleanHtml(rawHtml);
  assert.ok(!cleaned.includes('<script>'), 'Scripts must be stripped');
  assert.ok(cleaned.includes('# DePIN Title'), 'Header converted to markdown');
  assert.ok(cleaned.includes('Mycelial computing is the future.'), 'Paragraph preserved');
  console.log('✓ OpenClawCrawler passed.');

  // Test 4: DePinTelemetryLedger
  console.log('\nTest 4: DePinTelemetryLedger proof recording...');
  const ledger = new DePinTelemetryLedger({ ledgerPath: '/tmp/test_telemetry_' + Date.now() + '.json' });
  const proof = ledger.recordProof('OPENCLAW_TEST', { bytes: 4096, points: 25 });
  assert.ok(proof.proofHash.startsWith('0x'), 'Proof hash must start with 0x');
  const overview = ledger.getOverview();
  assert.strictEqual(overview.totalTasks, 1, 'Total tasks must be 1');
  assert.strictEqual(overview.sporePoints, 25, 'Points must be 25');
  console.log('✓ DePinTelemetryLedger passed.');

  // Test 5: HermesAgent Autonomous Task Execution
  console.log('\nTest 5: HermesAgent multi-step reasoning trace...');
  const agent = new HermesAgent({ crawler, cache });
  const result = await agent.runTask('Explain decentralized compute caching benefits');
  assert.ok(result.trace && result.trace.length >= 2, 'Trace must contain multiple steps');
  assert.ok(result.finalAnswer, 'Final answer must not be empty');
  assert.ok(result.depinRewardsEarned > 0, 'Rewards must be awarded');
  console.log('✓ HermesAgent passed.');

  console.log('\n🎉 ALL 5 TEST SUITES PASSED CLEANLY!\n');
}

runTests().catch(err => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
