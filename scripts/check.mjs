import { readdirSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
const scripts = readdirSync(root).filter(file => file.endsWith('.js'));
for (const file of scripts) {
  const result = spawnSync(process.execPath, ['--check', fileURLToPath(new URL(file, root))], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`${file}: ${result.stderr || result.error || 'syntax check failed'}`);
}
for (const dependency of Object.keys(manifest.dependencies)) import.meta.resolve(dependency);
console.log(`Syntax checked ${scripts.length} CLI scripts; all ${Object.keys(manifest.dependencies).length} declared packages resolve.`);
