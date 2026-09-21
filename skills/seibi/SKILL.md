---
name: seibi
license: MIT
description: >-
  Analyze recurring, interacting, or system-level behaviour using evidence,
  feedback loops, delays, competing hypotheses, leverage points, and measured
  experiments. Use when outcomes emerge from component interaction or recur
  over time. Ordinary debugging, dashboard summaries, and personal focus
  requests do not qualify without evidence of wider system behaviour.
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

## Activate Seibi when

First decide whether a systems investigation is warranted. A request to focus,
prioritise today's tasks, or finish one report does not qualify merely because
the user says "keep" or "repeatedly". Give brief direct help in those cases;
do not construct a system model. Apply the loop when evidence describes a
recurring process problem or material interactions, for example:

- a failure, bottleneck, backlog, quality problem, or operational pattern recurs;
- components, agents, teams, queues, incentives, or resources interact and
  materially affect the outcome;
- fixing one metric appears to worsen another;
- behaviour oscillates, compounds, overshoots, or changes after a delay;
- local fixes repeatedly fail or need manual intervention;
- a recurring process repeatedly consumes effort in rework, handoffs,
  duplicated work, or scope diversion without proportional system progress;
- a system-level question concerns feedback, delays, or second-order effects.

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

For recurring processes, task signal-to-noise means progress toward this
outcome per attention consumed. Testing, coordination, and safety work count
when they protect the outcome or guardrails; useful work elsewhere may not.

### 2. Observe

Establish from available evidence:

- baseline flow, waiting, saturation, rework, shortfalls;
- important accumulations or **stocks**, including where accumulated state may
  alter later behaviour;
- inflows and outflows;
- material events or changes;
- evidence gaps.

When relevant, distinguish direct progress, necessary support, avoidable
recurring noise, and non-blocking scope diversion. Do not label indirect work
noise solely because it is not the final output.

Examples: backlog, technical debt, or rework.

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

For recurring noise, explain its producing structure: ambiguous acceptance
criteria, delayed feedback, excessive WIP, weak authority, or missing routing.
Review count alone does not establish redundant review; distinguish disputes
about criteria from defects the review correctly catches.

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
- direction of change against the currently observed value;
- a proportional magnitude only when the supplied evidence contains the
  baseline it is measured against, cited together with it;
- otherwise the threshold or regime change expected, or direction alone. A
  threshold is a level the system crosses or holds, such as a queue that stops
  growing or a first-pass rate that returns above its recorded value; a bound
  on the size of an improvement that has not been measured is a magnitude, not
  a threshold;
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

Choose the least risky supported intervention; higher leverage is not
automatically better.

**Discover broadly; act narrowly.** Include adjacent findings that prevent
completion or threaten a guardrail; preserve and route related non-blocking
and independent findings. Any proposed parking rule must include that exception;
never defer a credible threat just because harm has not happened yet.
Supported removal of structural noise precedes adding effort.

### 7. Recommend or test

Recommend rather than execute by default.

For a proposed experiment specify:

- hypothesis;
- smallest useful change, preferably testing whether a candidate constraint
  changes the system outcome;
- expected result, as a direction against the current observed value;
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

Prefer narrower experiments that distinguish hypotheses.

For process changes, test one rule or handoff against a plausible alternative;
predict accepted completion or rework over a stated window while preserving
assurance. Test validation efficiency on historical/synthetic cases or in
shadow mode with the existing control retained; do not propose live removal
of serious-failure protection as a way to discover its value.

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

Do not invent an SNR score. When relevant, measure decision-relevant cycle
time, rework, handoffs, reopened work, waiting, throughput, first-pass
acceptance, or effort per outcome against guardrails. Focus fails if it removes
assurance or worsens the outcome.

## Instrumentation proportionality

Use existing evidence first.

Recommend additional metrics, logs, traces, dashboards, databases, or persistent
models only when their expected decision value justifies their operational,
privacy, security, storage, and maintenance cost.

Readiness:

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

## Confidence

Use:

- **LOW** — important evidence is missing or several explanations remain plausible;
- **MEDIUM** — one explanation is better supported but alternatives remain;
- **HIGH** — the mechanism has direct or experimental support, important
  alternatives have weakened, and predictions have matched observed behaviour.

Never raise confidence merely because an explanation sounds coherent.

## Final output

Keep reports proportional. The outline below is optional. For an active case,
even a short answer should retain a competing explanation, a distinguishing
observation, and a bounded recommendation with prediction and guardrails.
For a non-qualifying request, give direct help without this outline.
Every prediction returned carries a direction and an observation window; a
proportional magnitude or a duration promise appears only where the supplied
evidence contains the measured value it is derived from, cited with it. Label
assumptions.
Keep proposed changes conditional on evidence and applicable authorization.

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
Expected direction, observation window, guardrails, stop conditions, and rollback.

## Confidence and open questions
What is known, uncertain, and worth learning next?
```

If evidence is inadequate:

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
