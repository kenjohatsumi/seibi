# Changelog

## v0.3.2 — 2026-09-21

Added task signal-to-noise as a focused lens for recurring process behaviour.
The retune distinguishes outcome-advancing work and necessary guardrail work
from repeated effort that consumes attention without proportional progress. It
keeps task SNR task-relative, does not require a numerical score, preserves
non-blocking adjacent findings without expanding active scope, and directs
analysis toward the structural causes of rework, handoffs, duplicated work,
context switching, and scope diversion.

### Changed
- extended activation, boundary, observation, and causal modelling guidance
  for recurring low-progress process behaviour;
- added the rule **Discover broadly; act narrowly** to leverage and scope
  handling;
- added underlying process signals and guardrail protection to measurement
  guidance without introducing mandatory instrumentation or productivity
  dashboards;
- updated README capability and release version.

### Tests
Added five v0.3.2 forward-test cases covering repetitive review loops,
adjacent discovery, necessary safety work, one-off focus problems, and
repetitive operational workflows. A two-judge quantified comparison scored
v0.3.1 at 32.0/40 (80.0%) and v0.3.2 at 31.0/40 (77.5%); it does not support
claiming a performance improvement. TSN-4, the one-off focus negative control,
failed in both versions through over-activation and remains an open boundary
defect. See [`RETUNING_EVALUATION.md`](RETUNING_EVALUATION.md).

## v0.3.1 — 2026-09-18

Corrected the cost evidence for the v0.3.0 retune. Removed the synthetic
provider-cost scenario and replaced it with a direct base-versus-improved SOP
inference benchmark using identical runtime conditions. Across six scenarios,
v0.3.0 used 22,672 total tokens versus 21,796 for v0.2.0 (+876, +4.02%). No
dollar-cost or token-saving improvement is claimed; the result is a measured
usage comparison whose decision-quality trade-off remains open.

## v0.3.0 — 2026-09-18

Constraint-focused retuning: distinguishes whole-system improvement from local
optimisation, tests candidate governing constraints, considers recovery and
alignment before unnecessary capacity expansion, and reassesses the limiting
factor after successful interventions. Also fixes issue #1 by requiring analysis
records and helper targets to remain explicitly outside the system under
analysis. Existing activation, causal, safety, privacy, and permission
boundaries remain unchanged.

### Tests

Added CF-1–CF-9 forward checks for apparent bottlenecks, utilisation traps,
capacity recovery, non-constraint alignment, constraint migration, falsified
constraint hypotheses, analysis-record containment, expensive-flow priority,
and negative-control behaviour. The Jev-assisted two-pass rubric recorded
+0.85 percentage points on target reasoning, +4.24 points on negative controls,
and +70.50 points on containment. See
[`FORWARD_TESTS.md`](FORWARD_TESTS.md),
[`VALIDATION.md`](VALIDATION.md), and [`RETUNING_EVALUATION.md`](RETUNING_EVALUATION.md).

### Status

Versioned as a backward-compatible minor conceptual retune. Runtime footprint
fell 141 bytes (-1.10%) over v0.2.0.

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
