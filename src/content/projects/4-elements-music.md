---
client: 4 Elements Music
title: One manual EC2 box to containers on Fargate
summary: "Terraform, Fargate and blue/green delivery over a hand-deployed instance."
role: Senior DevOps Engineer
deliveredVia: Toptal
years: "2024"
stack: [AWS, ECS Fargate, Terraform, RDS, OpenSearch, GitHub Actions, CodeDeploy, Cloudflare]
order: 11
verified: 2026-08-11
---

## The company

4 Elements Music is a music company whose platform ran on a single EC2
instance, deployed by hand. Their developers were mid-rewrite at the time —
moving the application off **Ruby on Rails** onto **Django** — so the
infrastructure had to serve both the thing that existed and the thing being
built.

## The problem

One manually-deployed instance is a performance ceiling and an availability
risk in the same object, and it makes every change a decision about whether the
site can afford to be down. Running a framework migration across that is worse
again: you cannot stage a rewrite you cannot deploy twice.

They wanted a modern, scalable platform, and the networking done properly this
time.

## What I built

**Terraform modules written from scratch**, published to Terraform Cloud, so
the infrastructure was reproducible rather than remembered.

**Networking with an actual design.** A custom VPC with three subnet tiers —
public, private, database — and VPC endpoints to S3, ECR, Systems Manager,
CloudWatch and OpenSearch, keeping service traffic off the public internet.

**Compute and data.** Containers on **ECS Fargate**, with S3, **RDS
(PostgreSQL)** and **OpenSearch** behind them. I ran the data migration onto
the new stores.

**Development parity.** A multistage Dockerfile and an improved Docker Compose
setup, so what ran on a laptop resembled what ran in production.

**Delivery.** GitHub Actions with AWS CodeDeploy, using **blue/green**
deployment — the point being that a release stops being an event you schedule
around.

**Edge.** Cloudflare for DDoS protection and bot mitigation, and I migrated the
`4elementsmusic.com` DNS zone from Route 53 to Cloudflare.

## Result

A standardised delivery workflow accelerated the release cycle, and least
privilege was enforced across the infrastructure rather than asserted. The
platform launched on documented, diagrammed foundations that someone other than
me can maintain.
