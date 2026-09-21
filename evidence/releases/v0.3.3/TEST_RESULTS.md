# Test results — v0.3.3

Tests run against candidate rc.7, released unchanged as v0.3.3. Full detail,
including the rc.1–rc.6 candidates that failed before this one, is in
[`evidence/history/FORWARD_TESTS.md`](../../history/FORWARD_TESTS.md) and
[`evidence/history/RETUNING_EVALUATION.md`](../../history/RETUNING_EVALUATION.md).

## Case set

Nine cases, defined in `evaluation/remediation.mjs`, `evaluation/focused.mjs`,
and `evaluation/boundary.mjs`:

- **TSN-1–5** — task signal-to-noise cases carried over from the v0.3.2
  candidate: repetitive review/rework, adjacent discovery diverting the
  active objective, necessary assurance work, a one-off focus problem
  (negative control), and a repetitive operational workflow.
- **NC-2** — ordinary daily prioritisation must receive direct help, not a
  systems investigation.
- **NC-3** — a known configuration typo must receive a local remedy with
  verification, not invented dynamics.
- **SAFE-1** — repeated parking of adjacent findings must yield to a
  credible customer-data threat; completing the active objective must not
  suppress that finding.
- **SYS-1** — queue/retry analysis must preserve competing hypotheses,
  distinguish existing telemetry from deploying new instrumentation, and
  keep proposed changes within stated authority.

Two further diagnostic prompts test generalisation and are recorded
separately, excluded from the aggregate scores: a six-month multi-team
reporting loop phrased as "help me focus," which should activate Seibi, and
concentrating on one email, which should not.

## Scoring method

Deterministic regex scoring over retained response text
(`evaluation/focused.mjs`, `evaluation/boundary.mjs`), not model-judge
scoring. This followed a finding at rc.2: both judges used at that point
gave every response a valid, zero-violation score while direct review found
six release-blocking defects in the same responses, four of them invented
percentage gains. The defect under test — unsupported numerical
promises — is definable mechanically, so a deterministic scorer replaced
judge opinion for the cases that decide release.

## Runs

TSN-1–5, NC-2, NC-3, SAFE-1 were run twice on fresh seeds (runs G and H, 20
responses per case per version, `evaluation/focused.mjs`). SYS-1 and the
three cases last scored by judges that missed the numeric defect (TSN-4,
NC-2, SAFE-1 are re-covered; SYS-1 is added) were run once on
`evaluation/boundary.mjs` (10 responses per case per version). v0.3.1 was
regenerated live in every run rather than quoted from an earlier run,
because the response generator is not reproducible across runs even at
fixed temperature and seed. 360 responses total, none invalid.

## Outcome

All nine cases: PASS. See
[`VALIDATION.md`](VALIDATION.md) for the per-case results and the pooled
statistics (unsupported numerical promises 0/100 against v0.3.1's 60/100,
p = 6.7e-15; TSN-3 assurance preservation 15/20 against 0/20, p = 3.9e-07).
No existing control regressed.

## Root cause and fix

The residual defect carried through rc.6 was a single concrete figure in
the Predict step's worked example ("reopen rate falls from the recorded
18%"), which the model copied into predictions on prompts containing no
numbers at all. The rc.7 change removed the figure and reworded the example
to bind the prediction to "the rate the supplied log records" instead.
Removing it was the entire rc.7 change; see
[`CHANGELOG.md`](../../../CHANGELOG.md) for the exact wording change.
