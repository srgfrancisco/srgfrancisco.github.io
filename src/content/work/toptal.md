---
company: Toptal
role: Senior DevOps Engineer (Freelance)
periodStart: 2023-07
periodEnd: present
summary: "Sole infrastructure engineer on a WCAG remediation platform, live in production."
stack: [AWS, ECS Fargate, Terraform, GitHub Actions, OIDC, RDS, SQS, SES, Cloudflare]
order: 3
verified: 2026-08-11
---

Freelance engagements through Toptal since July 2023. The two worth describing
are Toptal's own internal product and CoinList.

## Toptal — accessibility remediation platform

From July to November 2025 I was the only infrastructure engineer on a team of
three — me, one frontend and one backend engineer — building a document
remediation platform for WCAG 2.2 AA accessibility. I left in November 2025 to
join Kojo. It is in production today at `app.accessibility.toptal.tech`, on the
infrastructure I designed.

- I designed and implemented the entire AWS footprint in Terraform, with my own
  reusable modules: `ecs-service`, `ecs-service-alb`, `ecs-task-definition`,
  `ecr-repository`, `gha-iam-role`. Staging and production ran with separate
  state backends.
- Multi-service **ECS Fargate**: API, frontend, workers, a migration task,
  BoxyHQ for SAML SSO and SuperTokens for auth — plus RDS, S3, SQS, SES, ACM
  and a bastion host.
- A private VPC with interface endpoints for ECR (api and dkr), Secrets
  Manager, CloudWatch Logs, ECS (default, agent, telemetry), SQS and S3.
- Delivery through GitHub Actions over **AWS OIDC federation**
  (`sts:AssumeRoleWithWebIdentity`), which removed long-lived AWS credentials
  from the pipeline entirely. Plan and apply were gated per environment via
  `workflow_dispatch`.

115 of the 119 commits in `md-toptal/infrastructure` are mine.

## CoinList

For CoinList, a cryptocurrency exchange, I migrated workloads from EC2 to
containers on **ECS**, cutting infrastructure cost by **87.5%** — from $4/hour
to $0.50/hour — through resource optimisation and autoscaling tuned for traffic
spikes. Application scaling time dropped **88%**, from 45 minutes to about 5. I
also led the CI/CD migration from Jenkins to GitHub Actions.

## 4 Elements Music

I architected a containerised platform on **AWS ECS Fargate** for Python/Django
applications, with Terraform managing all infrastructure across AWS and
Cloudflare, and moved the `4elementsmusic.com` DNS zone from Route 53 to
Cloudflare. Full CI/CD with GitHub Actions and AWS CodeDeploy.
