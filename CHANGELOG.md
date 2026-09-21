# Changelog

## v0.3.3-rc.7 — unreleased remediation candidate

Removes the concrete figure from the Predict step's example. rc.6's one
remaining flagged response read "reopen rate falls from the recorded 18%" on a
case whose prompt contains no numbers: the model took the figure out of the
example and presented it as evidence. The example now shows the binding without
supplying a digit - "reopen rate falls from the rate the supplied log records".

One run against v0.3.1, v0.3.2, rc.4 and rc.6 on fresh seeds:

| measure | v0.3.1 | rc.4 | rc.6 | rc.7 |
| --- | ---: | ---: | ---: | ---: |
| unsupported numerical promises | 20/50 | 17/50 | 3/50 | 0/50 |
| stop conditions, live-experiment cases | 27/30 | 27/30 | 30/30 | 30/30 |
| TSN-3 shadow comparison | 0/10 | 9/10 | 10/10 | 10/10 |
| TSN-3 control preserved | 0/10 | 7/10 | 9/10 | 8/10 |
| guardrail language present | 33/40 | 31/40 | 30/40 | 35/40 |

rc.7 against v0.3.1 on the target defect is p = 8.8e-08, and stop conditions sit
above the baseline rather than below it. All three of rc.6's remaining flags in
this run quote the removed example figure on cases whose prompts contain no
numbers at all; the string does not appear anywhere under rc.7.

Replicated on a second run with fresh seeds. Pooled over both, 100 responses
per version with v0.3.1 regenerated live in each: rc.7 is clean of unsupported
numerical promises 100/100 against v0.3.1's 60/100 (p = 6.7e-15), preserves the
TSN-3 assurance control 15/20 against 0/20 (p = 3.9e-07), and loses nothing on
stop conditions, guardrail language or the activation negative control. It
costs 27.2% more prompt tokens than v0.3.1 and produces responses about 6%
longer.

The four cases the focused harness omits - TSN-4, NC-2, SAFE-1 and SYS-1 - were
re-measured on a new deterministic harness (`evaluation/boundary.mjs`,
`evaluation/boundary-score.mjs`), since they had last been scored by the judges
that missed the numeric defect. rc.7 matches v0.3.1 on all four: declines to
activate 10/10 on both negative controls, refuses to defer the customer-data
finding 10/10 while naming the guardrail exception, keeps retry amplification
hypothetical 9/10, and proposes no instrumentation without stating the
authorisation requirement. The historical TSN-4 over-activation did not
reproduce in any version.

Candidate validation passes. See [`VALIDATION.md`](VALIDATION.md).

## v0.3.3-rc.6 — unreleased remediation candidate

Scopes rc.5's prediction rule to predictions. The rule governs the prediction;
stop conditions and rollback triggers are not predictions and keep their
numbers. Section 7 says so where the stop condition is written, and the
final-output paragraph repeats it.

One run against v0.3.1, v0.3.2, rc.4 and rc.5 on fresh seeds:

| measure | v0.3.1 | rc.4 | rc.5 | rc.6 |
| --- | ---: | ---: | ---: | ---: |
| unsupported numerical promises | 20/50 | 14/50 | 0/50 | 1/50 |
| stop conditions, live-experiment cases | 27/30 | 29/30 | 22/30 | 27/30 |
| TSN-3 shadow comparison | 2/10 | 9/10 | 8/10 | 10/10 |
| TSN-3 control preserved | 0/10 | 9/10 | 5/10 | 8/10 |

rc.6 against v0.3.1 on the target defect is p = 1.2e-06; on stop conditions the
two are identical. The stop-condition measure excludes TSN-3, where the correct
answer is a shadow comparison with the live control retained, so no live
experiment is proposed and no rollback is owed.

## v0.3.3-rc.5 — unreleased remediation candidate

Replaced the condition on the number with a form for the sentence. The Predict
step now says to write the observable, the direction it moves, and the window,
and that a number enters only by quoting one the supplied evidence states,
beside its source.

On the target defect this is complete: 0/50 responses flagged, against v0.3.1
at 16/50 (p = 3.7e-06) and rc.4 at 10/50 (p = 0.0006), within one run.

It overshoots. The absolute phrasing generalised past predictions and took stop
conditions with it: 24/40 responses state one, against v0.3.1's 37/40
(p = 0.0006). Adds `evaluation/stop-conditions.mjs`, which neither existing
scorer could stand in for, so the trade is measured rather than spotted by
hand.

## v0.3.3-rc.4 — unreleased remediation candidate

Defines a threshold as a level the system crosses or holds, and states that a
bound on an unmeasured improvement is a magnitude rather than a threshold. This
closes the wording rc.3 left open, under which the model offered "falls by at
least 10% (direction-based, not magnitude promise)" as a threshold.

Measured over two runs containing both, rc.4 is indistinguishable from rc.3:
25/100 against 27/100, stratified p = 0.44. The loophole survives the
definition. Recorded as tested and ineffective; the wording is kept because it
is correct, not because it is proven.

## v0.3.3-rc.3 — unreleased remediation candidate

Moves the unsupported-numeric instruction out of the final-output cleanup and
into the Predict step, and states it as a construction rather than a
prohibition: give the direction against the observed value, and a proportional
magnitude only where the supplied evidence contains the baseline it is measured
against, cited with it.

This reverses the rc.2 regression. Across the three runs containing both,
stratified by run, chi-square 10.82 on the clean rate, one-tailed p = 0.0005,
common odds ratio 2.37. Against the published baseline the improvement is not
established (p = 0.26).

Adds `evaluation/focused.mjs`, a judge-free harness that runs only the cases
which elicit the defect and spends the budget on seeds, and
`evaluation/assurance.mjs`, a deterministic classifier for assurance
preservation. The generator is not reproducible across runs: byte-identical
v0.3.1 scored 23, 13, 16 and 16 out of 50 on four runs, so every version under
comparison now appears in every run and confirmation means fresh seeds.

## v0.3.3-rc.2 — unreleased remediation candidate

Follow-up to rc.1 testing: require a guardrail exception in proposed parking
rules, retain serious-failure controls during efficiency experiments, and
check final advice for unsupported numerical promises. The evaluation harness
now reads the candidate label from `VERSION` so the recorded version cannot
drift from the source tested.

Re-evaluation is complete. rc.2 passes all five frozen automated gate
conditions and fails direct review of its own retained outputs: six
release-blocking defects, and no measurable reduction in unsupported numerical
promises against either baseline. The assurance-preservation change is
supported; the unsupported-numeric change is not. Release hold remains in
force. See `RETUNING_EVALUATION.md`.

Adds `evaluation/numeric-promise.mjs`, a deterministic offline detector for
unsupported numerical gain promises. Re-scoring both runs finds no detectable
difference between any version (chi-square 0.321, 2 df), and shows the nine-case
suite is underpowered for this defect by roughly an order of magnitude.

## v0.3.3-rc.1 — unreleased remediation candidate

Explicitly excludes ordinary personal focus requests from systems analysis;
consolidates task-SNR guidance; restores completion and guardrail exceptions
for adjacent findings; and preserves alternatives, falsifiers, predictions,
and assurance in short answers. Evaluation pending. No official release.

## v0.3.2 — 2026-09-21 — unreleased, failed candidate validation

**Do not release:** the version test below did not establish improvement and
failed its activation negative control. Preserved as a version test result.

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
