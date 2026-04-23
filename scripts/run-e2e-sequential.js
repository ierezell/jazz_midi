#!/usr/bin/env node
/**
 * Sequential Playwright runner that logs per-spec output and maintains a JSON summary.
 * Usage:
 *   node scripts/run-e2e-sequential.js [--stop-on-failure] [--specs spec1,spec2]
 * Examples:
 *   node scripts/run-e2e-sequential.js --stop-on-failure
 *   node scripts/run-e2e-sequential.js --specs tests/e2e/exercises/scales.spec.ts
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const root = process.cwd();
const specsDir = path.join(root, 'tests', 'e2e');

function collectSpecs(dir)
{
  const out = [];
  function walk(d)
  {
    for (const name of fs.readdirSync(d))
    {
      const p = path.join(d, name);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) walk(p);
      else if (stat.isFile() && p.endsWith('.spec.ts')) out.push(path.relative(root, p).replace(/\\/g, '/'));
    }
  }
  if (!fs.existsSync(dir)) return out;
  walk(dir);
  return out.sort();
}

const allSpecs = collectSpecs(specsDir);
if (allSpecs.length === 0)
{
  console.error('No spec files found under tests/e2e');
  process.exit(1);
}

// CLI args
const argv = process.argv.slice(2);
const stopOnFailure = argv.includes('--no-stop') ? false : true; // default: stop on failure
let specsToRun = allSpecs;
const specsArgIndex = argv.indexOf('--specs');
if (specsArgIndex !== -1 && argv[specsArgIndex + 1])
{
  specsToRun = argv[specsArgIndex + 1].split(',').map(s => s.trim());
}

const logDir = path.join(root, 'test-results');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const logFile = path.join(logDir, `e2e-sequential-${timestamp}.log`);
const summaryFile = path.join(logDir, `e2e-summary.json`);

let summary = {};
if (fs.existsSync(summaryFile))
{
  try { summary = JSON.parse(fs.readFileSync(summaryFile, 'utf8')); } catch (e) { summary = {}; }
}

function appendLog(text)
{
  fs.appendFileSync(logFile, text + '\n', 'utf8');
}

appendLog(`# E2E sequential run: ${new Date().toISOString()}`);
appendLog(`Specs to run: ${specsToRun.join(', ')}`);

for (const spec of specsToRun)
{
  appendLog(`\n--- RUN SPEC: ${spec} START ${new Date().toISOString()} ---`);
  const start = Date.now();
  // Run Playwright for a single spec (reporter=list helps keep output readable)
  const cp = spawnSync('npx', ['playwright', 'test', spec, '--workers=1', '--reporter=list'], { cwd: root, encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  const duration = Date.now() - start;

  if (cp.stdout) appendLog(cp.stdout);
  if (cp.stderr) appendLog('\n[STDERR]\n' + cp.stderr);
  appendLog(`--- END SPEC: ${spec} EXIT ${cp.status} DURATION ${duration}ms ---`);

  summary[spec] = {
    status: cp.status === 0 ? 'passed' : 'failed',
    exitCode: cp.status ?? 1,
    durationMs: duration,
    timestamp: new Date().toISOString()
  };

  // Write summary after each spec so it's always up-to-date
  try { fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8'); } catch (e) { appendLog('Failed to write summary: ' + String(e)); }

  if (cp.status !== 0 && stopOnFailure)
  {
    appendLog('Stopping run due to failure.');
    console.error(`Spec failed: ${spec} (exit ${cp.status}) — log: ${logFile}`);
    process.exit(cp.status ?? 1);
  }
}

appendLog('\n=== ALL REQUESTED SPECS COMPLETED ===');
console.log('Run complete. Log:', logFile, 'Summary:', summaryFile);
process.exit(0);
