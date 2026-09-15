# Changelog

## v0.2.0 — 2026-09-15

Conceptual retuning: recognizes interaction dynamics, nonlinearity, and
state-dependence alongside the existing stocks/flows/feedback model, without
expanding into general complexity science. Evaluated quantitatively against
v0.1.0 before release; see [`RETUNING_EVALUATION.md`](RETUNING_EVALUATION.md).

### Changed
- opening definition, activation criteria, and MODEL/CHALLENGE/PREDICT/FIND
  LEVERAGE wording retuned to recognize interaction dynamics, nonlinearity,
  accumulated state, and thresholds alongside existing stocks/flows/feedback
  analysis;
- OBSERVE's stocks bullet now notes accumulated state may alter subsequent
  behaviour;
- CHALLENGE requires an interaction-level hypothesis when component behaviour
  could combine to produce the outcome, and warns "emergent" is not itself a
  hypothesis;
- PREDICT may state a threshold or regime change instead of a proportional
  magnitude when more defensible;
- added Klaus Mainzer, *Thinking in Complexity*, to References (SKILL.md) and
  Intellectual foundations (README.md);
- added the "Emergent Interaction" archetype to
  `references/system-archetypes.md`.

### Unchanged
- core loop stages and order;
- activation boundary and narrow scope;
- Default authority/permissions, privacy boundary, instrumentation
  proportionality, confidence scale, and final output template;
- experimental discipline in Recommend/Test and Measure/Update.

### Tests
Evaluated against five forward-test scenarios run on both v0.1.0 and v0.2.0
(three targeting the retuned reasoning, two negative controls). Full method
and results in [`RETUNING_EVALUATION.md`](RETUNING_EVALUATION.md). Summary:
target-reasoning rubric score improved from 14/24 to 21/24 with no regression
on either negative control (12/12 on both versions).

### Status
Public release. Word count remains within the ~2% net growth ceiling set for
this revision.

## v0.1.0 — 2026-09-12

Initial public release candidate.

### Added
- narrow activation rules for recurring/interacting system behaviour;
- evidence-first system analysis;
- stocks, flows, feedback loops, delays, constraints, and leverage analysis;
- competing hypotheses and falsification requirements;
- prediction-before-intervention workflow;
- explicit system-level outcomes and guardrails;
- permission boundary: observe/analyze/recommend by default;
- production changes and new instrumentation require explicit authorization;
- privacy and data-minimization safeguards;
- proportional instrumentation guidance;
- optional persistent models, ledgers, and system archetypes under `references/`;
- realistic end-to-end example;
- specification/rubric validation;
- recorded forward tests;
- numerical experiment stop-condition guidance.

### Status
Public release candidate. No claim is made that v0.1.0 has been validated across
independent production deployments.
