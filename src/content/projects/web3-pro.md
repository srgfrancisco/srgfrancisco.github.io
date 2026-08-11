---
client: Web3 Pro
title: Governance for ten AWS accounts
summary: "Control Tower and Account Factory for Terraform over an ungoverned estate."
role: Cloud Architect
deliveredVia: Caylent
years: "2022–2023"
stack: [AWS, Control Tower, Organizations, Terraform, IAM Identity Center, GuardDuty, CloudTrail]
order: 7
verified: 2026-08-11
---

## The company

Web3 Pro operates in the web3 space, working across subcontractors as well as
its own teams — which is how the account sprawl below happened in the first
place.

## The problem

They were running **ten AWS accounts** — subcontractor, development, staging
and production — with no unifying governance structure. Ten accounts that grew
one at a time, each reasonable on its own, collectively impossible to answer
basic questions about: who has access to what, what is being logged, what a new
account is supposed to look like.

They needed order, and enterprise-grade security controls, without stopping
work in any of the ten.

## What I built

**AWS Control Tower with Landing Zones** for a standard account structure, and
**Account Factory for Terraform** so new accounts were provisioned as code
under the same policies rather than created by hand and remembered later.

Around that:

- **IAM Identity Center** for centralised access
- **GuardDuty** for threat detection, **CloudTrail** for audit logging
- Cost management thresholds, budgets and alarms
- A tagging strategy that made cost and inventory attributable

## How the engagement ran

I started with a security workshop on the **AWS Shared Responsibility Model** —
establishing where the boundary sits before designing controls, because most
disagreements about cloud security are really disagreements about that line.
From there we set the governance and compliance baseline, reviewed their
existing frameworks, and decided explicitly which Control Tower controls —
mandatory, recommended, elective — to apply.

The ten existing accounts were enrolled into the new structure while the
workloads in them kept running.

I documented the implementation in their Confluence, which for a governance
engagement is part of the deliverable rather than an afterthought: controls
nobody can explain get switched off the first time they are inconvenient.

## Result

The engagement delivered a governed, auditable multi-account estate with
provisioning as code. It did not publish quantitative outcomes.
