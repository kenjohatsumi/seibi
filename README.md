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
- make predictions before interventions;
- recommend bounded experiments with guardrails and rollback;
- measure observed results and update the system model;
- avoid unauthorized production changes and unnecessary data collection.

The runtime method is intentionally compact. Optional schemas, ledgers, and
archetypes live under [`references/`](references/).

## Activation

Use Seibi for recurring or interacting system behaviour, such as:

- recurring queue or backlog growth;
- retry amplification;
- oscillating autoscaling;
- quality/rework feedback;
- multiple components whose interactions produce an outcome;
- repeated local fixes that fail structurally;
- delayed or second-order effects.

Do not invoke Seibi merely for:

- an isolated bug with a clear local cause;
- a one-off incident;
- summarizing a dashboard;
- routine tuning with no evidence of interacting behaviour.

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
├── SKILL.md
├── README.md
├── LICENSE
├── VERSION
├── CHANGELOG.md
├── VALIDATION.md
├── FORWARD_TESTS.md
└── references/
    ├── machine-readable-model.md
    ├── system-archetypes.md
    └── templates.md
```

The runtime entry point is [`SKILL.md`](SKILL.md).

## Validation

`VALIDATION.md` contains specification/rubric checks. These checks test whether
the skill instructions contain the intended safeguards and decision rules; they
are **not evidence of real-world deployment performance**.

`FORWARD_TESTS.md` contains recorded forward tests in which representative
prompts were processed using the v0.1 methodology and the resulting analyses
were reviewed against the intended behaviour.

## Version

Current release candidate: **v0.1.0**

See [`CHANGELOG.md`](CHANGELOG.md).

## Intellectual foundations

Seibi is a practical methodology inspired by:

- Donella H. Meadows, *Thinking in Systems: A Primer*;
- Jay W. Forrester and the field of system dynamics;
- scientific practices involving competing hypotheses, falsification,
  prediction, and controlled experimentation;
- modern observability practices involving metrics, logs, traces, events, and
  system-level outcomes.

Seibi is not presented as an established formal standard.

## License

MIT. See [`LICENSE`](LICENSE).
