# Seibi Release Checklist

Use this checklist for every release. It follows [`RELEASE_SOP.md`](RELEASE_SOP.md)
section 16, the final release gate. Complete one copy per release and store it
at `evidence/releases/<version>/RELEASE_CHECKLIST.md`. Do not release if any
mandatory item is unchecked.

## Release identification

- Version: `___`
- Previous release: `___`
- Candidate identifier and commit: `___`
- Date: `___`
- Change classes (DOC / REF / BEH / SAFE / EVAL): `___`

## Gate items

- [ ] Candidate is frozen (no undocumented changes during validation).
- [ ] Change is classified (section 2 of `RELEASE_SOP.md`).
- [ ] Affected behaviour is identified.
- [ ] Required tests are complete (section 5).
- [ ] Raw evidence is retained.
- [ ] Adverse outputs are reviewed.
- [ ] Regressions are assessed (section 9).
- [ ] Safety checks pass, where applicable (SAFE class).
- [ ] Validation decision is PASS (section 11). Do not proceed on FAIL or BLOCKED.
- [ ] Limitations are recorded (section 10).
- [ ] Release evidence exists at `evidence/releases/<version>/`.
- [ ] `CHANGELOG.md` is updated.
- [ ] Documentation is current (section 15).
- [ ] `VERSION`, `CHANGELOG.md`, release evidence, and the Git tag agree.
- [ ] The release commit is identified.

## Publication (after the gate passes)

- [ ] Release commit confirmed.
- [ ] Git tag created.
- [ ] Release published.
- [ ] Public repository displays the expected version.
- [ ] Release documentation links work.
- [ ] Tag identifies the validated source.

## Notes

Record any deviation from this checklist and why.
