/**
 * MYCA Zero-Cost Semantic Cache
 * Eliminates redundant LLM token burning and repeat web crawls by caching
 * extracted knowledge graphs and agent reasoning locally and on the DePIN DAG.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export class ZeroCostSemanticCache {
  constructor(options = {}) {
    this.cacheDir = options.cacheDir || path.resolve(process.cwd(), '.myca_cache');
    this.memoryStore = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      tokensSavedEstimate: 0,
      dollarsSavedEstimate: 0
    };

    this.ensureCacheDir();
  }

  ensureCacheDir() {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }
    } catch (e) {
      // Fallback to in-memory only if disk cannot be written
    }
  }

  /**
   * Generates a deterministic semantic fingerprint
   */
  hashKey(input) {
    const normalized = String(input)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
    return crypto.createHash('sha256').update(normalized).digest('hex');
  }

  /**
   * Get value from semantic cache
   */
  get(key) {
    const hash = this.hashKey(key);

    // 1. Check memory cache first
    if (this.memoryStore.has(hash)) {
      const entry = this.memoryStore.get(hash);
      if (entry.expiresAt && entry.expiresAt < Date.now()) {
        this.memoryStore.delete(hash);
        this.stats.misses++;
        return null;
      }
      this.recordHit(entry.value);
      return entry.value;
    }

    // 2. Check disk cache
    const filePath = path.join(this.cacheDir, `${hash}.json`);
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const entry = JSON.parse(raw);
        if (entry.expiresAt && entry.expiresAt < Date.now()) {
          fs.unlinkSync(filePath);
          this.stats.misses++;
          return null;
        }
        this.memoryStore.set(hash, entry);
        this.recordHit(entry.value);
        return entry.value;
      }
    } catch (err) {
      // Cache read error falls back to miss
    }

    this.stats.misses++;
    return null;
  }

  /**
   * Put value into semantic cache with optional TTL
   */
  set(key, value, ttlSeconds = 86400) {
    const hash = this.hashKey(key);
    const entry = {
      key,
      value,
      createdAt: Date.now(),
      expiresAt: ttlSeconds ? Date.now() + (ttlSeconds * 1000) : null
    };

    this.memoryStore.set(hash, entry);

    try {
      const filePath = path.join(this.cacheDir, `${hash}.json`);
      fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), 'utf-8');
    } catch (err) {
      // disk write error ignored in memory fallback
    }

    return hash;
  }

  recordHit(value) {
    this.stats.hits++;
    const chars = typeof value === 'string' ? value.length : JSON.stringify(value).length;
    // Approximation: 4 characters = 1 LLM token
    const tokens = Math.max(150, Math.floor(chars / 4));
    this.stats.tokensSavedEstimate += tokens;
    // OpenAI / Claude average pricing estimate ($0.003 / 1k tokens)
    this.stats.dollarsSavedEstimate = (this.stats.tokensSavedEstimate / 1000) * 0.003;
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRatio = total > 0 ? ((this.stats.hits / total) * 100).toFixed(1) + '%' : '0%';
    return {
      ...this.stats,
      hitRatio,
      dollarsSavedFormatted: `$${this.stats.dollarsSavedEstimate.toFixed(4)}`
    };
  }
}
