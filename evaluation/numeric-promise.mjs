// Deterministic detector for unsupported numerical gain promises in evaluation responses.
// Offline: re-scores stored evidence, makes no model calls. Output is byte-stable across runs.
//   node evaluation/numeric-promise.mjs <evidence-dir> [more-dirs...] > report.json
import fs from 'node:fs';
import path from 'node:path';

// A magnitude is a proportional quantity. Bare durations and counts are not magnitudes:
// an observation window is permitted by the skill, a promised proportional gain is not.
const MAGNITUDE = /(?:[≥≤><~]\s*)?\d+(?:\.\d+)?(?:\s*[–-]\s*\d+(?:\.\d+)?)?\s*(?:%|percentage points?|pp\b|percent\b)|\b\d+(?:\.\d+)?\s*x\b|\b(?:half|double|twice|halve[sd]?)\b/gi;
// Sentence-level commitment frame: the response asserts the magnitude will be achieved.
const FRAME = /\b(?:predict(?:s|ed|ing|ion)?|expect(?:s|ed)?|should|will|must|target(?:s|ing)?|anticipate[sd]?|projected?)\b/i;
// Clause-level stop frame: the magnitude bounds a failure condition, which the skill requires.
const STOP = /\b(?:stop(?:\s+(?:if|when|condition))|roll\s?back|rollback|abort|halt|guardrail|stop conditions?|unless|does not (?:rise|exceed|drop)|not exceed|stays? (?:above|below)|no (?:more|less) than|else\s+roll)\b/i;
// Clause-level scope frame: the magnitude sizes the intervention or sample, not the outcome.
const SCOPE = /\b(?:on|of|to)\s*(?:[≥≤><~]?\s*\d[\d.,–-]*\s*(?:%|percent))\s*(?:of\s+)?(?:the\s+)?(?:traffic|clients?|items?|jobs?|requests?|users?|slice|sample|batch|volume)\b|\b(?:slice|sample|subset|pilot cohort)\b[^.;]{0,24}\d+\s*%/i;
// Improvement verb applied to an outcome metric.
const GAIN = /\b(?:improv(?:e|es|ed|ement)|increas(?:e|es|ed)|decreas(?:e|es|ed)|reduc(?:e|es|ed|tion)|drop(?:s|ped)?|fall(?:s|en)?|cut(?:s)?|shrink(?:s)?|rise(?:s)?|gain(?:s)?|speed(?:s)? up|fewer|better)\b/i;
// An explicit current value makes a promised delta checkable.
const BASELINE = /\b(?:from|currently|today|baseline of|current(?:ly)? at|measured at|now)\s*[≥≤><~]?\s*\d+(?:\.\d+)?\s*(?:%|percentage points?|pp\b)|\bfrom\s+\d[\d.,]*\s*(?:to|→)\s*\d/i;

const text = doc => {
  const p = doc.parsed;
  if (p && typeof p === 'object') return [p.decision, p.answer].filter(s => typeof s === 'string').join(' ');
  const r = doc.response;
  if (r && typeof r.response === 'string') return r.response;
  if (typeof doc.raw?.response === 'string') return doc.raw.response;
  return '';
};

function claims(body) {
  const out = [];
  for (const sentence of body.split(/(?<=[.])\s+|\n+/)) {
    if (!sentence.trim()) continue;
    const framed = FRAME.test(sentence);
    for (const clause of sentence.split(/;/)) {
      MAGNITUDE.lastIndex = 0;
      const first = MAGNITUDE.exec(clause);
      if (!first) continue;
      const magnitudes = clause.match(MAGNITUDE);
      // A stop condition only exempts a magnitude that falls inside its scope, i.e. the
      // marker opens the clause. A trailing mention of guardrails does not launder a
      // gain promise made earlier in the same clause.
      const stop = STOP.test(clause.slice(0, first.index)), scope = SCOPE.test(clause), gain = GAIN.test(clause);
      const rule = stop ? 'stop-condition' : scope ? 'intervention-scope' : !gain ? 'no-gain-verb'
        : !framed ? 'unframed' : 'unsupported-gain';
      out.push({
        clause: clause.trim().replace(/\s+/g, ' '),
        magnitudes: [...new Set(magnitudes.map(m => m.replace(/\s+/g, ' ').trim()))],
        rule,
        baseline_stated: BASELINE.test(clause),
        flagged: rule === 'unsupported-gain' && !BASELINE.test(clause),
      });
    }
  }
  return out;
}

const dirs = process.argv.slice(2);
if (!dirs.length) throw Error('Supply at least one evidence directory');
const report = {
  tool: 'numeric-promise',
  detects: 'A proportional gain magnitude asserted under a commitment frame, with no stated baseline and outside a stop condition or intervention-scope clause.',
  rules: {
    'unsupported-gain': 'FLAGGED: commitment frame + improvement verb + proportional magnitude, no baseline.',
    'stop-condition': 'Exempt: magnitude bounds a failure/stop condition.',
    'intervention-scope': 'Exempt: magnitude sizes the sample or intervention, not the outcome.',
    'no-gain-verb': 'Exempt: magnitude is not attached to an improvement claim.',
    unframed: 'Exempt: no commitment frame; magnitude is proposed, not promised.',
  },
  inputs: dirs,
  by_version: {},
  by_case: {},
  findings: [],
  exempt_sample: [],
};

for (const dir of dirs) {
  for (const file of fs.readdirSync(dir).sort()) {
    if (!/^(candidate-\d+|generalization-[\w-]+)\.json$/.test(file)) continue;
    const doc = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    const body = text(doc);
    if (!body) continue;
    const label = doc.version || doc.request?.version || 'probe';
    const key = `${path.basename(dir)}::${label}`;
    const bucket = report.by_version[key] ??= { responses: 0, flagged_responses: 0, flagged_claims: 0 };
    bucket.responses++;
    const found = claims(body);
    const flagged = found.filter(c => c.flagged);
    if (flagged.length) {
      bucket.flagged_responses++;
      bucket.flagged_claims += flagged.length;
      const caseKey = `${label}::${doc.case || 'probe'}`;
      report.by_case[caseKey] = (report.by_case[caseKey] || 0) + 1;
      for (const c of flagged) report.findings.push({ dir: path.basename(dir), id: doc.id || file.replace('.json', ''), version: label, case: doc.case || null, seed: doc.seed ?? null, ...c });
    }
    for (const c of found) if (!c.flagged && report.exempt_sample.length < 40) report.exempt_sample.push({ id: doc.id || file.replace('.json', ''), version: label, rule: c.rule, clause: c.clause.slice(0, 120) });
  }
}
for (const b of Object.values(report.by_version)) b.rate = `${b.flagged_responses}/${b.responses}`;
process.stdout.write(JSON.stringify(report, null, 2) + '\n');
