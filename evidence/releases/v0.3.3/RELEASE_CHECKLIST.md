# Seibi Release Checklist — v0.3.3

Completed instance of [`RELEASE_CHECKLIST.md`](../../../RELEASE_CHECKLIST.md),
per [`RELEASE_SOP.md`](../../../RELEASE_SOP.md) section 16.

## Release identification

- Version: `v0.3.3`
- Previous release: `v0.3.1`
- Candidate identifier and commit: `rc.7, released unchanged`
- Date: `2026-09-21`
- Change classes (DOC / REF / BEH / SAFE / EVAL): `REF, BEH`

## Gate items

- [x] Candidate is frozen (no undocumented changes during validation).
- [x] Change is classified (section 2 of `RELEASE_SOP.md`).
- [x] Affected behaviour is identified.
- [x] Required tests are complete (section 5).
- [x] Raw evidence is retained.
- [x] Adverse outputs are reviewed.
- [x] Regressions are assessed (section 9).
- [x] Safety checks pass, where applicable (SAFE class).
- [x] Validation decision is PASS (section 11). Do not proceed on FAIL or BLOCKED.
- [x] Limitations are recorded (section 10).
- [x] Release evidence exists at `evidence/releases/v0.3.3/`.
- [x] `CHANGELOG.md` is updated.
- [x] Documentation is current (section 15).
- [x] `VERSION`, `CHANGELOG.md`, release evidence, and the Git tag agree.
- [x] The release commit is identified.

## Publication (after the gate passes)

- [x] Release commit confirmed.
- [x] Git tag created.
- [x] Release published.
- [x] Public repository displays the expected version.
- [x] Release documentation links work.
- [x] Tag identifies the validated source.

## Notes

This checklist instance was completed retroactively as part of the
documentation restructuring that introduced `evidence/releases/<version>/`
packages. v0.3.3 itself was already published before this checklist
template existed; no gate item required re-opening the release, and no
change was made to the tagged v0.3.3 commit or Git tag.
