---
client: CoinList
title: EC2 to ECS, at 12.5% of the cost
summary: "Cut infrastructure cost 87.5% and application scaling time 88% on ECS."
role: Senior DevOps Engineer
deliveredVia: Toptal
years: "2023–2024"
stack: [AWS, ECS, EC2, Autoscaling, Ruby on Rails, Jenkins, GitHub Actions]
order: 5
verified: 2026-08-11
---

## The company

CoinList is a cryptocurrency exchange — a platform where traffic is not
smooth, and where being slow to scale during a spike is the same as being down.

## The problem

Workloads ran on EC2 instances sized for
peak traffic and left running through the troughs — the standard failure mode
of lift-and-shift infrastructure. Exchange traffic is spiky by nature, so the
gap between provisioned and used capacity was large and permanent.

Scaling the application took **45 minutes**, which is long enough that
autoscaling stops being a response to demand and becomes a guess about it.

## What I did

I migrated the workloads from EC2 to containers on **ECS**, right-sizing
resource allocation against actual usage rather than peak, and tuning
autoscaling for the traffic spikes the platform genuinely sees.

I also led the CI/CD migration from Jenkins to GitHub Actions.

## Result

- **Infrastructure cost down 87.5%** — from $4/hour to $0.50/hour.
- **Application scaling time down 88%** — from 45 minutes to about 5.

The second number matters more than the first. At 45 minutes, capacity
decisions have to be made in advance and paid for continuously. At 5 minutes,
they can be made in response to what is actually happening, which is what makes
the cost reduction durable rather than a one-off trim.
