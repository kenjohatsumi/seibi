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

## v0.3.1 → v0.3.2 task signal-to-noise evaluation

This paired forward test evaluated the task signal-to-noise integration from
the v0.3.2 brief. Five fixed scenarios were run against both `SKILL.md`
versions, one version per fresh request, using the same `glm-5.3-flash:cloud`
model, temperature 0, seed `20260921`, and a 700-token generation ceiling.
The compact prompt required the same four decision areas from each run:
activation, outcome/guardrails, structure/competing hypothesis, and smallest
intervention/prediction. The runs were read for behavioural outcomes, not
scored as production evidence.

| Case | v0.3.1 before | v0.3.2 after | Observed change |
|---|---|---|---|
| TSN-1 review loop | Activated; identified ambiguous requirements, review feedback, and the risk of reducing a guardrail | Activated; explicitly classified review churn as low-SNR rework and named acceptance criteria, authority, and delayed feedback as sources | More direct task-SNR and guardrail framing; same causal direction |
| TSN-2 adjacent discovery | Activated; identified attention diversion, a missing parking path, and the need to preserve B findings | Activated; explicitly applied **Discover broadly; act narrowly**, classified blocking scope expansion, and proposed capture/classify/route | Clearer scope-routing rule and falsifiable guardrails |
| TSN-3 necessary validation | Activated; treated validation as protective work and considered cheaper assurance | Activated; explicitly distinguished guardrail work from noise and rejected deliverable-only classification | No safety regression; sharper task-relative definition |
| TSN-4 one-off focus | Correctly did not activate Seibi; gave a direct local rationale | Correctly did not activate Seibi; retained the same negative control | No activation regression |
| TSN-5 operational workflow | Activated; modelled handoff/re-entry rework and proposed a shared record or checklist | Activated; retained the same model and explicitly identified duplicated work, delayed feedback, and WIP as low-SNR mechanisms | More explicit process-friction lens; same bounded intervention family |

### Paired observations

- Activation fidelity: **5/5 correct before, 5/5 correct after**. TSN-4
  remained a negative control.
- Guardrail protection: present in both versions for the validation and review
  cases; v0.3.2 made the rule explicit rather than relying only on general
  system-outcome reasoning.
- Scope discipline: both versions preserved useful adjacent findings in TSN-2;
  v0.3.2 made the blocking versus non-blocking routing rule explicit.
- Structural reasoning: both versions identified plausible feedback, delay,
  rework, or attention-allocation mechanisms. The retune improved vocabulary
  and classification more than it changed the underlying causal conclusions.

### Limits

This is a small paired forward test, not a statistically powered study. The
model sometimes repeated instruction text and some outputs reached the token
ceiling; no independent judge scored the full outputs. The results support the
claim that v0.3.2 changes the intended reasoning emphasis without an observed
activation or guardrail regression in these cases. They do not establish
production effectiveness, lower cost, or general task-management performance.
