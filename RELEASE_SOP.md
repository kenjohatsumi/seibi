# Seibi Release Standard Operating Procedure

This procedure governs how a Seibi release is prepared, validated, approved,
documented, and published. Use it for every release, including a
documentation-only release.

It is process documentation for maintainers, not part of the runtime skill.
It is not included in [`skills/seibi/`](skills/seibi/), which is the package a
consumer copies or references as the Seibi skill itself.

The procedure exists to make one chain traceable for every released version:

    change → test → evidence → validation → release decision → version → changelog

A release must not depend on undocumented judgment.

## 1. Release principles

Apply these rules to every release.

1. Do not release an unvalidated runtime change.
2. Test the candidate that will become the release, not a proxy for it.
3. Preserve failed test and candidate evidence; do not delete it.
4. Do not change evidence after the release decision is recorded.
5. State limitations and failed tests explicitly.
6. Keep runtime behaviour separate from documentation presentation.
7. Do not describe a test result as production evidence unless the evidence
   comes from production.
8. Do not update the release version until the release gate passes.
9. Make every released version traceable to its change record and validation
   evidence.
10. Keep `VERSION`, the release evidence, `CHANGELOG.md`, and the Git tag
    consistent with each other.

## 2. Change classification

Classify every material change before validation. A change may carry more
than one class.

- **DOC — Documentation.** Public documentation changes that do not change
  runtime instructions: README changes, navigation changes, spelling
  corrections, documentation restructuring. Runtime regression testing is
  normally not required.
- **REF — Runtime refinement.** Changes to runtime instructions intended to
  preserve behaviour: wording simplification, terminology standardisation,
  instruction consolidation, controlled-language edits to `SKILL.md`. Treat
  REF changes as runtime changes — wording can change model behaviour even
  when that is not the intent.
- **BEH — Behaviour.** The intended behaviour of Seibi changes: activation
  rules, causal reasoning, experiment guidance, constraint handling, scope
  rules. Behavioural validation is required.
- **SAFE — Safety and authority.** Changes involving authorization,
  production changes, privacy, sensitive data, instrumentation permissions,
  guardrails, or experiment safety. Safety regression tests are mandatory.
- **EVAL — Evaluation.** Changes to test harnesses, scoring, evaluation
  prompts, judges, metrics, or evidence capture. Validate the evaluation
  method itself before using changed evaluation infrastructure as release
  evidence.

## 3. Prepare the candidate

Create a candidate from a known repository state. Record:

- candidate identifier;
- base version;
- commit SHA;
- date;
- change classes;
- files changed;
- purpose of the change.

Freeze the candidate before release validation. Do not make undocumented
changes to the candidate while it is under validation. If a runtime-relevant
change is required, create a new candidate and repeat the affected
validation.

## 4. Define the change

Write a concise change summary that states:

- **Problem** — what problem does the change address?
- **Evidence** — what evidence shows that the problem exists?
- **Change** — what changed?
- **Expected effect** — what behaviour should change?
- **Protected behaviour** — what existing behaviour must not regress?
- **Known risk** — what could the change unintentionally affect?

Do not invent numerical improvement targets without a supported basis.

## 5. Select required tests

Select tests from the change classification and the affected behaviour. At
minimum, consider:

- activation boundary;
- negative controls;
- causal restraint;
- competing hypotheses;
- prediction behaviour;
- numerical-claim discipline;
- constraints;
- instrumentation proportionality;
- privacy;
- authorization;
- guardrails;
- stop conditions;
- scope discipline;
- failed-prediction handling;
- task signal-to-noise;
- token/runtime effects.

Do not run unrelated tests merely to enlarge the PASS count. Test the
behaviour that could reasonably change.

## 6. Establish the baseline

Select the correct released baseline and record:

- baseline version;
- baseline commit;
- candidate commit;
- test configuration;
- model or runtime;
- temperature, where applicable;
- seed, where applicable;
- response limits;
- scoring method.

Use equivalent conditions for comparative tests where practical. If
conditions differ, state the difference. Do not present incomparable
measurements as a direct comparison.

## 7. Run tests

Run the required tests against the frozen candidate. Preserve:

- prompts or scenarios;
- candidate outputs;
- baseline outputs, where applicable;
- scores;
- automated results;
- evaluator results;
- runtime configuration;
- errors;
- invalid runs.

Do not silently convert a failed or incomplete run into a passing result. Do
not delete adverse results.

## 8. Review the results

Separate three concepts and do not use them interchangeably:

- **Test result** — what happened?
- **Evaluation** — what does the result indicate?
- **Validation** — does the available evidence satisfy the release
  requirement?

Review both the aggregate results and the individual adverse outputs. An
aggregate PASS must not hide a serious individual failure.

## 9. Check regressions

Compare the candidate with the released baseline. Confirm that protected
behaviour has not materially regressed, with particular attention to:

- activation boundaries;
- safety;
- authorization;
- privacy;
- causal restraint;
- numerical claims;
- guardrails;
- existing negative controls.

Document every detected regression. A safety regression blocks release unless
it is resolved and re-tested.

## 10. Record limitations

State what the evidence does not establish, for example:

- synthetic tests are not production evidence;
- one model does not establish cross-model reliability;
- small samples do not establish statistical generality;
- model-judge scores can vary;
- token measurements do not establish cost-effectiveness;
- specification checks do not establish runtime behaviour.

Do not remove limitations to make a release appear stronger.

## 11. Make the validation decision

Use one of these states:

- **PASS** — the defined release requirements are satisfied.
- **FAIL** — one or more release requirements are not satisfied.
- **BLOCKED** — required evidence is missing or cannot be evaluated.

Do not release a FAIL or BLOCKED candidate. Record the reason for the
decision.

## 12. Create release evidence

For an approved release, record in the repository's evaluation and validation
documents:

- version;
- previous release;
- candidate identifier and commit;
- purpose;
- change classes;
- important changes;
- tests performed;
- validation result;
- known limitations;
- supporting evidence, with links to the raw evaluation output.

## 13. Update the version

Update the authoritative `VERSION` file only after the release gate passes.
Confirm that these agree:

- `VERSION`;
- runtime version metadata, where present;
- `CHANGELOG.md`;
- release documentation;
- the Git tag.

A mismatch blocks release.

## 14. Update the changelog

Add the release to `CHANGELOG.md`, using headings such as Added, Changed,
Fixed, Removed, and Validation where applicable. Keep the entry concise and
link to the supporting evidence rather than copying the full validation
report into the changelog.

## 15. Perform documentation checks

Before publication:

- verify internal links;
- verify version references;
- verify terminology;
- check public documents against the Seibi writing standard;
- check that the README identifies the current release correctly;
- check that historical candidate information is not presented as current
  behaviour;
- check that failed or unreleased candidates are clearly identified.

Public documentation should favour ASD-STE100-style controlled language where
applicable — one term per concept, short direct sentences, active voice,
imperative instructions. Do not sacrifice technical accuracy to satisfy a
language rule.

## 16. Perform the final release gate

A release is ready only when every applicable condition is satisfied:

- candidate is frozen;
- change is classified;
- affected behaviour is identified;
- required tests are complete;
- raw evidence is retained;
- adverse outputs are reviewed;
- regressions are assessed;
- safety checks pass;
- validation is PASS;
- limitations are recorded;
- release evidence exists;
- changelog is updated;
- documentation is current;
- versions agree;
- the release commit is identified.

If any mandatory condition fails, stop the release.

## 17. Publish

After the gate passes:

1. Confirm the release commit.
2. Create the Git tag.
3. Publish the release.
4. Confirm the public repository displays the expected version.
5. Confirm release documentation links work.
6. Confirm the tag identifies the validated source.

Do not modify a tagged release. Create a new release if a runtime correction
is required.

## 18. Preserve the record

Retain failed candidates, failed tests, superseded evaluations, release
evidence, known limitations, and remediation history. Move historical
material out of the primary reader path when it would otherwise bury the
current release, but do not erase it.

A future reviewer must be able to determine what changed, why it changed,
what was tested, what failed, what passed, and why the version was released.
