// Consistency check for a release, per RELEASE_SOP.md section 13: confirms that VERSION, runtime
// version metadata (where present), CHANGELOG.md, the evidence/releases/<version>/ package, and
// the Git tag all agree. Offline except for one `git tag` call. Exits non-zero on any mismatch.
//   node evaluation/check-release.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));

const problems = [];
const note = (msg) => problems.push(msg);

// 1. VERSION
const version = read('VERSION').trim();
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  note(`VERSION does not look like a plain semantic version: "${version}"`);
}

// 2. Runtime version metadata, where present. SKILL.md carries no version field at present;
//    this check only fires if one is later added, so it cannot silently drift from VERSION.
const skillMd = read('skills/seibi/SKILL.md');
const skillVersionMatch = skillMd.match(/^version:\s*(\S+)/m);
if (skillVersionMatch && skillVersionMatch[1] !== version) {
  note(`skills/seibi/SKILL.md declares version "${skillVersionMatch[1]}", VERSION says "${version}"`);
}

// 3. CHANGELOG.md has a heading for this version
const changelog = read('CHANGELOG.md');
const changelogHeading = new RegExp(`^## v${version.replace(/\./g, '\\.')}(\\s|$)`, 'm');
if (!changelogHeading.test(changelog)) {
  note(`CHANGELOG.md has no "## v${version}" heading`);
}

// 4. Evidence package exists and is complete
const evidenceDir = `evidence/releases/v${version}`;
const requiredEvidenceFiles = ['SUMMARY.md', 'VALIDATION.md', 'TEST_RESULTS.md', 'RELEASE_CHECKLIST.md'];
if (!exists(evidenceDir)) {
  note(`No evidence package at ${evidenceDir}/`);
} else {
  for (const f of requiredEvidenceFiles) {
    if (!exists(path.join(evidenceDir, f))) {
      note(`${evidenceDir}/ is missing ${f}`);
    }
  }
}

// 5. Git tag exists and matches VERSION. Best-effort: skip if not run inside a Git checkout.
try {
  const tags = execFileSync('git', ['tag', '--list'], { cwd: root, encoding: 'utf8' });
  const tagList = tags.split('\n').map((t) => t.trim()).filter(Boolean);
  const expectedTag = `v${version}`;
  if (!tagList.includes(expectedTag)) {
    note(`No Git tag "${expectedTag}" found (checked ${tagList.length} tags)`);
  }
} catch (err) {
  note(`Could not read Git tags: ${err.message}`);
}

if (problems.length === 0) {
  console.log(`OK: VERSION (${version}), CHANGELOG.md, ${evidenceDir}/, and the Git tag agree.`);
  process.exit(0);
} else {
  console.error(`Release consistency check failed for v${version}:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
