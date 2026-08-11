---
client: Kojo
title: Distributed tracing as a platform default
summary: "Org-wide OpenTelemetry on EKS, shipped entirely through Argo CD and Kargo."
role: Senior Infrastructure Engineer
deliveredVia: Direct contract
years: "2025–2026"
stack: [AWS, EKS, OpenTelemetry, Argo CD, Kargo, Helm, Datadog]
order: 1
verified: 2026-08-11
---

Kojo is a construction procurement SaaS running on AWS — EKS, Aurora Postgres,
Datadog.

## The problem

The platform had monitoring but no distributed tracing. Production
investigations stopped at the service boundary: you could see that a request
was slow, but not where inside a chain of services the time went. Every
cross-service incident became an exercise in correlating timestamps by hand.

## What I built

I led the org-wide OpenTelemetry deployment in a hybrid architecture — OTEL
Operator plus Collectors — that auto-instruments services in staging and
production on EKS and exports to Datadog.

The design mattered less than the delivery mechanism. The whole thing shipped
through GitOps:

- **Argo CD** Applications and ApplicationSets, so instrumentation rolled out
  per-service without a bespoke deploy path
- **Helm charts I wrote**, so the collector configuration was versioned and
  reviewable rather than clicked into a console
- **Kargo** for promotion between environments, so staging genuinely predicted
  production

## Why it landed

Application teams got distributed tracing with **close to zero application code
changes**. That is the whole story of adoption. A platform capability that
requires every team to schedule work in their own sprint does not get adopted;
one that arrives through the deployment pipeline they already use does.

Distributed tracing became the platform default rather than a thing individual
teams opted into.

## Scope note

I operated Kargo as a platform user. I did not build that setup.
