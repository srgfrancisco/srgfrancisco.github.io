---
client: ETUS Media Holding
title: Three providers to Google Cloud, and the SRE team to run it
summary: "Consolidated all infrastructure onto GCP and founded the SRE team."
role: Lead SRE
years: "2020–2021"
stack:
  [
    Google Cloud,
    GKE,
    Kubernetes,
    Docker,
    GitLab CI/CD,
    Cloud SQL,
    Datadog,
    Sentry,
    Cloud Operations Suite,
    CloudFlare,
    Linux,
  ]
order: 12
verified: 2026-08-12
---

## The company

ETUS Media Holding is a digital media and advertising group in Belo Horizonte,
Brazil. Its consumer-facing sites — programmatic media, a card recommendation
product, a health tech venture — take tens of thousands of concurrent visitors,
spread across the country. The company was positioning itself to become a data
management platform.

I joined as the only infrastructure engineer in the company, and left as Lead
SRE, having built the team.

## The problem

The infrastructure had accumulated rather than been designed. DigitalOcean was
the main provider, with roughly eight servers, most of them production, and a
dozen sites sharing a single box on free plans. Google Cloud held everything
touching BI and the data warehouse. Heroku ran a slice of it, AWS held test
servers, and an on-premises datacenter held the rest. CloudFlare had just been
signed on an Enterprise plan for one site. Around R$10k a month, spread across
providers nobody owned.

Underneath that, the parts that actually keep you up at night. There was no
VPC: every server was created with a public IP and left exposed, backend
machines included, SSH open to the internet — 891 failed login attempts since
the last successful one, on the day I counted. No bastion hosts, no directory
service, admin permissions handed out widely, and every developer with access
to production. No high availability anywhere. No defined environments and no
pipeline between them; deploys were manual, and infrastructure was administered
by the developers who happened to need it. Availability sat at a 95% baseline.

The company had growth plans the estate could not carry. But the sites were the
business and could not stop, which rules out re-architecting. It calls for
improve-and-move: fix what is broken on the way across, leave the applications
recognisable.

## What I did

**Picked the provider, and wrote down why.** I ran the AWS and Google Cloud
comparison as a documented decision rather than a preference. AWS was the more
mature cloud with better support. Google Cloud won on the things that were true
for this company specifically: the data stack was already there in BigQuery and
Looker, the billing worked in local currency instead of moving with the
exchange rate, and Kubernetes was where we intended to go. I recorded the honest
argument against it, which was mine — I had less experience with GCP and would
be studying while delivering.

**Rebuilt the network instead of copying it.** The target was a three-tier VPC,
public, application and data, with bastion hosts rather than public IPs on
backend servers, and a CDN in front. This is the part that made the migration
worth doing beyond consolidation: the old estate had no network design to
migrate, so there was nothing to preserve.

**Containers onto GKE.** I containerised most of the applications and moved
them to GKE with a GitOps delivery model, on Cloud SQL for managed databases.

**Built the delivery path.** Repositories moved to GitLab, and I set up CI/CD
with the three publication tracks the company had never had: development,
staging and production. Deploys stopped being a manual procedure performed by
whoever was around.

**Observability.** Datadog, Sentry and the Google Cloud Operations Suite, so
that reliability had numbers attached to it rather than opinions.

**Founded the SRE team.** I recruited, onboarded and trained three engineers,
and ran the team on OKRs with MTTR and service level indicators as the primary
KPIs. The principle I ran it on: what does not get measured does not get
managed.

## Result

Availability went from that 95% baseline to a 99.99% SLO, which the team then
met consistently. The sites absorbed peak traffic — tens of thousands of
concurrent visitors — without degradation. I was promoted from sole
infrastructure engineer to Lead SRE over the course of the work.

On cost, the honest version: the target condition I wrote was to maintain or
reduce infrastructure spend, and the before figure was around R$10k a month. I
do not have the after figure to quote, so I will not claim a delta. What the
migration bought that I can stand behind is the network and access design the
previous estate did not have, and a company that could deploy on purpose.
