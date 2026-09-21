# Seibi

**Understand the system. Steward its behaviour. Improve it with evidence.**

Seibi is a practical methodology for AI agents analyzing recurring, interacting,
or system-level behaviour. It is inspired by systems thinking and system
dynamics, and extends those ideas with modern observability, competing
hypotheses, falsification, explicit permissions, prediction, measured
experiments, and model revision.

Seibi is designed for problems where behaviour emerges from interactions across
components or recurs over time. It is intentionally **not** a replacement for
ordinary debugging, dashboard reading, or routine one-off optimization.

## What Seibi helps an agent do

Seibi guides an agent to:

- define the system boundary and outcome that actually matters;
- use existing evidence before requesting more instrumentation;
- identify stocks, flows, feedback loops, delays, and constraints;
- distinguish observations from causal claims;
- maintain competing hypotheses and falsifiers;
- identify practical leverage points;
- prioritize whole-system improvement over unsupported local optimisation;
- make predictions before interventions;
- recommend bounded experiments with guardrails and rollback;
- measure observed results and update the system model;
- identify recurring process activity that consumes effort without
  proportionately advancing the system outcome;
- keep analysis records outside the system under analysis;
- avoid unauthorized production changes and unnecessary data collection.

The runtime method is intentionally compact. Optional schemas, ledgers, and
archetypes live under [`references/`](skills/seibi/references/).

## Activation

Use Seibi for recurring or interacting system behaviour, such as:

- recurring queue or backlog growth;
- retry amplification;
- oscillating autoscaling;
- quality/rework feedback;
- multiple components whose interactions produce an outcome;
- repeated local fixes that fail structurally;
- delayed or second-order effects;
- recurring process rework, handoffs, duplicated work, or scope diversion that
  consume attention without proportional system progress.

Do not invoke Seibi merely for:

- an isolated bug with a clear local cause;
- a one-off incident;
- summarizing a dashboard;
- routine tuning with no evidence of interacting behaviour.

Task signal-to-noise is a focused lens within this boundary, not a productivity
or task-management method. Preserve useful adjacent findings, but discover
broadly and act narrowly: do not expand the active scope unless completion or
a guardrail is materially affected.

## Safety model

Seibi defaults to **observe, analyze, and recommend**.

It does not authorize an agent to change production systems, deploy
instrumentation, alter logging, run disruptive experiments, or collect sensitive
data. Those actions require explicit authorization.

Seibi also applies data-minimization by default and prohibits logging or
persisting secrets, prompts/responses, personal data, unrestricted identifiers,
or sensitive payloads without explicit authorization and safeguards.

## Package

```text
seibi/
├── README.md
├── LICENSE
├── VERSION
├── CHANGELOG.md
├── VALIDATION.md
├── FORWARD_TESTS.md
├── RETUNING_EVALUATION.md
└── skills/
    └── seibi/
        ├── SKILL.md
        └── references/
            ├── machine-readable-model.md
            ├── system-archetypes.md
            └── templates.md
```

The runtime entry point is [`SKILL.md`](skills/seibi/SKILL.md).

## Validation

`VALIDATION.md` contains specification/rubric checks. These checks test whether
the skill instructions contain the intended safeguards and decision rules; they
are **not evidence of real-world deployment performance**.

`FORWARD_TESTS.md` contains recorded forward tests in which representative
prompts were processed using Seibi instructions and the resulting analyses were
reviewed against intended behaviour.

`RETUNING_EVALUATION.md` contains quantitative before/after comparisons for
the release retunings, including independent-agent scoring and negative
controls where available.

## Version

Published baseline: **v0.3.1**. Development candidate: **v0.3.3-rc.3**.

**Release hold:** v0.3.2 failed candidate validation and was not released.
v0.3.3-rc.2 reduced one defect and left another unchanged; v0.3.3-rc.3 is
further remediation under evaluation, not an official release.

See [`CHANGELOG.md`](CHANGELOG.md).

## Intellectual foundations

Seibi is a practical methodology inspired by:

- Donella H. Meadows, *Thinking in Systems: A Primer*;
- Klaus Mainzer, *Thinking in Complexity: The Computational Dynamics of
  Matter, Mind, and Mankind*;
- Eliyahu M. Goldratt and Jeff Cox, *The Goal: A Process of Ongoing
  Improvement*;
- Jay W. Forrester and the field of system dynamics;
- scientific practices involving competing hypotheses, falsification,
  prediction, and controlled experimentation;
- modern observability practices involving metrics, logs, traces, events, and
  system-level outcomes.

Seibi is not presented as an established formal standard.

## License

MIT. See [`LICENSE`](LICENSE).
