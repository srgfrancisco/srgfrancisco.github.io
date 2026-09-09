---
client: Toptal
title: Accessibility remediation platform
summary: "Sole infrastructure engineer on a WCAG 2.2 AA platform, live in production."
role: Senior DevOps Engineer
deliveredVia: Toptal
years: "2025"
stack: [AWS, ECS Fargate, Terraform, GitHub Actions, OIDC, RDS, SQS, SES]
order: 4
verified: 2026-08-11
---

## The company

Toptal is a talent network that also builds internal products. This one was a
document remediation platform: taking documents that fail accessibility
standards and making them conform, as a service.

## The engagement

From July to November 2025 I was the only infrastructure engineer on a team of
three — me, one frontend and one backend engineer — building a document
remediation platform for **WCAG 2.2 AA** accessibility.

I left in November 2025 to join Kojo. The platform is in production today at
`app.accessibility.toptal.tech`, on the infrastructure I designed.

## What I built

**Terraform, with my own reusable modules.** `ecs-service`,
`ecs-service-alb`, `ecs-task-definition`, `ecr-repository`, `gha-iam-role`.
Staging and production ran with separate state backends, so a mistake in one
could not reach the other.

**Multi-service ECS Fargate.** API, frontend, workers, a migration task,
BoxyHQ for SAML SSO and SuperTokens for auth — plus RDS, S3, SQS, SES, ACM and
a bastion host.

**A private VPC with interface endpoints** for ECR (api and dkr), Secrets
Manager, CloudWatch Logs, ECS (default, agent, telemetry), SQS and S3. Traffic
to AWS services stayed inside the VPC rather than going out and back.

**Delivery on AWS OIDC federation.** GitHub Actions assumed roles via
`sts:AssumeRoleWithWebIdentity`, which removed long-lived AWS credentials from
the pipeline entirely — there is no access key in that repository to leak. Plan
and apply were gated per environment through `workflow_dispatch`.

## Ownership

**115 of the 119 commits** in `md-toptal/infrastructure` are mine. Being the
only infrastructure person on a three-person team means there is no ambiguity
about who made the architectural calls, and no one else to check them either —
which is its own argument for keeping the state backends separate and the
credentials federated.
