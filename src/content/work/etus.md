---
company: ETUS Media Holding
role: Lead Site Reliability Engineer
periodStart: 2020-03
periodEnd: 2021-06
summary: "Founded the SRE team and moved everything to GCP behind a 99.99% availability SLO."
stack: [GCP, GKE, GitOps, Datadog, Sentry, Google Cloud Operations Suite]
order: 5
verified: 2026-08-11
---

I joined ETUS as the only infrastructure person in the company — a one-man infra
army — and left as Lead SRE with a team of four. Both halves of that are the
story.

## The migration

Infrastructure was spread across Heroku, DigitalOcean and an on-premises
datacentre. I led the migration and consolidation of all of it onto **Google
Cloud**, using an improve-and-move strategy rather than a straight lift, onto a
single platform in the GCP South Carolina region.

Baseline uptime before the migration was around 95%.

I containerised most of the applications for **GKE**, with CI/CD delivered in a
GitOps approach, and re-architected the sites to handle tens of thousands of
concurrent visitors without degradation.

## Founding the team

I recruited, onboarded and trained three engineers, and ran the team on OKRs and
metrics. The headline number is availability: a **99.99% SLO — four nines —
consistently met after the GCP migration**, with MTTR and SLIs as the other
primary indicators. The stated principle was the obvious one: what you do not
measure, you do not manage.

Observability ran on Datadog, Sentry and the Google Cloud Operations Suite.

Going from sole operator to team lead in about a year meant most of my output in
the second half was through other people rather than by my own hands. That is a
different job, and worth being explicit about.
