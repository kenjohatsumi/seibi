# Testing

Seibi is tested at three levels. None of them is production evidence; each
tells you something different, and none should be substituted for another.

## 1. Specification and rubric checks

Fixed scenarios checked against the written `SKILL.md` text for the intended
activation rules, causal restraint, instrumentation proportionality, privacy
safeguards, and production-permission boundaries. A PASS here means the
specification contains the intended safeguard, not that the behaviour has
been proven in a real deployment.

## 2. Forward tests

Representative prompts run through Seibi instructions, with the resulting
analysis reviewed against the intended behaviour. These show what the method
actually produces for a prompt, not just what the specification says it
should produce.

## 3. Quantitative retuning evaluation

Before/after comparisons between versions: fixed cases, a stated model,
temperature, and seed, and either model judges or a deterministic scorer.
Used to decide whether a candidate may be released. See
[`RELEASE_SOP.md`](../RELEASE_SOP.md) for the release gate this evidence
feeds.

Two lessons from this evaluation programme, recorded because they shape how
results should be read:

- **Model judges can be blind to the defect under test.** A generation
  harness that scored zero guardrail violations under two model judges still
  produced release-blocking outputs on direct review. Deterministic,
  reproducible scorers (`evaluation/*.mjs`) replaced judge opinion wherever
  the target defect could be defined mechanically.
- **The response generator is not reproducible across runs**, even at
  temperature 0 with fixed seeds. Every version under comparison is
  regenerated in every run; a result is confirmed only by repeating it on
  fresh seeds, not by comparing against a number quoted from an earlier run.

## Where the evidence lives

- **Current release evidence** — the validation package for the version you
  are looking at is under
  [`evidence/releases/<version>/`](../evidence/releases/). Start with
  `SUMMARY.md` there.
- **Full historical record** — every candidate, including failed and
  superseded ones, with raw scenarios, outputs, and statistics, is preserved
  under [`evidence/history/`](../evidence/history/):
  `VALIDATION.md` (specification/rubric checks across all versions),
  `FORWARD_TESTS.md` (recorded forward tests), and
  `RETUNING_EVALUATION.md` (the full quantitative evaluation record,
  including the remediation programme behind v0.3.3).
- **Executable harnesses** — [`evaluation/`](../evaluation/) contains the
  scripts referenced above (`focused.mjs`, `boundary.mjs`,
  `numeric-promise.mjs`, `assurance.mjs`, `stop-conditions.mjs`,
  `boundary-score.mjs`, `remediation.mjs`).

## Limits that apply to all three levels

- Synthetic tests are not production evidence.
- One model does not establish cross-model reliability.
- Small samples do not establish statistical generality.
- Model-judge scores can vary run to run on byte-identical source.
- Token measurements do not establish cost-effectiveness.
- Specification checks do not establish runtime behaviour.

Public release should still include pilot use on representative real tasks
and review of false-positive activation, recommendation quality, and
permission compliance.
