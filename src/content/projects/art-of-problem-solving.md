---
client: Art of Problem Solving
title: Containers for a team with no DevOps
summary: "ECS Fargate and CircleCI for a platform four products had to share."
role: Cloud Architect
deliveredVia: Caylent
years: "2022–2023"
stack: [AWS, ECS Fargate, CircleCI, Docker]
order: 9
verified: 2026-08-11
---

## The problem

Art of Problem Solving runs several education products — AoPS Academy, AoPS
Online, Beast Academy, with more planned. Customers routinely buy access to
more than one, and moving them between products required manual intervention
every time.

Two constraints shaped the answer. There was **no dedicated DevOps team**, and
there was not going to be one. So whatever we built had to be operable by
application engineers as a side concern, not as a job.

## What I did

I ran the assessment and discovery, then designed an architecture around **ECS
with AWS Fargate**.

Fargate is the specific reason this works for AoPS. It removes server
provisioning and EC2 cluster management from the picture entirely — no node
pools to patch, no capacity to plan, no cluster upgrades landing on a team that
does not have anyone whose job that is. The operational surface an application
team has to hold in their head shrinks to the service definition.

**CircleCI** handled CI/CD and deployment orchestration, with supporting AWS
infrastructure for networking, monitoring and service discovery.

I oversaw the proof of concept in staging and ran stakeholder communication
through JIRA and Slack for the duration.

## Result

Manual deployment steps were replaced by automation, customer transitions
between products got faster, and support tickets for technical issues went
down. Longer term it gave them a platform that could take a fourth and fifth
product without a corresponding increase in operational load.

This engagement did not publish quantitative outcomes.
