---
client: Kojo
title: CircleCI to GitHub Actions
summary: "Halved pipeline duration at neutral cost by changing the instance, not the jobs."
role: Senior Infrastructure Engineer
deliveredVia: Direct contract
years: "2025–2026"
stack: [GitHub Actions, CircleCI, AWS Graviton, Node.js, Claude Code]
order: 2
verified: 2026-08-11
---

## The company

Kojo is a construction procurement SaaS running on AWS, with a main application
that is still a monolith — which is the relevant fact here, because a monolith
means one CI pipeline that every engineer waits on.

## The problem

The main monolith's CI ran on CircleCI: a separate licence, a separate mental
model from the GitHub the team already lived in, and pipeline durations long
enough to shape how people batched their work. The release workflows were not
trivial, which is the usual reason this migration gets postponed indefinitely.

## What I did

I migrated the monolith's CI from CircleCI to GitHub Actions with two
colleagues, in a few weeks.

The interesting decision was the instance type. The obvious choice for CI is
compute-optimised — c7g. But the bottleneck in this pipeline was not CPU, it
was memory pressure in Node. So I ran the jobs on **r8g.4xlarge**, the newest
Graviton memory-optimised generation with 128 GiB, and raised the Node heap
allocation across several workflow steps.

## Result

- **Pipeline duration dropped by about 50%.**
- Cost stayed effectively neutral: roughly **$2 per full CI run**. A more
  expensive instance for much less time is close to a wash, and the engineer
  hours it returns are not.
- The CircleCI licence went away.
- The internal developer experience rating went up.

I defended the instance choice technically in the DevEx guild once the numbers
backed it — the counter-argument, reasonably, was that memory-optimised
instances cost more per hour.

## Method

I converted **100% of the CircleCI workflow** to GitHub Actions using Claude,
and ran much of the migration's test iteration with it. That is what made the
deadline. The translation between two YAML dialects is exactly the kind of
work where an AI assistant earns its place: high volume, mechanically checkable,
and tedious enough that humans make transcription errors.
