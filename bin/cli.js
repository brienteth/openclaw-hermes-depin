#!/usr/bin/env node

/**
 * OpenClaw × Hermes DePIN Runner — CLI
 * Autonomous Web Automation & Reasoning on your local PC
 */

import readline from 'node:readline';
import { OpenClawCrawler } from '../src/openclaw_crawler.js';
import { HermesAgent } from '../src/hermes_agent.js';
import { DePinTelemetryLedger } from '../src/telemetry_rewards.js';
import { ZeroCostSemanticCache } from '../src/semantic_cache.js';

const BANNER = `
\x1b[38;2;46;107;69m ╔═══════════════════════════════════════════════════════════════════════╗
 ║   \x1b[1;37mOPENCLAW × HERMES DEPIN RUNNER\x1b[0m\x1b[38;2;46;107;69m                                     ║
 ║   \x1b[38;2;0;240;255mAutonomous Web Automation & Reasoning — 100% Free on Local PC\x1b[0m\x1b[38;2;46;107;69m       ║
 ║   \x1b[38;2;16;185;129mPowered by MYCA DePIN Spore Mesh & Zero-Cost Semantic Cache\x1b[0m\x1b[38;2;46;107;69m         ║
 ╚═══════════════════════════════════════════════════════════════════════╝\x1b[0m
`;

async function main() {
  console.log(BANNER);

  const crawler = new OpenClawCrawler();
  const agent = new HermesAgent({ crawler });
  const telemetry = new DePinTelemetryLedger();
  const cache = new ZeroCostSemanticCache();

  const args = process.argv.slice(2);
  const command = args[0];

  // Direct CLI Commands
  if (command === 'crawl') {
    const url = args[1] || 'https://news.ycombinator.com';
    console.log(`\x1b[36m[OpenClaw]\x1b[0m Starting stealth crawl for: \x1b[1m${url}\x1b[0m`);
    console.log(`\x1b[32m[DePIN Mesh]\x1b[0m Routing request through decentralized Spore residential nodes...`);

    const result = await crawler.crawl(url);
    telemetry.recordProof('OPENCLAW_CRAWL', { bytes: result.lengthChars, points: 20 });

    console.log(`\n\x1b[1;32m✓ Crawl Completed!\x1b[0m`);
    console.log(`• Status: HTTP ${result.statusCode}`);
    console.log(`• Source: ${result.source}`);
    console.log(`• Hop Node: ${result.depinRouting?.nodeId || 'Cache'}`);
    console.log(`• Extracted Characters: ${result.lengthChars}`);
    console.log(`\n\x1b[33m--- Extracted Markdown Preview (First 500 chars) ---\x1b[0m`);
    console.log(result.content.slice(0, 500) + '...\n');
    printStats(telemetry, cache);
    process.exit(0);
  }

  if (command === 'agent') {
    const task = args.slice(1).join(' ') || 'Summarize latest crypto AI DePIN developments from https://news.ycombinator.com';
    console.log(`\x1b[35m[Hermes Agent]\x1b[0m Executing autonomous plan for: \x1b[1m"${task}"\x1b[0m\n`);

    const result = await agent.runTask(task);
    telemetry.recordProof('HERMES_TASK', { points: result.depinRewardsEarned, bytes: 2048 });

    console.log(`\x1b[1;34m=== Hermes Reasoning Trace ===\x1b[0m`);
    for (const step of result.trace) {
      console.log(`\x1b[36m[${step.step}]\x1b[0m ${step.thought || step.provider || step.action || ''}`);
    }

    console.log(`\n\x1b[1;32m=== Final Synthesis ===\x1b[0m\n${result.finalAnswer}\n`);
    console.log(`\x1b[32m✓ Rewards Earned:\x1b[0m +${result.depinRewardsEarned} Spore Mining Points`);
    printStats(telemetry, cache);
    process.exit(0);
  }

  if (command === 'stats') {
    printStats(telemetry, cache);
    process.exit(0);
  }

  // Interactive Terminal Mode
  console.log(`\x1b[33mCommands:\x1b[0m`);
  console.log(`  1. \x1b[1mcrawl <url>\x1b[0m        - Stealth crawl a website through DePIN proxy mesh`);
  console.log(`  2. \x1b[1magent <prompt>\x1b[0m     - Run Hermes autonomous agent with tool calling`);
  console.log(`  3. \x1b[1mstats\x1b[0m              - Display local node rewards and cache savings`);
  console.log(`  4. \x1b[1mexit\x1b[0m               - Quit\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\x1b[1;32mmyca-spore > \x1b[0m'
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }

    if (input === 'exit' || input === 'quit') {
      console.log('Exiting. Spore node standby.');
      process.exit(0);
    }

    if (input.startsWith('crawl ')) {
      const targetUrl = input.replace(/^crawl\s+/, '').trim();
      console.log(`\x1b[36m[OpenClaw]\x1b[0m Crawling ${targetUrl} via DePIN mesh...`);
      try {
        const res = await crawler.crawl(targetUrl);
        telemetry.recordProof('OPENCLAW_CRAWL', { bytes: res.lengthChars, points: 20 });
        console.log(`\x1b[32m✓ Done!\x1b[0m Received ${res.lengthChars} chars (Source: ${res.source})`);
        console.log(res.content.slice(0, 300) + '...\n');
      } catch (e) {
        console.error(`\x1b[31mError:\x1b[0m ${e.message}`);
      }
    } else if (input.startsWith('agent ')) {
      const taskPrompt = input.replace(/^agent\s+/, '').trim();
      console.log(`\x1b[35m[Hermes]\x1b[0m Running task...`);
      try {
        const res = await agent.runTask(taskPrompt);
        telemetry.recordProof('HERMES_TASK', { points: res.depinRewardsEarned });
        console.log(`\n\x1b[32m[Result]\x1b[0m\n${res.finalAnswer}\n`);
      } catch (e) {
        console.error(`\x1b[31mError:\x1b[0m ${e.message}`);
      }
    } else if (input === 'stats') {
      printStats(telemetry, cache);
    } else {
      console.log(`Unknown command. Type 'crawl <url>', 'agent <task>', 'stats', or 'exit'.`);
    }

    rl.prompt();
  });
}

function printStats(telemetry, cache) {
  const t = telemetry.getOverview();
  const c = cache.getStats();

  console.log(`\x1b[1;36m════════════════ MYCA SPORE NODE TELEMETRY ════════════════\x1b[0m`);
  console.log(` • Node Identity:       \x1b[1m${t.nodeAddress}\x1b[0m`);
  console.log(` • Tasks Completed:     \x1b[32m${t.totalTasks}\x1b[0m`);
  console.log(` • Spore Mining Points: \x1b[33m${t.sporePoints} PTS\x1b[0m`);
  console.log(` • Bandwidth Routed:    ${t.bytesRoutedMB}`);
  console.log(` • Semantic Cache Hits: ${c.hits} / ${c.hits + c.misses} (${c.hitRatio})`);
  console.log(` • Est. API Cost Saved: \x1b[32m${c.dollarsSavedFormatted}\x1b[0m`);
  console.log(` • Last Proof Hash:     ${t.lastProof}`);
  console.log(`\x1b[1;36m═══════════════════════════════════════════════════════════\x1b[0m\n`);
}

main().catch(err => {
  console.error('\x1b[31mFatal error:\x1b[0m', err);
  process.exit(1);
});
