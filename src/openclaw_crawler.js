/**
 * OpenClaw Intelligent Web Crawler
 * Powered by MYCA DePIN Spore Mesh Routing & Anti-Bot Fingerprint Engine
 */

import { DePinMeshProxy } from './mesh_proxy.js';
import { ZeroCostSemanticCache } from './semantic_cache.js';

export class OpenClawCrawler {
  constructor(options = {}) {
    this.proxy = options.proxy || new DePinMeshProxy();
    this.cache = options.cache || new ZeroCostSemanticCache();
  }

  /**
   * Cleans raw HTML and converts to readable markdown/text
   */
  cleanHtml(html) {
    if (!html || typeof html !== 'string') return '';

    return html
      // Remove scripts, styles, noscript, svg, iframes
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      // Replace headings with markdown style
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
      // Replace paragraphs and line breaks
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
      .replace(/<br\s*[\/]?>/gi, '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      // Strip all remaining tags
      .replace(/<[^>]+>/g, '')
      // Decode basic HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Collapse whitespace
      .replace(/\n\s+\n/g, '\n\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /**
   * Crawl a single webpage with DePIN proxy and semantic caching
   */
  async crawl(targetUrl, options = {}) {
    const cacheKey = `crawl:${targetUrl}`;
    
    // 1. Check Zero-Cost Semantic Cache
    if (!options.bypassCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return {
          ...cached,
          source: 'SEMANTIC_CACHE',
          cachedAt: cached.crawledAt
        };
      }
    }

    // 2. Fetch through DePIN Mesh
    const response = await this.proxy.fetchThroughMesh(targetUrl, options);
    const cleanedText = this.cleanHtml(response.body);

    const result = {
      url: targetUrl,
      statusCode: response.statusCode,
      content: cleanedText.slice(0, 15000), // Protect token context
      lengthChars: cleanedText.length,
      crawledAt: Date.now(),
      depinRouting: response.meta,
      source: 'DEPIN_MESH'
    };

    // 3. Save to Semantic Cache
    this.cache.set(cacheKey, result, options.ttlSeconds || 3600);

    return result;
  }
}
