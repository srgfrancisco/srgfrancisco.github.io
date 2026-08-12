---
client: TeleTracking
title: Hub-and-spoke across three regions
summary: "Azure to AWS for a healthcare platform: centralised ingress and egress."
role: Cloud Architect
deliveredVia: Caylent
years: "2022–2023"
stack: [AWS, Transit Gateway, WAF, Load Balancers, Multi-region]
order: 6
verified: 2026-08-11
---

## The company

TeleTracking builds software for hospitals — patient flow and capacity
management. Healthcare software carries a constraint most platforms do not:
the migration cannot be visible to the people using it.

## The problem

They were carrying three constraints at once on Azure: ongoing cost, infrastructure management that consumed
significant staff time, and a footprint that could not scale with the business.

They had been planning a move for **more than three years** without one
happening.

## What I did

I ran discovery workshops to map the Azure footprint against the actual
business drivers, then produced a total cost of ownership analysis covering
licensing, hardware and operational expense — the artefact that turns "we
should move" into a decision someone can sign.

Then I designed the target: a **hub-and-spoke** network topology spanning three
regions, two in the US and one in Europe.

- **Transit Gateway** as the hub, centralising ingress and egress rather than
  letting each spoke manage its own path out
- **WAF and load balancers** at the edge
- Multi-region from the start, because retrofitting region isolation into a
  running healthcare platform is considerably harder than designing for it

## Result

The architectural assessment was **completed within a month**, against a
client history of three-plus years of planning. The migration and optimisation
delivered substantial savings — the engagement did not publish a figure, and I
am not going to invent one.

Centralising ingress and egress is what made the rest tractable: it gave them
one place to apply policy across three regions instead of three places to keep
in sync.
