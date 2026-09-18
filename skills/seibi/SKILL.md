---
name: seibi
license: MIT
description: >-
  Analyze recurring, interacting, or system-level behaviour using evidence,
  feedback loops, delays, competing hypotheses, leverage points, and measured
  experiments. Use when outcomes emerge from component interaction or recur
  over time. Do not activate for isolated bugs, dashboard reads, or
  routine optimization without evidence of wider system behaviour.
---

# Seibi

**Understand the system. Steward its behaviour. Improve it with evidence.**

Seibi is a practical, evidence-driven methodology for understanding and
improving recurring, interacting, or system-level behaviour. It helps an agent
understand how system structure and interactions produce that behaviour,
identify plausible causal mechanisms and leverage points, and recommend
measured improvements without confusing correlation with causation.

Prefer the simplest evidence-supported explanation, but account for component
interaction.

It is not a formal standard.

## Activate Seibi when

Use Seibi when one or more apply:

- a failure, bottleneck, backlog, quality problem, or operational pattern recurs;
- components, agents, teams, queues, incentives, or resources interact and
  materially affect the outcome;
- fixing one metric appears to worsen another;
- behaviour oscillates, compounds, overshoots, or changes after a delay;
- local fixes repeatedly fail or need manual intervention;
- the user asks for system dynamics, feedback loops, leverage points,
  second-order effects, or a system-level explanation.

Do **not** activate merely for:

- one isolated bug or incident with an obvious local cause;
- reading a dashboard or summarizing metrics;
- routine debugging or configuration change resolvable directly;
- multiple components without evidence their interaction affects the outcome.

If uncertain, use the smallest adequate method; escalate when evidence suggests
a system-level pattern. Do not force constraint analysis onto ordinary or
strictly linear, single-component cases.

## Default authority and permissions

Seibi defaults to **observe, analyze, and recommend**.

Without explicit authorization, do not change production configuration, code,
infrastructure, routing, scaling, retry policy, prompts, models, permissions,
or retention; deploy instrumentation; run disruptive experiments, synthetic
load, restarts, failovers, or traffic shifts; or enable logging/collect
sensitive data. When evidence is missing, state the gap and recommend minimum
instrumentation; implement only when authorized. Inspect read-only telemetry
when permitted. Keep analysis artifacts outside target: never write models,
ledgers, scripts, or reports into its tree or lifecycle controls. Helpers require
an explicit target and fail closed if absent.

## Privacy and data-minimization boundary

Collect the minimum evidence required for the question.

Do not log or persist passwords, API keys, tokens, cookies, private keys, or
credentials; prompts or responses by default; personal data; unrestricted
identifiers; message/request bodies, file contents, or sensitive payloads; or
secrets in environment variables, headers, URLs, traces, or error output.

Prefer aggregates, redacted event types, bounded pseudonymous identifiers, and
short retention. If sensitive content is necessary, stop and obtain explicit
authorization and define scope, retention, access, and redaction first.

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
- the time window;
- the analysis record location, outside it.

Define the system outcome before judging components; local efficiency counts
only if it improves that outcome or guardrails.

### 2. Observe

Establish from available evidence:

- baseline flow, waiting, saturation, rework, shortfalls;
- important accumulations or **stocks**, including where accumulated state may
  alter later behaviour;
- inflows and outflows;
- material events or changes;
- evidence gaps.

Examples: backlog, unresolved incidents, technical debt, pending approvals,
accumulated cost, or rework.

Do not create heavyweight observability because Seibi is active.

### 3. Model

Describe only needed structure and interaction:

- important relationships and interactions;
- reinforcing and balancing feedback;
- meaningful delays and state dependence;
- candidate constraints, nonlinearities, or thresholds that change behaviour.
  Treat a constraint as governing only if improving, relieving, or protecting
  it should materially improve the outcome; queues and utilisation are
  evidence, not proof.

Treat loops inferred from telemetry as candidates until causally supported.

### 4. Challenge

For each material explanation or candidate constraint, record:

- the leading hypothesis;
- at least one plausible alternative, if any;
- evidence supporting and contradicting each;
- what observation would weaken or falsify the leading hypothesis.

Include an interaction-level hypothesis when component behaviour could
combine to produce the outcome. "Emergent" is not itself a hypothesis — bad:
*H1: the behaviour is emergent.* Good: *H1: retries, queue growth, and
delayed scaling amplify arrival past a threshold.*

Temporal proximity and correlation generate hypotheses; they do not prove causes.

### 5. Predict

Before recommending a material intervention, state what the model predicts:

- which system outcome should change; local metrics are supporting signals;
- direction of change;
- approximate magnitude, threshold, or regime change if defensible;
- expected delay or observation window;
- guardrails that should remain acceptable.

Without falsifiable prediction, keep causal confidence low.

### 6. Find leverage

Prefer changes to the producing structure or interaction. Deprioritize local
optimisation unless it improves the defined outcome, relieves a supported
governing constraint, or weakens the supported mechanism. If so,
recover avoidable loss, align surrounding flow (release, priorities, batches,
WIP), then add capacity or redesign only when evidence justifies it.

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

Higher leverage is not automatically better. Choose the least risky
intervention that addresses the supported mechanism.

### 7. Recommend or test

By default, recommend rather than execute the change.

For a proposed experiment specify:

- hypothesis;
- smallest useful change, preferably testing whether a candidate constraint
  changes the system outcome;
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

When a numerical threshold cannot be defined, state the qualitative stop
condition and why it cannot be quantified safely.

Avoid changing several interacting variables at once when a narrower
experiment can distinguish hypotheses.

### 8. Measure and update

Compare predicted with observed results:

- **MATCH**
- **PARTIAL**
- **MISS**
- **INCONCLUSIVE**

Strengthen, weaken, reject, or revise the model accordingly. After a successful
constraint change, reassess the system's new limit before optimising the old
target. Preserve failed
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
ledgers, or dashboards suit important, long-lived systems. Store them in an
explicit external analysis root, never a bare path in the target; separate
target findings from the analysis model, ledger, and predictions. They are
unnecessary for many investigations.

See `references/` for optional templates.

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
Where intervention best improves the system, its constraint priority, and why.

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
"Every weekday at 09:00 our support queue spikes. Workers rose from 8 to 12,
but p95 completion time still rises and operators restart workers. What should
we change?"

**Boundary and evidence:**
Scope the queue, workers, retrying clients, and downstream tool; metrics and
traces suffice.

**Analysis:**
Backlog is the key stock. At 09:00, primary arrivals rise 35% but total
requests rise 80%; timeouts precede retries by ~20 seconds, and utilisation
and queue wait climb together — consistent with interaction, not one failed
part.

**Competing hypotheses:**

- H1 (interaction-level): retry amplification forms a reinforcing loop — queue
  wait → timeout → retry → arrival rate → queue wait — crossing a threshold.
- H2: the downstream tool independently slows at 09:00.
- H3: twelve workers introduce lock contention.

Traces weaken H2: tool latency stays near baseline before queue wait rises; H3
remains plausible.

**Prediction:**
If H1 dominates, cutting retries on a small authorized slice while holding
load steady should reduce queue growth within 1–2 minutes; unchanged growth
weakens H1.

**Experiment and recommendation:**
Request authorization for a bounded 10% retry experiment, with success and
error rate as guardrails; roll back if either worsens. Do not add workers yet:
test whether retries or another shared dependency governs; if relieved,
reassess what now limits performance. Confidence: MEDIUM until H1 is
distinguished from H3.

## Optional references

Load these only when needed:

- [`references/templates.md`](references/templates.md) — evidence, hypothesis,
  prediction, intervention, and instrumentation templates.
- [`references/machine-readable-model.md`](references/machine-readable-model.md) —
  persistent YAML system model for repeated or multi-agent analysis.
- [`references/system-archetypes.md`](references/system-archetypes.md) —
  archetypes for generating hypotheses, never for proving them.

## References

Seibi is a practical methodology inspired by, not equivalent to, the
established fields below:

- Donella H. Meadows, *Thinking in Systems: A Primer* — structure, stocks,
  flows, feedback, delays, and leverage.
- Klaus Mainzer, *Thinking in Complexity: The Computational Dynamics of
  Matter, Mind, and Mankind* — nonlinear interaction, emergence,
  self-organization, and state dependence.
- Eliyahu M. Goldratt and Jeff Cox, *The Goal: A Process of Ongoing
  Improvement* — constraints and whole-system improvement.
- Jay W. Forrester, work on system dynamics.
- General scientific practices of competing hypotheses, falsification,
  controlled experimentation, and prediction.
- Modern software observability practices involving metrics, structured logs,
  distributed traces, event histories, and service-level outcomes.

See `references/` for optional patterns.
