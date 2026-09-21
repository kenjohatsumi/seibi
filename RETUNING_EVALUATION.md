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
