# Release summary — v0.3.3

Recorded under [`RELEASE_SOP.md`](../../../RELEASE_SOP.md) section 12.

- **Version:** v0.3.3
- **Previous release:** v0.3.1 (v0.3.2 was developed but failed candidate
  validation and was never released; see
  [`evidence/history/RETUNING_EVALUATION.md`](../../history/RETUNING_EVALUATION.md))
- **Candidate identifier and commit:** rc.7, released unchanged as v0.3.3
- **Date:** 2026-09-21
- **Change classes:** REF, BEH

## Purpose

Remove the release-blocking defect present in every v0.3.3 candidate since
rc.1: `SKILL.md` produced unsupported numerical promises in recommendations,
and failed to preserve necessary assurance under task signal-to-noise
pressure (the TSN-3 case).

## Important changes

The rc.7 change removed a concrete figure from the Predict step's worked
example. Under rc.6, the model copied that figure into predictions on cases
whose prompts contained no numbers at all — the last source of the defect
traced across the rc.1–rc.6 remediation rounds. Removing it, and rewording
the example to bind the prediction to "the rate the supplied log records"
instead of a digit, was the entire rc.7 change.

## Tests performed

- Specification and rubric checks (12 scenarios) — see
  [`VALIDATION.md`](VALIDATION.md).
- Nine deterministic forward-behaviour cases (TSN-1–5, NC-2, NC-3, SAFE-1,
  SYS-1), 360 retained responses across two runs, scored by
  `evaluation/focused.mjs` and `evaluation/boundary.mjs` rather than by model
  judges — see [`TEST_RESULTS.md`](TEST_RESULTS.md).
- Regression check against the v0.3.1 released baseline, regenerated live in
  every run.

## Validation result

**PASS.** See [`VALIDATION.md`](VALIDATION.md) for the full result and
statistics.

## Known limitations

- Synthetic tests are not production evidence.
- One model does not establish cross-model reliability.
- Small samples do not establish statistical generality.
- Model-judge scores can vary run to run on byte-identical source; this is
  why the release-deciding cases use deterministic scorers instead.
- Token measurements do not establish cost-effectiveness. Measured cost:
  27.2% more prompt tokens than v0.3.1, responses about 6% longer.
- Specification checks do not establish runtime behaviour.

## Supporting evidence

- [`VALIDATION.md`](VALIDATION.md) — this release's validation result.
- [`TEST_RESULTS.md`](TEST_RESULTS.md) — tests run and outcomes.
- [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md) — the completed release
  gate.
- [`CHANGELOG.md`](../../../CHANGELOG.md) — the public changelog entry.
- [`evidence/history/RETUNING_EVALUATION.md`](../../history/RETUNING_EVALUATION.md) —
  the full remediation programme across rc.1–rc.7, including failed
  candidates.
