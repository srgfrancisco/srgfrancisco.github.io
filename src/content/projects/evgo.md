---
client: EVgo
title: Rackspace bare metal to AWS
summary: "Re-platformed three applications onto EKS and CloudFront, minimal downtime."
role: Cloud Architect
deliveredVia: Caylent
years: "2022–2023"
stack: [AWS, EKS, ECR, S3, CloudFront, Docker, Bitbucket Pipelines]
order: 9
verified: 2026-08-11
---

## The company

EVgo runs one of the largest public fast-charging networks for electric
vehicles in the US. Drivers depend on the apps working at the moment they are
standing at a charger.

## The problem

EVgo ran three applications — two Node.js backends and a React frontend — on
Rackspace bare-metal servers, deployed by hand. They wanted to consolidate on
AWS, reduce cost, and stop deploying manually.

The constraints were the interesting part: a tight deadline, **no changes to
the core application architecture or code**, and minimal downtime, with the
cutover confined to a low-usage window.

That combination rules out re-architecting. It calls for lift-and-reshape —
change the platform, leave the application alone.

## What I did

**Discovery first.** I mapped what the three applications actually depended on:
databases, third-party APIs, the implicit assumptions bare-metal deployment had
allowed them to accumulate. This is the step that decides whether a migration
window holds.

**Containers.** I improved the existing Dockerfiles for the Node.js builds, and
built a Bitbucket Pipelines CI workflow to build, test and push images to
**ECR**.

**Kubernetes.** I wrote the manifests — Deployment, Service and Ingress — and a
Bitbucket Pipelines CD workflow to deploy to **EKS**.

**Frontend.** I provisioned the S3 bucket and **CloudFront** distribution, moving
the React app off a server that had no business serving static files.

**Cutover.** I orchestrated the traffic migration inside the scheduled
maintenance window.

## Result

All workloads consolidated into one AWS environment, infrastructure cost down
significantly, and the Rackspace footprint decommissioned. Deployment went from
a manual procedure to an automated pipeline, which is what turned the migration
from an event into a new normal.
