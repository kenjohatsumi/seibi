// Deterministic counter for stop and rollback conditions, which section 7 of the skill requires
// for a proposed experiment. Offline: re-scores stored evidence, makes no model calls. Output is
// byte-stable across runs.
//   node evaluation/stop-conditions.mjs <evidence-dir> [more-dirs...] > report.json
//
// Two measures, because they are not the same defect:
//   any_stop - the response states a stop or rollback condition at all. Losing this is a
//              regression against a required behaviour.
//   numeric  - that condition carries a threshold rather than a direction. The skill prefers
//              this but explicitly permits a qualitative stop condition, so a fall here is a
//              change in form, not necessarily a defect, and must be read alongside any_stop.
//
// The measure exists because v0.3.3-rc.5 removed unsupported numerical promises completely and
// took stop conditions with it, dropping any_stop to 24/40 against v0.3.1's 37/40. Neither
// numeric-promise.mjs nor assurance.mjs could see it: the first exempts stop conditions by
// design, the second scores one case. A remediation that trades a defect for a regression has
// to be visible to the harness, not caught by hand.
import fs from 'node:fs';
import path from 'node:path';

// A stop frame: the responder names a condition under which the experiment is halted or undone.
const STOP = /\b(?:stop|halt|abort|pause|revert|roll[\s-]?back|kill[\s-]?switch|back\s+out)\b/i;
// A quantity in the same clause: a percentage, percentage points, a count, a ratio, a multiple
// or a comparison against a stated level. Bare durations do not qualify, because an observation
// window is not a stop threshold -- "stop after two weeks" states when to look, not when to quit.
const QUANTITY = /(?:\d+(?:\.\d+)?\s*(?:%|percentage\s+points?|pp\b|x\b|×)|(?:[<>≤≥]=?|\bbelow\b|\babove\b|\bexceeds?\b|\bunder\b|\bover\b|\bmore than\b|\bless than\b|\bat least\b|\bat most\b|\bdrops? to\b|\brises? to\b|\bfalls? to\b)\s*\D{0,20}?\d)/i;
const DURATION_ONLY = /^\d+(?:\.\d+)?\s*(?:second|minute|hour|day|week|month|sprint|cycle|session|iteration)s?$/i;

const text = doc => {
  const p = doc.parsed;
  if (!p) return '';
  return [p.decision, p.answer].filter(s => typeof s === 'string').join('\n');
};

// Scan clause by clause so a stop frame in one sentence cannot claim a number from the next.
function findStop(body) {
  for (const clause of body.split(/(?<=[.;])\s+|\n+/)) {
    if (!STOP.test(clause)) continue;
    const m = QUANTITY.exec(clause);
    if (!m) continue;
    if (DURATION_ONLY.test(m[0].trim())) continue;
    return {flagged: true, clause: clause.trim().replace(/\s+/g, ' ')};
  }
  return {flagged: false, clause: null};
}

const dirs = process.argv.slice(2);
if (!dirs.length) throw Error('usage: stop-conditions.mjs <evidence-dir> [more-dirs...]');

const by_version = {}, by_case = {}, rows = [];
for (const dir of dirs) {
  for (const file of fs.readdirSync(dir).sort()) {
    if (!/^candidate-\d+\.json$/.test(file)) continue;
    const doc = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (doc.valid === false) continue;
    // Non-activating controls are excluded: a case that correctly declines systems analysis
    // owes no experiment, so it owes no stop condition.
    if (/^NC-/.test(doc.case)) continue;
    const body = text(doc);
    const hit = findStop(body);
    const any_stop = STOP.test(body);
    rows.push({run: path.basename(dir), id: doc.id, version: doc.version, case: doc.case, seed: doc.seed, any_stop, ...hit});
    const b = by_version[doc.version] ||= {responses: 0, any_stop: 0, with_numeric_stop: 0, any_stop_rate: 0, numeric_rate: 0};
    b.responses++; if (any_stop) b.any_stop++; if (hit.flagged) b.with_numeric_stop++;
    b.any_stop_rate = Number((b.any_stop / b.responses).toFixed(4));
    b.numeric_rate = Number((b.with_numeric_stop / b.responses).toFixed(4));
    const c = by_case[doc.case] ||= {responses: 0, any_stop: 0, with_numeric_stop: 0};
    c.responses++; if (any_stop) c.any_stop++; if (hit.flagged) c.with_numeric_stop++;
  }
}
rows.sort((a, b) => (a.run + a.id).localeCompare(b.run + b.id));
process.stdout.write(JSON.stringify({
  tool: 'stop-conditions',
  detects: 'stop or rollback condition required by skill section 7, and whether it carries a threshold',
  dirs, by_version, by_case, rows,
}, null, 2) + '\n');
