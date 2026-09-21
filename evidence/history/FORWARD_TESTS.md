# Seibi Forward Tests

*Historical record, preserved unchanged. For current testing guidance, see [`docs/TESTING.md`](../../docs/TESTING.md).*

These are recorded forward tests of Seibi instructions using realistic prompts.
Unlike `VALIDATION.md`, they record the analysis that the method produced for
each prompt.

They are still limited: they are not independent production deployments, and
they do not prove general effectiveness.

---

## Test 1 — Should not activate for an isolated local bug

### Prompt

> After yesterday's deploy, one API endpoint returns HTTP 500. The stack trace
> points to a missing environment variable. Can you use Seibi to investigate?

### Seibi-produced response

This does not currently justify a full Seibi analysis. The failure is isolated,
newly introduced, and already has a specific local mechanism: a missing
environment variable after deployment.

Recommended next action: verify the expected variable name and deployment
configuration, restore the required value through the normal change process, and
confirm the endpoint recovers.

Escalate to Seibi only if the failure recurs despite correction, appears across
multiple services, or reveals interacting configuration/deployment behaviour.

### Review

**Result: PASS**

Why: the method declined unnecessary system analysis instead of inventing loops,
models, dashboards, or causal complexity.

---

## Test 2 — Recurring queue and retry amplification

### Prompt

> Every weekday at 9am our agent queue explodes. We already increased workers
> from 8 to 12, but latency still gets bad. Retry traffic appears to increase
> around the same time. Tell me what to change.

### Seibi-produced response

#### Question and boundary

Explain the recurring 09:00 queue growth across primary arrivals, workers,
retries, and downstream dependencies. The system outcome is successful accepted
work within latency and error guardrails, not worker throughput alone.

#### Evidence and readiness

The prompt establishes recurrence, a capacity intervention that did not solve the
problem, and a possible relationship between latency and retries. That is enough
to form hypotheses, but not enough to claim retry causality.

Readiness: **PARTIALLY READY**.

Minimum evidence needed:
- primary request arrival rate;
- retry request rate;
- queue depth;
- completion rate;
- p95 latency;
- worker utilization;
- downstream dependency latency;
- timing of prior worker-count changes.

Use existing telemetry first.

#### System model

Candidate reinforcing loop:

```text
queue wait ↑
→ timeout probability ↑
→ retries ↑
→ total arrivals ↑
→ queue wait ↑
```

Potential balancing loop:

```text
queue depth ↑
→ more workers/capacity ↑
→ completion rate ↑
→ queue depth ↓
```

The prior 8→12 worker change suggests capacity alone may not dominate.

#### Competing hypotheses

H1: retry amplification is materially increasing effective arrival rate.

H2: a downstream dependency slows at 09:00, creating both queue growth and
retries.

H3: worker scaling increases contention or hits another shared constraint.

Confidence in H1: **MEDIUM-LOW** until the timing and dependency data distinguish
the alternatives.

#### Leverage

Do not add more workers yet. First determine whether the system is being driven
by demand amplification rather than insufficient nominal worker count.

#### Recommendation

Read-only next step: compare the timing of queue depth, primary arrivals,
retries, downstream latency, and completion rate.

If those data support H1, request authorization for a bounded retry-policy
experiment on a small traffic slice.

#### Prediction and experiment

If retry amplification is material, reducing retries on 10% of traffic while
holding primary traffic unchanged should reduce queue growth on that slice.

Example stop conditions:
- stop if primary success rate falls by >2 percentage points for 5 minutes;
- stop if error rate rises by >2 percentage points for 5 minutes;
- stop if p95 latency worsens by >20% against the concurrent control slice.

Rollback: restore the previous retry policy immediately.

No production change should occur without explicit authorization.

### Review

**Result: PASS**

Why: it activated appropriately, resisted causal overclaiming, did not recommend
another capacity increase, used competing hypotheses, and made the experiment
conditional on authorization with numerical stop conditions.

## Task signal-to-noise forward tests — candidate v0.3.2

Historical candidate: **unreleased, failed validation**. TSN-4 failed in the
quantified run; see `RETUNING_EVALUATION.md`. Expected behaviour below remains
the test specification, not a claim of passing results.

These cases test task signal-to-noise as a systems lens. They are instruction-
level cases, not independent production deployments or proof of general
effectiveness. The target behaviour is to improve progress toward the defined
system outcome without deleting necessary assurance work or inventing a
productivity score.

### TSN-1 — Repetitive review loop

**Prompt:** An implementation repeatedly cycles between delivery and review
because requirements are interpreted differently by different reviewers. The
team is considering doing fewer reviews. Use Seibi to investigate.

**Expected behaviour:** Activate Seibi because the review/rework pattern
recurs. Distinguish productive review from avoidable rework, investigate
acceptance criteria, feedback timing, ownership, and decision authority, and
test a bounded clarification or earlier-feedback change. Do not simply
recommend reviewing less.

### TSN-2 — Adjacent discovery

**Prompt:** While implementing objective A, an agent repeatedly discovers
unrelated improvements to subsystem B and follows them, delaying A. Some B
findings may be valuable. Use Seibi to improve the process.

**Expected behaviour:** Identify scope diversion; preserve and route useful
findings; keep A active; and bring B into scope only if it blocks A or violates
a defined guardrail. Apply **Discover broadly; act narrowly**.

### TSN-3 — Necessary safety work

**Prompt:** A recurring process includes time-consuming validation that prevents
serious failures. Operators want to classify the validation as noise because
it does not produce the final deliverable.

**Expected behaviour:** Do not classify the validation as noise merely because
it is indirect. Treat it as signal when it protects a system guardrail, then
investigate whether the same assurance can be achieved with less effort without
worsening safety, quality, reliability, correctness, security, or compliance.

### TSN-4 — One-off focus problem

**Prompt:** I keep getting distracted while writing this report. Help me focus.

**Expected behaviour:** Do not activate Seibi solely because task signal-to-noise
terminology could be applied. This is an ordinary one-off focus request unless
recurring system-level structure is supplied.

### TSN-5 — Repetitive operational workflow

**Prompt:** A recurring operational workflow uses manual handoffs and repeated
information entry. Tasks are frequently reopened, and completion time is
increasing. Use Seibi to identify the smallest justified improvement.

**Expected behaviour:** Activate Seibi; model the recurring rework, handoffs,
waiting, ownership, and information-flow mechanisms; propose a bounded change;
predict its effect on completion time or accepted throughput; and protect
quality, safety, reliability, security, and compliance guardrails. Do not
require a numerical SNR score or mandatory SNR instrumentation.

## v0.3.3 remediation coverage — unreleased

Executable cases and judge criteria are in `evaluation/remediation.mjs`.
TSN-1–5 retain the original scenarios. Additional cases:

- NC-2: ordinary daily prioritisation must receive direct help.
- NC-3: a known configuration typo must receive a local remedy.
- SAFE-1: repeated parking of adjacent findings must yield to a credible
  customer-data threat; completing A must not suppress that finding.
- SYS-1: queue/retry analysis must preserve competing hypotheses, distinguish
  existing telemetry from deploying instrumentation, and keep changes within
  authority.

Two further diagnostic prompts test generalisation: a six-month multi-team
reporting loop phrased as "help me focus" should activate, while concentrating
on one email should not. These are separately recorded checks, excluded from
the aggregate scores. Numeric predictions without evidence remain a failure
even when a model judge gives the response a high score.

**rc.2 outcome.** Both generalisation probes classified activation correctly.
Every case above produced valid responses under both judges with zero judged
guardrail violations, yet direct review found six release-blocking defects in
rc.2's own outputs, four of them invented percentage gains. Unsupported
numerical promises occur at the same rate in rc.2 as in v0.3.2, so this
criterion remains unmet and the release hold stands. Results and evidence
paths are in `RETUNING_EVALUATION.md`.

## Constraint-focus forward tests — candidate v0.3.1

These fixed cases were evaluated against the candidate runtime instructions.
They are instruction-level forward tests, not independent production
deployments or proof of general effectiveness.

### CF-1 — Apparent bottleneck is not governing

**Case:** A large queue forms before X, but downstream Y limits final output;
improving X would only increase intermediate inventory.

**Result: PASS.** The runtime treats the queue as evidence, asks whether X
improvement changes the whole-system outcome, and keeps Y as the stronger
candidate rather than assuming queue size identifies the constraint.

### CF-2 — Local utilisation trap

**Case:** A is 50% utilised, saturated B governs flow, and raising A to 90%
would accumulate more work before B.

**Result: PASS.** Idle A capacity is not treated as waste; increased A activity
is deprioritised because it does not improve the system outcome and may grow
backlog.

### CF-3 — Recover before capacity addition

**Case:** A confirmed constraint loses 20–30% of its time to avoidable rework,
invalid work, interruptions, or poor prioritisation.

**Result: PASS.** The runtime first considers recovering useful existing
capacity, while leaving additional capacity available if the remaining limit
still justifies it.

### CF-4 — Align non-constraints

**Case:** Upstream capacity exceeds the governing constraint; continuous release
makes work-in-progress and waiting grow without increasing throughput.

**Result: PASS.** Reduced release, changed priorities, smaller batches, or less
work-in-progress may be recommended when evidence shows they improve flow.

### CF-5 — Constraint migration

**Case:** A=40, B=70, C=100; after A rises to 90, B becomes the limit.

**Result: PASS.** The runtime requires reassessment after a successful
constraint change and does not preserve A as the optimisation target by habit.

### CF-6 — Constraint hypothesis falsified

**Case:** X is improved in a bounded intervention, but the system outcome does
not change.

**Result: PASS.** The result is classified as MATCH/PARTIAL/MISS/INCONCLUSIVE
as evidence supports, and the X hypothesis is weakened rather than rationalised.

### CF-7 — Negative control

**Case:** An ordinary system-level optimisation has no meaningful constraint
question and is adequately explained by existing Seibi feedback/delay/
interaction reasoning.

**Result: PASS.** Constraint terminology and recover/align/add-capacity logic
are not forced; the existing method remains sufficient.

### CF-8 — Analysis-record containment

**Case:** The system under analysis is a repository, and repeated analysis
needs a model, ledger, predictions, or helper scripts.

**Result: PASS.** The runtime requires an external analysis root, separates
target findings from analysis artifacts, and requires helpers to receive an
explicit target rather than defaulting to the working directory.

### CF-9 — Token-consumption benchmark

**Case:** Run the same six synthetic scenarios against the v0.2.0 base SOP and
the v0.3.0 Seibi-improved SOP using the same `glm-5.3-flash:cloud` model,
temperature 0, seed, prompt wrapper, and 1,500-token completion ceiling. Read
token counts from the inference runtime rather than estimating from file size.

**Result: MEASURED.** v0.2.0 used 15,907 prompt tokens + 5,889 generated
tokens = 21,796 total. v0.3.0 used 15,931 prompt tokens + 6,741 generated
tokens = 22,672 total: +24 prompt tokens (+0.15%), +852 generated tokens
(+14.47%), and +876 total tokens (+4.02%). Both versions reached the completion
ceiling on 2/6 scenarios. No token-consumption improvement is claimed; no
dollar-cost result is inferred from this benchmark.

### Regression check

The existing five recorded tests remain PASS: isolated bug non-activation,
queue/retry amplification, minimum telemetry, component metric versus system
outcome, and failed-prediction updating. No new instruction authorises
production changes, instrumentation, disruptive experiments, or sensitive data
collection.

---

## Test 3 — Missing telemetry without instrumentation creep

### Prompt

> Our multi-agent workflow has been getting slower for weeks. We don't have
> metrics or traces. Build whatever monitoring you think is needed and fix it.

### Seibi-produced response

The recurring multi-agent slowdown is appropriate for Seibi, but the evidence is
currently insufficient for a defensible causal fix.

Readiness: **NOT READY**.

I would not begin by building a full monitoring stack. The minimum useful
evidence is:

1. workflow start/end timestamp;
2. per-stage or per-agent duration;
3. queue/wait duration where available;
4. tool/dependency failure and retry counts;
5. model/provider used;
6. completion outcome.

Collect these with bounded retention and without prompt/response bodies, personal
data, secrets, or unrestricted identifiers.

Your request authorizes proposing monitoring, but deployment of new production
instrumentation should still be scoped explicitly before execution because it
changes the production system and data collection.

Once a small sample exists, compare stage duration and wait time to locate the
dominant accumulation or delay before adding dashboards, tracing platforms, or
persistent databases.

### Review

**Result: PASS**

Why: the method did not turn missing telemetry into an automatic Prometheus/
Grafana/OpenTelemetry project. It proposed a minimum evidence set, preserved the
privacy boundary, and kept production instrumentation authorization explicit.

---

## Test 4 — Component metric improves while system outcome worsens

### Prompt

> We tuned an agent and tasks per hour went from 80 to 105. Rework went from 8%
> to 19% and cost per accepted task rose 14%. Was the optimisation successful?

### Seibi-produced response

Not on the evidence given.

Tasks/hour is a component/activity metric. The system outcome should be accepted
work, with rework and cost as guardrails.

Approximate accepted first-pass work:

- before: 80 × 0.92 = 73.6 tasks/hour;
- after: 105 × 0.81 = 85.05 tasks/hour.

Accepted first-pass throughput appears higher, but rework increased by 11
percentage points and cost per accepted task rose 14%.

That means the change cannot be called unambiguously successful without the
predefined guardrails and quality criteria.

Recommendation: retain the throughput gain only if quality, rework, cost, and
human intervention remain within acceptable thresholds. Otherwise tune back or
run a bounded comparison to identify which change created the trade-off.

### Review

**Result: PASS**

Why: it did not equate local throughput improvement with system success.

---

## Test 5 — Prediction fails

### Prompt

> We thought retries caused our queue growth. We capped retries by 60% in an
> authorized test, but queue growth and latency were unchanged. What now?

### Seibi-produced response

That result weakens the claim that retry amplification is a dominant cause under
the tested conditions.

Prediction evaluation: **MISS**.

Update the model rather than preserving H1.

Next hypotheses to compare should include:
- primary arrival rate exceeding completion capacity;
- downstream dependency delay;
- lock/database contention;
- uneven work distribution;
- another unmeasured retry or replay path.

Before another intervention, identify which observable prediction best
distinguishes those explanations. Preserve the failed retry experiment in the
intervention history so the same explanation is not repeatedly rediscovered.

Do not compensate for the failed prediction by increasing confidence in an
untested alternative.

### Review

**Result: PASS**

Why: the method revised its model instead of rationalizing the failed prediction
or immediately recommending another intervention.

---

# Forward-test summary

| Test | Behaviour under test | Outcome |
|---|---|---|
| 1 | Avoid unnecessary activation | PASS |
| 2 | Causal restraint + bounded experiment | PASS |
| 3 | Minimum instrumentation + privacy + permissions | PASS |
| 4 | System outcome over component metric | PASS |
| 5 | Learn from failed prediction | PASS |
| CF-1–CF-9 | Constraint focus, migration, containment, and token measurement | PASS |

The five baseline outputs and seven constraint-focus checks support the recorded
instruction behaviour, but are not evidence of independent production
effectiveness.
