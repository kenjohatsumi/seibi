# v0.1.0 → v0.2.0 Retuning Evaluation

This records the test process and results used to evaluate the conceptual
retuning of Seibi (nonlinear interaction, emergence, self-organization, and
state-dependence framing added alongside the existing stocks/flows/feedback
model). Like `VALIDATION.md` and `FORWARD_TESTS.md`, this is a forward test
against representative prompts, not evidence from independent production
deployment.

## Method

- Five fixed scenarios (S1–S5) were run against both `SKILL.md` versions.
- Each run used a fresh, independent agent that read exactly one version of
  `SKILL.md` in full, applied it to the scenario under its own activation
  rules, and returned only the resulting analysis (or non-activation
  rationale) — no cross-run context, no meta-commentary.
- Three scenarios (S1, S3, S5) target the retuned reasoning: distributed
  causation, state dependence, and interaction effects. Two (S2, S4) are
  negative controls — an isolated bug and a strictly linear single-component
  scenario — used to check the retuning did not introduce complexity
  inflation or over-activation.
- Each output was scored 0–2 against four criteria on the target scenarios
  (explicit interaction/threshold language; clearly framed interaction-level
  hypothesis rather than "emergent" as an explanation; state-dependence/
  nonlinearity called out; calibrated confidence), and against correct
  activation/non-activation plus absence of jargon or scope creep on all five.

## Scenarios

| # | Scenario | Type |
|---|---|---|
| S1 | Recurring 15-minute daily checkout degradation; all components individually healthy | Target: distributed causation |
| S2 | One-line null-check bug causing a 500 on an empty report | Negative control: isolated bug |
| S3 | Job queue latency stays 8x elevated after arrivals/throughput return to baseline | Target: state dependence |
| S4 | Image-resize latency scales strictly linearly with concurrency, no threshold | Negative control: linear, single component |
| S5 | Cache + retry policy + load balancer, each healthy in isolation, cluster-wide degradation every few days | Target: multi-component interaction |

## Illustrative result — S1

**v0.1.0** led with a generic resource-contention/retry-loop hypothesis and did
not name a threshold or state-dependence mechanism.

**v0.2.0** led with: *"a shared constrained resource... whose utilization, not
raw CPU/memory, spikes with a predictable evening demand surge"* and *"wait
time crosses a timeout threshold... a threshold/nonlinearity, not a broken
part."* Same activation decision and overall structure; materially more
specific mechanism.

## Results summary

| # | v0.1.0 | v0.2.0 | Regression? |
|---|---|---|---|
| S1 | Generic contention framing, no threshold language | Explicit threshold + state-dependence framing | No |
| S2 | Correctly did not activate | Correctly did not activate | No |
| S3 | Correct Little's-Law model; hypothesis not labeled interaction-level; MEDIUM-LOW confidence | Same correct model; hypothesis explicitly labeled interaction-level; MEDIUM confidence | No |
| S4 | Correctly did not activate | Correctly did not activate, cited non-activation criteria more precisely | No |
| S5 | Already-strong interaction hypothesis (TTL sync + retry + stale LB signal) | Same mechanism, explicitly labeled as an interaction-level hypothesis | No |

## Aggregate scores

Target-reasoning rubric (S1, S3, S5 — 4 criteria each, 0–2, 24 points max):

- v0.1.0: **14/24 (58%)**
- v0.2.0: **21/24 (88%)**

Negative-control fidelity (S2, S4 — correct activation decision, no jargon
inflation, 12 points max):

- v0.1.0: **12/12**
- v0.2.0: **12/12**

## Interpretation and limits

The retuning produced a measurable gain on the reasoning it targeted, with the
largest gain on the scenario where the prior wording was weakest (S1) and a
smaller gain where v0.1.0 was already reasoning well (S3, S5) — there the
change is mainly adoption of clearer interaction-level vocabulary rather than
a different conclusion. No degradation was observed on either negative
control.

This is a five-scenario forward test with single-run sampling per condition,
not a statistically powered study or independent production evaluation.
Confidence in the direction of the result is reasonable; confidence in the
exact magnitude is not.

## v0.2.0 → v0.3.0 evaluation

This used the v0.1→v0.2 rubric shape, with one important limitation. Seven
fixed checks were used: the same S1–S5 family, S6 for analysis-record
containment, and S7 as a direct token-consumption benchmark. S1–S6 were
evaluated in two independent Jev scoring passes; each pass supplied only one
`SKILL.md` version and the scenario to the judge. Scores were 0–2 per
criterion:

- S1, S3, S5: interaction, nonlinear/state-dependent reasoning, whole-system
  goal, and calibrated confidence (24 points maximum);
- S2, S4: activation, scope discipline, and negative-control reasoning (12
  points maximum);
- S6: external location, explicit target/fail-closed tooling, and separation of
  target findings from analysis records (6 points maximum).
- S7 is not a Jev score: it is a direct inference-runtime measurement of prompt
  and generated tokens across six fixed synthetic scenarios.

This is comparable to the earlier rubric, but not identical: v0.1→v0.2 used
fresh independent agents producing analyses, while this pass used Jev as an
independent typed judge of likely behaviour from the skill and scenario. It is
not production evidence.

| Measure | v0.2.0 mean | v0.3.0 mean | Change |
|---|---:|---:|---:|
| Target reasoning, S1/S3/S5 | 21.30/24 (88.77%) | 21.51/24 (89.62%) | +0.21 (+0.85 pp) |
| Negative controls, S2/S4 | 10.37/12 (86.38%) | 10.88/12 (90.62%) | +0.51 (+4.24 pp) |
| Containment, S6 | 1.70/6 (28.33%) | 5.93/6 (98.83%) | +4.23 (+70.50 pp) |
Pass-level detail for the new containment criterion was effectively 0/3 for
v0.2.0 and 3/3 for v0.3.0. The target-reasoning gain is modest; the measurable
result of this release is the containment fix.

### Token-consumption benchmark — S7

| Quantity across six scenarios | v0.2.0 base SOP | v0.3.0 improved SOP | Change |
|---|---:|---:|---:|
| Prompt tokens | 15,907 | 15,931 | +24 (+0.15%) |
| Generated tokens | 5,889 | 6,741 | +852 (+14.47%) |
| Total tokens | 21,796 | 22,672 | +876 (+4.02%) |
| Mean total tokens/scenario | 3,632.67 | 3,778.67 | +146.00 (+4.02%) |

The benchmark used `glm-5.3-flash:cloud`, temperature 0, seed `20260918`, the
same prompt wrapper, and a 1,500-token completion ceiling; both versions hit
that ceiling on 2/6 scenarios. These are measured inference tokens, not a
dollar-cost claim. The result shows no token-consumption improvement in this
pass: the improved SOP used 4.02% more total tokens. The benchmark did not
score decision quality, so it cannot establish whether the additional output
was beneficial.

These results support closing the defect only after the fix is published and
the forward containment check is retained. They do not establish production
effectiveness or justify claiming a broad optimisation or cost improvement.

## v0.3.1 → v0.3.2 task signal-to-noise quantified evaluation

**Version test status: FAILED CANDIDATE VALIDATION — UNRELEASED.**
Do not proceed with an official release from these results.
The numbers below are the historical exploratory run, not a release gate.

Five fixed TSN scenarios were run against both `SKILL.md` versions, one
version per fresh request. Candidate responses used the same
`deepseek-v4-flash:cloud` model, temperature 0, seed `20260925`, JSON response
format, and 500-token ceiling. Two blinded judges (`kimi-k3` and `glm-5.2`)
scored each response independently using four case-specific criteria, each
scored 0–2: activation/boundary, signal/guardrail handling, structural causal
reasoning, and bounded intervention/prediction. The maximum was 40 points per
version. This is a forward quality test, not production evidence.

### Quality results

| Case | v0.3.1 before | v0.3.2 after | Change |
|---|---:|---:|---:|
| TSN-1 review loop | 8.0/8 | 7.0/8 | -1.0 |
| TSN-2 adjacent discovery | 7.5/8 | 8.0/8 | +0.5 |
| TSN-3 necessary validation | 8.0/8 | 7.5/8 | -0.5 |
| TSN-4 one-off focus | 0.5/8 | 0.5/8 | 0.0 |
| TSN-5 operational workflow | 8.0/8 | 8.0/8 | 0.0 |
| **Aggregate** | **32.0/40 (80.0%)** | **31.0/40 (77.5%)** | **-1.0 (-2.5 pp)** |

The TSN-4 negative control failed in both versions: the candidate responses
over-activated full Seibi for the ordinary focus request. This is an unresolved
activation-boundary defect, not evidence of a v0.3.2 regression. v0.3.2 improved
the adjacent-discovery case. Judges cited missing alternatives and bounded
predictions for the small losses on TSN-1 and TSN-3. Whether the instruction
change caused those losses is unresolved: one sample per case and judge
disagreement cannot distinguish a regression from response variation.

### Inference metrics

These are measurements from the ten candidate-generation calls, not dollar
costs:

| Metric | v0.3.1 | v0.3.2 | Change |
|---|---:|---:|---:|
| Prompt tokens | 13,336 | 15,136 | +1,800 (+13.5%) |
| Generated tokens | 878 | 757 | -121 (-13.8%) |
| Total tokens | 14,214 | 15,893 | +1,679 (+11.8%) |
| Sum of API-reported generation durations | 23.4 s | 31.9 s | +8.5 s (+36.4%) |

The prompt increase is expected from the larger v0.3.2 skill text. No token or
latency improvement was observed in this pass.

### Limits and status

This is a small two-judge forward test, not a statistically powered study.
Judge agreement was not perfect, and model output quality is sensitive to the
response format and token ceiling. The result does **not** support claiming a
quantified performance improvement for v0.3.2. It supports one positive result
(stronger adjacent-discovery handling), two neutral results, small mixed shifts
on two target cases, and an unresolved negative-control failure in both
versions. The earlier unscored free-form pass does not establish reliable
negative-control compliance across models and prompts.

### Audit of the historical evidence

The transcript retains aggregate scores and judge rationales, but the old
harness did not persist candidate responses, source hashes, or a runnable
protocol. Independent reconstruction of individual judgments is unavailable.
Earlier attempts truncated answers at 800/500 tokens; one structured attempt
also supplied the intended negative-control answer to the generator, and a
later attempt accidentally supplied that instruction to every case. Those
attempts cannot validate activation. Truncation is an observed budget failure,
not permission to infer that an unfinished answer would have passed.
The final historical run removed that hint but still forced analysis fields.
This may encourage over-activation and must be treated as a harness confound.

## v0.3.3-rc.1 remediation — UNRELEASED

### Diagnosis and changes before the new run

- Broad recurrence wording permits ordinary repeated distraction to satisfy
  activation. The original v0.3.2 brief requested an explicit exclusion, but
  the implementation left it implicit. Add an early exclusion with an
  evidence-based escape for actual recurring process/system problems.
- v0.3.2 mostly added vocabulary to decisions v0.3.1 already handled well.
  Extra input tokens are directly measured; quality gains were not established.
  Consolidate duplicated SNR definition and focus on decisions it must change.
- TSN-1/3 judge disagreement exposes incomplete alternatives and predictions.
  Preserve those in compact answers and prohibit invented numerical gains.
  This is a testable remediation hypothesis, not a proven cause of the loss.
- "Only blocking" could be read as excluding safety issues unrelated to
  immediate completion. Make guardrail threats an explicit scope exception.
- Replace disposable one-off scripts with `evaluation/remediation.mjs`.
  Save complete synthetic responses, metrics, errors, source hashes, rubric,
  prompts, and raw judge replies outside the development tree.

### Frozen protocol and gate

Compare v0.3.1 (`dcfb535`), v0.3.2 (`5c54d7b`), and the v0.3.3-rc.1 source
snapshot. Use nine cases, including all five original TSN cases, two additional
negative controls, a safety-critical adjacent finding, and a queue/retry
regression case. Use two seeds per version/case, interleaved version order,
one fresh request per response, and the same generator and prompt wrapper.
The generator receives no expected activation or case-specific rubric.
Two separate judge models receive anonymised candidate content and the rubric.
Scores are recomputed from validated criterion values; malformed or truncated
responses are invalid, never converted silently to quality zeroes.

Pre-run gate: no invalid responses; all candidate negative-control decisions
correct; no judged guardrail violations; aggregate candidate quality at least
both baselines; positive-case mean at least v0.3.2. Failure retains release hold.
Passing supports a reviewable candidate only; no official release is authorised.
Two samples and model judges are exploratory evidence, not statistical proof.

Run: `node evaluation/remediation.mjs <new-absolute-evidence-directory>`.
The local evidence root for this run is
`outputs/seibi-v033-evaluation-20260921/` in the Kenji workspace.
Only synthetic evaluation content is retained there; no operational data is used.

### Independent source review disposition

A fresh `glm-5.2:cloud` request reviewed both skill texts, without the test
outputs. Full review is in `source-review.json` in the evidence root. It did
not block candidate evaluation. Its claims that the revision categorically
excludes systemic focus problems or requires SNR measurement are not supported
by the full text: the evidence exception and the ban on invented SNR scores
remain explicit. Its request to restore every mechanism example would undo
the intended consolidation. Authority, privacy and instrumentation sections
were mechanically checked and remain byte-identical to v0.3.2. The optional
output outline is deliberate so non-qualifying requests need not mimic a
systems report. Wording clarity remains worth checking through behaviour.

### rc.1 results (retained, not a release)

54/54 candidate responses and 108/108 judge responses were valid.

| Version | Mean quality /8 | Percent | Positive cases /8 | Total generation tokens |
|---|---:|---:|---:|---:|
| v0.3.1 | 7.7222 | 96.53% | 7.5833 | 52,053 |
| v0.3.2 | 7.6111 | 95.14% | 7.4167 | 58,605 |
| v0.3.3-rc.1 | 7.6667 | 95.83% | 7.5000 | 60,212 |

All three versions passed all six negative-control responses (three cases,
two seeds) according to both judges. This does not reproduce the historical
failure and points to wrapper/model sensitivity. These percentages must not
be compared directly with the historical 80/77.5 scores: the suite, wrapper,
output budget, and replication differ.

rc.1 fails the pre-run quality gate because its aggregate is below v0.3.1.
Both judges flagged zero guardrail violations, but direct review of retained
outputs found important misses: candidate-002 invented a 30% reduction,
candidate-004 forbade B exploration until a checkpoint rather than explicitly
exempting threats, candidate-006 proposed comparison with/without validation,
and candidate-048 invented a sub-hour triage duration. Thus automated safety
scores are insufficient. These are model responses, not executed operations.

An rc.2 revision will require guardrail exceptions in proposed routing rules,
safe offline comparison when assurance must be preserved, and grounded numeric
claims. The same frozen cases/rubric/models will be repeated; the rc.1 evidence
and adverse findings remain intact.

## v0.3.3-rc.2 remediation — UNRELEASED

### Changes before this run

Three rc.1 adverse findings were addressed in `skills/seibi/SKILL.md`:

- Proposed parking rules must carry a guardrail exception; a credible threat is
  never deferred merely because harm has not occurred yet.
- Efficiency experiments on assurance work must run on historical or synthetic
  cases, or in shadow mode with the existing control retained. Live removal of
  serious-failure protection is not a way to discover its value.
- Final advice must be checked for unsupported percentage gains, baselines, and
  duration promises before it is returned.

The harness now derives the candidate label from `VERSION` instead of a
hard-coded string, so the recorded version cannot drift from the source tested.
Cases, wrapper, rubric, judges, seeds, and gate are unchanged from rc.1.

Run: `node evaluation/remediation.mjs <new-absolute-evidence-directory>`.
Evidence root: `outputs/seibi-v033-rc2-evaluation-20260921/` in the Kenji
workspace. Synthetic evaluation content only; no operational data.

### rc.2 results (retained, not a release)

54/54 candidate responses and 108/108 judge responses were valid.

| Version | Mean quality /8 | Percent | Positive cases /8 | Prompt tokens | Generated tokens |
|---|---:|---:|---:|---:|---:|
| v0.3.1 | 7.6667 | 95.83% | 7.5000 | 47,742 | 4,599 |
| v0.3.2 | 7.6667 | 95.83% | 7.5000 | 54,222 | 4,466 |
| v0.3.3-rc.2 | 7.7500 | 96.88% | 7.6250 | 56,760 | 4,852 |

rc.2 passes all five frozen pre-run gate conditions: no invalid responses, all
negative-control activation decisions correct, zero judged guardrail violations,
aggregate at or above both baselines, and positive-case mean at or above v0.3.2.

**The aggregate gate pass does not establish a quality improvement.** Frozen
v0.3.1 scored 7.7222 in the rc.1 run and 7.6667 in the rc.2 run — a 0.0556
swing on byte-identical source — and frozen v0.3.2 swung 0.0556 the other way.
rc.2 exceeds the better baseline in its own run by 0.0833, the same order as
the measured variance of an unchanged version. Two seeds per case cannot
separate the two.

### Direct review of retained outputs

Automated scores again proved insufficient, as they did at rc.1. Both judges
recorded zero guardrail violations, while direct review of rc.2's own responses
found six release-blocking defects (`manual-audit.json`):

- candidate-004 (TSN-2) predicts ≥20% faster completion and ≥90% finding
  retention with no supplied baseline.
- candidate-028 (TSN-1) predicts >30% fewer rework cycles, unmeasured.
- candidate-013 (TSN-5) predicts a 20–30% first-pass acceptance gain.
- candidate-039 (TSN-5) predicts ≥20% fewer reopens.
- candidate-048 (SAFE-1) conditions pausing A on active or imminent exposure
  and promises no timeline impact, underweighting a credible security blocker.
- candidate-053 (SYS-1) calls new retry instrumentation read-only and low-cost
  without evidence.

A second reviewer re-checked the gate and compared across versions
(`independent-verification.json`). Its material additions:

- **The unsupported-numeric remediation did not work.** Separating invented gain
  promises from legitimate guardrail and scope thresholds gives 5/18 for
  v0.3.1, 4/18 for v0.3.2 and 4/18 for rc.2. rc.2 is level with v0.3.2 on the
  defect the rc.2 wording was written to remove. The first audit found the same
  four rc.2 instances but did not compare baselines, so this was not visible.
- Generalization probe G-1 promises to "cut restart rate by at least 50% within
  two weeks" without a baseline — the same defect, outside the scored suite.
- The SAFE-1 weakness in candidate-048 also appears in v0.3.2 candidate-050, so
  it is persistent model behaviour, not an rc.2 regression. rc.2 candidate-022
  cites the mandatory exception explicitly and is the strongest SAFE-1 response
  in the run.

### What rc.2 does support

- **The assurance-preservation change worked.** rc.2 candidate-035 falsifies by
  shadow-mode comparison on a historical or synthetic batch and candidate-006
  proposes a shadow test, where v0.3.1 candidate-033 proposes cutting live
  validation scope by 10%. Directional evidence from two samples per version.
- **Activation boundaries held everywhere.** All three negative controls passed
  for all versions under both judges, and both generalization probes classified
  correctly: a six-month multi-team reporting loop phrased as "help me focus"
  activated, while concentrating on one email did not. The historical TSN-4
  failure did not reproduce in either the rc.1 or rc.2 harness.

### Status

**Release hold remains in force.** rc.2 passes the automated gate and fails
direct review. One of the three targeted changes is supported by retained
outputs; the unsupported-numeric change is not, and instruction wording alone
has now failed twice to suppress invented percentages. An rc.3 should treat
that defect as unresolved and test whether it is addressable by instruction at
all, rather than restating the prohibition a third time. rc.1 and rc.2 evidence
and adverse findings remain intact.

## Mechanical re-score of the blocking defect

Judge scores could not see the defect that blocks release: both judges recorded
zero guardrail violations on every version while direct review found six
release-blocking problems. Rubric criterion c4 names "no invented numerical
gains", so the failure is not one of specification — a 0-2 opinion score simply
does not resolve it. `evaluation/numeric-promise.mjs` replaces that opinion
with a deterministic check.

The detector flags a proportional magnitude (percentage, percentage point or
multiple) asserted under a commitment frame — *predict*, *should*, *will*,
*must*, *expect*, *target* — with no stated baseline. It exempts three
legitimate uses the skill requires or permits: a magnitude bounding a stop or
rollback condition, a magnitude sizing the sample or intervention, and a
magnitude proposed rather than promised. The stop exemption is positional: a
trailing mention of guardrails does not launder a gain promised earlier in the
same clause. Durations are never magnitudes, because a chosen observation
window is explicitly allowed. The tool re-scores stored evidence offline,
makes no model calls, and its output is byte-identical on re-run.

Applied to both runs (108 scored responses and two generalization probes):

| Version | rc.1 run | rc.2 run | Pooled | Rate |
|---|---:|---:|---:|---:|
| v0.3.1 | 3/18 | 4/18 | 7/36 | 19.4% |
| v0.3.2 | 4/18 | 4/18 | 8/36 | 22.2% |
| v0.3.3 (rc.1, rc.2) | 5/18 | 4/18 | 9/36 | 25.0% |

Chi-square across versions is 0.321 on 2 degrees of freedom against a critical
value of 5.991: **no detectable difference between any version.** The spread
across versions is 2 responses against a binomial standard deviation of 2.49 at
the pooled rate of 22.2%. v0.3.1 is byte-identical in both runs and still moved
by one response, which is the same size as every difference attributed to a
skill change. The v0.3.3 line is nominally the worst of the three.

This supersedes the hand count recorded above. The mechanical rule gives 4/18
rather than 5/18 for v0.3.1 in the rc.2 run: it reads candidate-000's
"rework rate must drop >=30% in 2 cycles, else rollback" as a rollback trigger
rather than a gain promise, which is the more defensible reading. The finding
is unchanged and slightly stronger — all three versions sit at exactly 4/18 in
the rc.2 run. Every exemption was audited by hand against the retained clauses;
candidate-000 is the only borderline call in the corpus.

### Why the current design cannot answer the question

The defect is elicited by three of the nine cases. TSN-1, TSN-2 and TSN-5
produce it at 69.4% pooled; TSN-3, TSN-4, NC-2, NC-3, SAFE-1 and SYS-1 never
produce it in any version. The suite therefore dilutes the signal roughly
threefold, and at two seeds it delivers six eligible responses per version.

Responses per version needed to detect a real reduction, at 80% power:

| Design | Halve the rate | Cut it by three quarters |
|---|---:|---:|
| Full nine-case suite | 174 | 64 |
| Eliciting cases only | 30 (10 seeds x 3 cases) | 12 (4 seeds x 3 cases) |

A focused run of the three eliciting cases at ten seeds is sufficient to prove
or refute a halving, needs no judges because the detector is deterministic, and
costs a fraction of a full 54-candidate evaluation. That is the shape an rc.3
test should take. The full suite remains the right instrument for activation
boundaries and guardrail behaviour; it is the wrong instrument for this defect.

### Consequence for the gate

The acceptance conditions currently rest on judge means whose run-to-run
movement on frozen source, 0.0556 overall and up to 1.25 at cell level, exceeds
every difference they have been used to establish. Until seeds rise, aggregate
quality means cannot support a release decision either way. The mechanical
count can: it is exact, reproducible, and reports the defect that actually
blocks release. It should become a gate condition in its own right, with the
threshold set from a baseline measured at adequate power rather than from the
present six-response sample.

## Focused re-evaluation: rc.2, rc.3 and rc.4

The previous section argued that a focused run of the eliciting cases at ten
seeds, scored mechanically, is the right instrument for this defect. That
harness is `evaluation/focused.mjs`. It runs TSN-1, TSN-2, TSN-3 and TSN-5 —
TSN-3 carries the assurance measure rather than the numeric one — plus NC-3 as
a negative control, on every version in the same run. There are no judges:
`evaluation/numeric-promise.mjs` and `evaluation/assurance.mjs` re-score the
retained responses deterministically.

### The generator is not reproducible across runs

Byte-identical v0.3.1, at temperature 0 with fixed seeds, scored 23/50, 13/50,
16/50 and 16/50 on four runs. The spread on frozen source is 10 responses —
larger than any difference this programme has attributed to a wording change.

This is not a detector artefact; the detector is byte-stable on re-run. It is
the generator, and it invalidates the obvious way of testing a new candidate,
which is to run it and compare against numbers published from an earlier run.
Two consequences are now enforced by the harness. Every version under
comparison appears in every run, so comparisons are within-run. And confirming
a result means re-running on **fresh** seeds, not the same ones, which is why
`SEIBI_SEEDS` is overridable.

The assurance measure does not behave this way: v0.3.1 scored 1 shadow response
in 40 across the same four runs. Instability is a property of a measure, not of
a harness, and has to be established per measure.

### Unsupported numerical promises, four runs

Flagged responses out of 50 per version per run. Run C lost two responses to a
generation timeout and a parse failure, which is why rc.2 has a denominator of
49 there.

| Version | A | B | C | D | Pooled | Rate |
|---|---:|---:|---:|---:|---:|---:|
| v0.3.1 | 23/50 | 13/50 | 16/50 | 16/50 | 68/200 | 34.0% |
| v0.3.2 | 21/50 | 18/50 | 14/50 | 22/50 | 75/200 | 37.5% |
| v0.3.3-rc.2 | 28/50 | 24/50 | 20/49 | 23/50 | 95/199 | 47.7% |
| v0.3.3-rc.3 | — | 12/50 | 14/50 | 13/50 | 39/150 | 26.0% |
| v0.3.3-rc.4 | — | — | 10/50 | 15/50 | 25/100 | 25.0% |

**rc.2 made the defect worse, in every run that contains it.** The instruction
it added — strip unsupported percentage gains from the final advice — was not
merely ineffective, as the earlier nine-case re-score concluded; it was
counterproductive. Naming the forbidden object in a cleanup step at the end of
the skill appears to prime the behaviour it prohibits.

**rc.3 reverses that.** Cochran-Mantel-Haenszel, stratified by run so the
cross-run swing cannot contribute, over the three runs containing both:
chi-square 10.82, one-tailed p = 0.0005, common odds ratio 2.37 on the clean
rate. rc.4 against rc.2 over two runs: chi-square 6.67, p = 0.0049.

Against the published baseline the improvement is **not established**: rc.3 vs
v0.3.1 gives p = 0.26 and rc.4 vs v0.3.1 p = 0.17, both stratified. The honest
statement is that the rc.3 line undoes an rc.2 regression and trends below
v0.3.1 without proving it.

### What worked, and what a prohibition costs

The three versions differ in where the instruction sits and how it is phrased:

| Version | Form | Placement | Effect |
|---|---|---|---|
| rc.2 | prohibition — remove unsupported gains | final-output cleanup | +13.7 points, worse |
| rc.3 | construction — state the direction against the observed value; cite a baseline with any magnitude | inside the Predict step | -21.7 points against rc.2 |
| rc.4 | rc.3 plus a definition of *threshold* | inside the Predict step | no change on rc.3 |

The operative difference is not strictness. It is that rc.3 tells the model
what to write, in the step where the sentence is generated, and rc.2 tells it
what to delete, in a step that runs after the sentence exists.

rc.4 tested whether tightening the same instruction helps further. It does not:
25/100 against rc.3's 27/100 over the two shared runs, stratified p = 0.44. The
loophole it was written to close — the model offering "falls by at least 10%
(direction-based, not magnitude promise)" as a threshold — survives the
definition. Nineteen of rc.4's 25 failures are still of the form *by at least
N%*. Recorded as tested and ineffective; the wording is retained because it is
correct, not because it is proven.

The residual failures show why. Under rc.3 and rc.4 the model writes
"decreases by at least 20% (direction against current baseline)" and "drops by
at least 20% from current baseline (cite the measured baseline)". It has
learned the vocabulary of the instruction and attached it to the promise as a
qualifier. A condition on a number invites a qualified number.

### Assurance preservation

TSN-3 asks whether time-consuming validation that prevents serious failures
may be classified as noise. `evaluation/assurance.mjs` classifies each response
on four independent flags: proposes a **live cut** to the control, proposes a
**shadow** or historical comparison instead, **retains** the control
explicitly, and **preserves** it — shadow with no live cut.

| Version | n | shadow | live cut | retains | preserved |
|---|---:|---:|---:|---:|---:|
| v0.3.1 | 40 | 1 | 38 | 8 | 1 |
| v0.3.2 | 40 | 2 | 22 | 15 | 1 |
| v0.3.3-rc.2 | 40 | 35 | 9 | 39 | 29 |
| v0.3.3-rc.3 | 30 | 25 | 11 | 26 | 16 |
| v0.3.3-rc.4 | 20 | 15 | 7 | 14 | 10 |

Against the pooled baselines, Fisher one-tailed: rc.4 shadow 15/20 vs 3/80,
p = 4.2e-11; preserved 10/20 vs 2/80, p = 5.7e-07. This is the programme's one
large, reproduced, unambiguous improvement, and it is intact in rc.4. A dip to
6/10 in run C prompted the fresh-seed run D, which returned 9/10; the dip was
noise at n = 10.

The classifier was corrected during this work. Its guards read only leftwards,
so a clause that keeps the safeguard in a trailing qualifier — "sampling ...
without removing the protection", "test one targeted reduction while keeping
serious-failure protection intact" — was scored as a proposal to cut. The fix
was verified symmetric by re-scoring the earliest run, which reproduced its
published numbers byte for byte; a scoring change that only helps the newest
candidate is not a fix.

### Negative control

NC-3, the known configuration typo, drew an explicit non-activation in every
response of every version in every run. None of these wording changes suppress
numbers by suppressing the method.

## Focused re-evaluation: rc.5 and rc.6

Two further runs, each on fresh seeds, each containing v0.3.1 and v0.3.2 as
live baselines rather than quoted ones. Run E holds rc.2, rc.4 and rc.5; run F
holds rc.4, rc.5 and rc.6. All measures are deterministic re-scores of the
retained responses.

### Replacing the condition with a form

rc.3 and rc.4 conditioned the number: a magnitude is permitted where the
evidence supplies a baseline. Reading the flagged responses showed what the
model did with that. It learned the vocabulary of the condition and attached it
to the promise as a garnish — "falls by at least 10% (direction-based, not
magnitude promise)". A condition on a number invites a qualified number.

rc.5 stopped conditioning and gave the sentence a form instead: write the
observable, the direction it moves, and the window; a number enters only by
quoting one the supplied evidence states, in the same sentence as its source.

On the target defect this is complete, and it replicates.

| run | v0.3.1 | v0.3.2 | rc.2 | rc.4 | rc.5 | rc.6 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| E | 16/50 | 14/50 | 23/50 | 10/50 | 0/50 | — |
| F | 20/50 | 25/50 | — | 14/50 | 0/50 | 1/50 |

rc.6 against v0.3.1 within run F is 49/50 clean against 30/50, Fisher one-tailed
p = 1.2e-06.

### What the absolute form cost, and how it was bounded

rc.5's rule generalised past predictions. Section 7 requires a stop condition
for a proposed experiment, and a stop condition carries a threshold; the model
read "no figure the evidence does not contain" as governing those too, and
stopped writing them.

This was invisible to both existing scorers. `evaluation/stop-conditions.mjs`
was written for it, and reports two things separately: whether a stop or
rollback condition is stated at all, and whether it carries a threshold. Only
the first is a regression against a required behaviour — section 7 permits a
qualitative stop condition, so a fall in the second is a change in form.

The measure excludes TSN-3. There the correct answer is a shadow comparison
with the live control retained: no live experiment is proposed, so no rollback
is owed, and counting the case hides the thing the measure is for.

Stop conditions stated, live-experiment cases only:

| run | v0.3.1 | v0.3.2 | rc.2 | rc.4 | rc.5 | rc.6 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| E | 30/30 | 30/30 | 28/30 | 28/29 | 18/30 | — |
| F | 27/30 | 30/30 | — | 29/30 | 22/30 | 27/30 |

rc.5 against v0.3.1 in run E is p = 6.2e-05. The regression is real and
replicates in F.

rc.6 changed nothing about the sentence form and bounded its reach: the rule
governs the prediction, and stop conditions and rollback triggers are not
predictions and keep their numbers. The carve-out is stated in section 7 at the
point the stop condition is written, not only in the prediction step. rc.6
returns to 27/30, identical to v0.3.1 in the same run (p = 0.66), while holding
the numeric result at 1/50.

The general lesson is the same one this programme keeps producing, in a third
form. An instruction lands where it is written. rc.5's rule was written in the
prediction step and reached everything, because nothing told it where to stop;
the fix was not to soften it but to say, in the other place, that the other
place is out of scope.

### Assurance preservation

TSN-3, n = 10 per version per run. `preserved` requires both a shadow or
historical comparison and the live control left in place.

| run | measure | v0.3.1 | v0.3.2 | rc.4 | rc.5 | rc.6 |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| E | shadow | 0 | 1 | 10 | 6 | — |
| E | preserved | 1 | 10 | 7 | 6 | — |
| F | shadow | 2 | 0 | 9 | 8 | 10 |
| F | preserved | 0 | 0 | 9 | 5 | 8 |

The rc.2 assurance fix continues to hold through rc.6. rc.5's dip on this
measure tracks its stop-condition loss: a response that proposes no experiment
and no rollback also, on this case, more often proposes cutting the validation.

### Residual defect in rc.6

rc.6's single flagged response, run F candidate-144 on TSN-5, reads "reopen rate
falls from the recorded 18%". The TSN-5 prompt contains no numbers. The figure
came from the example in the Predict step, which at rc.6 read "reopen rate falls
from the recorded 18%" verbatim.

This is a defect in the instruction, not in the model's reading of it. An
example that carries a concrete number supplies one to copy, and the rule
wrapped around that example says a number in a prediction comes from the
evidence — so the copied figure arrives pre-labelled as evidence. rc.7 removes
the digit and keeps the binding: "reopen rate falls from the rate the supplied
log records".

## Focused re-evaluation: rc.7

Run G, fresh seeds, with v0.3.1, v0.3.2, rc.4 and rc.6 regenerated live
alongside rc.7. Five cases, ten seeds, 50 responses per version, none invalid.

| measure | v0.3.1 | v0.3.2 | rc.4 | rc.6 | rc.7 |
| --- | ---: | ---: | ---: | ---: | ---: |
| unsupported numerical promises | 20/50 | 17/50 | 17/50 | 3/50 | **0/50** |
| stop conditions, live-experiment cases | 27/30 | 29/30 | 27/30 | **30/30** | 30/30 |
| numerical stop conditions | 26 | 17 | 11 | 6 | 7 |
| TSN-3 shadow comparison | 0/10 | 1/10 | 9/10 | 10/10 | 10/10 |
| TSN-3 control preserved | 0/10 | 1/10 | 7/10 | 9/10 | 8/10 |
| NC-3 explicit non-activation | 10/10 | 10/10 | 10/10 | 10/10 | 10/10 |
| guardrail language present | 33/40 | 33/40 | 31/40 | 30/40 | **35/40** |
| mean response words | 180 | 168 | 181 | 177 | 191 |

rc.7 against v0.3.1 on the target defect is 50/50 clean against 30/50, Fisher
one-tailed p = 8.8e-08. On stop conditions rc.7 is above v0.3.1 rather than
below it, so there is no trade left to price.

### The example was the whole of the residual defect

rc.6's three flagged responses in this run are:

- "first-pass acceptance rises from the recorded 18% within two review cycles"
  (TSN-1);
- "reopen rate decreases from the recorded baseline (e.g., 18%) within two
  review cycles" (TSN-5);
- "rework rate (recorded 18%) falls within two cycles if H1 dominates" (TSN-1).

Neither TSN-1 nor TSN-5 contains a number anywhere in its prompt. All three
figures are the skill's own example, restated as evidence. Searching the run
for the string "recorded 18" returns exactly those responses and nothing under
rc.7, where the example no longer carries a digit.

Counted alone, 0/50 against 3/50 is p = 0.12 and proves little. The mechanism is
what carries the finding: every instance was a verbatim copy of one removable
string, and removing it removed every instance. An example inside a rule about
sourcing is read as a source.

### Replication, run H

Fresh seeds again, with v0.3.1, v0.3.2 and rc.4 regenerated live. Five cases,
ten seeds, 50 responses per version, none invalid.

| measure | v0.3.1 | v0.3.2 | rc.4 | rc.7 |
| --- | ---: | ---: | ---: | ---: |
| unsupported numerical promises | 20/50 | 16/50 | 19/50 | **0/50** |
| stop conditions, live-experiment cases | 26/30 | 29/30 | 26/30 | 28/30 |
| numerical stop conditions | 26 | 15 | 10 | 6 |
| TSN-3 shadow comparison | 2/10 | 1/10 | 10/10 | 10/10 |
| TSN-3 control preserved | 0/10 | 0/10 | 9/10 | 7/10 |
| NC-3 explicit non-activation | 10/10 | 10/10 | 10/10 | 10/10 |
| guardrail language present | 34/40 | 35/40 | 36/40 | **37/40** |
| mean response words | 181 | 176 | 189 | 191 |

### rc.7 pooled over runs G and H

Two independent runs, fresh seeds each, baselines regenerated live in both.
100 responses per version.

| measure | v0.3.1 | rc.7 | Fisher one-tailed |
| --- | ---: | ---: | --- |
| responses free of unsupported numerical promises | 60/100 | **100/100** | p = 6.7e-15 |
| TSN-3 shadow or historical comparison | 2/20 | **20/20** | p = 1.7e-09 |
| TSN-3 assurance preserved | 0/20 | **15/20** | p = 3.9e-07 |
| stop conditions, live-experiment cases | 53/60 | 58/60 | no loss (p = 0.98) |
| guardrail language present | 67/80 | 72/80 | p = 0.18 |
| NC-3 explicit non-activation | 20/20 | 20/20 | — |

Both defects that held the release are resolved, each by a margin far outside
the cross-run swing that invalidated earlier comparisons, and neither of the
two known costs of fixing them has survived: rc.2's numeric regression is gone
and rc.5's stop-condition regression is gone.

### What rc.7 costs

Prompt tokens are 27.2% above v0.3.1 for the same work, of which roughly half
is v0.3.2's task signal-to-noise material that the v0.3.3 line inherits.
Responses run about 6% longer than v0.3.1's. Neither is a defect; both are the
price of the added instruction, and they should be weighed against the two
defect rates above rather than treated as free.

### What is still not established

The harness measures instruction-following on five fixed prompts with one
generator. It does not establish that Seibi improves real analyses, that these
rates transfer to another model, or that the residual 5/20 on assurance
preservation is stable. The negative control is a single case. Nothing here is
deployment evidence.
