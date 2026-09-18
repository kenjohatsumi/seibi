# Optional Machine-Readable Model

Use a machine-readable model only when automation, repeated analysis, or multiple
agents will materially benefit from it.

```yaml
system:
  name: example-system
  purpose: accepted work within quality, latency, cost, and safety guardrails

north_star:
  metric: accepted_work_per_hour

guardrails:
  - quality_score
  - cost_per_accepted_task
  - rework_rate
  - p95_latency

stocks:
  - id: task_backlog
    metric: open_tasks
    status: OBSERVED

flows:
  - id: arrivals
    stock: task_backlog
    direction: inflow
    metric: tasks_received_per_minute

causal_edges:
  - from: queue_depth
    to: queue_wait
    polarity: positive
    delay_seconds: 0
    evidence: [E12]
    confidence: high
    status: VALIDATED

loops:
  - id: R1
    type: reinforcing
    status: HYPOTHESISED
    path: [queue_wait, timeout_rate, retry_rate, arrival_rate, queue_wait]

delays: []
constraints: []
open_questions: []
```

Store the model in an explicit analysis root outside the target. Version
control it when practical; never silently overwrite validated history.
