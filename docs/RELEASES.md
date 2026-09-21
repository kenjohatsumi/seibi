# Releases

The full release history, with what changed in each version, is in
[`CHANGELOG.md`](../CHANGELOG.md). This page explains how to read it and
where to find the evidence behind each release.

## Current release

**v0.3.3.** See [`docs/VALIDATION.md`](VALIDATION.md) for its validation
status and [`evidence/releases/v0.3.3/SUMMARY.md`](../evidence/releases/v0.3.3/SUMMARY.md)
for the full release record.

## How releases are made

Every release follows [`RELEASE_SOP.md`](../RELEASE_SOP.md): a candidate is
frozen, classified, tested against selected criteria, checked for
regression against the released baseline, and validated PASS, FAIL, or
BLOCKED before `VERSION`, `CHANGELOG.md`, the release evidence package, and
the Git tag are updated together. A release does not proceed on FAIL or
BLOCKED.

## Release evidence packages

Each released version has an evidence package at
`evidence/releases/<version>/`, containing:

- `SUMMARY.md` — what changed, why, and the validation decision;
- `VALIDATION.md` — the validation result for that version;
- `TEST_RESULTS.md` — the tests run and their outcomes;
- `RELEASE_CHECKLIST.md` — the completed release gate checklist.

Only v0.3.3 has a package in this form. Evidence for earlier versions
predates this structure and is preserved in
[`evidence/history/`](../evidence/history/) instead.

## Candidates that did not release

Several v0.3.3 candidates (rc.1 through rc.6) failed validation and were not
released. Their evidence is preserved, not deleted, in
[`evidence/history/RETUNING_EVALUATION.md`](../evidence/history/RETUNING_EVALUATION.md),
because a future reviewer needs to see what was tried and why it did not
pass, not only what eventually shipped.
