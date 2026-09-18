# Optional Seibi Templates

Use these only when the system is important, long-lived, or repeatedly analyzed.

## Evidence ledger

| ID | Source | Window | Observation | Supports | Caveat |
|---|---|---|---|---|---|

Separate raw observations from interpretations.

## Hypothesis table

| Hypothesis | Supporting evidence | Contradicting evidence | Missing evidence | Falsifier | Confidence |
|---|---|---|---|---|---|

## Prediction ledger

| ID | Hypothesis | Prediction | Expected window | Observed | Result | Model impact |
|---|---|---|---|---|---|---|

Result: MATCH / PARTIAL / MISS / INCONCLUSIVE.

## Intervention ledger

| ID | Date | Hypothesis | Change | Expected | Actual | Side effects | Decision |
|---|---|---|---|---|---|---|---|

## Instrumentation map

| Signal | Existing source | Retention | Resolution | Owner | Status |
|---|---|---|---|---|---|

## Persistent system model

Use `<analysis-root>/SYSTEM_MODEL.md` only when repeated analysis justifies
persistent state. `<analysis-root>` must be outside the system under analysis;
never resolve this path from the target's working directory.

Suggested headings:

- Scope and boundary
- System purpose
- Components and dependencies
- Stocks and flows
- Reinforcing loops
- Balancing loops
- Delays
- Constraints
- Goals and incentives
- Baseline metrics
- Instrumentation map
- Known failure modes
- Validated causal findings
- Rejected hypotheses
- Intervention history
- Open questions
- Last updated

Classify claims as OBSERVED, HYPOTHESISED, VALIDATED, REJECTED, or STALE.
