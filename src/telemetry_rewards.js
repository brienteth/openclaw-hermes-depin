/**
 * MYCA DePIN Spore Node Telemetry & Proof-of-Crawl Rewards
 * Records autonomous agent tasks on the decentralized network and awards
 * Spore Points and Genesis airdrop credit.
 */

import fs from 'node:fs';
import path from 'node:path';

export class DePinTelemetryLedger {
  constructor(options = {}) {
    this.ledgerPath = options.ledgerPath || path.resolve(process.cwd(), '.myca_telemetry.json');
    this.state = {
      nodeAddress: options.nodeAddress || '0xLocalSporeNode_' + Math.random().toString(36).slice(2, 8),
      totalTasksExecuted: 0,
      totalBytesRouted: 0,
      sporePointsEarned: 0,
      lastProofHash: null,
      history: []
    };

    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.ledgerPath)) {
        const data = JSON.parse(fs.readFileSync(this.ledgerPath, 'utf8'));
        this.state = { ...this.state, ...data };
      }
    } catch (e) {
      // fresh ledger on failure
    }
  }

  save() {
    try {
      fs.writeFileSync(this.ledgerPath, JSON.stringify(this.state, null, 2), 'utf8');
    } catch (e) {
      // memory fallback
    }
  }

  recordProof(taskType, metadata = {}) {
    const points = metadata.points || 15;
    const bytes = metadata.bytes || 1024;
    const proofHash = '0x' + Buffer.from(`${Date.now()}_${taskType}_${points}`).toString('hex').slice(0, 32);

    this.state.totalTasksExecuted += 1;
    this.state.totalBytesRouted += bytes;
    this.state.sporePointsEarned += points;
    this.state.lastProofHash = proofHash;

    const entry = {
      timestamp: new Date().toISOString(),
      taskType,
      points,
      bytes,
      proofHash
    };

    this.state.history.unshift(entry);
    if (this.state.history.length > 50) this.state.history.pop();

    this.save();
    return entry;
  }

  getOverview() {
    return {
      nodeAddress: this.state.nodeAddress,
      totalTasks: this.state.totalTasksExecuted,
      bytesRoutedMB: (this.state.totalBytesRouted / (1024 * 1024)).toFixed(3) + ' MB',
      sporePoints: this.state.sporePointsEarned,
      lastProof: this.state.lastProofHash || 'None'
    };
  }
}
