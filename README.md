# 🌐 OpenClaw × Hermes DePIN Runner

> **Run Autonomous Web Automation & Hermes AI Agents 100% Free on Your PC.**  
> Powered by **MYCA DePIN Spore Mesh** & **Zero-Cost Semantic Cache**.

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-cyan.svg)](https://nodejs.org)
[![DePIN](https://img.shields.io/badge/DePIN-Decentralized%20Mesh-green.svg)](https://github.com/brienteth/openclaw-hermes-depin)
[![Zero-Cost Cache](https://img.shields.io/badge/Semantic%20Cache-Zero--Gas-purple.svg)](https://github.com/brienteth/openclaw-hermes-depin)

---

## ⚡ The Problem vs. Our Solution

| The Old Way (Expensive & Centralized) | The OpenClaw × Hermes DePIN Way (100% Free) |
|---|---|
| ❌ **$50 - $200/mo** for residential proxies to avoid Cloudflare IP bans | ✅ **$0:** Decentralized Spore Mesh rotates requests across P2P residential nodes |
| ❌ **$0.03 - $0.15** per token prompt to cloud LLMs (OpenAI / Anthropic) | ✅ **$0:** Zero-Cost Semantic Cache intercepts repeated reasoning & crawls |
| ❌ Hardware lock: 70B models require $3,000+ GPUs or cloud rentals | ✅ Local Ollama / lightweight execution + P2P Edge inference fallback |
| ❌ Running scrapers burns electricity with zero financial return | ✅ Earn **Spore Mining Points & Genesis DePIN airdrop multiplier** |

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       LOCAL USER PC                         │
│                                                             │
│   ┌─────────────────────┐        ┌───────────────────────┐  │
│   │   OpenClaw Engine   │        │   Nous Hermes Agent   │  │
│   │  (Stealth Crawler)  │◄──────►│   (Autonomous Logic)  │  │
│   └──────────┬──────────┘        └───────────┬───────────┘  │
│              │                               │              │
│              ▼                               ▼              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │           Zero-Cost Semantic DAG Cache               │  │
│   │    (Eliminates redundant GPU burns & repeat crawls)  │  │
│   └──────────────────────────┬───────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
  ┌─────────────────────────┐     ┌─────────────────────────┐
  │   MYCA DePIN Mesh       │     │   Living Lattice Proof  │
  │ (P2P Residential Proxy  │     │   (Earn Spore Mining    │
  │  & Cloudflare Bypasser) │     │    Points on Ledger)    │
  └─────────────────────────┘     └─────────────────────────┘
```

---

## 🚀 Quickstart (Under 60 Seconds)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/openclaw-hermes-depin.git
cd openclaw-hermes-depin
```
*(Zero external npm dependencies required — runs purely on modern Node.js native standard libraries!)*

### 2. Launch Interactive Terminal
```bash
npm start
```

### 3. One-Liner Commands

* **Stealth Crawl Any Website (Bypass Cloudflare via DePIN Mesh):**
  ```bash
  npm run crawl -- https://news.ycombinator.com
  ```

* **Run Hermes Autonomous Reasoning Agent:**
  ```bash
  npm run agent -- "Find latest AI developments from https://news.ycombinator.com and summarize key trends"
  ```

* **Check Your Local Spore Mining Points & Telemetry:**
  ```bash
  node bin/cli.js stats
  ```

---

## 🧠 Using with Local LLMs (Optional)

If you have [Ollama](https://ollama.ai) installed on your machine, simply start your favorite Hermes model:

```bash
ollama run hermes3:8b
```

The runner will automatically detect local neural weights and route full reasoning through your GPU/CPU with **zero cloud dependencies**. If Ollama is offline, the runner automatically switches to the built-in deterministic edge engine.

---

## 💎 Support the Technology & Ecosystem

This project is built independently as an open-source public good for AI sovereignty and decentralized computing.

To support ongoing open-source infrastructure development, edge relays, and semantic cache optimizations:
* **Community Fair-Launch Token:** Available on **Pond Family** / DEX.

---

## 🧪 Running Tests

```bash
npm test
```
*All 5 core suites (Mesh Proxy, Semantic Cache, OpenClaw Sanitizer, Proof Ledger, Hermes Execution) run and pass with zero configuration.*

---

## 📜 License

MIT License — Free for individuals, builders, and the decentralized AI community.
