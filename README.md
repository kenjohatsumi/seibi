# Seibi

**Understand the system. Steward its behaviour. Improve it with evidence.**

## What Seibi is

Seibi is a methodology for AI agents. It analyzes recurring, interacting, or
system-level behaviour. It is inspired by systems thinking and system
dynamics, and adds modern observability, competing hypotheses, falsification,
explicit permissions, prediction, measured experiments, and model revision.

Seibi is not a replacement for ordinary debugging, dashboard reading, or a
routine one-off fix.

## When to use it

Use Seibi when behaviour emerges from interactions across components, or
recurs over time: a recurring backlog, retry amplification, oscillating
autoscaling, quality/rework feedback, or repeated local fixes that fail
structurally.

Do not use Seibi for an isolated bug with a clear local cause, a one-off
incident, a dashboard summary, or routine tuning with no evidence of
interacting behaviour.

See [`docs/METHOD.md`](docs/METHOD.md) for the full activation guidance and
the safety model.

## How to use it

Seibi ships as a skill at [`skills/seibi/`](skills/seibi/), with its runtime
entry point at [`SKILL.md`](skills/seibi/SKILL.md). Copy that directory into
your agent's skills path, or point your agent at the file directly. Optional
schemas, ledgers, and archetypes are in
[`references/`](skills/seibi/references/); the runtime instructions stay
compact and load them only when needed.

## Example

A queue backlog recurs every morning, and retries rise after latency spikes.
Seibi asks the agent to model the stock (queue depth) and flows (arrival and
drain rate), form a hypothesis about the candidate reinforcing loop between
retries and latency, and check it against existing telemetry before
recommending a bounded, reversible experiment.

An isolated bug — one service returns a 500 after a config typo just
deployed — does not activate Seibi. The direct fix-and-verify path is
sufficient.

## Safety model

Seibi defaults to **observe, analyze, and recommend**. It does not authorize
an agent to change production systems, deploy instrumentation, alter
logging, run disruptive experiments, or collect sensitive data — those need
explicit authorization. It applies data minimization by default: no logging
or persisting secrets, prompts/responses, personal data, or sensitive
payloads without explicit authorization and safeguards.

## Start here

- New to Seibi? Read [`docs/METHOD.md`](docs/METHOD.md).
- Testing it against your own use case? Read [`docs/TESTING.md`](docs/TESTING.md).
- Checking what is validated and what is not? Read
  [`docs/VALIDATION.md`](docs/VALIDATION.md).
- Looking for a specific release? Read [`docs/RELEASES.md`](docs/RELEASES.md)
  and [`CHANGELOG.md`](CHANGELOG.md).
- Maintaining or releasing Seibi? Read [`RELEASE_SOP.md`](RELEASE_SOP.md) and
  use [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md).

## Current release

**v0.3.3.** It closes the last release-blocking defect from the v0.3.2/v0.3.3
remediation programme: unsupported numerical promises in recommendations,
and loss of necessary assurance under task signal-to-noise pressure. Both
are resolved with no regression on any existing control. See
[`docs/VALIDATION.md`](docs/VALIDATION.md) for the current status and
[`evidence/releases/v0.3.3/SUMMARY.md`](evidence/releases/v0.3.3/SUMMARY.md)
for the full release record.

## Package

```text
seibi/
├── README.md
├── LICENSE
├── VERSION
├── CHANGELOG.md
├── RELEASE_SOP.md
├── RELEASE_CHECKLIST.md
├── docs/                    - current guidance: method, testing, validation, releases
├── evidence/
│   ├── releases/<version>/  - per-release evidence package
│   └── history/             - full historical validation and evaluation record
├── evaluation/              - deterministic test harnesses
└── skills/
    └── seibi/
        ├── SKILL.md         - runtime entry point
        └── references/
            ├── machine-readable-model.md
            ├── system-archetypes.md
            └── templates.md
```

## Intellectual foundations

Seibi is inspired by Donella H. Meadows (*Thinking in Systems: A Primer*),
Klaus Mainzer (*Thinking in Complexity*), Eliyahu M. Goldratt and Jeff Cox
(*The Goal*), Jay W. Forrester and the field of system dynamics, scientific
practice around competing hypotheses and falsification, and modern
observability practice. See [`docs/METHOD.md`](docs/METHOD.md) for the full
list. Seibi is not presented as an established formal standard.

## License

MIT. See [`LICENSE`](LICENSE).
