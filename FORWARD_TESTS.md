# Seibi v0.1 Forward Tests

These are recorded forward tests of the v0.1 instructions using realistic
prompts. Unlike `VALIDATION.md`, these tests record the analysis that the method
actually produced for each prompt.

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

These outputs support the **v0.1 release-candidate behaviour**, but they should
not be described as evidence of independent production effectiveness.
