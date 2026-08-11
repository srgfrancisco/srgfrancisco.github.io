---
company: Kojo
role: Senior Infrastructure Engineer
periodStart: 2025-11
periodEnd: 2026-07
summary: "Led an org-wide OpenTelemetry rollout and cut CI pipeline time roughly in half."
stack: [AWS, EKS, Argo CD, Kargo, Helm, OpenTelemetry, Datadog, Aurora Postgres, GitHub Actions]
order: 1
verified: 2026-08-11
---

Kojo is a construction procurement SaaS running on AWS — EKS, Aurora Postgres,
Datadog. I joined as a contractor on the infrastructure team.

## Distributed tracing as a platform default

The platform had monitoring but no distributed tracing, so production
investigations stopped at the service boundary. I led the org-wide OpenTelemetry
deployment in a hybrid architecture — OTEL Operator plus Collectors — that
auto-instruments services in staging and production on EKS and exports to
Datadog.

What made it land was the delivery mechanism, not the design. The whole thing
shipped through GitOps: Argo CD Applications and ApplicationSets, Helm charts I
wrote, and Kargo for promotion between environments. Application teams got
distributed tracing with close to zero application code changes, which is why
adoption was not a negotiation.

I operated Kargo as a platform user; I did not build that setup.

## CI: CircleCI to GitHub Actions

I migrated the main monolith's CI from CircleCI to GitHub Actions with two
colleagues, in a few weeks, against release workflows that were not trivial.

The interesting decision was the instance type. Instead of the c7g
compute-optimized default, I ran the jobs on **r8g.4xlarge** — the newest
Graviton memory-optimized generation, 128 GiB — and raised the Node heap
allocation across several workflow steps. Pipeline duration dropped by about
50% at effectively neutral cost: roughly $2 per full CI run, a more expensive
instance for much less time. The CircleCI licence went away and the DevEx
rating went up. I defended the choice technically in the DevEx guild once the
numbers backed it.

I converted 100% of the CircleCI workflow to GitHub Actions using Claude, and
ran much of the migration's test iteration with it. That is what made the
deadline.

## A 50-item performance programme

I wrote and executed a 50-item performance programme against an SLO of 99% of
API requests under 2 seconds: query optimisation, cache-aside in Redis for the
hottest entities, Postgres indexing. Keeping headroom on the Aurora writer under
load growth meant coordinating fixes across several product teams rather than
doing all of it myself. The 5xx bursts caused by heap exhaustion stopped.

## ECS to EKS

I argued for prioritising the ECS/Elastic Beanstalk to EKS migration in
engineering conversations and team meetings, and delivered key workstreams:

- an nginx sidecar for parity with the Elastic Beanstalk environment — a gap
  nobody else had identified, and one that would have broken the cutover
- pod sizing derived from 30 days of real peak data
- a dedicated Karpenter node pool, provisioned by GitOps with Argo CD and
  isolated with taint/toleration, on on-demand c7g.2xlarge — the same instance
  type as the Elastic Beanstalk fleet, which ran up to 14 instances — in a
  one-pod-per-node design

## Access and incidents

I hardened database access across the platform, moving from shared master
credentials to least-privilege per-role access with Credstash and AWS Secrets
Manager, with a repeatable cutover runbook and zero downtime.

I also ran incident response and root-cause analysis in production: 504 bursts
from V8 heap exhaustion, Aurora writer saturation, recurring deadlocks in
`CostCategory`, `RequisitionItem` and `ItemDescription`. Correlating Datadog
APM, Sentry and CloudWatch is what turned those into durable fixes instead of
mitigations.
