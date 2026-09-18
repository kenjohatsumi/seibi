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
containment, and S7 as a cost-bearing system dry-run. S1–S6 were evaluated in
two independent Jev scoring passes; each pass supplied only one `SKILL.md`
version and the scenario to the judge. Scores were 0–2 per criterion:

- S1, S3, S5: interaction, nonlinear/state-dependent reasoning, whole-system
  goal, and calibrated confidence (24 points maximum);
- S2, S4: activation, scope discipline, and negative-control reasoning (12
  points maximum);
- S6: external location, explicit target/fail-closed tooling, and separation of
  target findings from analysis records (6 points maximum).
- S7 is not a Jev score: it is a cost-bearing dry-run with explicit expensive
  flows and cost per accepted outcome, measured as a model forecast rather than
  a production observation.

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

### Cost-bearing dry-run — S7

| Quantity | Baseline | After bounded change | Change |
|---|---:|---:|---:|
| Accepted jobs/day | 1,000 | 1,000 | 0% |
| Expensive provider calls/day | 1,500 | 1,200 | -300 (-20%) |
| Provider cost/day | $300 | $240 | -$60 (-20%) |
| Cost per accepted job | $0.30 | $0.24 | -$0.06 (-20%) |

This quantifies the saving from the stated cost-driver intervention. It is a
synthetic model forecast, not evidence that a real system has saved $60/day.
No real workload cost ledger was available for this repository, so there is no
honest production v0.2.0→v0.3.0 dollar delta yet. Jev input-token footprint is
reported separately as evaluation overhead and is not a system cost result.

These results support closing the defect only after the fix is published and
the forward containment check is retained. They do not establish production
effectiveness or justify claiming a broad optimisation improvement.
