---
name: seibi
description: >-
  Analyze recurring, interacting, or system-level behaviour using evidence,
  feedback loops, delays, competing hypotheses, leverage points, and measured
  experiments. Use when outcomes emerge from interactions across components or
  recur over time. Do not activate for isolated bugs, one-off incidents, simple
  dashboard reading, or routine optimization unless there is evidence of wider
  system behaviour.
---

# Seibi

**Understand the system. Steward its behaviour. Improve it with evidence.**

Seibi is a practical agent methodology inspired by systems thinking and system
dynamics. It helps an agent understand recurring or interacting behaviour,
identify plausible causal structure and leverage points, and recommend measured
improvements without confusing correlation with causation.

It is not a formal standard.

## Activate Seibi when

Use Seibi when at least one of these is true:

- the same failure, bottleneck, backlog, quality problem, or operational pattern recurs;
- several components, agents, teams, queues, incentives, or resources interact;
- fixing one metric appears to worsen another;
- behaviour oscillates, compounds, overshoots, or changes after a delay;
- local fixes repeatedly fail or require continuing manual intervention;
- the user explicitly asks for system dynamics, feedback loops, leverage points,
  second-order effects, or a system-level explanation.

Do **not** activate Seibi merely because there is:

- one isolated bug or incident with an obvious local cause;
- a request to read a dashboard or summarize metrics;
- routine debugging that can be resolved directly;
- a simple configuration change;
- ordinary performance tuning with no evidence of interacting system behaviour.

If uncertain, use the smallest adequate method first. Escalate to Seibi when the
evidence suggests a system-level pattern.

## Default authority and permissions

Seibi defaults to **observe, analyze, and recommend**.

Without explicit authorization, do not:

- change production configuration, code, infrastructure, routing, scaling, retry
  policy, prompts, models, permissions, or data retention;
- deploy instrumentation, agents, collectors, dashboards, databases, or tracing;
- run disruptive experiments, synthetic load, restarts, failovers, or traffic shifts;
- enable new logging or collect new sensitive data.

When evidence is missing, state what is missing and recommend the minimum useful
instrumentation. Implement it only when the user has authorized that action.

Existing read-only telemetry may be inspected when normal tool permissions allow it.

## Privacy and data-minimization boundary

Collect the minimum evidence required for the question.

Do not log or persist:

- passwords, API keys, access tokens, cookies, private keys, or credentials;
- user prompts or model responses by default;
- personal data or personally identifying information;
- unrestricted user, device, session, request, or account identifiers;
- message bodies, request bodies, file contents, or other sensitive payloads;
- secrets embedded in environment variables, headers, URLs, traces, or error output.

Prefer aggregates, redacted event types, bounded pseudonymous identifiers, and
short retention. If sensitive content is genuinely necessary, stop and obtain
explicit authorization and define scope, retention, access, and redaction first.

## Core loop

```text
BOUND → OBSERVE → MODEL → CHALLENGE → PREDICT
  → FIND LEVERAGE → RECOMMEND/TEST → MEASURE → UPDATE
```

### 1. Bound

State:

- the question;
- what is inside and outside the system;
- the system-level outcome that matters;
- the time window.

Do not optimize a component before defining the system outcome.

### 2. Observe

Use available evidence to establish:

- baseline behaviour;
- important accumulations or **stocks**;
- inflows and outflows;
- material events or changes;
- evidence gaps.

Examples of stocks include backlog, unresolved incidents, technical debt,
pending approvals, accumulated cost, or rework.

Do not create heavyweight observability merely because Seibi is active.

### 3. Model

Describe only the structure needed to explain the question:

- important relationships;
- reinforcing loops that amplify change;
- balancing loops that resist change;
- meaningful delays;
- current constraints.

Treat loops inferred from telemetry as candidates until causally supported.

### 4. Challenge

For each material explanation, record:

- the leading hypothesis;
- at least one plausible alternative when one exists;
- evidence supporting and contradicting each;
- what observation would weaken or falsify the leading hypothesis.

Temporal proximity and correlation generate hypotheses; they do not prove causes.

### 5. Predict

Before recommending a material intervention, state what the model predicts:

- which outcome should change;
- direction of change;
- approximate magnitude if defensible;
- expected delay or observation window;
- guardrails that should remain acceptable.

A model that cannot make a useful falsifiable prediction should retain low causal confidence.

### 6. Find leverage

Prefer interventions that alter the structure producing the behaviour rather than
repeatedly treating symptoms.

Consider, from lower to higher leverage:

1. parameters;
2. buffers or capacity;
3. delays;
4. feedback strength;
5. information flows;
6. rules;
7. incentives;
8. system goals;
9. system structure;
10. underlying assumptions or paradigms.

Higher leverage is not automatically better. Choose the least risky practical
intervention that addresses the supported mechanism.

### 7. Recommend or test

By default, recommend the change rather than executing it.

For a proposed experiment specify:

- hypothesis;
- smallest useful change;
- expected result;
- observation window;
- primary system outcome;
- guardrails;
- **numerical stop conditions whenever practical**;
- rollback;
- required authorization.

Prefer explicit thresholds over vague language. For example:

```text
stop if error rate increases by >2 percentage points for 5 minutes;
stop if p95 latency worsens by >20% from baseline;
stop if primary success rate falls below 98%;
```

When a meaningful numerical threshold cannot be defined, state the qualitative
stop condition and why it cannot be quantified safely.

Avoid changing several causal variables at once when a narrower experiment can
distinguish hypotheses.

### 8. Measure and update

Compare predicted with observed results:

- **MATCH**
- **PARTIAL**
- **MISS**
- **INCONCLUSIVE**

Strengthen, weaken, reject, or revise the model accordingly. Preserve failed
experiments and rejected hypotheses when they are useful to future analysis.

## Instrumentation proportionality

Use existing evidence first.

Recommend additional metrics, logs, traces, dashboards, databases, or persistent
models only when their expected decision value justifies their operational,
privacy, security, storage, and maintenance cost.

A useful readiness classification is:

- **READY** — evidence can distinguish the important hypotheses;
- **PARTIALLY READY** — useful analysis is possible but causal confidence is limited;
- **NOT READY** — the evidence cannot distinguish plausible explanations.

`NOT READY` does not automatically mean "build an observability platform." It
means identify the **minimum missing signal** needed for the next decision.

Persistent artifacts such as `SYSTEM_MODEL.md`, `system-model.yaml`, evidence
ledgers, or dashboards are appropriate for important, long-lived, repeatedly
analyzed systems. They are unnecessary for many investigations.

Detailed optional templates are in `references/`.

## Confidence

Use:

- **LOW** — important evidence is missing or several explanations remain plausible;
- **MEDIUM** — one explanation is better supported but alternatives remain;
- **HIGH** — the mechanism has direct or experimental support, important
  alternatives have weakened, and predictions have matched observed behaviour.

Never raise confidence merely because an explanation sounds coherent.

## Final output

Keep the report proportional to the problem.

```markdown
# Seibi Analysis

## Question and boundary
What behaviour is being explained and what is in scope?

## System outcome
What whole-system result matters, with relevant guardrails?

## Evidence and readiness
What is observed, what baseline is used, and what is missing?

## System model
Relevant stocks/flows, relationships, loops, delays, and constraints.

## Competing hypotheses
Leading explanation, alternatives, falsifiers, and confidence.

## Leverage
Where intervention is most likely to improve the system and why.

## Recommendation
The smallest justified next action. State whether it is read-only,
recommended-only, or requires explicit authorization.

## Prediction and measurement
Expected result, observation window, guardrails, stop conditions, and rollback.

## Confidence and open questions
What is known, uncertain, and worth learning next?
```

If evidence is inadequate, a valid conclusion is:

> No defensible causal recommendation can yet be made. The next step is to obtain
> the minimum evidence needed to distinguish the leading hypotheses.

## End-to-end example

**Input:**  
"Every weekday around 09:00 our support-agent queue spikes. We increased workers
from 8 to 12, but p95 completion time still rises and operators keep manually
restarting workers. Work out what is happening and tell me what to change."

**Boundary and evidence:**  
Scope the queue, workers, retrying clients, tool dependency, and operator
restarts. Existing metrics show queue depth, completion latency, worker count,
request rate, retry rate, and deployment events. Tool latency is available in
existing traces. No new instrumentation is required initially.

**Analysis:**  
The backlog is the key stock. Arrival and completion are its principal flows.
At 09:00, primary arrival rate rises 35%, but total request rate rises 80%.
Timeouts rise first, followed about 20 seconds later by retries. Worker
utilization increases, queue wait rises, and more requests time out.

**Competing hypotheses:**

- H1: retry amplification forms a reinforcing loop:
  queue wait → timeout → retry → arrival rate → queue wait.
- H2: the downstream tool becomes slow at 09:00 and independently causes both
  latency and retries.
- H3: twelve workers introduce lock contention.

Existing traces weaken H2 because tool latency remains near baseline before
queue wait rises. H3 remains plausible.

**Prediction:**  
If H1 is materially driving the spike, reducing retry traffic for a small
authorized traffic slice while leaving primary load unchanged should reduce
queue growth within roughly 1–2 minutes and improve p95 latency shortly after.
If queue growth is unchanged, H1 weakens.

**Experiment recommendation:**  
Do not change production automatically. Request authorization for a bounded
retry-policy experiment on 10% of traffic. Keep primary success rate and error
rate as guardrails; stop and roll back if either materially worsens.

**Final recommendation:**  
Do not add more workers yet. The evidence supports testing retry amplification
before another capacity change. If the prediction matches, the higher-leverage
fix is likely stronger backpressure/retry rules rather than additional worker
capacity. Confidence: MEDIUM until the experiment distinguishes H1 from H3.


## Optional references

Load these only when needed:

- [`references/templates.md`](references/templates.md) — evidence, hypothesis,
  prediction, intervention, and instrumentation templates.
- [`references/machine-readable-model.md`](references/machine-readable-model.md) —
  optional persistent YAML system model for repeated or multi-agent analysis.
- [`references/system-archetypes.md`](references/system-archetypes.md) — optional
  archetypes for generating hypotheses, never for proving them.

## References

Seibi is a practical methodology inspired by, rather than equivalent to, the
established fields below:

- Donella H. Meadows, *Thinking in Systems: A Primer*.
- Jay W. Forrester, work on system dynamics.
- General scientific practices of competing hypotheses, falsification,
  controlled experimentation, and prediction.
- Modern software observability practices involving metrics, structured logs,
  distributed traces, event histories, and service-level outcomes.

See `references/` for optional implementation patterns and templates.
