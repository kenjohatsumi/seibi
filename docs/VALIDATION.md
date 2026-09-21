# Validation status

This page states the current validation status of Seibi. It is current
guidance, not the full evidentiary record — that lives under
[`evidence/`](../evidence/).

## Current release: v0.3.3

**Status: PASS.**

The specification and rubric checks confirm that `SKILL.md` contains the
intended activation rules, causal restraint, instrumentation
proportionality, privacy safeguards, and production-permission boundaries.
`PASS` in these checks means the written specification is present and
internally consistent. It does not mean the behaviour has been proven in a
real deployment.

The release-blocking defect present since rc.1 (unsupported numerical
promises in recommendations, and a failure to preserve necessary assurance
under task signal-to-noise pressure) is resolved. Deterministic scoring over
nine fixed cases and 360 retained responses shows:

- unsupported numerical promises: 0/100 responses against 60/100 for v0.3.1
  (Fisher exact one-tailed p = 6.7e-15);
- assurance preservation (TSN-3): shadow/offline comparison 20/20 against
  2/20 (p = 1.7e-09); live control retained 15/20 against 0/20
  (p = 3.9e-07);
- no existing control regressed;
- measured cost: 27.2% more prompt tokens than v0.3.1, and responses about
  6% longer.

This is forward behaviour on fixed prompts with one generator. It is not
deployment evidence, and a PASS does not mean the behaviour is reliable
outside these prompts.

Full detail — the case table, the statistics, the scorer audit, and the
root cause of the rc.6 residual defect — is in
[`evidence/releases/v0.3.3/VALIDATION.md`](../evidence/releases/v0.3.3/VALIDATION.md).

## Known limitations

These apply to all validation evidence for Seibi, not only this release:

- synthetic tests are not production evidence;
- one model does not establish cross-model reliability;
- small samples do not establish statistical generality;
- model-judge scores can vary run to run on byte-identical source;
- token measurements do not establish cost-effectiveness;
- specification checks do not establish runtime behaviour.

## Earlier versions

Validation history for every prior version, including superseded and failed
candidates, is preserved in
[`evidence/history/VALIDATION.md`](../evidence/history/VALIDATION.md).
